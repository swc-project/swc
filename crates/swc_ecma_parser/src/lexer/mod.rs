//! ECMAScript lexer.

use std::{cell::RefCell, char, iter::FusedIterator, mem::transmute, rc::Rc};

use either::Either::{Left, Right};
use smallvec::{smallvec, SmallVec};
use swc_atoms::{Atom, AtomStoreCell};
use swc_common::{comments::Comments, input::StringInput, BytePos, Span};
use swc_ecma_ast::{op, AssignOp, EsVersion, Ident};

use self::{
    comments_buffer::CommentsBuffer,
    state::State,
    table::{ByteHandler, BYTE_HANDLERS},
    util::*,
};
pub use self::{
    input::Input,
    state::{TokenContext, TokenContexts},
};
use crate::{
    error::{Error, SyntaxError},
    token::{BinOpToken, IdentLike, Token, Word},
    Context, Syntax,
};

mod comments_buffer;
#[deprecated = "Directly use swc_common::input instead"]
pub mod input;
mod jsx;
mod number;
mod state;
mod table;
#[cfg(test)]
mod tests;
pub mod util;
mod whitespace;

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

/// Ported from https://github.com/web-infra-dev/oxc/blob/99a4816ce7b6132b2667257984f9d92ae3768f03/crates/oxc_parser/src/lexer/mod.rs#L1349-L1374
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
                let mut buf = smallvec![];

                let high = self.0 & 0xffff0000 >> 16;

                let low = self.0 & 0x0000ffff;

                // The second code unit of a surrogate pair is always in the range from 0xDC00
                // to 0xDFFF, and is called a low surrogate or a trail surrogate.
                if !(0xdc00..=0xdfff).contains(&low) {
                    buf.push('\\');
                    buf.push('u');
                    buf.extend(format!("{high:x}").chars());
                    buf.push('\\');
                    buf.push('u');
                    buf.extend(format!("{low:x}").chars());
                } else {
                    // `https://tc39.es/ecma262/#sec-utf16decodesurrogatepair`
                    let astral_code_point = (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;

                    buf.push('\\');
                    buf.push('u');
                    buf.extend(format!("{astral_code_point:x}").chars());
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
pub struct Lexer<'a> {
    comments: Option<&'a dyn Comments>,
    /// [Some] if comment comment parsing is enabled. Otherwise [None]
    comments_buffer: Option<CommentsBuffer>,

    pub(crate) ctx: Context,
    input: StringInput<'a>,
    start_pos: BytePos,

    state: State,
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
            state: State::new(syntax, start_pos),
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
                return Ok(tok!('.'));
            }
        };
        if next.is_ascii_digit() {
            return self.read_number(true).map(|v| match v {
                Left((value, raw)) => Token::Num { value, raw },
                Right((value, raw)) => Token::BigInt { value, raw },
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

                    return Ok(tok!("??="));
                }
                Ok(tok!("??"))
            }
            _ => {
                unsafe {
                    // Safety: peek() is callable only if cur() is Some
                    self.input.bump();
                }
                Ok(tok!('?'))
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
        Ok(tok!(':'))
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
                    Left((value, raw)) => Token::Num { value, raw },
                    Right((value, raw)) => Token::BigInt { value, raw },
                });
            }
        };

        bigint.map(|v| match v {
            Left((value, raw)) => Token::Num { value, raw },
            Right((value, raw)) => Token::BigInt { value, raw },
        })
    }

    /// Read a token given `|` or `&`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_logical(&mut self, c: u8) -> LexResult<Token> {
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c as char)
            self.input.bump();
        }
        let token = if c == b'&' {
            BinOpToken::BitAnd
        } else {
            BinOpToken::BitOr
        };

        // '|=', '&='
        if self.input.eat_byte(b'=') {
            return Ok(Token::AssignOp(match token {
                BinOpToken::BitAnd => AssignOp::BitAndAssign,
                BinOpToken::BitOr => AssignOp::BitOrAssign,
                _ => unreachable!(),
            }));
        }

        // '||', '&&'
        if self.input.cur() == Some(c as char) {
            unsafe {
                // Safety: cur() is Some(c)
                self.input.bump();
            }

            if self.input.cur() == Some('=') {
                unsafe {
                    // Safety: cur() is Some('=')
                    self.input.bump();
                }
                return Ok(Token::AssignOp(match token {
                    BinOpToken::BitAnd => op!("&&="),
                    BinOpToken::BitOr => op!("||="),
                    _ => unreachable!(),
                }));
            }

            // |||||||
            //   ^
            if had_line_break_before_last && token == BinOpToken::BitOr && self.is_str("||||| ") {
                let span = fixed_len_span(start, 7);
                self.emit_error_span(span, SyntaxError::TS1185);
                self.skip_line_comment(5);
                self.skip_space::<true>();
                return self.error_span(span, SyntaxError::TS1185);
            }

            return Ok(Token::BinOp(match token {
                BinOpToken::BitAnd => BinOpToken::LogicalAnd,
                BinOpToken::BitOr => BinOpToken::LogicalOr,
                _ => unreachable!(),
            }));
        }

        Ok(Token::BinOp(token))
    }

    /// Read a token given `*` or `%`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_mul_mod(&mut self, c: u8) -> LexResult<Token> {
        let is_mul = c == b'*';
        unsafe {
            // Safety: cur() is Some(c)
            self.input.bump();
        }
        let mut token = if is_mul {
            Token::BinOp(BinOpToken::Mul)
        } else {
            Token::BinOp(BinOpToken::Mod)
        };

        // check for **
        if is_mul && self.input.eat_byte(b'*') {
            token = Token::BinOp(BinOpToken::Exp)
        }

        if self.input.eat_byte(b'=') {
            token = match token {
                Token::BinOp(BinOpToken::Mul) => Token::AssignOp(AssignOp::MulAssign),
                Token::BinOp(BinOpToken::Mod) => Token::AssignOp(AssignOp::ModAssign),
                Token::BinOp(BinOpToken::Exp) => Token::AssignOp(AssignOp::ExpAssign),
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

    fn read_token_plus_minus(&mut self, c: u8) -> LexResult<Option<Token>> {
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c), if this method is called.
            self.input.bump();
        }

        // '++', '--'
        Ok(Some(if self.input.cur() == Some(c as char) {
            unsafe {
                // Safety: cur() is Some(c)
                self.input.bump();
            }

            // Handle -->
            if self.state.had_line_break && c == b'-' && self.eat(b'>') {
                self.emit_module_mode_error(start, SyntaxError::LegacyCommentInModule);
                self.skip_line_comment(0);
                self.skip_space::<true>();
                return self.read_token();
            }

            if c == b'+' {
                Token::PlusPlus
            } else {
                Token::MinusMinus
            }
        } else if self.input.eat_byte(b'=') {
            Token::AssignOp(if c == b'+' {
                AssignOp::AddAssign
            } else {
                AssignOp::SubAssign
            })
        } else {
            Token::BinOp(if c == b'+' {
                BinOpToken::Add
            } else {
                BinOpToken::Sub
            })
        }))
    }

    fn read_token_bang_or_eq(&mut self, c: u8) -> LexResult<Option<Token>> {
        let start = self.cur_pos();
        let had_line_break_before_last = self.had_line_break_before_last();

        unsafe {
            // Safety: cur() is Some(c) if this method is called.
            self.input.bump();
        }

        Ok(Some(if self.input.eat_byte(b'=') {
            // "=="

            if self.input.eat_byte(b'=') {
                if c == b'!' {
                    Token::BinOp(BinOpToken::NotEqEq)
                } else {
                    // =======
                    //    ^
                    if had_line_break_before_last && self.is_str("====") {
                        self.emit_error_span(fixed_len_span(start, 7), SyntaxError::TS1185);
                        self.skip_line_comment(4);
                        self.skip_space::<true>();
                        return self.read_token();
                    }

                    Token::BinOp(BinOpToken::EqEqEq)
                }
            } else if c == b'!' {
                Token::BinOp(BinOpToken::NotEq)
            } else {
                Token::BinOp(BinOpToken::EqEq)
            }
        } else if c == b'=' && self.input.eat_byte(b'>') {
            // "=>"

            Token::Arrow
        } else if c == b'!' {
            Token::Bang
        } else {
            Token::AssignOp(AssignOp::Assign)
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

        if self.syntax.typescript() && self.ctx.in_type && !self.ctx.should_not_lex_lt_or_gt_as_type
        {
            if c == '<' {
                return Ok(Some(tok!('<')));
            } else if c == '>' {
                return Ok(Some(tok!('>')));
            }
        }

        // XML style comment. `<!--`
        if c == '<' && self.is(b'!') && self.peek() == Some('-') && self.peek_ahead() == Some('-') {
            self.skip_line_comment(3);
            self.skip_space::<true>();
            self.emit_module_mode_error(start, SyntaxError::LegacyCommentInModule);

            return self.read_token();
        }

        let mut op = if c == '<' {
            BinOpToken::Lt
        } else {
            BinOpToken::Gt
        };

        // '<<', '>>'
        if self.cur() == Some(c) {
            self.bump();
            op = if c == '<' {
                BinOpToken::LShift
            } else {
                BinOpToken::RShift
            };

            //'>>>'
            if c == '>' && self.cur() == Some(c) {
                self.bump();
                op = BinOpToken::ZeroFillRShift;
            }
        }

        let token = if self.eat(b'=') {
            match op {
                BinOpToken::Lt => Token::BinOp(BinOpToken::LtEq),
                BinOpToken::Gt => Token::BinOp(BinOpToken::GtEq),
                BinOpToken::LShift => Token::AssignOp(AssignOp::LShiftAssign),
                BinOpToken::RShift => Token::AssignOp(AssignOp::RShiftAssign),
                BinOpToken::ZeroFillRShift => Token::AssignOp(AssignOp::ZeroFillRShiftAssign),
                _ => unreachable!(),
            }
        } else {
            Token::BinOp(op)
        };

        // All conflict markers consist of the same character repeated seven times.
        // If it is a <<<<<<< or >>>>>>> marker then it is also followed by a space.
        // <<<<<<<
        //   ^
        // >>>>>>>
        //    ^
        if had_line_break_before_last
            && match op {
                BinOpToken::LShift if self.is_str("<<<<< ") => true,
                BinOpToken::ZeroFillRShift if self.is_str(">>>> ") => true,
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

        let (word, _) = self
            .read_word_as_str_with(|l, s, _, _| Word::Ident(IdentLike::Other(l.atoms.atom(s))))?;

        Ok(Word(word))
    }

    /// This can be used if there's no keyword starting with the first
    /// character.
    fn read_word_with(
        &mut self,
        convert: &dyn Fn(&str) -> Option<Word>,
    ) -> LexResult<Option<Token>> {
        debug_assert!(self.cur().is_some());

        let start = self.cur_pos();
        let (word, has_escape) = self.read_word_as_str_with(|l, s, _, can_be_known| {
            if can_be_known {
                if let Some(word) = convert(s) {
                    return word;
                }
            }

            Word::Ident(IdentLike::Other(l.atoms.atom(s)))
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
            Ok(Some(Token::Word(word)))
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

                    if Ident::is_valid_continue(c as _) {
                        l.bump();
                        continue;
                    } else if first && Ident::is_valid_start(c as _) {
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
                }

                if let Some(c) = l.input.cur() {
                    if Ident::is_valid_continue(c) {
                        l.bump();
                        continue;
                    } else if first && Ident::is_valid_start(c) {
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

        let mut chars = Vec::new();
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

                        return Ok(Token::Str { value, raw });
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
            Ok(Token::Str {
                value: l.atoms.atom(&*buf),
                raw: l.atoms.atom(raw),
            })
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

        Ok(Token::Regex(content, flags))
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
                        return Ok(tok!("${"));
                    } else {
                        self.bump();
                        return Ok(tok!('`'));
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
                return Ok(Token::Template {
                    cooked,
                    raw: self.atoms.atom(raw),
                });
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
