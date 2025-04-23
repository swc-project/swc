//! ECMAScript lexer.

use std::{cell::RefCell, char, iter::FusedIterator, mem::transmute, rc::Rc};

use either::Either::{Left, Right};
use swc_atoms::{Atom, AtomStoreCell};
use swc_common::{
    comments::Comments,
    input::{Input, StringInput},
    BytePos, Span,
};
use swc_ecma_ast::{EsVersion, Ident};
use swc_ecma_lexer::common::lexer::{
    char::{Char, CharExt},
    comments_buffer::CommentsBuffer,
    state::State,
    LexResult,
};

use self::table::{ByteHandler, BYTE_HANDLERS};
use crate::{
    error::{Error, SyntaxError},
    Context, Syntax, *,
};

mod jsx;
mod number;
mod state;
mod table;
mod token;
pub mod util;

pub(crate) use token::{Token, TokenAndSpan, TokenValue};

#[derive(Clone)]
pub struct Lexer<'a> {
    comments: Option<&'a dyn Comments>,
    /// [Some] if comment comment parsing is enabled. Otherwise [None]
    comments_buffer: Option<CommentsBuffer>,

    pub ctx: Context,
    input: StringInput<'a>,
    start_pos: BytePos,

    state: self::state::State,
    pub(crate) syntax: Syntax,
    pub(crate) target: EsVersion,

    errors: Rc<RefCell<Vec<Error>>>,
    module_errors: Rc<RefCell<Vec<Error>>>,

    buf: Rc<RefCell<String>>,

    atoms: Rc<AtomStoreCell>,
}

impl FusedIterator for Lexer<'_> {}

impl<'a> Lexer<'a> {
    pub fn new(
        syntax: Syntax,
        target: EsVersion,
        input: StringInput<'a>,
        comments: Option<&'a dyn Comments>,
    ) -> Self {
        let start_pos = input.last_pos();

        Lexer {
            comments,
            comments_buffer: comments.is_some().then(CommentsBuffer::new),
            ctx: Default::default(),
            input,
            start_pos,
            state: self::state::State::new(syntax, start_pos),
            syntax,
            target,
            errors: Default::default(),
            module_errors: Default::default(),
            buf: Rc::new(RefCell::new(String::with_capacity(256))),
            atoms: Default::default(),
        }
    }

    /// Utility method to reuse buffer.
    fn with_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
    where
        F: for<'any> FnOnce(&mut Lexer<'any>, &mut String) -> LexResult<Ret>,
    {
        let b = self.buf.clone();
        let mut buf = b.borrow_mut();
        buf.clear();

        op(self, &mut buf)
    }

    /// babel: `getTokenFromCode`
    fn read_token(&mut self) -> LexResult<Option<Token>> {
        let byte = match self.input.as_str().as_bytes().first() {
            Some(&v) => v,
            None => return Ok(None),
        };

        let handler = unsafe { *(&BYTE_HANDLERS as *const ByteHandler).offset(byte as isize) };

        match handler {
            Some(handler) => handler(self),
            None => {
                let start = self.cur_pos();
                self.input.bump_bytes(1);
                self.error_span(
                    pos_span(start),
                    SyntaxError::UnexpectedChar { c: byte as _ },
                )
            }
        }
    }

    /// `#`
    fn read_token_number_sign(&mut self) -> LexResult<Option<Token>> {
        debug_assert!(self.cur().is_some());

        unsafe {
            // Safety: cur() is Some('#')
            self.input.bump(); // '#'
        }

        // `#` can also be a part of shebangs, however they should have been
        // handled by `read_shebang()`
        debug_assert!(
            !self.input.is_at_start() || self.cur() != Some('!'),
            "#! should have already been handled by read_shebang()"
        );
        Ok(Some(Token::Hash))
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
                unsafe {
                    // Safety: cur() is Some(',')
                    self.input.bump();
                }
                return Ok(Token::Dot);
            }
        };
        if next.is_ascii_digit() {
            return self.read_number(true).map(|v| match v {
                Left((value, raw)) => {
                    self.state.set_token_value(TokenValue::Num { value, raw });
                    Token::Num
                }
                Right((value, raw)) => {
                    self.state
                        .set_token_value(TokenValue::BigInt { value, raw });
                    Token::BigInt
                }
            });
        }

        unsafe {
            // Safety: cur() is Some
            // 1st `.`
            self.input.bump();
        }

        if next == '.' && self.input.peek() == Some('.') {
            unsafe {
                // Safety: peek() was Some

                self.input.bump(); // 2nd `.`
                self.input.bump(); // 3rd `.`
            }

            return Ok(Token::DotDotDot);
        }

        Ok(Token::Dot)
    }

    /// Read a token given `?`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_question_mark(&mut self) -> LexResult<Token> {
        match self.input.peek() {
            Some('?') => {
                unsafe {
                    // Safety: peek() was some
                    self.input.bump();
                    self.input.bump();
                }
                if self.input.cur() == Some('=') {
                    unsafe {
                        // Safety: cur() was some
                        self.input.bump();
                    }

                    return Ok(Token::NullishEq);
                }
                Ok(Token::NullishCoalescing)
            }
            _ => {
                unsafe {
                    // Safety: peek() is callable only if cur() is Some
                    self.input.bump();
                }
                Ok(Token::QuestionMark)
            }
        }
    }

    /// Read a token given `:`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_colon(&mut self) -> LexResult<Token> {
        unsafe {
            // Safety: cur() is Some(':')
            self.input.bump();
        }
        Ok(Token::Colon)
    }

    /// Read a token given `0`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_zero(&mut self) -> LexResult<Token> {
        let next = self.input.peek();

        let bigint = match next {
            Some('x') | Some('X') => self.read_radix_number::<16>(),
            Some('o') | Some('O') => self.read_radix_number::<8>(),
            Some('b') | Some('B') => self.read_radix_number::<2>(),
            _ => {
                return self.read_number(false).map(|v| match v {
                    Left((value, raw)) => {
                        self.state.set_token_value(TokenValue::Num { value, raw });
                        Token::Num
                    }
                    Right((value, raw)) => {
                        self.state
                            .set_token_value(TokenValue::BigInt { value, raw });
                        Token::BigInt
                    }
                });
            }
        };

        bigint.map(|v| match v {
            Left((value, raw)) => {
                self.state.set_token_value(TokenValue::Num { value, raw });
                Token::Num
            }
            Right((value, raw)) => {
                self.state
                    .set_token_value(TokenValue::BigInt { value, raw });
                Token::BigInt
            }
        })
    }

    /// Read a token given `|` or `&`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_logical<const C: u8>(&mut self) -> LexResult<Token> {
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c as char)
            self.input.bump();
        }
        let token = if C == b'&' {
            Token::Ampersand
        } else {
            debug_assert!(C == b'|');
            Token::Pipe
        };

        // '|=', '&='
        if self.input.eat_byte(b'=') {
            return Ok(match token {
                Token::Ampersand => Token::BitAndEq,
                Token::Pipe => Token::BitOrEq,
                _ => unreachable!(),
            });
        }

        // '||', '&&'
        if self.input.cur() == Some(C as char) {
            unsafe {
                // Safety: cur() is Some(c)
                self.input.bump();
            }

            if self.input.cur() == Some('=') {
                unsafe {
                    // Safety: cur() is Some('=')
                    self.input.bump();
                }
                return Ok(match token {
                    Token::Ampersand => Token::LogicalAndEq,
                    Token::Pipe => Token::LogicalOrEq,
                    _ => unreachable!(),
                });
            }

            // |||||||
            //   ^
            if had_line_break_before_last && token == Token::Pipe && self.is_str("||||| ") {
                let span = fixed_len_span(start, 7);
                self.emit_error_span(span, SyntaxError::TS1185);
                self.skip_line_comment(5);
                self.skip_space::<true>();
                return self.error_span(span, SyntaxError::TS1185);
            }

            return Ok(match token {
                Token::Ampersand => Token::LogicalAnd,
                Token::Pipe => Token::LogicalOr,
                _ => unreachable!(),
            });
        }

        Ok(token)
    }

    /// Read a token given `*` or `%`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_mul_mod<const C: u8>(&mut self) -> LexResult<Token> {
        let is_mul = C == b'*';
        unsafe {
            // Safety: cur() is Some(c)
            self.input.bump();
        }
        let mut token = if is_mul {
            Token::Asterisk
        } else {
            debug_assert!(C == b'%');
            Token::Percent
        };

        // check for **
        if is_mul && self.input.eat_byte(b'*') {
            token = Token::Exp;
        }

        if self.input.eat_byte(b'=') {
            token = match token {
                Token::Asterisk => Token::MulEq,
                Token::Percent => Token::ModEq,
                Token::Exp => Token::ExpEq,
                _ => unreachable!(),
            }
        }

        Ok(token)
    }

    /// Read an escaped character for string literal.
    ///
    /// In template literal, we should preserve raw string.
    fn read_escaped_char(&mut self, in_template: bool) -> LexResult<Option<Vec<Char>>> {
        debug_assert_eq!(self.cur(), Some('\\'));

        let start = self.cur_pos();

        self.bump(); // '\'

        let c = match self.cur() {
            Some(c) => c,
            None => self.error_span(pos_span(start), SyntaxError::InvalidStrEscape)?,
        };

        macro_rules! push_c_and_ret {
            ($c:expr) => {{
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
                self.bump(); // remove '\r'

                self.eat(b'\n');

                return Ok(None);
            }
            '\n' | '\u{2028}' | '\u{2029}' => {
                self.bump();

                return Ok(None);
            }

            // read hexadecimal escape sequences
            'x' => {
                self.bump(); // 'x'

                match self.read_int_u32::<16>(2)? {
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
            'u' => match self.read_unicode_escape() {
                Ok(chars) => return Ok(Some(chars)),
                Err(err) => self.error(start, err.into_kind())?,
            },

            // octal escape sequences
            '0'..='7' => {
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
                            }
                            _ => return Ok(Some(vec![Char::from(value as u32)])),
                        }
                    }};
                }

                one!(false);
                one!(true);

                return Ok(Some(vec![Char::from(value as char)]));
            }
            _ => c,
        };

        unsafe {
            // Safety: cur() is Some(c) if this method is called.
            self.input.bump();
        }

        Ok(Some(vec![c.into()]))
    }

    fn read_token_plus_minus<const C: u8>(&mut self) -> LexResult<Option<Token>> {
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c), if this method is called.
            self.input.bump();
        }

        // '++', '--'
        Ok(Some(if self.input.cur() == Some(C as char) {
            unsafe {
                // Safety: cur() is Some(c)
                self.input.bump();
            }

            // Handle -->
            if self.state.had_line_break && C == b'-' && self.eat(b'>') {
                self.emit_module_mode_error(start, SyntaxError::LegacyCommentInModule);
                self.skip_line_comment(0);
                self.skip_space::<true>();
                return self.read_token();
            }

            if C == b'+' {
                Token::PlusPlus
            } else {
                Token::MinusMinus
            }
        } else if self.input.eat_byte(b'=') {
            if C == b'+' {
                Token::PlusEq
            } else {
                Token::MinusEq
            }
        } else if C == b'+' {
            Token::Plus
        } else {
            Token::Minus
        }))
    }

    fn read_token_bang_or_eq<const C: u8>(&mut self) -> LexResult<Option<Token>> {
        let start = self.cur_pos();
        let had_line_break_before_last = self.had_line_break_before_last();

        unsafe {
            // Safety: cur() is Some(c) if this method is called.
            self.input.bump();
        }

        Ok(Some(if self.input.eat_byte(b'=') {
            // "=="

            if self.input.eat_byte(b'=') {
                if C == b'!' {
                    Token::NotEqEq
                } else {
                    // =======
                    //    ^
                    if had_line_break_before_last && self.is_str("====") {
                        self.emit_error_span(fixed_len_span(start, 7), SyntaxError::TS1185);
                        self.skip_line_comment(4);
                        self.skip_space::<true>();
                        return self.read_token();
                    }

                    Token::EqEqEq
                }
            } else if C == b'!' {
                Token::NotEq
            } else {
                Token::EqEq
            }
        } else if C == b'=' && self.input.eat_byte(b'>') {
            // "=>"

            Token::Arrow
        } else if C == b'!' {
            Token::Bang
        } else {
            Token::Eq
        }))
    }
}

impl Lexer<'_> {
    #[inline(never)]
    fn read_slash(&mut self) -> LexResult<Option<Token>> {
        debug_assert_eq!(self.cur(), Some('/'));

        // Divide operator
        self.bump();

        Ok(Some(if self.eat(b'=') {
            token!("/=")
        } else {
            token!('/')
        }))
    }

    #[inline(never)]
    fn read_token_lt_gt<const C: u8>(&mut self) -> LexResult<Option<Token>> {
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();
        self.bump();

        if self.syntax.typescript()
            && self.ctx.contains(Context::InType)
            && !self.ctx.contains(Context::ShouldNotLexLtOrGtAsType)
        {
            if C == b'<' {
                return Ok(Some(Token::Lt));
            } else if C == b'>' {
                return Ok(Some(Token::Gt));
            }
        }

        // XML style comment. `<!--`
        if C == b'<' && self.is(b'!') && self.peek() == Some('-') && self.peek_ahead() == Some('-')
        {
            self.skip_line_comment(3);
            self.skip_space::<true>();
            self.emit_module_mode_error(start, SyntaxError::LegacyCommentInModule);

            return self.read_token();
        }

        let mut op = if C == b'<' { Token::Lt } else { Token::Gt };

        // '<<', '>>'
        if self.cur() == Some(C as char) {
            self.bump();
            op = if C == b'<' {
                Token::LShift
            } else {
                Token::RShift
            };

            //'>>>'
            if C == b'>' && self.cur() == Some(C as char) {
                self.bump();
                op = Token::ZeroFillRShift;
            }
        }

        let token = if self.eat(b'=') {
            match op {
                Token::Lt => Token::LtEq,
                Token::Gt => Token::GtEq,
                Token::LShift => Token::LShiftEq,
                Token::RShift => Token::RShiftEq,
                Token::ZeroFillRShift => Token::ZeroFillRShiftEq,
                _ => unreachable!(),
            }
        } else {
            op
        };

        // All conflict markers consist of the same character repeated seven times.
        // If it is a <<<<<<< or >>>>>>> marker then it is also followed by a space.
        // <<<<<<<
        //   ^
        // >>>>>>>
        //    ^
        if had_line_break_before_last
            && match op {
                Token::LShift if self.is_str("<<<<< ") => true,
                Token::ZeroFillRShift if self.is_str(">>>> ") => true,
                _ => false,
            }
        {
            self.emit_error_span(fixed_len_span(start, 7), SyntaxError::TS1185);
            self.skip_line_comment(5);
            self.skip_space::<true>();
            return self.read_token();
        }

        Ok(Some(token))
    }

    /// This can be used if there's no keyword starting with the first
    /// character.
    fn read_ident_unknown(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur().is_some());

        let (word, _) = self.read_word_as_str_with(|l, s, _, _| {
            l.state.set_token_value(TokenValue::Word(l.atoms.atom(s)));
            Token::Ident
        })?;

        Ok(word)
    }

    /// This can be used if there's no keyword starting with the first
    /// character.
    fn read_word_with(
        &mut self,
        convert: &dyn Fn(&str) -> Option<Token>,
    ) -> LexResult<Option<Token>> {
        debug_assert!(self.cur().is_some());

        let start = self.cur_pos();
        let (token, has_escape) = self.read_word_as_str_with(|l, s, _, can_be_known| {
            if can_be_known {
                if let Some(token) = convert(s) {
                    return token;
                }
            }

            l.state.set_token_value(TokenValue::Word(l.atoms.atom(s)));
            Token::Ident
        })?;

        // Note: ctx is store in lexer because of this error.
        // 'await' and 'yield' may have semantic of reserved word, which means lexer
        // should know context or parser should handle this error. Our approach to this
        // problem is former one.

        if has_escape && token.is_reserved(self.ctx) {
            self.error(
                start,
                SyntaxError::EscapeInReservedWord {
                    word: token.into_atom(self.state.token_value.as_ref()),
                },
            )?
        } else {
            Ok(Some(token))
        }
    }

    /// This method is optimized for texts without escape sequences.
    ///
    /// `convert(text, has_escape, can_be_keyword)`
    fn read_word_as_str_with<F, Ret>(&mut self, convert: F) -> LexResult<(Ret, bool)>
    where
        F: for<'any> FnOnce(&'any mut Lexer<'_>, &str, bool, bool) -> Ret,
    {
        debug_assert!(self.cur().is_some());
        let mut first = true;
        let mut can_be_keyword = true;
        let mut slice_start = self.cur_pos();
        let mut has_escape = false;

        self.with_buf(|l, buf| {
            loop {
                if let Some(c) = l.input.cur_as_ascii() {
                    // Performance optimization
                    if can_be_keyword && (c.is_ascii_uppercase() || c.is_ascii_digit()) {
                        can_be_keyword = false;
                    }

                    if Ident::is_valid_ascii_continue(c) {
                        l.bump();
                        continue;
                    } else if first && Ident::is_valid_ascii_start(c) {
                        l.bump();
                        first = false;
                        continue;
                    }

                    // unicode escape
                    if c == b'\\' {
                        first = false;
                        has_escape = true;
                        let start = l.cur_pos();
                        l.bump();

                        if !l.is(b'u') {
                            l.error_span(pos_span(start), SyntaxError::ExpectedUnicodeEscape)?
                        }

                        {
                            let end = l.input.cur_pos();
                            let s = unsafe {
                                // Safety: start and end are valid position because we got them from
                                // `self.input`
                                l.input.slice(slice_start, start)
                            };
                            buf.push_str(s);
                            unsafe {
                                // Safety: We got end from `self.input`
                                l.input.reset_to(end);
                            }
                        }

                        let chars = l.read_unicode_escape()?;

                        if let Some(c) = chars.first() {
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

                        slice_start = l.cur_pos();
                        continue;
                    }

                    // ASCII but not a valid identifier

                    break;
                } else if let Some(c) = l.input.cur() {
                    if Ident::is_valid_non_ascii_continue(c) {
                        l.bump();
                        continue;
                    } else if first && Ident::is_valid_non_ascii_start(c) {
                        l.bump();
                        first = false;
                        continue;
                    }
                }

                break;
            }

            let end = l.cur_pos();

            let value = if !has_escape {
                // Fast path: raw slice is enough if there's no escape.

                let s = unsafe {
                    // Safety: slice_start and end are valid position because we got them from
                    // `self.input`
                    l.input.slice(slice_start, end)
                };
                let s = unsafe {
                    // Safety: We don't use 'static. We just bypass the lifetime check.
                    transmute::<&str, &'static str>(s)
                };

                convert(l, s, has_escape, can_be_keyword)
            } else {
                let s = unsafe {
                    // Safety: slice_start and end are valid position because we got them from
                    // `self.input`
                    l.input.slice(slice_start, end)
                };
                buf.push_str(s);

                convert(l, buf, has_escape, can_be_keyword)
            };

            Ok((value, has_escape))
        })
    }

    fn read_unicode_escape(&mut self) -> LexResult<Vec<Char>> {
        debug_assert_eq!(self.cur(), Some('u'));

        let mut chars = Vec::with_capacity(4);
        let mut is_curly = false;

        self.bump(); // 'u'

        if self.eat(b'{') {
            is_curly = true;
        }

        let state = self.input.cur_pos();
        let c = match self.read_int_u32::<16>(if is_curly { 0 } else { 4 }) {
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
                unsafe {
                    // Safety: state is valid position because we got it from cur_pos()
                    self.input.reset_to(state);
                }

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

        if is_curly && !self.eat(b'}') {
            self.error(state, SyntaxError::InvalidUnicodeEscape)?
        }

        Ok(chars)
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    fn read_str_lit(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur() == Some('\'') || self.cur() == Some('"'));
        let start = self.cur_pos();
        let quote = self.cur().unwrap() as u8;

        self.bump(); // '"'

        let mut has_escape = false;
        let mut slice_start = self.input.cur_pos();

        self.with_buf(|l, buf| {
            loop {
                if let Some(c) = l.input.cur_as_ascii() {
                    if c == quote {
                        let value_end = l.cur_pos();

                        let value = if !has_escape {
                            let s = unsafe {
                                // Safety: slice_start and value_end are valid position because we
                                // got them from `self.input`
                                l.input.slice(slice_start, value_end)
                            };

                            l.atoms.atom(s)
                        } else {
                            let s = unsafe {
                                // Safety: slice_start and value_end are valid position because we
                                // got them from `self.input`
                                l.input.slice(slice_start, value_end)
                            };
                            buf.push_str(s);

                            l.atoms.atom(&**buf)
                        };

                        unsafe {
                            // Safety: cur is quote
                            l.input.bump();
                        }

                        let end = l.cur_pos();

                        let raw = unsafe {
                            // Safety: start and end are valid position because we got them from
                            // `self.input`
                            l.input.slice(start, end)
                        };
                        let raw = l.atoms.atom(raw);

                        l.state.set_token_value(TokenValue::Str { value, raw });
                        return Ok(Token::Str);
                    }

                    if c == b'\\' {
                        has_escape = true;

                        {
                            let end = l.cur_pos();
                            let s = unsafe {
                                // Safety: start and end are valid position because we got them from
                                // `self.input`
                                l.input.slice(slice_start, end)
                            };
                            buf.push_str(s);
                        }

                        if let Some(chars) = l.read_escaped_char(false)? {
                            for c in chars {
                                buf.extend(c);
                            }
                        }

                        slice_start = l.cur_pos();
                        continue;
                    }

                    if (c as char).is_line_break() {
                        break;
                    }

                    unsafe {
                        // Safety: cur is a ascii character
                        l.input.bump();
                    }
                    continue;
                }

                match l.input.cur() {
                    Some(c) => {
                        if c.is_line_break() {
                            break;
                        }
                        unsafe {
                            // Safety: cur is Some(c)
                            l.input.bump();
                        }
                    }
                    None => break,
                }
            }

            {
                let end = l.cur_pos();
                let s = unsafe {
                    // Safety: start and end are valid position because we got them from
                    // `self.input`
                    l.input.slice(slice_start, end)
                };
                buf.push_str(s);
            }

            l.emit_error(start, SyntaxError::UnterminatedStrLit);

            let end = l.cur_pos();

            let raw = unsafe {
                // Safety: start and end are valid position because we got them from
                // `self.input`
                l.input.slice(start, end)
            };
            l.state.set_token_value(TokenValue::Str {
                value: l.atoms.atom(&*buf),
                raw: l.atoms.atom(raw),
            });
            Ok(Token::Str)
        })
    }

    /// Expects current char to be '/'
    fn read_regexp(&mut self, start: BytePos) -> LexResult<Token> {
        unsafe {
            // Safety: start is valid position, and cur() is Some('/')
            self.input.reset_to(start);
        }

        debug_assert_eq!(self.cur(), Some('/'));

        let start = self.cur_pos();

        self.bump();

        let (mut escaped, mut in_class) = (false, false);

        let content = self.with_buf(|l, buf| {
            while let Some(c) = l.cur() {
                // This is ported from babel.
                // Seems like regexp literal cannot contain linebreak.
                if c.is_line_terminator() {
                    let span = l.span(start);

                    return Err(Error::new(span, SyntaxError::UnterminatedRegExp));
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

            Ok(l.atoms.atom(&**buf))
        })?;

        // input is terminated without following `/`
        if !self.is(b'/') {
            let span = self.span(start);

            return Err(Error::new(span, SyntaxError::UnterminatedRegExp));
        }

        self.bump(); // '/'

        // Spec says "It is a Syntax Error if IdentifierPart contains a Unicode escape
        // sequence." TODO: check for escape

        // Need to use `read_word` because '\uXXXX' sequences are allowed
        // here (don't ask).
        // let flags_start = self.cur_pos();
        let flags = {
            match self.cur() {
                Some(c) if c.is_ident_start() => self
                    .read_word_as_str_with(|l, s, _, _| l.atoms.atom(s))
                    .map(Some),
                _ => Ok(None),
            }
        }?
        .map(|(value, _)| value)
        .unwrap_or_default();

        self.state.set_token_value(TokenValue::Regex {
            value: content,
            flags,
        });
        Ok(Token::Regex)
    }

    #[cold]
    fn read_shebang(&mut self) -> LexResult<Option<Atom>> {
        if self.input.cur() != Some('#') || self.input.peek() != Some('!') {
            return Ok(None);
        }
        unsafe {
            // Safety: cur() is Some('#')
            self.input.bump();
            // Safety: cur() is Some('!')
            self.input.bump();
        }
        let s = self.input.uncons_while(|c| !c.is_line_terminator());
        Ok(Some(self.atoms.atom(s)))
    }

    fn read_tmpl_token(&mut self, start_of_tpl: BytePos) -> LexResult<Token> {
        let start = self.cur_pos();

        let mut cooked = Ok(String::new());
        let mut cooked_slice_start = start;
        let raw_slice_start = start;

        macro_rules! consume_cooked {
            () => {{
                if let Ok(cooked) = &mut cooked {
                    let last_pos = self.cur_pos();
                    cooked.push_str(unsafe {
                        // Safety: Both of start and last_pos are valid position because we got them
                        // from `self.input`
                        self.input.slice(cooked_slice_start, last_pos)
                    });
                }
            }};
        }

        while let Some(c) = self.cur() {
            if c == '`' || (c == '$' && self.peek() == Some('{')) {
                if start == self.cur_pos() && self.state.last_was_tpl_element() {
                    if c == '$' {
                        self.bump();
                        self.bump();
                        return Ok(Token::DollarLBrace);
                    } else {
                        self.bump();
                        return Ok(Token::BackQuote);
                    }
                }

                // If we don't have any escape
                let cooked = if cooked_slice_start == raw_slice_start {
                    let last_pos = self.cur_pos();
                    let s = unsafe {
                        // Safety: Both of start and last_pos are valid position because we got them
                        // from `self.input`
                        self.input.slice(cooked_slice_start, last_pos)
                    };

                    Ok(self.atoms.atom(s))
                } else {
                    consume_cooked!();

                    cooked.map(|s| self.atoms.atom(s))
                };

                // TODO: Handle error
                let end = self.input.cur_pos();
                let raw = unsafe {
                    // Safety: Both of start and last_pos are valid position because we got them
                    // from `self.input`
                    self.input.slice(raw_slice_start, end)
                };
                self.state.set_token_value(TokenValue::Template {
                    cooked,
                    raw: self.atoms.atom(raw),
                });
                return Ok(Token::Template);
            }

            if c == '\\' {
                consume_cooked!();

                match self.read_escaped_char(true) {
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

                cooked_slice_start = self.cur_pos();
            } else if c.is_line_terminator() {
                self.state.had_line_break = true;

                consume_cooked!();

                let c = if c == '\r' && self.peek() == Some('\n') {
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
                cooked_slice_start = self.cur_pos();
            } else {
                self.bump();
            }
        }

        self.error(start_of_tpl, SyntaxError::UnterminatedTpl)?
    }

    #[inline]
    #[allow(clippy::misnamed_getters)]
    pub fn had_line_break_before_last(&self) -> bool {
        self.state.had_line_break
    }

    #[inline]
    pub fn set_expr_allowed(&mut self, allow: bool) {
        self.state.is_expr_allowed = allow;
    }

    #[inline]
    pub fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.state.next_regexp = start;
    }
}

fn pos_span(p: BytePos) -> Span {
    Span::new(p, p)
}

fn fixed_len_span(p: BytePos, len: u32) -> Span {
    Span::new(p, p + BytePos(len))
}
