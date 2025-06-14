//! ECMAScript lexer.

use std::{cell::RefCell, char, iter::FusedIterator, rc::Rc};

use swc_atoms::AtomStoreCell;
use swc_common::{
    comments::Comments,
    input::{Input, StringInput},
    BytePos, Span,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_lexer::common::lexer::{
    char::CharExt, comments_buffer::CommentsBuffer, fixed_len_span, pos_span, LexResult,
    Lexer as LexerTrait,
};

use self::table::{ByteHandler, BYTE_HANDLERS};
use crate::{
    error::{Error, SyntaxError},
    Context, Syntax,
};

mod jsx;
mod state;
mod table;
mod token;

pub(crate) use token::{NextTokenAndSpan, Token, TokenAndSpan, TokenValue};

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

impl<'a> swc_ecma_lexer::common::lexer::Lexer<'a, TokenAndSpan> for Lexer<'a> {
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
    fn push_error(&self, error: Error) {
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
    fn comments_buffer(
        &self,
    ) -> Option<&swc_ecma_lexer::common::lexer::comments_buffer::CommentsBuffer> {
        self.comments_buffer.as_ref()
    }

    #[inline(always)]
    fn comments_buffer_mut(
        &mut self,
    ) -> Option<&mut swc_ecma_lexer::common::lexer::comments_buffer::CommentsBuffer> {
        self.comments_buffer.as_mut()
    }

    #[inline(always)]
    unsafe fn input_slice(&mut self, start: BytePos, end: BytePos) -> &'a str {
        self.input.slice(start, end)
    }

    #[inline(always)]
    fn input_uncons_while(&mut self, f: impl FnMut(char) -> bool) -> &'a str {
        self.input_mut().uncons_while(f)
    }

    #[inline(always)]
    fn atom<'b>(&self, s: impl Into<std::borrow::Cow<'b, str>>) -> swc_atoms::Atom {
        self.atoms.atom(s)
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
}
