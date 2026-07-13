//! OXC-style lexer cursor, dispatch, and checkpoint state.

use rustc_hash::FxHashMap;
use swc_atoms::{
    wtf8::{CodePoint, Wtf8Buf},
    Atom, Wtf8Atom,
};
use swc_common::{BytePos, Span};
use swc_ecma_ast::Ident;

use super::{config::Config, source::Source, PackedToken};
use crate::{
    error::{Error, SyntaxError},
    next::lexer::TokenKind as Kind,
};

/// State required to restore a speculative lexical read.
#[derive(Debug, Clone, Copy)]
pub(crate) struct LexerCheckpoint {
    position: BytePos,
    token: PackedToken,
    tokens_len: usize,
    trivia_len: usize,
    diagnostics_len: usize,
    legacy_comments_len: usize,
    had_line_break: bool,
}

/// Source-backed comment retained without allocating its text.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) struct CommentRange {
    /// Comment kind.
    pub(crate) kind: CommentKind,
    /// Full range including comment delimiters.
    pub(crate) span: Span,
    text_start: BytePos,
    text_end: BytePos,
}

/// Lexical comment delimiter kind.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum CommentKind {
    /// `//` line comment.
    Line,
    /// `/* */` block comment.
    Block,
}

/// Independent lexer used by the next parser.
pub(crate) struct Lexer<'a, C: Config> {
    pub(super) source: Source<'a>,
    token: PackedToken,
    config: C,
    had_line_break: bool,
    escaped: bool,
    escaped_identifiers: FxHashMap<u32, Atom>,
    escaped_strings: FxHashMap<u32, Wtf8Atom>,
    trivia: Vec<CommentRange>,
    diagnostics: Vec<Error>,
    legacy_comments: Vec<Span>,
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
            escaped_identifiers: FxHashMap::default(),
            escaped_strings: FxHashMap::default(),
            trivia: Vec::new(),
            diagnostics: Vec::new(),
            legacy_comments: Vec::new(),
        })
    }

    /// Current packed token.
    #[inline(always)]
    pub(crate) fn token(&self) -> PackedToken {
        self.token
    }

    /// Borrow the original source covered by a token.
    #[inline(always)]
    pub(crate) fn token_source(&self, token: PackedToken) -> &'a str {
        // SAFETY: Packed token spans are created exclusively from positions of
        // this source cursor and therefore are in bounds and UTF-8 aligned.
        unsafe { self.source.slice_str(token.start(), token.end()) }
    }

    /// Borrow an arbitrary parser-validated byte range from the input.
    #[inline(always)]
    pub(crate) fn source_slice(&self, start: BytePos, end: BytePos) -> &'a str {
        // SAFETY: Callers pass token boundaries produced by this lexer, which
        // are in bounds and UTF-8 aligned by the source cursor invariants.
        unsafe { self.source.slice_str(start, end) }
    }

    /// Decoded value for a string token containing escapes.
    pub(crate) fn escaped_string(&self, token: PackedToken) -> Option<&Wtf8Atom> {
        self.escaped_strings.get(&token.start().0)
    }

    /// Decoded value for an identifier token containing Unicode escapes.
    pub(crate) fn escaped_identifier(&self, token: PackedToken) -> Option<&Atom> {
        self.escaped_identifiers.get(&token.start().0)
    }

    /// Comments collected in source order.
    pub(crate) fn comments(&self) -> &[CommentRange] {
        &self.trivia
    }

    /// Lexical diagnostics produced independently of parser context.
    pub(crate) fn diagnostics(&self) -> &[Error] {
        &self.diagnostics
    }

    /// HTML-style comment delimiters, which are invalid in modules only.
    pub(crate) fn legacy_comments(&self) -> &[Span] {
        &self.legacy_comments
    }

    /// Borrow comment text without its delimiters.
    pub(crate) fn comment_text(&self, comment: CommentRange) -> &'a str {
        // SAFETY: Comment boundaries are produced by this source cursor and
        // always lie on UTF-8 boundaries.
        unsafe { self.source.slice_str(comment.text_start, comment.text_end) }
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
            trivia_len: self.trivia.len(),
            diagnostics_len: self.diagnostics.len(),
            legacy_comments_len: self.legacy_comments.len(),
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
        self.trivia.truncate(checkpoint.trivia_len);
        self.diagnostics.truncate(checkpoint.diagnostics_len);
        self.legacy_comments
            .truncate(checkpoint.legacy_comments_len);
        self.had_line_break = checkpoint.had_line_break;
        self.escaped = false;
    }

    /// Consume the lexer and return collected tokens.
    pub(crate) fn into_tokens(self) -> Vec<PackedToken> {
        self.config.into_tokens()
    }

    /// Finish a parser-directed token that starts at the current cursor.
    pub(super) fn finish_external(&mut self, token: PackedToken) -> PackedToken {
        self.token = token;
        self.config.push(token);
        self.had_line_break = false;
        self.escaped = false;
        token
    }

    /// Replace the current token after parser-directed re-lexing.
    pub(super) fn replace_current(
        &mut self,
        kind: Kind,
        span: Span,
        had_line_break: bool,
        escaped: bool,
    ) -> PackedToken {
        let token = PackedToken::new(kind, span, had_line_break, escaped);
        self.token = token;
        self.config.replace_last(token);
        self.escaped = false;
        token
    }

    fn skip_trivia(&mut self) {
        loop {
            if self.source.is_str("<!--") {
                self.skip_html_line_comment(4);
                continue;
            }
            if self.had_line_break && self.source.is_str("-->") {
                self.skip_html_line_comment(3);
                continue;
            }
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
                (Some(byte), _) if !byte.is_ascii() => {
                    let Some(character) = self.source.cur_as_char() else {
                        return;
                    };
                    if matches!(character, '\u{2028}' | '\u{2029}') {
                        self.had_line_break = true;
                    } else if character != '\u{feff}' && !character.is_whitespace() {
                        return;
                    }
                    // SAFETY: Consume the complete matched UTF-8 whitespace
                    // or line-terminator character.
                    unsafe { self.source.bump_bytes(character.len_utf8()) };
                }
                (Some(b'/'), Some(b'/')) => {
                    let start = self.source.cur_pos();
                    // SAFETY: The two matched slashes are ASCII.
                    unsafe { self.source.bump_bytes(2) };
                    let text_start = self.source.cur_pos();
                    self.source
                        .uncons_while(|character| !matches!(character, '\r' | '\n'));
                    let end = self.source.cur_pos();
                    self.trivia.push(CommentRange {
                        kind: CommentKind::Line,
                        span: Span::new_with_checked(start, end),
                        text_start,
                        text_end: end,
                    });
                }
                (Some(b'/'), Some(b'*')) => {
                    let start = self.source.cur_pos();
                    // SAFETY: The two matched bytes are ASCII.
                    unsafe { self.source.bump_bytes(2) };
                    let text_start = self.source.cur_pos();
                    self.skip_block_comment(start, text_start);
                }
                _ => return,
            }
        }
    }

    fn skip_html_line_comment(&mut self, delimiter_len: usize) {
        let start = self.source.cur_pos();
        // SAFETY: Callers matched the complete ASCII HTML comment delimiter.
        unsafe { self.source.bump_bytes(delimiter_len) };
        let text_start = self.source.cur_pos();
        self.source
            .uncons_while(|character| !matches!(character, '\r' | '\n' | '\u{2028}' | '\u{2029}'));
        let end = self.source.cur_pos();
        self.legacy_comments
            .push(Span::new_with_checked(start, end));
        self.trivia.push(CommentRange {
            kind: CommentKind::Line,
            span: Span::new_with_checked(start, end),
            text_start,
            text_end: end,
        });
    }

    fn skip_block_comment(&mut self, start: BytePos, text_start: BytePos) {
        while let Some(byte) = self.source.cur() {
            if byte == b'*' && self.source.peek() == Some(b'/') {
                let text_end = self.source.cur_pos();
                // SAFETY: The matched terminator consists of two ASCII bytes.
                unsafe { self.source.bump_bytes(2) };
                self.trivia.push(CommentRange {
                    kind: CommentKind::Block,
                    span: Span::new_with_checked(start, self.source.cur_pos()),
                    text_start,
                    text_end,
                });
                return;
            }
            let character = self.source.cur_as_char();
            if matches!(character, Some('\r' | '\n' | '\u{2028}' | '\u{2029}')) {
                self.had_line_break = true;
            }
            let width = character.map_or(1, char::len_utf8);
            // SAFETY: `width` belongs to the complete current UTF-8 character.
            unsafe { self.source.bump_bytes(width) };
        }
        let end = self.source.cur_pos();
        self.diagnostics.push(Error::new(
            Span::new_with_checked(start, end),
            SyntaxError::UnterminatedBlockComment,
        ));
        self.trivia.push(CommentRange {
            kind: CommentKind::Block,
            span: Span::new_with_checked(start, end),
            text_start,
            text_end: end,
        });
    }

    pub(super) fn read_identifier(&mut self) -> Kind {
        let start = self.source.cur_pos();
        let mut first = true;
        while let Some(character) = self.source.cur_as_char() {
            if character == '\\' {
                if !self.consume_identifier_escape() {
                    break;
                }
                first = false;
                continue;
            }
            let valid = if first {
                Ident::is_valid_start(character)
            } else {
                Ident::is_valid_continue(character)
            };
            if !valid {
                break;
            }
            // SAFETY: Consume one complete valid identifier character.
            unsafe { self.source.bump_bytes(character.len_utf8()) };
            first = false;
        }
        let end = self.source.cur_pos();
        if start == end {
            return self.read_invalid();
        }
        // SAFETY: Both positions came from the source cursor.
        let value = unsafe { self.source.slice_str(start, end) };
        self.escaped = value.as_bytes().contains(&b'\\');
        if self.escaped {
            if let Some(decoded) = decode_identifier(value) {
                let mut characters = decoded.chars();
                if characters.next().is_some_and(Ident::is_valid_start)
                    && characters.all(Ident::is_valid_continue)
                {
                    self.escaped_identifiers.insert(start.0, Atom::new(decoded));
                    return Kind::Ident;
                }
            }
            Kind::Error
        } else {
            keyword_kind(value).unwrap_or(Kind::Ident)
        }
    }

    fn consume_identifier_escape(&mut self) -> bool {
        let remaining = self.source.as_str().as_bytes();
        if remaining.len() < 2 || remaining[0] != b'\\' || remaining[1] != b'u' {
            return false;
        }
        let mut length = 2;
        if remaining.get(length) == Some(&b'{') {
            length += 1;
            let digits_start = length;
            while remaining
                .get(length)
                .is_some_and(|byte| byte.is_ascii_hexdigit())
            {
                length += 1;
            }
            if length == digits_start || remaining.get(length) != Some(&b'}') {
                return false;
            }
            length += 1;
        } else {
            if remaining.len() < length + 4
                || !remaining[length..length + 4]
                    .iter()
                    .all(u8::is_ascii_hexdigit)
            {
                return false;
            }
            length += 4;
        }
        // SAFETY: Identifier escapes are entirely ASCII and `length` was
        // checked against the remaining source bytes.
        unsafe { self.source.bump_bytes(length) };
        true
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

        let remaining = self.source.as_str().as_bytes();
        let legacy_leading_zero = remaining.first() == Some(&b'0')
            && remaining.get(1).is_some_and(|byte| byte.is_ascii_digit())
            && remaining
                .iter()
                .take_while(|byte| byte.is_ascii_digit())
                .all(|byte| matches!(byte, b'0'..=b'7'));
        if self.source.cur() == Some(b'.') {
            self.bump_ascii();
            self.consume_ascii_while(|byte| byte.is_ascii_digit() || byte == b'_');
        } else {
            self.consume_ascii_while(|byte| byte.is_ascii_digit() || byte == b'_');
            if !legacy_leading_zero && self.eat(b'.') {
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
            if legacy_leading_zero {
                Kind::Error
            } else {
                Kind::BigInt
            }
        } else {
            Kind::Num
        }
    }

    pub(super) fn read_string(&mut self) -> Kind {
        let start = self.source.cur_pos();
        let quote = self.source.cur().unwrap_or(b'\0');
        // SAFETY: The byte handler only routes ASCII quote bytes here.
        unsafe { self.source.bump_bytes(1) };

        while let Some(byte) = self.source.cur() {
            if byte == quote {
                // SAFETY: The closing quote is ASCII.
                unsafe { self.source.bump_bytes(1) };
                if self.escaped {
                    let end = self.source.cur_pos();
                    // SAFETY: Both positions came from this source cursor.
                    let raw = unsafe { self.source.slice_str(start, end) };
                    let Some(value) = decode_string(raw) else {
                        return Kind::Error;
                    };
                    self.escaped_strings.insert(start.0, Wtf8Atom::new(value));
                }
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
                    if character == '\r' {
                        // SAFETY: A matching LF after CR is one ASCII byte.
                        unsafe { self.source.eat_byte(b'\n') };
                    }
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
            b'#' if self.source.is_at_start() && self.source.peek() == Some(b'!') => {
                while !matches!(self.source.cur(), None | Some(b'\r' | b'\n')) {
                    let width = self.source.cur_as_char().map_or(1, char::len_utf8);
                    // SAFETY: `width` is the complete current UTF-8 character.
                    unsafe { self.source.bump_bytes(width) };
                }
                Kind::Shebang
            }
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
        if self.eat(b'<') {
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

/// Decode the two Unicode escape forms accepted in identifier names.
///
/// Plain identifiers never call this function, so the allocation remains off
/// the common lexer path. Invalid escapes are left for parser diagnostics.
fn decode_identifier(raw: &str) -> Option<String> {
    let mut output = String::with_capacity(raw.len());
    let mut characters = raw.chars();
    while let Some(character) = characters.next() {
        if character != '\\' {
            output.push(character);
            continue;
        }
        if characters.next()? != 'u' {
            return None;
        }
        let value = if characters.clone().next() == Some('{') {
            characters.next();
            let mut value = 0_u32;
            let mut digits = 0;
            loop {
                let character = characters.next()?;
                if character == '}' {
                    break;
                }
                value = value
                    .checked_mul(16)?
                    .checked_add(character.to_digit(16)?)?;
                digits += 1;
                if digits > 6 {
                    return None;
                }
            }
            if digits == 0 {
                return None;
            }
            value
        } else {
            let mut value = 0_u32;
            for _ in 0..4 {
                value = value
                    .checked_mul(16)?
                    .checked_add(characters.next()?.to_digit(16)?)?;
            }
            value
        };
        output.push(char::from_u32(value)?);
    }
    Some(output)
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

fn decode_string(raw: &str) -> Option<Wtf8Buf> {
    debug_assert!(raw.len() >= 2);
    let mut output = Wtf8Buf::with_capacity(raw.len() - 2);
    let mut characters = raw[1..raw.len() - 1].chars();
    while let Some(character) = characters.next() {
        if character != '\\' {
            output.push_char(character);
            continue;
        }

        let Some(escaped) = characters.next() else {
            break;
        };
        match escaped {
            'n' => output.push_char('\n'),
            'r' => output.push_char('\r'),
            't' => output.push_char('\t'),
            'b' => output.push_char('\u{0008}'),
            'f' => output.push_char('\u{000c}'),
            'v' => output.push_char('\u{000b}'),
            '0'..='7' => {
                let mut value = escaped.to_digit(8).unwrap_or(0);
                let remaining_digits = if escaped <= '3' { 2 } else { 1 };
                for _ in 0..remaining_digits {
                    let Some(next) = characters.clone().next() else {
                        break;
                    };
                    let Some(digit) = next.to_digit(8) else {
                        break;
                    };
                    characters.next();
                    value = value * 8 + digit;
                }
                push_code_point(&mut output, value);
            }
            '\n' => {}
            '\r' => {
                if characters.clone().next() == Some('\n') {
                    characters.next();
                }
            }
            '\u{2028}' | '\u{2029}' => {}
            'x' => {
                let value = read_hex_escape(&mut characters, 2)?;
                push_code_point(&mut output, value);
            }
            'u' => {
                let value = if characters.clone().next() == Some('{') {
                    characters.next();
                    let mut value = 0_u32;
                    let mut digits = 0_u8;
                    let mut terminated = false;
                    for digit in characters.by_ref() {
                        if digit == '}' {
                            terminated = true;
                            break;
                        }
                        value = value.checked_mul(16)?.checked_add(digit.to_digit(16)?)?;
                        digits = digits.checked_add(1)?;
                    }
                    if digits == 0 || !terminated {
                        return None;
                    }
                    value
                } else {
                    read_hex_escape(&mut characters, 4)?
                };
                if value > 0x10ffff {
                    return None;
                }
                push_code_point(&mut output, value);
            }
            other => output.push_char(other),
        }
    }
    Some(output)
}

fn push_code_point(output: &mut Wtf8Buf, value: u32) {
    output.push(CodePoint::from_u32(value).unwrap_or_else(|| CodePoint::from_char('\u{fffd}')));
}

fn read_hex_escape(characters: &mut std::str::Chars<'_>, length: usize) -> Option<u32> {
    let mut value = 0;
    for _ in 0..length {
        value = value * 16 + characters.next()?.to_digit(16)?;
    }
    Some(value)
}

#[cfg(test)]
mod tests {
    use swc_atoms::Atom;
    use swc_common::BytePos;

    use super::Lexer;
    use crate::next::lexer::{
        config::{NoTokens, WithTokens},
        TokenKind as Kind,
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
    fn collects_source_backed_comments_and_rewinds_trivia() {
        let mut lexer = Lexer::new(
            "value /* block */ // line\nother",
            BytePos(1),
            WithTokens::default(),
        )
        .unwrap();
        assert_eq!(lexer.next_token().kind(), Kind::Ident);
        let checkpoint = lexer.checkpoint();
        assert_eq!(lexer.next_token().kind(), Kind::Ident);
        assert_eq!(lexer.comments().len(), 2);
        assert_eq!(lexer.comment_text(lexer.comments()[0]), " block ");
        assert_eq!(lexer.comment_text(lexer.comments()[1]), " line");

        lexer.rewind(checkpoint);
        assert!(lexer.comments().is_empty());
        assert_eq!(lexer.next_token().kind(), Kind::Ident);
        assert_eq!(lexer.comments().len(), 2);
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
        let mut lexer = Lexer::new("1foo .. ?.1 ... 0xffn 01.a", BytePos(1), NoTokens).unwrap();
        let expected = [
            Kind::Num,
            Kind::Ident,
            Kind::Dot,
            Kind::Dot,
            Kind::QuestionMark,
            Kind::Num,
            Kind::DotDotDot,
            Kind::BigInt,
            Kind::Num,
            Kind::Dot,
            Kind::Ident,
            Kind::Eof,
        ];

        for expected in expected {
            assert_eq!(lexer.next_token().kind(), expected);
        }
    }

    #[test]
    fn stores_only_decoded_escaped_strings() {
        let mut lexer = Lexer::new("'plain' 'a\\n\\u{1f600}'", BytePos(1), NoTokens).unwrap();
        let plain = lexer.next_token();
        assert!(!plain.escaped());
        assert!(lexer.escaped_string(plain).is_none());

        let escaped = lexer.next_token();
        assert!(escaped.escaped());
        assert_eq!(
            lexer
                .escaped_string(escaped)
                .and_then(|value| value.as_wtf8().as_str()),
            Some("a\n😀")
        );
    }

    #[test]
    fn decodes_annex_b_octal_and_line_continuation_escapes() {
        let mut lexer = Lexer::new(
            "'\\1111' '\\712' 'a\\\r\nb' 'a\\\u{2028}b'",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        for expected in ["I1", "92", "ab", "ab"] {
            let token = lexer.next_token();
            assert_eq!(token.kind(), Kind::Str);
            assert_eq!(
                lexer
                    .escaped_string(token)
                    .and_then(|value| value.as_wtf8().as_str()),
                Some(expected)
            );
        }
    }

    #[test]
    fn decodes_escaped_identifiers_without_allocating_plain_identifiers() {
        let mut lexer = Lexer::new("plain A\\u{42}C \\u0061a", BytePos(1), NoTokens).unwrap();
        let plain = lexer.next_token();
        assert!(!plain.escaped());
        assert!(lexer.escaped_identifier(plain).is_none());

        let braced = lexer.next_token();
        assert!(braced.escaped());
        assert_eq!(
            lexer.escaped_identifier(braced).map(Atom::as_ref),
            Some("ABC")
        );

        let fixed = lexer.next_token();
        assert!(fixed.escaped());
        assert_eq!(
            lexer.escaped_identifier(fixed).map(Atom::as_ref),
            Some("aa")
        );
    }

    #[test]
    fn recognizes_ecmascript_unicode_whitespace_and_line_terminators() {
        let mut lexer =
            Lexer::new("a\u{200a}\u{feff}b\u{2028}c\u{2029}d", BytePos(1), NoTokens).unwrap();
        let a = lexer.next_token();
        let b = lexer.next_token();
        let c = lexer.next_token();
        let d = lexer.next_token();

        assert_eq!(lexer.token_source(a), "a");
        assert_eq!(lexer.token_source(b), "b");
        assert!(!b.had_line_break());
        assert!(c.had_line_break());
        assert!(d.had_line_break());
    }

    #[test]
    fn skips_annex_b_html_comments_at_their_grammar_boundaries() {
        let mut lexer = Lexer::new("a<!-- tail\n+b\n  --> tail\nc", BytePos(1), NoTokens).unwrap();
        let a = lexer.next_token();
        let plus = lexer.next_token();
        let b = lexer.next_token();
        let c = lexer.next_token();

        assert_eq!(lexer.token_source(a), "a");
        assert_eq!(plus.kind(), Kind::Plus);
        assert!(plus.had_line_break());
        assert_eq!(lexer.token_source(b), "b");
        assert_eq!(lexer.token_source(c), "c");
        assert!(c.had_line_break());
        assert_eq!(lexer.comments().len(), 2);
    }
}
