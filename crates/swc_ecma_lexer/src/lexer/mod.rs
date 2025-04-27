//! ECMAScript lexer.

use std::{cell::RefCell, char, iter::FusedIterator, rc::Rc};

use either::Either::{Left, Right};
use swc_atoms::AtomStoreCell;
use swc_common::{
    comments::Comments,
    input::{Input, StringInput},
    BytePos, Span,
};
use swc_ecma_ast::{op, AssignOp, EsVersion};

pub use self::state::{TokenContext, TokenContexts, TokenType};
use self::table::{ByteHandler, BYTE_HANDLERS};
use crate::{
    common::{
        lexer::{char::CharExt, comments_buffer::CommentsBuffer, LexResult, Lexer as LexerTrait},
        syntax::Syntax,
    },
    error::{Error, SyntaxError},
    tok,
    token::{BinOpToken, IdentLike, Token, TokenAndSpan, Word},
    Context,
};

mod jsx;
mod number;
mod state;
mod table;
#[cfg(test)]
mod tests;
pub mod util;

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

impl<'a> crate::common::lexer::Lexer<'a, TokenAndSpan> for Lexer<'a> {
    type State = self::state::State;
    type Token = self::Token;

    #[inline(always)]
    fn input(&self) -> &StringInput<'a> {
        &self.input
    }

    #[inline(always)]
    fn input_mut(&mut self) -> &mut StringInput<'a> {
        &mut self.input
    }

    #[inline(always)]
    fn push_error(&self, error: crate::error::Error) {
        self.errors.borrow_mut().push(error);
    }

    #[inline(always)]
    fn state(&self) -> &Self::State {
        &self.state
    }

    #[inline(always)]
    fn state_mut(&mut self) -> &mut Self::State {
        &mut self.state
    }

    #[inline(always)]
    fn comments(&self) -> Option<&'a dyn swc_common::comments::Comments> {
        self.comments
    }

    #[inline(always)]
    fn comments_buffer(&self) -> Option<&crate::common::lexer::comments_buffer::CommentsBuffer> {
        self.comments_buffer.as_ref()
    }

    #[inline(always)]
    fn comments_buffer_mut(
        &mut self,
    ) -> Option<&mut crate::common::lexer::comments_buffer::CommentsBuffer> {
        self.comments_buffer.as_mut()
    }

    #[inline(always)]
    unsafe fn input_slice(&mut self, start: BytePos, end: BytePos) -> &'a str {
        let s = self.input.slice(start, end);
        // SAFETY: the input is guaranteed to live for the entire
        // lifetime.
        std::mem::transmute::<&str, &'a str>(s)
    }

    fn input_uncons_while(&mut self, f: impl FnMut(char) -> bool) -> &'a str {
        let s = self.input_mut().uncons_while(f);
        unsafe {
            // SAFETY: the input is guaranteed to live for the entire
            // lifetime.
            std::mem::transmute::<&str, &'a str>(s)
        }
    }

    #[inline(always)]
    fn atom<'b>(&self, s: impl Into<std::borrow::Cow<'b, str>>) -> swc_atoms::Atom {
        self.atoms.atom(s)
    }

    #[inline(always)]
    fn skip_block_comment(&mut self) {
        self.skip_block_comment();
    }

    #[inline(always)]
    fn buf(&self) -> std::rc::Rc<std::cell::RefCell<String>> {
        self.buf.clone()
    }
}

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
    fn read_token_logical<const C: u8>(&mut self) -> LexResult<Token> {
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c as char)
            self.input.bump();
        }
        let token = if C == b'&' {
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
    fn read_token_mul_mod<const C: u8>(&mut self) -> LexResult<Token> {
        let is_mul = C == b'*';
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
            Token::AssignOp(if C == b'+' {
                AssignOp::AddAssign
            } else {
                AssignOp::SubAssign
            })
        } else {
            Token::BinOp(if C == b'+' {
                BinOpToken::Add
            } else {
                BinOpToken::Sub
            })
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
            } else if C == b'!' {
                Token::BinOp(BinOpToken::NotEq)
            } else {
                Token::BinOp(BinOpToken::EqEq)
            }
        } else if C == b'=' && self.input.eat_byte(b'>') {
            // "=>"

            Token::Arrow
        } else if C == b'!' {
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
    fn read_token_lt_gt<const C: u8>(&mut self) -> LexResult<Option<Token>> {
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();
        self.bump();

        if self.syntax.typescript()
            && self.ctx.contains(Context::InType)
            && !self.ctx.contains(Context::ShouldNotLexLtOrGtAsType)
        {
            if C == b'<' {
                return Ok(Some(tok!('<')));
            } else if C == b'>' {
                return Ok(Some(tok!('>')));
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

        let mut op = if C == b'<' {
            BinOpToken::Lt
        } else {
            BinOpToken::Gt
        };

        // '<<', '>>'
        if self.cur() == Some(C as char) {
            self.bump();
            op = if C == b'<' {
                BinOpToken::LShift
            } else {
                BinOpToken::RShift
            };

            //'>>>'
            if C == b'>' && self.cur() == Some(C as char) {
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
}

fn pos_span(p: BytePos) -> Span {
    Span::new(p, p)
}

fn fixed_len_span(p: BytePos, len: u32) -> Span {
    Span::new(p, p + BytePos(len))
}
