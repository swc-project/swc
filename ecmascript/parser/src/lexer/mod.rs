//! ECMAScript lexer.

pub use self::state::{TokenContext, TokenContexts};
use self::{state::State, util::*};
use crate::{
    error::{Error, SyntaxError},
    token::*,
    Context, JscTarget, Syntax,
};
use memchr::memchr_iter;
use smallvec::{smallvec, SmallVec};
use std::{cell::RefCell, char, iter::FusedIterator, rc::Rc, str::Chars};
use swc_atoms::{js_word, JsWord};
use swc_common::{
    comments::{Comment, Comments},
    BytePos, Span,
};
use swc_ecma_raw_lexer::{DumbLexer, InternalToken};

#[macro_use]
mod macros;
mod jsx;
mod number;
mod state;
#[cfg(test)]
mod tests;
pub mod util;

pub(crate) type LexResult<T> = Result<T, Error>;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub(crate) struct Char(u32);

impl From<char> for Char {
    fn from(c: char) -> Self {
        Char(c as u32)
    }
}

impl From<u32> for Char {
    fn from(c: u32) -> Self {
        Char(c)
    }
}

pub(crate) struct CharIter(SmallVec<[char; 6]>);

impl IntoIterator for Char {
    type Item = char;
    type IntoIter = CharIter;

    #[allow(unsafe_code)]
    fn into_iter(self) -> Self::IntoIter {
        //        // TODO: Check if this is correct
        //        fn to_char(v: u8) -> char {
        //            char::from_digit(v as _, 16).unwrap_or('0')
        //        }

        CharIter(match char::from_u32(self.0) {
            Some(c) => smallvec![c],
            None => {
                smallvec![unsafe { char::from_u32_unchecked(self.0) }]
                // TODO:
                //            smallvec![
                //               '\\',
                //                'u',
                //                to_char(((self.0 >> 24) & 0xff) as u8),
                //                to_char(((self.0 >> 16) & 0xff) as u8),
                //                to_char(((self.0 >> 8) & 0xff) as u8),
                //                to_char((self.0 & 0xff) as u8)
                //             ]
            }
        })
    }
}

impl Iterator for CharIter {
    type Item = char;

    fn next(&mut self) -> Option<Self::Item> {
        if self.0.is_empty() {
            None
        } else {
            Some(self.0.remove(0))
        }
    }
}

impl FusedIterator for CharIter {}

#[derive(Clone)]
pub struct Lexer<'a> {
    comments: Option<&'a dyn Comments>,
    /// [Some] if comment comment parsing is enabled. Otherwise [None]
    leading_comments_buffer: Option<Rc<RefCell<Vec<Comment>>>>,

    pub(crate) ctx: Context,
    input: DumbLexer<'a>,
    /// Stores last position of the last comment.
    ///
    /// [Rc] and [RefCell] is used because this value should always increment,
    /// even if backtracking fails.
    last_comment_pos: Rc<RefCell<BytePos>>,

    state: State,
    pub(crate) syntax: Syntax,
    pub(crate) target: JscTarget,

    errors: Rc<RefCell<Vec<Error>>>,

    buf: String,
}

impl FusedIterator for Lexer<'_> {}

impl<'a> Lexer<'a> {
    pub fn new(
        syntax: Syntax,
        target: JscTarget,
        start: BytePos,
        input: &'a str,
        comments: Option<&'a dyn Comments>,
    ) -> Self {
        Lexer {
            leading_comments_buffer: if comments.is_some() {
                Some(Default::default())
            } else {
                None
            },
            comments,
            input: DumbLexer::new(start, input),
            last_comment_pos: Rc::new(RefCell::new(BytePos(0))),
            state: State::new(syntax),
            ctx: Default::default(),
            syntax,
            target,
            errors: Default::default(),
            buf: String::with_capacity(16),
        }
    }

    /// babel: `getTokenFromCode`
    fn read_token(&mut self) -> LexResult<Option<Token>> {
        let c = match self.input.cur() {
            Some(c) => c,
            None => {
                return Ok(None);
            }
        };
        let start = self.input.cur_pos();

        let token = match c {
            itok!("#") => return self.read_token_number_sign(),

            // Identifier or keyword. '\uXXXX' sequences are allowed in
            // identifiers, so '\' also dispatches to that.
            InternalToken::Ident | itok!("\\") => return self.read_ident().map(Some),

            InternalToken::BigInt => return self.read_bigint().map(Token::BigInt).map(Some),

            InternalToken::FloatNum
            | InternalToken::BinNum
            | InternalToken::DecNum
            | InternalToken::HexNum
            | InternalToken::OctalNum => {
                return self.read_number().map(Token::Num).map(Some);
            }

            InternalToken::Null
            | InternalToken::True
            | InternalToken::False
            | InternalToken::Await
            | InternalToken::Break
            | InternalToken::Case
            | InternalToken::Catch
            | InternalToken::Continue
            | InternalToken::Debugger
            | InternalToken::Default
            | InternalToken::Do
            | InternalToken::Export
            | InternalToken::Else
            | InternalToken::Finally
            | InternalToken::For
            | InternalToken::Function
            | InternalToken::If
            | InternalToken::Return
            | InternalToken::Switch
            | InternalToken::Throw
            | InternalToken::Try
            | InternalToken::Var
            | InternalToken::Let
            | InternalToken::Const
            | InternalToken::While
            | InternalToken::With
            | InternalToken::New
            | InternalToken::This
            | InternalToken::Super
            | InternalToken::Class
            | InternalToken::Extends
            | InternalToken::Import
            | InternalToken::Yield
            | InternalToken::In
            | InternalToken::InstanceOf
            | InternalToken::TypeOf
            | InternalToken::Void
            | InternalToken::Delete
            | itok!("??")
            | itok!("?")
            | itok!("`")
            | itok!("...")
            | itok!(".")
            | itok!("(")
            | itok!(")")
            | itok!(";")
            | itok!(",")
            | itok!("[")
            | itok!("]")
            | itok!("{")
            | itok!("}")
            | itok!("@")
            | itok!("<<")
            | itok!("<<=")
            | itok!(">>")
            | itok!(">>=")
            | itok!(">>>")
            | itok!(">>>=") => {
                // These tokens are emitted directly.
                self.input.advance();
                return Ok(Some(match c {
                    itok!("??") => tok!("??"),
                    itok!("?") => tok!('?'),
                    itok!("`") => tok!('`'),
                    itok!("(") => LParen,
                    itok!(")") => RParen,
                    itok!(";") => Semi,
                    itok!(",") => Comma,
                    itok!("[") => LBracket,
                    itok!("]") => RBracket,
                    itok!("{") => LBrace,
                    itok!("}") => RBrace,
                    itok!("@") => At,
                    itok!("...") => DotDotDot,
                    itok!(".") => Dot,
                    itok!("<<") => BinOp(LShift),
                    itok!("<<=") => AssignOp(LShiftAssign),
                    itok!(">>") => BinOp(RShift),
                    itok!(">>=") => AssignOp(RShiftAssign),
                    itok!(">>>") => BinOp(ZeroFillRShift),
                    itok!(">>>=") => AssignOp(ZeroFillRShiftAssign),
                    InternalToken::Null => Word(Word::Null),
                    InternalToken::True => Word(Word::True),
                    InternalToken::False => Word(Word::False),
                    InternalToken::Await => Word(Await.into()),
                    InternalToken::Break => Word(Break.into()),
                    InternalToken::Case => Word(Case.into()),
                    InternalToken::Catch => Word(Catch.into()),
                    InternalToken::Continue => Word(Continue.into()),
                    InternalToken::Debugger => Word(Debugger.into()),
                    InternalToken::Default => Word(Default_.into()),
                    InternalToken::Do => Word(Do.into()),
                    InternalToken::Export => Word(Export.into()),
                    InternalToken::Else => Word(Else.into()),
                    InternalToken::Finally => Word(Finally.into()),
                    InternalToken::For => Word(For.into()),
                    InternalToken::Function => Word(Function.into()),
                    InternalToken::If => Word(If.into()),
                    InternalToken::Return => Word(Return.into()),
                    InternalToken::Switch => Word(Switch.into()),
                    InternalToken::Throw => Word(Throw.into()),
                    InternalToken::Try => Word(Try.into()),
                    InternalToken::Var => Word(Var.into()),
                    InternalToken::Let => Word(Let.into()),
                    InternalToken::Const => Word(Const.into()),
                    InternalToken::While => Word(While.into()),
                    InternalToken::With => Word(With.into()),
                    InternalToken::New => Word(New.into()),
                    InternalToken::This => Word(This.into()),
                    InternalToken::Super => Word(Super.into()),
                    InternalToken::Class => Word(Class.into()),
                    InternalToken::Extends => Word(Extends.into()),
                    InternalToken::Import => Word(Import.into()),
                    InternalToken::Yield => Word(Yield.into()),
                    InternalToken::In => Word(In.into()),
                    InternalToken::InstanceOf => Word(InstanceOf.into()),
                    InternalToken::TypeOf => Word(TypeOf.into()),
                    InternalToken::Void => Word(Void.into()),
                    InternalToken::Delete => Word(Delete.into()),
                    _ => unreachable!(),
                }));
            }

            itok!("??=") if self.syntax.typescript() => {
                self.input.advance();
                return Ok(Some(tok!("??=")));
            }

            itok!(":") => {
                self.input.advance();

                if self.syntax.fn_bind() && self.input.cur() == Some(itok!(":")) {
                    self.input.advance();
                    return Ok(Some(tok!("::")));
                }

                return Ok(Some(tok!(':')));
            }

            InternalToken::Str => return self.read_str_lit().map(Some),

            InternalToken::Div => return self.read_slash(),

            itok!("**=") => {
                self.input.advance();
                AssignOp(ExpAssign)
            }
            itok!("*=") => {
                self.input.advance();
                AssignOp(MulAssign)
            }
            itok!("%=") => {
                self.input.advance();
                AssignOp(ModAssign)
            }

            itok!("**") => {
                self.input.advance();
                BinOp(Exp)
            }
            itok!("*") => {
                self.input.advance();
                BinOp(Mul)
            }
            itok!("%") => {
                self.input.advance();
                BinOp(Mod)
            }

            // Logical operators
            itok!("|=") => {
                self.input.advance();
                AssignOp(BitOrAssign)
            }
            itok!("&=") => {
                self.input.advance();
                AssignOp(BitAndAssign)
            }
            itok!("|") => {
                self.input.advance();
                BinOp(BitOr)
            }
            itok!("&") => {
                self.input.advance();
                BinOp(BitAnd)
            }

            itok!("||") => {
                self.input.advance();
                BinOp(LogicalOr)
            }
            itok!("&&") => {
                self.input.advance();
                BinOp(LogicalAnd)
            }
            itok!("||=") => {
                self.input.advance();
                AssignOp(OrAssign)
            }
            itok!("&&=") => {
                self.input.advance();
                AssignOp(AndAssign)
            }

            // Bitwise xor
            itok!("^=") => {
                self.input.advance();
                AssignOp(BitXorAssign)
            }
            itok!("^") => {
                self.input.advance();
                BinOp(BitXor)
            }

            itok!("++") => {
                self.input.advance();
                PlusPlus
            }

            itok!("--") => {
                self.input.advance();

                if self.state.had_line_break {
                    match self.input.cur() {
                        Some(itok!(">")) => {
                            if self.ctx.module {
                                return self.error(start, SyntaxError::LegacyCommentInModule)?;
                            }
                            self.skip_line_comment();
                            self.skip_space()?;
                            return self.read_token();
                        }

                        _ => {}
                    }
                }

                MinusMinus
            }

            itok!("+") => {
                self.input.advance();
                BinOp(Add)
            }
            itok!("-") => {
                self.input.advance();
                BinOp(Sub)
            }

            itok!("+=") => {
                self.input.advance();
                AssignOp(AddAssign)
            }
            itok!("-=") => {
                self.input.advance();
                AssignOp(SubAssign)
            }

            // XML style comment. `<!--`
            InternalToken::XmlCommentStart => {
                self.input.advance();
                self.skip_space()?;
                if self.ctx.module {
                    self.error(start, SyntaxError::LegacyCommentInModule)?;
                }
                return self.read_token();
            }

            itok!("<") => {
                self.input.advance();
                tok!('<')
            }

            itok!("<=") => {
                self.input.advance();
                BinOp(LtEq)
            }

            itok!(">") => {
                self.input.advance();
                tok!('>')
            }

            itok!(">=") => {
                self.input.advance();
                BinOp(GtEq)
            }

            itok!("!") => {
                self.input.advance();
                Bang
            }
            itok!("=") => {
                self.input.advance();
                AssignOp(Assign)
            }

            itok!("=>") => {
                self.input.advance();
                AssignOp(Assign)
            }

            itok!("!==") => {
                self.input.advance();
                BinOp(NotEqEq)
            }
            itok!("!=") => {
                self.input.advance();
                BinOp(NotEq)
            }
            itok!("===") => {
                self.input.advance();
                BinOp(EqEqEq)
            }
            itok!("==") => {
                self.input.advance();
                BinOp(EqEq)
            }

            itok!("~") => {
                self.input.advance();
                tok!('~')
            }

            // unexpected character
            c => {
                let s = self.input.slice();
                self.error_span(
                    pos_span(start),
                    SyntaxError::UnexpectedToken {
                        token: format!("{:?} ({}))", c, s),
                    },
                )?
            }
        };

        Ok(Some(token))
    }

    /// `#`
    fn read_token_number_sign(&mut self) -> LexResult<Option<Token>> {
        debug_assert_eq!(self.input.cur(), Some(itok!("#")));

        let start = self.input.cur_pos();

        if self.input.is_at_start() && self.read_token_interpreter()? {
            return Ok(None);
        }

        if self.syntax.class_private_props() || self.syntax.class_private_methods() {
            self.input.advance(); // '#'
            return Ok(Some(Token::Hash));
        }

        self.error(start, SyntaxError::Hash)?
    }

    fn read_token_interpreter(&mut self) -> LexResult<bool> {
        if !self.input.is_at_start() {
            return Ok(false);
        }

        match self.input.cur() {
            Some(InternalToken::Interpreter) => {
                self.input.advance();
                Ok(true)
            }
            _ => Ok(false),
        }
    }

    /// Read an escaped charater for string literal.
    ///
    /// In template literal, we should preserve raw string.
    fn parse_escaped_char(&mut self, iter: &mut Chars, raw: &mut Raw) -> LexResult<Option<Char>> {
        let start = self.input.cur_pos(); // TODO: correct pos
        let in_template = raw.0.is_some();

        let c = match iter.clone().next() {
            Some(c) => c,
            None => self.error(start, SyntaxError::InvalidStrEscape)?,
        };

        macro_rules! push_c_and_ret {
            ($c:expr) => {{
                raw.push(c);
                $c
            }};
        }

        let c = match c {
            '\\' => push_c_and_ret!('\\'),
            'n' => push_c_and_ret!('\n'),
            'r' => push_c_and_ret!('\r'),
            't' => push_c_and_ret!('\t'),
            'b' => push_c_and_ret!('\u{0008}'),
            'v' => push_c_and_ret!('\u{000b}'),
            'f' => push_c_and_ret!('\u{000c}'),
            '\r' => {
                raw.push_str("\r");
                iter.next(); // remove '\r'

                if iter.as_str().starts_with('\n') {
                    iter.next();
                    raw.push_str("\n");
                }
                return Ok(None);
            }
            '\n' | '\u{2028}' | '\u{2029}' => {
                match c {
                    '\n' => raw.push_str("\n"),
                    '\u{2028}' => raw.push_str("\u{2028}"),
                    '\u{2029}' => raw.push_str("\u{2029}"),
                    _ => unreachable!(),
                }
                iter.next();
                return Ok(None);
            }

            // read hexadecimal escape sequences
            'x' => {
                raw.push_str("\\x");
                iter.next(); // 'x'
                return self.parse_hex_char(iter, start, 2, raw).map(Some);
            }

            // read unicode escape sequences
            'u' => {
                return self.parse_unicode_escape(iter, start, raw).map(Some);
            }
            // octal escape sequences
            '0'..='7' => {
                raw.push(c);
                iter.next(); // first digit
                let first_c = if c == '0' {
                    match iter.clone().next() {
                        Some(next) if next.is_digit(8) => c,
                        // \0 is not an octal literal nor decimal literal.
                        _ => return Ok(Some('\u{0000}'.into())),
                    }
                } else {
                    c
                };

                // TODO: Show template instead of strict mode
                if in_template {
                    let span = self.input.span();
                    self.error_span(span, SyntaxError::LegacyOctal)?
                }

                if self.ctx.strict {
                    let span = self.input.span();
                    self.error_span(span, SyntaxError::LegacyOctal)?
                }

                let mut value: u8 = first_c.to_digit(8).unwrap() as u8;
                macro_rules! one {
                    ($check:expr) => {{
                        match iter.clone().next().and_then(|c| c.to_digit(8)) {
                            Some(v) => {
                                value = if $check {
                                    let new_val = value
                                        .checked_mul(8)
                                        .and_then(|value| value.checked_add(v as u8));
                                    match new_val {
                                        Some(val) => val,
                                        None => return Ok(Some(value as char).map(From::from)),
                                    }
                                } else {
                                    value * 8 + v as u8
                                };
                                iter.next();
                            }
                            _ => return Ok(Some(value as u32).map(From::from)),
                        }
                    }};
                }
                one!(false);
                one!(true);

                return Ok(Some(value as char).map(From::from));
            }
            _ => {
                raw.push(c);
                iter.next();
                c
            }
        };

        Ok(Some(c.into()))
    }
}

impl<'a> Lexer<'a> {
    fn read_slash(&mut self) -> LexResult<Option<Token>> {
        debug_assert_eq!(self.input.cur(), Some(itok!("/")));
        // let start = self.cur_pos();

        // Regex
        if self.state.is_expr_allowed {
            return self.read_regexp().map(Some);
        }

        // Divide operator
        self.input.advance(); // ';'

        Ok(Some(match self.input.cur() {
            Some(itok!("=")) => {
                self.input.advance();
                tok!("/=")
            }
            _ => tok!('/'),
        }))
    }

    /// See https://tc39.github.io/ecma262/#sec-names-and-keywords
    fn read_ident(&mut self) -> LexResult<Token> {
        let word = Word::Ident(self.input.slice().into());
        self.input.advance();

        Ok(Word(word))
    }

    fn may_read_word_as_str(&mut self) -> LexResult<Option<(JsWord, bool)>> {
        match self.input.cur() {
            Some(InternalToken::Ident) => self.read_word_as_str().map(Some),
            _ => Ok(None),
        }
    }

    fn read_word_as_str(&mut self) -> LexResult<(JsWord, bool)> {
        self.read_word_as_str_with(|_, s| JsWord::from(s))
    }

    /// returns (word, has_escape)
    ///
    /// This method is optimized for texts without escape sequences.
    fn read_word_as_str_with<F, Ret>(&mut self, convert: F) -> LexResult<(Ret, bool)>
    where
        F: FnOnce(InternalToken, &str) -> Ret,
    {
        let s = self.input.slice();
        let ret = convert(self.input.cur().unwrap(), s);

        self.input.advance();

        Ok((ret, s.contains('\\')))
    }

    fn parse_unicode_escape(
        &mut self,
        iter: &mut Chars,
        start: BytePos,
        raw: &mut Raw,
    ) -> LexResult<Char> {
        debug_assert_eq!(iter.clone().next(), Some('u'));
        iter.next();

        raw.push_str("u");

        if iter.as_str().starts_with('{') {
            iter.next();
            raw.push('{');
            // let cp_start = self.cur_pos();
            let c = self.parse_code_point(iter, raw)?;

            if !iter.as_str().starts_with('}') {
                self.error(start, SyntaxError::InvalidUnicodeEscape)?
            }
            raw.push('}');
            iter.next();

            Ok(c)
        } else {
            self.parse_hex_char(iter, start, 4, raw)
        }
    }

    ///
    ///
    /// THis method returns [Char] as non-utf8 character is valid in javsacript.
    /// See https://github.com/swc-project/swc/issues/261
    fn parse_hex_char(
        &mut self,
        iter: &mut Chars,
        start: BytePos,
        count: u8,
        raw: &mut Raw,
    ) -> LexResult<Char> {
        debug_assert!(count == 2 || count == 4);

        // let pos = self.cur_pos();
        match self.parse_int_u32(iter, 16, count, raw)? {
            Some(val) => Ok(val.into()),
            None => self.error(start, SyntaxError::ExpectedHexChars { count })?,
        }
    }

    /// Read `CodePoint`.
    fn parse_code_point(&mut self, iter: &mut Chars, raw: &mut Raw) -> LexResult<Char> {
        let start = self.input.cur_pos();
        let val = self.parse_int_u32(iter, 16, 0, raw)?;
        match val {
            Some(val) if 0x0010_FFFF >= val => match char::from_u32(val) {
                Some(c) => Ok(c.into()),
                None => self.error(start, SyntaxError::InvalidCodePoint)?,
            },
            _ => self.error(start, SyntaxError::InvalidCodePoint)?,
        }
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    fn read_str_lit(&mut self) -> LexResult<Token> {
        debug_assert_eq!(self.input.cur(), Some(InternalToken::Str));

        let s = self.input.slice();
        // Remove quotes
        let s = &s[1..s.len() - 1];
        self.input.advance();

        if !s.contains('\\') {
            // Fast path
            return Ok(Token::Str {
                has_escape: false,
                value: s.into(),
            });
        }

        let mut buf = String::with_capacity(s.len());
        let mut chunk_start = 0usize;
        for idx in memchr_iter(b'\\', s.as_bytes()) {
            //
            if idx != chunk_start {
                let chunk = &s[chunk_start..idx];
                buf.push_str(chunk);
                // 1 for '\'
            }
            chunk_start = idx + 1;
            let mut iter = s[idx + 1..].chars();
            let iter_orig_len = iter.as_str().len();

            let c = self.parse_escaped_char(&mut iter, &mut Raw(None))?;
            if let Some(c) = c {
                buf.extend(c);
            }
            chunk_start += iter_orig_len - iter.as_str().len();
        }

        buf.push_str(&s[chunk_start..]);

        Ok(Token::Str {
            has_escape: true,
            value: buf.into(),
        })
    }

    /// Expects current char to be '/'
    fn read_regexp(&mut self) -> LexResult<Token> {
        debug_assert_eq!(self.input.cur(), Some(itok!("/")));
        let start = self.input.cur_pos();
        self.input.advance(); // '/'

        let (mut escaped, mut in_class) = (false, false);
        // let content_start = self.cur_pos();
        let content: JsWord = self.with_chars(|lexer, iter| {
            let mut buf = String::new();

            while let Some(c) = iter.clone().next() {
                // This is ported from babel.
                // Seems like regexp literal cannot contain linebreak.
                if c.is_line_break() {
                    lexer.error(start, SyntaxError::UnterminatedRegxp)?;
                }

                if escaped {
                    escaped = false;
                } else {
                    match c {
                        '[' => in_class = true,
                        ']' if in_class => in_class = false,
                        // Termniates content part of regex literal
                        '/' if !in_class => break,
                        _ => {}
                    }
                    escaped = c == '\\';
                }
                iter.next();
                buf.push(c);
            }

            Ok(buf.into())
        })?;
        // let content_span = Span::new(content_start, self.cur_pos(),
        // Default::default());

        // input is terminated without following `/`
        if self.input.cur() != Some(itok!("/")) {
            self.error(start, SyntaxError::UnterminatedRegxp)?;
        }

        self.input.advance(); // '/'

        // Spec says "It is a Syntax Error if IdentifierPart contains a Unicode escape
        // sequence." TODO: check for escape

        // Need to use `read_word` because '\uXXXX' sequences are allowed
        // here (don't ask).
        // let flags_start = self.cur_pos();
        let flags = self
            .may_read_word_as_str()?
            .map(|(value, _)| value)
            .unwrap_or(js_word!(""));

        Ok(Regex(content, flags))
    }

    fn read_shebang(&mut self) -> LexResult<Option<JsWord>> {
        match self.input.cur() {
            Some(InternalToken::Interpreter) => {
                self.input.advance();
                return Ok(Some(self.input.slice().into()));
            }
            _ => Ok(None),
        }
    }

    fn read_tmpl_token(&mut self, start_of_tpl: BytePos) -> LexResult<Token> {
        let start = self.input.cur_pos();

        // TODO: Optimize
        let mut has_escape = false;
        let mut cooked = String::new();
        let mut raw = String::new();

        while let Some(c) = self.input.cur() {
            if c == itok!("`") || c == itok!("${") {
                if start == self.input.cur_pos() && self.state.last_was_tpl_element() {
                    self.input.advance();

                    return Ok(if c == itok!("${") {
                        tok!("${")
                    } else {
                        tok!('`')
                    });
                }

                // TODO: Handle error
                return Ok(Template {
                    cooked: cooked.into(),
                    raw: raw.into(),
                    has_escape,
                });
            }

            if c == itok!("\\") {
                has_escape = true;
                raw.push('\\');
                let mut wrapped = Raw(Some(raw));

                let ch =
                    self.with_chars(|lexer, iter| lexer.parse_escaped_char(iter, &mut wrapped))?;

                raw = wrapped.0.unwrap();
                if let Some(s) = ch {
                    cooked.extend(s);
                }
            } else if c == InternalToken::NewLine {
                self.state.had_line_break = true;

                let mut iter = self.input.slice().chars();
                while let Some(c) = iter.next() {
                    let c = if c == '\r' && iter.as_str().starts_with('\n') {
                        raw.push_str("\\r\\n");
                        '\n'
                    } else {
                        match c {
                            '\n' => raw.push_str("\n"),
                            '\r' => raw.push_str("\r"),
                            '\u{2028}' => raw.push_str("\u{2028}"),
                            '\u{2029}' => raw.push_str("\u{2029}"),
                            _ => unreachable!(),
                        }
                        c
                    };
                    cooked.push(c);
                }
                self.input.advance();
            } else {
                cooked.push_str(self.input.slice());
                raw.push_str(self.input.slice());
                self.input.advance();
            }
        }

        self.error(start_of_tpl, SyntaxError::UnterminatedTpl)?
    }

    pub fn had_line_break_before_last(&self) -> bool {
        self.state.had_line_break
    }

    pub fn set_expr_allowed(&mut self, allow: bool) {
        self.state.is_expr_allowed = allow;
    }
}

fn pos_span(p: BytePos) -> Span {
    Span::new(p, p, Default::default())
}
