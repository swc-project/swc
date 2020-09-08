//! ECMAScript lexer.

pub use self::{
    input::Input,
    state::{TokenContext, TokenContexts},
};
use self::{state::State, util::*};
use crate::{
    error::{Error, SyntaxError},
    token::*,
    Context, JscTarget, Syntax,
};
use smallvec::{smallvec, SmallVec};
use std::{cell::RefCell, char, iter::FusedIterator, marker::PhantomData, mem::take, rc::Rc};
use swc_atoms::{js_word, JsWord};
use swc_common::{
    comments::{Comment, Comments},
    BytePos, Span,
};
use swc_ecma_raw_lexer::{DumbLexer, InternalToken};

#[macro_use]
mod macros;
pub mod input;
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
pub struct Lexer<'a, I: Input> {
    comments: Option<&'a dyn Comments>,
    /// [Some] if comment comment parsing is enabled. Otherwise [None]
    leading_comments_buffer: Option<Rc<RefCell<Vec<Comment>>>>,

    pub(crate) ctx: Context,
    input: DumbLexer<'a>,
    marker: PhantomData<I>,
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

impl<I: Input> FusedIterator for Lexer<'_, I> {}

impl<'a, I: Input> Lexer<'a, I> {
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
            marker: PhantomData,
            last_comment_pos: Rc::new(RefCell::new(BytePos(0))),
            state: State::new(syntax),
            ctx: Default::default(),
            syntax,
            target,
            errors: Default::default(),
            buf: String::with_capacity(16),
        }
    }

    /// Utility method to reuse buffer.
    fn with_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
    where
        F: for<'any> FnOnce(&mut Lexer<'any, I>, &mut String) -> LexResult<Ret>,
    {
        let mut buf = take(&mut self.buf);
        buf.clear();

        let res = op(self, &mut buf);

        self.buf = buf;

        res
    }

    /// babel: `getTokenFromCode`
    fn read_token(&mut self) -> LexResult<Option<Token>> {
        let c = match self.input.cur() {
            Some(c) => c,
            None => {
                return Ok(None);
            }
        };
        let start = self.cur_pos();

        let token = match c {
            itok!("#") => return self.read_token_number_sign(),
            // Identifier or keyword. '\uXXXX' sequences are allowed in
            // identifiers, so '\' also dispatches to that.
            InternalToken::Ident | itok!("\\") => return self.read_ident_or_keyword().map(Some),

            //
            itok!(".") => {
                return Ok(Some(tok!('.')));
            }

            InternalToken::BigInt => return self.read_bigint().map(Token::BigInt).map(Some),

            InternalToken::Num => {
                return self.read_number().map(Token::Num).map(Some);
            }

            itok!("??")
            | itok!("?")
            | itok!("`")
            | itok!("...")
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
                self.input.bump();
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
                    itok!("?") => QuestionMark,
                    itok!("...") => DotDotDot,
                    itok!("<<") => BinOp(LShift),
                    itok!("<<=") => AssignOp(LShiftAssign),
                    itok!(">>") => BinOp(RShift),
                    itok!(">>=") => AssignOp(RShiftAssign),
                    itok!(">>>") => BinOp(ZeroFillRShift),
                    itok!(">>>=") => AssignOp(ZeroFillRShiftAssign),
                    _ => unreachable!(),
                }));
            }

            itok!("??=") if self.syntax.typescript() => {
                self.input.bump();
                return Ok(Some(tok!("??=")));
            }

            itok!(":") => {
                self.input.bump();

                if self.syntax.fn_bind() && self.input.cur() == Some(itok!(":")) {
                    self.input.bump();
                    return Ok(Some(tok!("::")));
                }

                return Ok(Some(tok!(':')));
            }

            InternalToken::BigInt => return self.read_bigint().map(Token::BigInt).map(Some),

            InternalToken::Num => {
                return self.read_number().map(Token::Num).map(Some);
            }

            InternalToken::Str => return self.read_str_lit().map(Some),

            InternalToken::Div => return self.read_slash(),

            itok!("**=") => {
                self.bump();
                AssignOp(ExpAssign)
            }
            itok!("*=") => {
                self.bump();
                AssignOp(MulAssign)
            }
            itok!("%") => {
                self.bump();
                AssignOp(ModAssign)
            }

            itok!("**") => {
                self.bump();
                BinOp(Exp)
            }
            itok!("*") => {
                self.bump();
                BinOp(Mul)
            }
            itok!("%") => {
                self.bump();
                BinOp(Mod)
            }

            // Logical operators
            itok!("|=") => {
                self.bump();
                AssignOp(BitOrAssign)
            }
            itok!("&=") => {
                self.bump();
                AssignOp(BitAndAssign)
            }
            itok!("|") => {
                self.bump();
                BinOp(BitOr)
            }
            itok!("&") => {
                self.bump();
                BinOp(BitAnd)
            }

            itok!("||") => {
                self.bump();
                BinOp(LogicalOr)
            }
            itok!("&&") => {
                self.bump();
                BinOp(LogicalAnd)
            }
            itok!("||=") => {
                self.bump();
                AssignOp(OrAssign)
            }
            itok!("&&=") => {
                self.bump();
                AssignOp(AndAssign)
            }

            // Bitwise xor
            itok!("^=") => {
                self.bump();
                AssignOp(BitXorAssign)
            }
            itok!("^") => {
                self.bump();
                BinOp(BitXor)
            }

            itok!("++") => {
                self.bump();
                PlusPlus
            }

            itok!("--") => {
                self.input.bump();

                if self.state.had_line_break {
                    match self.cur() {
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
                self.bump();
                BinOp(Add)
            }
            itok!("-") => {
                self.bump();
                BinOp(Sub)
            }

            itok!("+=") => {
                self.bump();
                AssignOp(AddAssign)
            }
            itok!("-=") => {
                self.bump();
                AssignOp(SubAssign)
            }

            itok!("<") | itok!(">") => return self.read_token_lt_gt(),

            itok!("!") => {
                self.bump();
                Bang
            }
            itok!("=") => {
                self.bump();
                AssignOp(Assign)
            }

            itok!("=>") => {
                self.bump();
                AssignOp(Assign)
            }

            itok!("!==") => {
                self.bump();
                BinOp(NotEqEq)
            }
            itok!("!=") => {
                self.bump();
                BinOp(NotEq)
            }
            itok!("===") => {
                self.bump();
                BinOp(EqEqEq)
            }
            itok!("==") => {
                self.bump();
                BinOp(EqEq)
            }

            itok!("~") => {
                self.input.bump();
                tok!('~')
            }

            // unexpected character
            c => self.error_span(
                pos_span(start),
                SyntaxError::UnexpectedToken {
                    token: format!("{:?}", c),
                },
            )?,
        };

        Ok(Some(token))
    }

    /// `#`
    fn read_token_number_sign(&mut self) -> LexResult<Option<Token>> {
        debug_assert_eq!(self.cur(), Some(itok!("#")));

        let start = self.input.cur_pos();

        if self.input.is_at_start() && self.read_token_interpreter()? {
            return Ok(None);
        }

        if self.syntax.class_private_props() || self.syntax.class_private_methods() {
            self.input.bump(); // '#'
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
                self.input.bump();
                Ok(true)
            }
            _ => Ok(false),
        }
    }

    /// Read an escaped charater for string literal.
    ///
    /// In template literal, we should preserve raw string.
    fn read_escaped_char(&mut self, raw: &mut Raw) -> LexResult<Option<Char>> {
        debug_assert_eq!(self.cur(), Some(itok!("\\")));
        let start = self.cur_pos();
        self.bump(); // '\'

        let in_template = raw.0.is_some();

        let c = match self.input.cur_char() {
            Some(c) => c,
            None => self.error_span(pos_span(start), SyntaxError::InvalidStrEscape)?,
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
                self.bump(); // remove '\r'

                if self.eat(b'\n') {
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
                self.bump();
                return Ok(None);
            }

            // read hexadecimal escape sequences
            'x' => {
                raw.push_str("0x");
                self.bump(); // 'x'
                return self.read_hex_char(start, 2, raw).map(Some);
            }

            // read unicode escape sequences
            'u' => {
                return self.read_unicode_escape(start, raw).map(Some);
            }
            // octal escape sequences
            '0'..='7' => {
                raw.push(c);
                self.bump();
                let first_c = if c == '0' {
                    match self.cur() {
                        Some(next) if next.is_digit(8) => c,
                        // \0 is not an octal literal nor decimal literal.
                        _ => return Ok(Some('\u{0000}'.into())),
                    }
                } else {
                    c
                };

                // TODO: Show template instead of strict mode
                if in_template {
                    self.error(start, SyntaxError::LegacyOctal)?
                }

                if self.ctx.strict {
                    self.error(start, SyntaxError::LegacyOctal)?
                }

                let mut value: u8 = first_c.to_digit(8).unwrap() as u8;
                macro_rules! one {
                    ($check:expr) => {{
                        match self.cur().and_then(|c| c.to_digit(8)) {
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
                                self.bump();
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
                c
            }
        };
        self.input.bump();

        Ok(Some(c.into()))
    }
}

impl<'a, I: Input> Lexer<'a, I> {
    fn read_slash(&mut self) -> LexResult<Option<Token>> {
        debug_assert_eq!(self.cur(), Some(itok!("/")));
        // let start = self.cur_pos();

        // Regex
        if self.state.is_expr_allowed {
            return self.read_regexp().map(Some);
        }

        // Divide operator
        self.bump();

        Ok(Some(match self.input.cur() {
            Some(itok!("=")) => {
                self.bump();
                tok!("/=")
            }
            _ => tok!('/'),
        }))
    }

    fn read_token_lt_gt(&mut self) -> LexResult<Option<Token>> {
        debug_assert!(self.cur() == Some(itok!("<")) || self.cur() == Some(itok!(">")));

        let start = self.cur_pos();
        let c = self.cur().unwrap();
        self.bump();

        // XML style comment. `<!--`
        if c == itok!("<")
            && self.cur() == Some(itok!("!"))
            && self.peek() == Some(itok!("-"))
            && self.peek_ahead() == Some(itok!("-"))
        {
            self.input.bump_bytes(3);
            self.skip_space()?;
            if self.ctx.module {
                self.error(start, SyntaxError::LegacyCommentInModule)?;
            }
            return self.read_token();
        }

        let mut op = if c == itok!("<") { Lt } else { Gt };

        Ok(Some(BinOp(op)))
    }

    /// See https://tc39.github.io/ecma262/#sec-names-and-keywords
    fn read_ident_or_keyword(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur().is_some());
        let start = self.cur_pos();

        let (word, has_escape) = self.read_word_as_str_with(|s| match s {
            "null" => Word::Null,
            "true" => Word::True,
            "false" => Word::False,
            "await" => Await.into(),
            "break" => Break.into(),
            "case" => Case.into(),
            "catch" => Catch.into(),
            "continue" => Continue.into(),
            "debugger" => Debugger.into(),
            "default" => Default_.into(),
            "do" => Do.into(),
            "export" => Export.into(),
            "else" => Else.into(),
            "finally" => Finally.into(),
            "for" => For.into(),
            "function" => Function.into(),
            "if" => If.into(),
            "return" => Return.into(),
            "switch" => Switch.into(),
            "throw" => Throw.into(),
            "try" => Try.into(),
            "var" => Var.into(),
            "let" => Let.into(),
            "const" => Const.into(),
            "while" => While.into(),
            "with" => With.into(),
            "new" => New.into(),
            "this" => This.into(),
            "super" => Super.into(),
            "class" => Class.into(),
            "extends" => Extends.into(),
            "import" => Import.into(),
            "yield" => Yield.into(),
            "in" => In.into(),
            "instanceof" => InstanceOf.into(),
            "typeof" => TypeOf.into(),
            "void" => Void.into(),
            "delete" => Delete.into(),
            _ => Word::Ident(s.into()),
        })?;

        // Note: ctx is store in lexer because of this error.
        // 'await' and 'yield' may have semantic of reserved word, which means lexer
        // should know context or parser should handle this error. Our approach to this
        // problem is former one.
        if has_escape && self.ctx.is_reserved(&word) {
            self.error(
                start,
                SyntaxError::EscapeInReservedWord { word: word.into() },
            )?
        } else {
            Ok(Word(word))
        }
    }

    fn may_read_word_as_str(&mut self) -> LexResult<Option<(JsWord, bool)>> {
        match self.cur() {
            Some(InternalToken::Ident) => self.read_word_as_str().map(Some),
            _ => Ok(None),
        }
    }

    fn read_word_as_str(&mut self) -> LexResult<(JsWord, bool)> {
        self.read_word_as_str_with(|s| JsWord::from(s))
    }

    /// returns (word, has_escape)
    ///
    /// This method is optimized for texts without escape sequences.
    fn read_word_as_str_with<F, Ret>(&mut self, convert: F) -> LexResult<(Ret, bool)>
    where
        F: FnOnce(&str) -> Ret,
    {
        debug_assert_eq!(self.input.cur(), Some(InternalToken::Ident));
        let mut first = true;

        let s = &self.input.into();

        self.with_buf(|l, buf| {
            let mut has_escape = false;

            while let Some(c) = {
                // Optimization
                {
                    let s = l.input.uncons_while(|c| c.is_ident_part());
                    if !s.is_empty() {
                        first = false;
                    }
                    buf.push_str(s)
                }

                l.cur()
            } {
                let start = l.cur_pos();

                match c {
                    c if c.is_ident_part() => {
                        l.bump();
                        buf.push(c);
                    }
                    // unicode escape
                    '\\' => {
                        l.bump();
                        if !l.is(b'u') {
                            l.error_span(pos_span(start), SyntaxError::ExpectedUnicodeEscape)?
                        }
                        has_escape = true;
                        let c = l.read_unicode_escape(start, &mut Raw(None))?;
                        let valid = if first {
                            c.is_ident_start()
                        } else {
                            c.is_ident_part()
                        };

                        if !valid {
                            l.error(start, SyntaxError::InvalidIdentChar)?
                        }
                        buf.extend(c);
                    }

                    _ => {
                        break;
                    }
                }
                first = false;
            }
            let value = convert(&buf);

            Ok((value, has_escape))
        })
    }

    fn read_unicode_escape(&mut self, start: BytePos, raw: &mut Raw) -> LexResult<Char> {
        debug_assert_eq!(self.cur(), Some('u'));
        self.bump();

        raw.push_str("u");

        if self.eat(b'{') {
            raw.push('{');
            // let cp_start = self.cur_pos();
            let c = self.read_code_point(raw)?;

            if !self.eat(b'}') {
                self.error(start, SyntaxError::InvalidUnicodeEscape)?
            }
            raw.push('}');

            Ok(c)
        } else {
            self.read_hex_char(start, 4, raw)
        }
    }

    ///
    ///
    /// THis method returns [Char] as non-utf8 character is valid in javsacript.
    /// See https://github.com/swc-project/swc/issues/261
    fn read_hex_char(&mut self, start: BytePos, count: u8, raw: &mut Raw) -> LexResult<Char> {
        debug_assert!(count == 2 || count == 4);

        // let pos = self.cur_pos();
        match self.read_int_u32(16, count, raw)? {
            Some(val) => Ok(val.into()),
            None => self.error(start, SyntaxError::ExpectedHexChars { count })?,
        }
    }

    /// Read `CodePoint`.
    fn read_code_point(&mut self, raw: &mut Raw) -> LexResult<Char> {
        let start = self.cur_pos();
        let val = self.read_int_u32(16, 0, raw)?;
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
        debug_assert!(self.cur() == Some('\'') || self.cur() == Some('"'));
        let start = self.cur_pos();
        let quote = self.cur().unwrap();
        self.bump(); // '"'

        self.with_buf(|l, out| {
            let mut has_escape = false;

            while let Some(c) = {
                // Optimization
                {
                    let s = l
                        .input
                        .uncons_while(|c| c != quote && c != '\\' && !c.is_line_break());
                    out.push_str(s);
                }
                l.cur()
            } {
                match c {
                    c if c == quote => {
                        l.bump();
                        return Ok(Token::Str {
                            value: (&**out).into(),
                            has_escape,
                        });
                    }
                    '\\' => {
                        if let Some(s) = l.read_escaped_char(&mut Raw(None))? {
                            out.extend(s);
                        }
                        has_escape = true
                    }
                    c if c.is_line_break() => l.error(start, SyntaxError::UnterminatedStrLit)?,
                    _ => {
                        out.push(c);
                        l.bump();
                    }
                }
            }

            l.error(start, SyntaxError::UnterminatedStrLit)?
        })
    }

    /// Expects current char to be '/'
    fn read_regexp(&mut self) -> LexResult<Token> {
        debug_assert_eq!(self.cur(), Some('/'));
        let start = self.cur_pos();
        self.bump();

        let (mut escaped, mut in_class) = (false, false);
        // let content_start = self.cur_pos();
        let content = self.with_buf(|l, buf| {
            while let Some(c) = l.cur() {
                // This is ported from babel.
                // Seems like regexp literal cannot contain linebreak.
                if c.is_line_break() {
                    l.error(start, SyntaxError::UnterminatedRegxp)?;
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
                l.bump();
                buf.push(c);
            }

            Ok((&**buf).into())
        })?;
        // let content_span = Span::new(content_start, self.cur_pos(),
        // Default::default());

        // input is terminated without following `/`
        if !self.is(b'/') {
            self.error(start, SyntaxError::UnterminatedRegxp)?;
        }

        self.bump(); // '/'

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
        if self.input.cur() != Some('#') || self.input.peek() != Some('!') {
            return Ok(None);
        }
        match self.input.cur()? {
            InternalToken::Interpreter => return Ok(Some(self.input.slice_cur().into())),
            _ => Ok(None),
        }
    }

    fn read_tmpl_token(&mut self, start_of_tpl: BytePos) -> LexResult<Token> {
        let start = self.cur_pos();

        // TODO: Optimize
        let mut has_escape = false;
        let mut cooked = String::new();
        let mut raw = String::new();

        while let Some(c) = self.cur() {
            if c == itok!("`") || c == itok!("${") {
                if start == self.cur_pos() && self.state.last_was_tpl_element() {
                    self.bump();

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

            if c == '\\' {
                has_escape = true;
                raw.push('\\');
                let mut wrapped = Raw(Some(raw));
                let ch = self.read_escaped_char(&mut wrapped)?;
                raw = wrapped.0.unwrap();
                if let Some(s) = ch {
                    cooked.extend(s);
                }
            } else if c.is_line_break() {
                self.state.had_line_break = true;
                let c = if c == '\r' && self.peek() == Some('\n') {
                    raw.push_str("\\r\\n");
                    self.bump(); // '\r'
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
                self.bump();
                cooked.push(c);
            } else {
                self.bump();
                cooked.push(c);
                raw.push(c);
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
