//! OXC-style lexer cursor, dispatch, and checkpoint state.

use swc_common::{BytePos, Span};

use super::{config::Config, source::Source, PackedToken};
use crate::lexer::Token as Kind;

/// State required to restore a speculative lexical read.
#[derive(Debug, Clone, Copy)]
pub(crate) struct LexerCheckpoint {
    position: BytePos,
    token: PackedToken,
    tokens_len: usize,
    had_line_break: bool,
}

/// Independent lexer used by the next parser.
pub(crate) struct Lexer<'a, C: Config> {
    source: Source<'a>,
    token: PackedToken,
    config: C,
    had_line_break: bool,
    escaped: bool,
}

impl<'a, C: Config> Lexer<'a, C> {
    /// Create a lexer over one source file.
    pub(crate) fn new(source: &'a str, start_pos: BytePos, config: C) -> Option<Self> {
        let source_len = u32::try_from(source.len()).ok()?;
        let end_pos = BytePos(start_pos.0.checked_add(source_len)?);
        let eof = PackedToken::new(
            Kind::Eof,
            Span::new_with_checked(start_pos, start_pos),
            true,
            false,
        );
        Some(Self {
            source: Source::new(source, start_pos, end_pos),
            token: eof,
            config,
            // The first token is treated as starting on a new line.
            had_line_break: true,
            escaped: false,
        })
    }

    /// Current packed token.
    #[inline(always)]
    pub(crate) fn token(&self) -> PackedToken {
        self.token
    }

    /// Read the next significant token.
    #[inline]
    pub(crate) fn next_token(&mut self) -> PackedToken {
        self.skip_trivia();
        let start = self.source.cur_pos();
        self.escaped = false;

        let kind = if let Some(byte) = self.source.cur() {
            let handler = self.config.byte_handlers()[byte as usize];
            handler(self)
        } else {
            Kind::Eof
        };

        let end = self.source.cur_pos();
        let token = PackedToken::new(
            kind,
            Span::new_with_checked(start, end),
            self.had_line_break,
            self.escaped,
        );
        self.had_line_break = false;
        self.token = token;
        self.config.push(token);
        token
    }

    /// Save the cursor and collection lengths for speculative parsing.
    #[inline]
    pub(crate) fn checkpoint(&self) -> LexerCheckpoint {
        LexerCheckpoint {
            position: self.source.cur_pos(),
            token: self.token,
            tokens_len: self.config.len(),
            had_line_break: self.had_line_break,
        }
    }

    /// Restore a checkpoint without cloning source or token buffers.
    #[inline]
    pub(crate) fn rewind(&mut self, checkpoint: LexerCheckpoint) {
        // SAFETY: Checkpoints only store positions produced by this source
        // cursor, so the position is in bounds and on a UTF-8 boundary.
        unsafe { self.source.reset_to(checkpoint.position) };
        self.token = checkpoint.token;
        self.config.truncate(checkpoint.tokens_len);
        self.had_line_break = checkpoint.had_line_break;
        self.escaped = false;
    }

    /// Consume the lexer and return collected tokens.
    pub(crate) fn into_tokens(self) -> Vec<PackedToken> {
        self.config.into_tokens()
    }

    fn skip_trivia(&mut self) {
        loop {
            match (self.source.cur(), self.source.peek()) {
                (Some(b' ' | b'\t' | 0x0b | 0x0c), _) => {
                    // SAFETY: The matched whitespace is one ASCII byte.
                    unsafe { self.source.bump_bytes(1) };
                }
                (Some(b'\r'), _) => {
                    // SAFETY: `\r` is one ASCII byte.
                    unsafe { self.source.bump_bytes(1) };
                    // SAFETY: A matching `\n`, if present, is one ASCII byte.
                    unsafe { self.source.eat_byte(b'\n') };
                    self.had_line_break = true;
                }
                (Some(b'\n'), _) => {
                    // SAFETY: `\n` is one ASCII byte.
                    unsafe { self.source.bump_bytes(1) };
                    self.had_line_break = true;
                }
                (Some(b'/'), Some(b'/')) => {
                    // SAFETY: The two matched slashes are ASCII.
                    unsafe { self.source.bump_bytes(2) };
                    self.source
                        .uncons_while(|character| !matches!(character, '\r' | '\n'));
                }
                (Some(b'/'), Some(b'*')) => {
                    // SAFETY: The two matched bytes are ASCII.
                    unsafe { self.source.bump_bytes(2) };
                    self.skip_block_comment();
                }
                _ => return,
            }
        }
    }

    fn skip_block_comment(&mut self) {
        while let Some(byte) = self.source.cur() {
            if byte == b'*' && self.source.peek() == Some(b'/') {
                // SAFETY: The matched terminator consists of two ASCII bytes.
                unsafe { self.source.bump_bytes(2) };
                return;
            }
            if matches!(byte, b'\r' | b'\n') {
                self.had_line_break = true;
            }
            let width = self.source.cur_as_char().map_or(1, char::len_utf8);
            // SAFETY: `width` belongs to the complete current UTF-8 character.
            unsafe { self.source.bump_bytes(width) };
        }
    }

    pub(super) fn read_identifier(&mut self) -> Kind {
        let start = self.source.cur_pos();
        self.source.uncons_while(is_identifier_continue);
        let end = self.source.cur_pos();
        // SAFETY: Both positions came from the source cursor.
        let value = unsafe { self.source.slice_str(start, end) };
        self.escaped = value.as_bytes().contains(&b'\\');
        if self.escaped {
            Kind::Ident
        } else {
            keyword_kind(value).unwrap_or(Kind::Ident)
        }
    }

    pub(super) fn read_number(&mut self) -> Kind {
        if self.source.cur() == Some(b'0') {
            let radix = match self.source.peek() {
                Some(b'x' | b'X') => 16,
                Some(b'o' | b'O') => 8,
                Some(b'b' | b'B') => 2,
                _ => 0,
            };
            if radix != 0 {
                // SAFETY: The matched prefix is two ASCII bytes.
                unsafe { self.source.bump_bytes(2) };
                self.consume_ascii_while(|byte| {
                    byte == b'_'
                        || match radix {
                            16 => byte.is_ascii_hexdigit(),
                            8 => matches!(byte, b'0'..=b'7'),
                            2 => matches!(byte, b'0' | b'1'),
                            _ => false,
                        }
                });
                return if self.eat(b'n') {
                    Kind::BigInt
                } else {
                    Kind::Num
                };
            }
        }

        if self.source.cur() == Some(b'.') {
            self.bump_ascii();
            self.consume_ascii_while(|byte| byte.is_ascii_digit() || byte == b'_');
        } else {
            self.consume_ascii_while(|byte| byte.is_ascii_digit() || byte == b'_');
            if self.eat(b'.') {
                self.consume_ascii_while(|byte| byte.is_ascii_digit() || byte == b'_');
            }
        }

        if matches!(self.source.cur(), Some(b'e' | b'E')) {
            self.bump_ascii();
            if matches!(self.source.cur(), Some(b'+' | b'-')) {
                self.bump_ascii();
            }
            self.consume_ascii_while(|byte| byte.is_ascii_digit() || byte == b'_');
        }

        if self.eat(b'n') {
            Kind::BigInt
        } else {
            Kind::Num
        }
    }

    pub(super) fn read_string(&mut self) -> Kind {
        let quote = self.source.cur().unwrap_or(b'\0');
        // SAFETY: The byte handler only routes ASCII quote bytes here.
        unsafe { self.source.bump_bytes(1) };

        while let Some(byte) = self.source.cur() {
            if byte == quote {
                // SAFETY: The closing quote is ASCII.
                unsafe { self.source.bump_bytes(1) };
                return Kind::Str;
            }
            if matches!(byte, b'\r' | b'\n') {
                return Kind::Error;
            }
            if byte == b'\\' {
                self.escaped = true;
                // SAFETY: The backslash is ASCII.
                unsafe { self.source.bump_bytes(1) };
                if let Some(character) = self.source.cur_as_char() {
                    // SAFETY: Consume the complete escaped UTF-8 character.
                    unsafe { self.source.bump_bytes(character.len_utf8()) };
                }
                continue;
            }
            let width = self.source.cur_as_char().map_or(1, char::len_utf8);
            // SAFETY: `width` belongs to the complete current UTF-8 character.
            unsafe { self.source.bump_bytes(width) };
        }
        Kind::Error
    }

    pub(super) fn read_template(&mut self) -> Kind {
        // SAFETY: The byte handler only routes ASCII backticks here.
        unsafe { self.source.bump_bytes(1) };
        while let Some(byte) = self.source.cur() {
            match byte {
                b'`' => {
                    // SAFETY: The closing backtick is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                    return Kind::NoSubstitutionTemplateLiteral;
                }
                b'$' if self.source.peek() == Some(b'{') => {
                    // SAFETY: The matched `${` consists of ASCII bytes.
                    unsafe { self.source.bump_bytes(2) };
                    return Kind::TemplateHead;
                }
                b'\\' => {
                    self.escaped = true;
                    // SAFETY: The backslash is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                    if let Some(character) = self.source.cur_as_char() {
                        // SAFETY: Consume the complete escaped character.
                        unsafe { self.source.bump_bytes(character.len_utf8()) };
                    }
                }
                b'\r' | b'\n' => {
                    self.had_line_break = true;
                    // SAFETY: The line terminator is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                }
                _ => {
                    let width = self.source.cur_as_char().map_or(1, char::len_utf8);
                    // SAFETY: Consume the complete current UTF-8 character.
                    unsafe { self.source.bump_bytes(width) };
                }
            }
        }
        Kind::Error
    }

    pub(super) fn read_punctuation(&mut self) -> Kind {
        let Some(byte) = self.source.cur() else {
            return Kind::Eof;
        };
        match byte {
            b'(' => self.single(Kind::LParen),
            b')' => self.single(Kind::RParen),
            b'{' => self.single(Kind::LBrace),
            b'}' => self.single(Kind::RBrace),
            b'[' => self.single(Kind::LBracket),
            b']' => self.single(Kind::RBracket),
            b';' => self.single(Kind::Semi),
            b',' => self.single(Kind::Comma),
            b':' => self.single(Kind::Colon),
            b'~' => self.single(Kind::Tilde),
            b'@' => self.single(Kind::At),
            b'#' => self.single(Kind::Hash),
            b'.' => {
                if self.source.peek().is_some_and(|next| next.is_ascii_digit()) {
                    self.read_number()
                } else {
                    if self.source.is_str("...") {
                        // SAFETY: The matched ellipsis is three ASCII bytes.
                        unsafe { self.source.bump_bytes(3) };
                        Kind::DotDotDot
                    } else {
                        self.bump_ascii();
                        Kind::Dot
                    }
                }
            }
            b'!' => {
                self.bump_ascii();
                if self.eat(b'=') {
                    if self.eat(b'=') {
                        Kind::NotEqEq
                    } else {
                        Kind::NotEq
                    }
                } else {
                    Kind::Bang
                }
            }
            b'=' => {
                self.bump_ascii();
                if self.eat(b'>') {
                    Kind::Arrow
                } else if self.eat(b'=') {
                    if self.eat(b'=') {
                        Kind::EqEqEq
                    } else {
                        Kind::EqEq
                    }
                } else {
                    Kind::Eq
                }
            }
            b'+' => self.plus_or_minus(true),
            b'-' => self.plus_or_minus(false),
            b'*' => {
                self.bump_ascii();
                if self.eat(b'*') {
                    if self.eat(b'=') {
                        Kind::ExpEq
                    } else {
                        Kind::Exp
                    }
                } else if self.eat(b'=') {
                    Kind::MulEq
                } else {
                    Kind::Asterisk
                }
            }
            b'/' => {
                self.bump_ascii();
                if self.eat(b'=') {
                    Kind::DivEq
                } else {
                    Kind::Slash
                }
            }
            b'%' => self.assignment(Kind::Percent, Kind::ModEq),
            b'^' => self.assignment(Kind::Caret, Kind::BitXorEq),
            b'&' => {
                self.bump_ascii();
                if self.eat(b'&') {
                    if self.eat(b'=') {
                        Kind::LogicalAndEq
                    } else {
                        Kind::LogicalAnd
                    }
                } else if self.eat(b'=') {
                    Kind::BitAndEq
                } else {
                    Kind::Ampersand
                }
            }
            b'|' => {
                self.bump_ascii();
                if self.eat(b'|') {
                    if self.eat(b'=') {
                        Kind::LogicalOrEq
                    } else {
                        Kind::LogicalOr
                    }
                } else if self.eat(b'=') {
                    Kind::BitOrEq
                } else {
                    Kind::Pipe
                }
            }
            b'?' => {
                self.bump_ascii();
                if self.eat(b'?') {
                    if self.eat(b'=') {
                        Kind::NullishEq
                    } else {
                        Kind::NullishCoalescing
                    }
                } else if self.source.cur() == Some(b'.')
                    && !self.source.peek().is_some_and(|next| next.is_ascii_digit())
                {
                    self.bump_ascii();
                    Kind::OptionalChain
                } else {
                    Kind::QuestionMark
                }
            }
            b'<' => self.less_than(),
            b'>' => self.greater_than(),
            _ => self.read_invalid(),
        }
    }

    pub(super) fn read_invalid(&mut self) -> Kind {
        if let Some(character) = self.source.cur_as_char() {
            // SAFETY: Consume one complete source character.
            unsafe { self.source.bump_bytes(character.len_utf8()) };
        }
        Kind::Error
    }

    fn single(&mut self, kind: Kind) -> Kind {
        self.bump_ascii();
        kind
    }

    fn assignment(&mut self, plain: Kind, assigned: Kind) -> Kind {
        self.bump_ascii();
        if self.eat(b'=') {
            assigned
        } else {
            plain
        }
    }

    fn plus_or_minus(&mut self, plus: bool) -> Kind {
        let byte = if plus { b'+' } else { b'-' };
        self.bump_ascii();
        if self.eat(byte) {
            if plus {
                Kind::PlusPlus
            } else {
                Kind::MinusMinus
            }
        } else if self.eat(b'=') {
            if plus {
                Kind::PlusEq
            } else {
                Kind::MinusEq
            }
        } else if plus {
            Kind::Plus
        } else {
            Kind::Minus
        }
    }

    fn less_than(&mut self) -> Kind {
        self.bump_ascii();
        if self.eat(b'/') {
            Kind::LessSlash
        } else if self.eat(b'<') {
            if self.eat(b'=') {
                Kind::LShiftEq
            } else {
                Kind::LShift
            }
        } else if self.eat(b'=') {
            Kind::LtEq
        } else {
            Kind::Lt
        }
    }

    fn greater_than(&mut self) -> Kind {
        self.bump_ascii();
        if self.eat(b'>') {
            if self.eat(b'>') {
                if self.eat(b'=') {
                    Kind::ZeroFillRShiftEq
                } else {
                    Kind::ZeroFillRShift
                }
            } else if self.eat(b'=') {
                Kind::RShiftEq
            } else {
                Kind::RShift
            }
        } else if self.eat(b'=') {
            Kind::GtEq
        } else {
            Kind::Gt
        }
    }

    #[inline(always)]
    fn bump_ascii(&mut self) {
        // SAFETY: Callers use this only after matching an ASCII byte.
        unsafe { self.source.bump_bytes(1) };
    }

    #[inline(always)]
    fn eat(&mut self, byte: u8) -> bool {
        // SAFETY: Punctuation callers pass ASCII bytes.
        unsafe { self.source.eat_byte(byte) }
    }

    #[inline]
    fn consume_ascii_while(&mut self, mut predicate: impl FnMut(u8) -> bool) {
        while let Some(byte) = self.source.cur_as_ascii() {
            if !predicate(byte) {
                break;
            }
            // SAFETY: `cur_as_ascii` proved the current character is one byte.
            unsafe { self.source.bump_bytes(1) };
        }
    }
}

fn is_identifier_continue(character: char) -> bool {
    character == '$'
        || character == '_'
        || character == '\\'
        || character.is_ascii_alphanumeric()
        || !character.is_ascii()
}

fn keyword_kind(value: &str) -> Option<Kind> {
    Some(match value {
        "abstract" => Kind::Abstract,
        "any" => Kind::Any,
        "as" => Kind::As,
        "assert" => Kind::Assert,
        "asserts" => Kind::Asserts,
        "async" => Kind::Async,
        "await" => Kind::Await,
        "bigint" => Kind::Bigint,
        "boolean" => Kind::Boolean,
        "break" => Kind::Break,
        "case" => Kind::Case,
        "catch" => Kind::Catch,
        "class" => Kind::Class,
        "const" => Kind::Const,
        "constructor" => Kind::Constructor,
        "continue" => Kind::Continue,
        "debugger" => Kind::Debugger,
        "declare" => Kind::Declare,
        "default" => Kind::Default,
        "delete" => Kind::Delete,
        "do" => Kind::Do,
        "else" => Kind::Else,
        "enum" => Kind::Enum,
        "export" => Kind::Export,
        "extends" => Kind::Extends,
        "false" => Kind::False,
        "finally" => Kind::Finally,
        "for" => Kind::For,
        "from" => Kind::From,
        "function" => Kind::Function,
        "get" => Kind::Get,
        "global" => Kind::Global,
        "if" => Kind::If,
        "implements" => Kind::Implements,
        "import" => Kind::Import,
        "in" => Kind::In,
        "infer" => Kind::Infer,
        "instanceof" => Kind::InstanceOf,
        "interface" => Kind::Interface,
        "intrinsic" => Kind::Intrinsic,
        "is" => Kind::Is,
        "keyof" => Kind::Keyof,
        "let" => Kind::Let,
        "module" => Kind::Module,
        "namespace" => Kind::Namespace,
        "never" => Kind::Never,
        "new" => Kind::New,
        "null" => Kind::Null,
        "number" => Kind::Number,
        "object" => Kind::Object,
        "of" => Kind::Of,
        "out" => Kind::Out,
        "override" => Kind::Override,
        "package" => Kind::Package,
        "private" => Kind::Private,
        "protected" => Kind::Protected,
        "public" => Kind::Public,
        "readonly" => Kind::Readonly,
        "require" => Kind::Require,
        "return" => Kind::Return,
        "satisfies" => Kind::Satisfies,
        "set" => Kind::Set,
        "static" => Kind::Static,
        "string" => Kind::String,
        "super" => Kind::Super,
        "switch" => Kind::Switch,
        "symbol" => Kind::Symbol,
        "this" => Kind::This,
        "throw" => Kind::Throw,
        "true" => Kind::True,
        "try" => Kind::Try,
        "type" => Kind::Type,
        "typeof" => Kind::TypeOf,
        "undefined" => Kind::Undefined,
        "unique" => Kind::Unique,
        "unknown" => Kind::Unknown,
        "using" => Kind::Using,
        "var" => Kind::Var,
        "void" => Kind::Void,
        "while" => Kind::While,
        "with" => Kind::With,
        "yield" => Kind::Yield,
        "accessor" => Kind::Accessor,
        _ => return None,
    })
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;

    use super::Lexer;
    use crate::{
        lexer::Token as Kind,
        next::lexer::config::{NoTokens, WithTokens},
    };

    #[test]
    fn lexes_basic_javascript_with_static_no_tokens_config() {
        let mut lexer =
            Lexer::new("// header\nconst value = 1 + foo;", BytePos(10), NoTokens).unwrap();
        let expected = [
            Kind::Const,
            Kind::Ident,
            Kind::Eq,
            Kind::Num,
            Kind::Plus,
            Kind::Ident,
            Kind::Semi,
            Kind::Eof,
        ];

        for expected in expected {
            let token = lexer.next_token();
            assert_eq!(token.kind(), expected);
        }
        assert!(lexer.into_tokens().is_empty());
    }

    #[test]
    fn checkpoint_rewinds_cursor_and_collected_tokens() {
        let mut lexer =
            Lexer::new("let first = second;", BytePos(1), WithTokens::default()).unwrap();
        assert_eq!(lexer.next_token().kind(), Kind::Let);
        let checkpoint = lexer.checkpoint();
        let first = lexer.next_token();
        assert_eq!(first.kind(), Kind::Ident);

        lexer.rewind(checkpoint);
        let second = lexer.next_token();
        assert_eq!(second, first);
        assert_eq!(lexer.token(), second);

        let tokens = lexer.into_tokens();
        assert_eq!(tokens.len(), 2);
        assert_eq!(tokens[0].kind(), Kind::Let);
        assert_eq!(tokens[1].kind(), Kind::Ident);
    }

    #[test]
    fn preserves_line_break_and_escape_flags() {
        let mut lexer = Lexer::new("'a\\n'\nvalue", BytePos(1), NoTokens).unwrap();
        let string = lexer.next_token();
        let identifier = lexer.next_token();

        assert!(string.had_line_break());
        assert!(string.escaped());
        assert!(identifier.had_line_break());
    }

    #[test]
    fn keeps_numeric_and_punctuation_boundaries() {
        let mut lexer = Lexer::new("1foo .. ?.1 ... 0xffn", BytePos(1), NoTokens).unwrap();
        let expected = [
            Kind::Num,
            Kind::Ident,
            Kind::Dot,
            Kind::Dot,
            Kind::QuestionMark,
            Kind::Num,
            Kind::DotDotDot,
            Kind::BigInt,
            Kind::Eof,
        ];

        for expected in expected {
            assert_eq!(lexer.next_token().kind(), expected);
        }
    }
}
