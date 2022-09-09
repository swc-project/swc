//! ECMAScript lexer.

use std::{cell::RefCell, char, iter::FusedIterator, rc::Rc};

use either::Either::{Left, Right};
use smallvec::{smallvec, SmallVec};
use swc_atoms::{Atom, AtomGenerator};
use swc_common::{comments::Comments, BytePos, Span};
use swc_ecma_ast::{op, EsVersion};

use self::{comments_buffer::CommentsBuffer, state::State, util::*};
pub use self::{
    input::Input,
    state::{TokenContext, TokenContexts},
};
use crate::{
    error::{Error, SyntaxError},
    token::*,
    Context, Syntax,
};

mod comments_buffer;
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

pub(crate) struct CharIter(SmallVec<[char; 7]>);

impl IntoIterator for Char {
    type IntoIter = CharIter;
    type Item = char;

    #[allow(unsafe_code)]
    fn into_iter(self) -> Self::IntoIter {
        //        // TODO: Check if this is correct
        //        fn to_char(v: u8) -> char {
        //            char::from_digit(v as _, 16).unwrap_or('0')
        //        }

        CharIter(match char::from_u32(self.0) {
            Some(c) => smallvec![c],
            None => {
                let c = unsafe { char::from_u32_unchecked(self.0) };
                let escaped = c.escape_unicode().to_string();

                debug_assert!(escaped.starts_with('\\'));

                let mut buf = smallvec![];
                buf.push('\\');
                buf.push('\0');
                buf.push('u');

                if escaped.len() == 8 {
                    buf.extend(escaped[3..=6].chars());
                } else {
                    buf.extend(escaped[2..].chars());
                }

                buf
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
    comments_buffer: Option<CommentsBuffer>,

    pub(crate) ctx: Context,
    input: I,
    start_pos: BytePos,

    state: State,
    pub(crate) syntax: Syntax,
    pub(crate) target: EsVersion,

    errors: Rc<RefCell<Vec<Error>>>,
    module_errors: Rc<RefCell<Vec<Error>>>,

    atoms: Rc<RefCell<AtomGenerator>>,

    buf: Rc<RefCell<String>>,
}

impl<I: Input> FusedIterator for Lexer<'_, I> {}

impl<'a, I: Input> Lexer<'a, I> {
    pub fn new(
        syntax: Syntax,
        target: EsVersion,
        input: I,
        comments: Option<&'a dyn Comments>,
    ) -> Self {
        let start_pos = input.last_pos();

        Lexer {
            comments,
            comments_buffer: comments.is_some().then(CommentsBuffer::new),
            ctx: Default::default(),
            input,
            start_pos,
            state: State::new(syntax, start_pos),
            syntax,
            target,
            errors: Default::default(),
            module_errors: Default::default(),
            atoms: Default::default(),
            buf: Rc::new(RefCell::new(String::with_capacity(256))),
        }
    }

    /// Utility method to reuse buffer.
    fn with_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
    where
        F: for<'any> FnOnce(&mut Lexer<'any, I>, &mut String) -> LexResult<Ret>,
    {
        let b = self.buf.clone();
        let mut buf = b.borrow_mut();
        buf.clear();

        op(self, &mut buf)
    }

    /// babel: `getTokenFromCode`
    fn read_token(&mut self) -> LexResult<Option<Token>> {
        let c = self.input.cur_as_ascii();

        match c {
            None => {}
            Some(c) => {
                match c {
                    b'#' => return self.read_token_number_sign(),

                    //
                    b'.' => return self.read_token_dot().map(Some),

                    b'(' | b')' | b';' | b',' | b'[' | b']' | b'{' | b'}' | b'@' | b'`' | b'~' => {
                        // These tokens are emitted directly.
                        self.input.bump();
                        return Ok(Some(match c {
                            b'(' => LParen,
                            b')' => RParen,
                            b';' => Semi,
                            b',' => Comma,
                            b'[' => LBracket,
                            b']' => RBracket,
                            b'{' => LBrace,
                            b'}' => RBrace,
                            b'@' => At,
                            b'`' => tok!('`'),
                            b'~' => tok!('~'),

                            _ => unreachable!(),
                        }));
                    }

                    b'?' => return self.read_token_question_mark().map(Some),

                    b':' => return self.read_token_colon().map(Some),

                    b'0' => return self.read_token_zero().map(Some),

                    b'1'..=b'9' => {
                        return self
                            .read_number(false)
                            .map(|v| match v {
                                Left((value, raw)) => Num { value, raw },
                                Right((value, raw)) => BigInt { value, raw },
                            })
                            .map(Some);
                    }

                    b'"' | b'\'' => return self.read_str_lit().map(Some),

                    b'/' => return self.read_slash(),

                    b'%' | b'*' => return self.read_token_mul_mod(c).map(Some),

                    // Logical operators
                    b'|' | b'&' => return self.read_token_logical(c).map(Some),
                    b'^' => {
                        // Bitwise xor
                        self.input.bump();
                        return Ok(Some(if self.input.cur() == Some('=') {
                            self.input.bump();
                            AssignOp(BitXorAssign)
                        } else {
                            BinOp(BitXor)
                        }));
                    }

                    b'+' | b'-' => {
                        let start = self.cur_pos();

                        self.input.bump();

                        // '++', '--'
                        return Ok(Some(if self.input.cur() == Some(c as char) {
                            self.input.bump();

                            // Handle -->
                            if self.state.had_line_break && c == b'-' && self.eat(b'>') {
                                self.emit_module_mode_error(
                                    start,
                                    SyntaxError::LegacyCommentInModule,
                                );
                                self.skip_line_comment(0);
                                self.skip_space(true)?;
                                return self.read_token();
                            }

                            if c == b'+' {
                                PlusPlus
                            } else {
                                MinusMinus
                            }
                        } else if self.input.eat_byte(b'=') {
                            AssignOp(if c == b'+' { AddAssign } else { SubAssign })
                        } else {
                            BinOp(if c == b'+' { Add } else { Sub })
                        }));
                    }

                    b'<' | b'>' => return self.read_token_lt_gt(),

                    b'!' | b'=' => {
                        let start = self.cur_pos();
                        let had_line_break_before_last = self.had_line_break_before_last();

                        self.input.bump();

                        return Ok(Some(if self.input.eat_byte(b'=') {
                            // "=="

                            if self.input.eat_byte(b'=') {
                                if c == b'!' {
                                    BinOp(NotEqEq)
                                } else {
                                    // =======
                                    //    ^
                                    if had_line_break_before_last && self.is_str("====") {
                                        self.emit_error_span(
                                            fixed_len_span(start, 7),
                                            SyntaxError::TS1185,
                                        );
                                        self.skip_line_comment(4);
                                        self.skip_space(true)?;
                                        return self.read_token();
                                    }

                                    BinOp(EqEqEq)
                                }
                            } else if c == b'!' {
                                BinOp(NotEq)
                            } else {
                                BinOp(EqEq)
                            }
                        } else if c == b'=' && self.input.eat_byte(b'>') {
                            // "=>"

                            Arrow
                        } else if c == b'!' {
                            Bang
                        } else {
                            AssignOp(Assign)
                        }));
                    }
                    _ => {}
                }
            }
        }

        let c = match self.input.cur() {
            Some(c) => c,
            None => {
                return Ok(None);
            }
        };

        let token = {
            // Identifier or keyword. '\uXXXX' sequences are allowed in
            // identifiers, so '\' also dispatches to that.
            if c == '\\' || c.is_ident_start() {
                return self.read_ident_or_keyword().map(Some);
            }

            let start = self.cur_pos();
            self.input.bump();
            self.error_span(pos_span(start), SyntaxError::UnexpectedChar { c })?
        };

        Ok(Some(token))
    }

    /// `#`
    fn read_token_number_sign(&mut self) -> LexResult<Option<Token>> {
        debug_assert!(self.cur().is_some());

        if self.input.is_at_start() && self.read_token_interpreter()? {
            return Ok(None);
        }

        self.input.bump(); // '#'
        Ok(Some(Token::Hash))
    }

    #[inline(never)]
    fn read_token_interpreter(&mut self) -> LexResult<bool> {
        if !self.input.is_at_start() {
            return Ok(false);
        }

        let start = self.input.cur_pos();
        self.input.bump();
        let c = self.input.cur();
        if c == Some('!') {
            while let Some(c) = self.input.cur() {
                self.input.bump();
                if c == '\n' || c == '\r' || c == '\u{8232}' || c == '\u{8233}' {
                    return Ok(true);
                }
            }
            Ok(false)
        } else {
            self.input.reset_to(start);
            Ok(false)
        }
    }

    /// Read a token given `.`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_dot(&mut self) -> LexResult<Token> {
        // Check for eof
        let next = match self.input.peek() {
            Some(next) => next,
            None => {
                self.input.bump();
                return Ok(tok!('.'));
            }
        };
        if ('0'..='9').contains(&next) {
            return self.read_number(true).map(|v| match v {
                Left((value, raw)) => Num { value, raw },
                Right((value, raw)) => BigInt { value, raw },
            });
        }

        self.input.bump(); // 1st `.`

        if next == '.' && self.input.peek() == Some('.') {
            self.input.bump(); // 2nd `.`
            self.input.bump(); // 3rd `.`

            return Ok(tok!("..."));
        }

        Ok(tok!('.'))
    }

    /// Read a token given `?`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_question_mark(&mut self) -> LexResult<Token> {
        match self.input.peek() {
            Some('?') => {
                self.input.bump();
                self.input.bump();
                if self.input.cur() == Some('=') {
                    self.input.bump();
                    return Ok(tok!("??="));
                }
                Ok(tok!("??"))
            }
            _ => {
                self.input.bump();
                Ok(tok!('?'))
            }
        }
    }

    /// Read a token given `:`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_colon(&mut self) -> LexResult<Token> {
        self.input.bump();

        if self.syntax.fn_bind() && self.input.cur() == Some(':') {
            self.input.bump();
            return Ok(tok!("::"));
        }

        Ok(tok!(':'))
    }

    /// Read a token given `0`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_zero(&mut self) -> LexResult<Token> {
        let next = self.input.peek();

        let bigint = match next {
            Some('x') | Some('X') => {
                self.read_radix_number::<16, { lexical::NumberFormatBuilder::hexadecimal() }>()
            }
            Some('o') | Some('O') => {
                self.read_radix_number::<8, { lexical::NumberFormatBuilder::octal() }>()
            }
            Some('b') | Some('B') => {
                self.read_radix_number::<2, { lexical::NumberFormatBuilder::binary() }>()
            }
            _ => {
                return self.read_number(false).map(|v| match v {
                    Left((value, raw)) => Num { value, raw },
                    Right((value, raw)) => BigInt { value, raw },
                });
            }
        };

        bigint.map(|v| match v {
            Left((value, raw)) => Num { value, raw },
            Right((value, raw)) => BigInt { value, raw },
        })
    }

    /// Read a token given `|` or `&`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_logical(&mut self, c: u8) -> LexResult<Token> {
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();

        self.input.bump();
        let token = if c == b'&' { BitAnd } else { BitOr };

        // '|=', '&='
        if self.input.eat_byte(b'=') {
            return Ok(AssignOp(match token {
                BitAnd => BitAndAssign,
                BitOr => BitOrAssign,
                _ => unreachable!(),
            }));
        }

        // '||', '&&'
        if self.input.cur() == Some(c as char) {
            self.input.bump();

            if self.input.cur() == Some('=') {
                self.input.bump();
                return Ok(AssignOp(match token {
                    BitAnd => op!("&&="),
                    BitOr => op!("||="),
                    _ => unreachable!(),
                }));
            }

            // |||||||
            //   ^
            if had_line_break_before_last && token == BitOr && self.is_str("||||| ") {
                let span = fixed_len_span(start, 7);
                self.emit_error_span(span, SyntaxError::TS1185);
                self.skip_line_comment(5);
                self.skip_space(true)?;
                return self.error_span(span, SyntaxError::TS1185);
            }

            return Ok(BinOp(match token {
                BitAnd => LogicalAnd,
                BitOr => LogicalOr,
                _ => unreachable!(),
            }));
        }

        Ok(BinOp(token))
    }

    /// Read a token given `*` or `%`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_mul_mod(&mut self, c: u8) -> LexResult<Token> {
        let is_mul = c == b'*';
        self.input.bump();
        let mut token = if is_mul { BinOp(Mul) } else { BinOp(Mod) };

        // check for **
        if is_mul && self.input.eat_byte(b'*') {
            token = BinOp(Exp)
        }

        if self.input.eat_byte(b'=') {
            token = match token {
                BinOp(Mul) => AssignOp(MulAssign),
                BinOp(Mod) => AssignOp(ModAssign),
                BinOp(Exp) => AssignOp(ExpAssign),
                _ => unreachable!(),
            }
        }

        Ok(token)
    }

    /// Read an escaped character for string literal.
    ///
    /// In template literal, we should preserve raw string.
    fn read_escaped_char(
        &mut self,
        raw: &mut Raw,
        in_template: bool,
    ) -> LexResult<Option<Vec<Char>>> {
        debug_assert_eq!(self.cur(), Some('\\'));

        let start = self.cur_pos();

        self.bump(); // '\'

        let c = match self.cur() {
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
                raw.push_str("x");

                self.bump(); // 'x'

                match self.read_int_u32::<16>(2, raw)? {
                    Some(val) => return Ok(Some(vec![Char::from(val)])),
                    None => self.error(
                        start,
                        SyntaxError::BadCharacterEscapeSequence {
                            expected: "2 hex characters",
                        },
                    )?,
                }
            }

            // read unicode escape sequences
            'u' => match self.read_unicode_escape(raw) {
                Ok(chars) => return Ok(Some(chars)),
                Err(err) => self.error(start, err.into_kind())?,
            },

            // octal escape sequences
            '0'..='7' => {
                raw.push(c);

                self.bump();

                let first_c = if c == '0' {
                    match self.cur() {
                        Some(next) if next.is_digit(8) => c,
                        // \0 is not an octal literal nor decimal literal.
                        _ => return Ok(Some(vec!['\u{0000}'.into()])),
                    }
                } else {
                    c
                };

                // TODO: Show template instead of strict mode
                if in_template {
                    self.error(start, SyntaxError::LegacyOctal)?
                }

                self.emit_strict_mode_error(start, SyntaxError::LegacyOctal);

                let mut value: u8 = first_c.to_digit(8).unwrap() as u8;

                macro_rules! one {
                    ($check:expr) => {{
                        let cur = self.cur();

                        match cur.and_then(|c| c.to_digit(8)) {
                            Some(v) => {
                                value = if $check {
                                    let new_val = value
                                        .checked_mul(8)
                                        .and_then(|value| value.checked_add(v as u8));
                                    match new_val {
                                        Some(val) => val,
                                        None => return Ok(Some(vec![Char::from(value as char)])),
                                    }
                                } else {
                                    value * 8 + v as u8
                                };

                                self.bump();
                                raw.push(cur.unwrap());
                            }
                            _ => return Ok(Some(vec![Char::from(value as u32)])),
                        }
                    }};
                }

                one!(false);
                one!(true);

                return Ok(Some(vec![Char::from(value as char)]));
            }
            _ => {
                raw.push(c);
                c
            }
        };

        self.input.bump();

        Ok(Some(vec![c.into()]))
    }
}

impl<'a, I: Input> Lexer<'a, I> {
    #[inline(never)]
    fn read_slash(&mut self) -> LexResult<Option<Token>> {
        debug_assert_eq!(self.cur(), Some('/'));
        // let start = self.cur_pos();

        // Regex
        if self.state.is_expr_allowed {
            return self.read_regexp().map(Some);
        }

        // Divide operator
        self.bump();

        Ok(Some(if self.eat(b'=') {
            tok!("/=")
        } else {
            tok!('/')
        }))
    }

    #[inline(never)]
    fn read_token_lt_gt(&mut self) -> LexResult<Option<Token>> {
        debug_assert!(self.cur() == Some('<') || self.cur() == Some('>'));

        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();
        let c = self.cur().unwrap();
        self.bump();

        // XML style comment. `<!--`
        if c == '<' && self.is(b'!') && self.peek() == Some('-') && self.peek_ahead() == Some('-') {
            self.skip_line_comment(3);
            self.skip_space(true)?;
            self.emit_module_mode_error(start, SyntaxError::LegacyCommentInModule);

            return self.read_token();
        }

        let mut op = if c == '<' { Lt } else { Gt };

        // '<<', '>>'
        if self.cur() == Some(c) {
            self.bump();
            op = if c == '<' { LShift } else { RShift };

            //'>>>'
            if c == '>' && self.cur() == Some(c) {
                self.bump();
                op = ZeroFillRShift;
            }
        }

        let token = if self.eat(b'=') {
            match op {
                Lt => BinOp(LtEq),
                Gt => BinOp(GtEq),
                LShift => AssignOp(LShiftAssign),
                RShift => AssignOp(RShiftAssign),
                ZeroFillRShift => AssignOp(ZeroFillRShiftAssign),
                _ => unreachable!(),
            }
        } else {
            BinOp(op)
        };

        // All conflict markers consist of the same character repeated seven times.
        // If it is a <<<<<<< or >>>>>>> marker then it is also followed by a space.
        // <<<<<<<
        //   ^
        // >>>>>>>
        //    ^
        if had_line_break_before_last
            && match op {
                LShift if self.is_str("<<<<< ") => true,
                ZeroFillRShift if self.is_str(">>>> ") => true,
                _ => false,
            }
        {
            self.emit_error_span(fixed_len_span(start, 7), SyntaxError::TS1185);
            self.skip_line_comment(5);
            self.skip_space(true)?;
            return self.read_token();
        }

        Ok(Some(token))
    }

    /// See https://tc39.github.io/ecma262/#sec-names-and-keywords
    fn read_ident_or_keyword(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur().is_some());
        let start = self.cur_pos();

        let (word, has_escape) = self.read_word_as_str_with(|s| {
            if s.len() == 1 || s.len() > 10 {
                Word::Ident(s.into())
            } else {
                match s.as_bytes()[0] {
                    b'a' if s == "await" => Await.into(),
                    b'b' if s == "break" => Break.into(),
                    b'c' => match s {
                        "case" => Case.into(),
                        "const" => Const.into(),
                        "class" => Class.into(),
                        "catch" => Catch.into(),
                        "continue" => Continue.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b'd' => match s {
                        "do" => Do.into(),
                        "default" => Default_.into(),
                        "delete" => Delete.into(),
                        "debugger" => Debugger.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b'e' => match s {
                        "else" => Else.into(),
                        "export" => Export.into(),
                        "extends" => Extends.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b'f' => match s {
                        "for" => For.into(),
                        "false" => Word::False,
                        "finally" => Finally.into(),
                        "function" => Function.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b'i' => match s {
                        "if" => If.into(),
                        "import" => Import.into(),
                        "in" => In.into(),
                        "instanceof" => InstanceOf.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b'l' if s == "let" => Let.into(),
                    b'n' => match s {
                        "new" => New.into(),
                        "null" => Word::Null,
                        _ => Word::Ident(s.into()),
                    },
                    b'r' if s == "return" => Return.into(),
                    b's' => match s {
                        "super" => Super.into(),
                        "switch" => Switch.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b't' => match s {
                        "this" => This.into(),
                        "true" => Word::True,
                        "try" => Try.into(),
                        "throw" => Throw.into(),
                        "typeof" => TypeOf.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b'v' => match s {
                        "var" => Var.into(),
                        "void" => Void.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b'w' => match s {
                        "while" => While.into(),
                        "with" => With.into(),
                        _ => Word::Ident(s.into()),
                    },
                    b'y' if s == "yield" => Yield.into(),
                    _ => Word::Ident(s.into()),
                }
            }
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

    /// This method is optimized for texts without escape sequences.
    fn read_word_as_str_with<F, Ret>(&mut self, convert: F) -> LexResult<(Ret, bool)>
    where
        F: FnOnce(&str) -> Ret,
    {
        debug_assert!(self.cur().is_some());
        let mut first = true;

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

                        let chars = l.read_unicode_escape(&mut Raw(None))?;

                        if let Some(c) = chars.get(0) {
                            let valid = if first {
                                c.is_ident_start()
                            } else {
                                c.is_ident_part()
                            };

                            if !valid {
                                l.emit_error(start, SyntaxError::InvalidIdentChar);
                            }
                        }

                        for c in chars {
                            buf.extend(c);
                        }
                    }
                    _ => {
                        break;
                    }
                }
                first = false;
            }
            let value = convert(buf);

            Ok((value, has_escape))
        })
    }

    fn read_unicode_escape(&mut self, raw: &mut Raw) -> LexResult<Vec<Char>> {
        debug_assert_eq!(self.cur(), Some('u'));

        let mut chars = vec![];
        let mut is_curly = false;

        self.bump(); // 'u'

        raw.push_str("u");

        if self.eat(b'{') {
            is_curly = true;

            raw.push('{');
        }

        let state = self.input.cur_pos();
        let c = match self.read_int_u32::<16>(if is_curly { 0 } else { 4 }, raw) {
            Ok(Some(val)) => {
                if 0x0010_ffff >= val {
                    char::from_u32(val)
                } else {
                    let start = self.cur_pos();

                    self.error(
                        start,
                        SyntaxError::BadCharacterEscapeSequence {
                            expected: if is_curly {
                                "1-6 hex characters in the range 0 to 10FFFF."
                            } else {
                                "4 hex characters"
                            },
                        },
                    )?
                }
            }
            _ => {
                let start = self.cur_pos();

                self.error(
                    start,
                    SyntaxError::BadCharacterEscapeSequence {
                        expected: if is_curly {
                            "1-6 hex characters"
                        } else {
                            "4 hex characters"
                        },
                    },
                )?
            }
        };

        match c {
            Some(c) => {
                chars.push(c.into());
            }
            _ => {
                self.input.reset_to(state);

                chars.push(Char::from('\\'));
                chars.push(Char::from('u'));

                if is_curly {
                    chars.push(Char::from('{'));

                    for _ in 0..6 {
                        if let Some(c) = self.input.cur() {
                            if c == '}' {
                                break;
                            }

                            self.bump();

                            chars.push(Char::from(c));
                        } else {
                            break;
                        }
                    }

                    chars.push(Char::from('}'));
                } else {
                    for _ in 0..4 {
                        if let Some(c) = self.input.cur() {
                            self.bump();

                            chars.push(Char::from(c));
                        }
                    }
                }
            }
        }

        if is_curly {
            if !self.eat(b'}') {
                self.error(state, SyntaxError::InvalidUnicodeEscape)?
            }

            raw.push('}');
        }

        Ok(chars)
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    fn read_str_lit(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur() == Some('\'') || self.cur() == Some('"'));
        let start = self.cur_pos();
        let mut raw = String::new();
        let quote = self.cur().unwrap();

        raw.push(quote);

        self.bump(); // '"'

        self.with_buf(|l, out| {
            while let Some(c) = {
                // Optimization
                {
                    let s = l
                        .input
                        .uncons_while(|c| c != quote && c != '\\' && !c.is_line_break());
                    out.push_str(s);
                    raw.push_str(s);
                }
                l.cur()
            } {
                match c {
                    c if c == quote => {
                        raw.push(c);

                        l.bump();

                        return Ok(Token::Str {
                            value: (&**out).into(),
                            raw: l.atoms.borrow_mut().intern(raw),
                        });
                    }
                    '\\' => {
                        raw.push(c);

                        let mut wrapped = Raw(Some(String::new()));

                        if let Some(chars) = l.read_escaped_char(&mut wrapped, false)? {
                            for c in chars {
                                out.extend(c);
                            }
                        }

                        raw.push_str(&wrapped.0.unwrap());
                    }
                    c if c.is_line_break() => {
                        raw.push(c);

                        break;
                    }
                    _ => {
                        out.push(c);
                        raw.push(c);

                        l.bump();
                    }
                }
            }

            l.emit_error(start, SyntaxError::UnterminatedStrLit);

            Ok(Token::Str {
                value: (&**out).into(),
                raw: l.atoms.borrow_mut().intern(raw),
            })
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
                if c.is_line_terminator() {
                    l.error(start, SyntaxError::UnterminatedRegExp)?;
                }

                if escaped {
                    escaped = false;
                } else {
                    match c {
                        '[' => in_class = true,
                        ']' if in_class => in_class = false,
                        // Terminates content part of regex literal
                        '/' if !in_class => break,
                        _ => {}
                    }
                    escaped = c == '\\';
                }
                l.bump();
                buf.push(c);
            }

            Ok(Atom::new(&**buf))
        })?;
        // let content_span = Span::new(content_start, self.cur_pos(),
        // Default::default());

        // input is terminated without following `/`
        if !self.is(b'/') {
            self.error(start, SyntaxError::UnterminatedRegExp)?;
        }

        self.bump(); // '/'

        // Spec says "It is a Syntax Error if IdentifierPart contains a Unicode escape
        // sequence." TODO: check for escape

        // Need to use `read_word` because '\uXXXX' sequences are allowed
        // here (don't ask).
        // let flags_start = self.cur_pos();
        let flags = {
            let atoms = self.atoms.clone();
            match self.cur() {
                Some(c) if c.is_ident_start() => self
                    .read_word_as_str_with(|s| atoms.borrow_mut().intern(s))
                    .map(Some),
                _ => Ok(None),
            }
        }?
        .map(|(value, _)| value)
        .unwrap_or_default();

        Ok(Regex(content, flags))
    }

    fn read_shebang(&mut self) -> LexResult<Option<Atom>> {
        if self.input.cur() != Some('#') || self.input.peek() != Some('!') {
            return Ok(None);
        }
        self.input.bump();
        self.input.bump();
        let s = self.input.uncons_while(|c| !c.is_line_terminator());
        Ok(Some(Atom::new(s)))
    }

    fn read_tmpl_token(&mut self, start_of_tpl: BytePos) -> LexResult<Token> {
        let start = self.cur_pos();

        let mut cooked = Ok(String::new());
        let mut raw = String::new();

        while let Some(c) = self.cur() {
            if c == '`' || (c == '$' && self.peek() == Some('{')) {
                if start == self.cur_pos() && self.state.last_was_tpl_element() {
                    if c == '$' {
                        self.bump();
                        self.bump();
                        return Ok(tok!("${"));
                    } else {
                        self.bump();
                        return Ok(tok!('`'));
                    }
                }

                // TODO: Handle error
                return Ok(Template {
                    cooked: cooked.map(Atom::from),
                    raw: Atom::new(raw),
                });
            }

            if c == '\\' {
                raw.push('\\');

                let mut wrapped = Raw(Some(raw));

                match self.read_escaped_char(&mut wrapped, true) {
                    Ok(Some(chars)) => {
                        if let Ok(ref mut cooked) = cooked {
                            for c in chars {
                                cooked.extend(c);
                            }
                        }
                    }
                    Ok(None) => {}
                    Err(error) => {
                        cooked = Err(error);
                    }
                }

                raw = wrapped.0.unwrap();
            } else if c.is_line_terminator() {
                self.state.had_line_break = true;

                let c = if c == '\r' && self.peek() == Some('\n') {
                    raw.push('\r');
                    self.bump(); // '\r'
                    '\n'
                } else {
                    match c {
                        '\n' => '\n',
                        '\r' => '\n',
                        '\u{2028}' => '\u{2028}',
                        '\u{2029}' => '\u{2029}',
                        _ => unreachable!(),
                    }
                };

                self.bump();

                if let Ok(ref mut cooked) = cooked {
                    cooked.push(c);
                }

                raw.push(c);
            } else {
                self.bump();

                if let Ok(ref mut cooked) = cooked {
                    cooked.push(c);
                }

                raw.push(c);
            }
        }

        self.error(start_of_tpl, SyntaxError::UnterminatedTpl)?
    }

    #[inline]
    pub fn had_line_break_before_last(&self) -> bool {
        self.state.had_line_break
    }

    #[inline]
    pub fn set_expr_allowed(&mut self, allow: bool) {
        self.state.is_expr_allowed = allow;
    }
}

fn pos_span(p: BytePos) -> Span {
    Span::new(p, p, Default::default())
}

fn fixed_len_span(p: BytePos, len: u32) -> Span {
    Span::new(p, p + BytePos(len), Default::default())
}
