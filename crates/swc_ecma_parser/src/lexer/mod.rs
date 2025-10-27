//! ECMAScript lexer.

use std::{char, iter::FusedIterator, rc::Rc};

use swc_atoms::{
    wtf8::{Wtf8, Wtf8Buf},
    AtomStoreCell,
};
use swc_common::{
    comments::Comments,
    input::{Input, StringInput},
    BytePos,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_lexer::{
    common::{
        lexer::{char::CharExt, fixed_len_span, pos_span, LexResult, Lexer as LexerTrait},
        syntax::SyntaxFlags,
    },
    lexer::TokenFlags,
};

use self::table::{ByteHandler, BYTE_HANDLERS};
use crate::{
    error::{Error, SyntaxError},
    input::Tokens,
    lexer::comments_buffer::CommentsBuffer,
    Context, Syntax,
};

#[cfg(feature = "unstable")]
pub(crate) mod capturing;
mod comments_buffer;
mod state;
mod table;
pub(crate) mod token;

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
    token_flags: TokenFlags,
    pub(crate) syntax: SyntaxFlags,
    pub(crate) target: EsVersion,

    errors: Vec<Error>,
    module_errors: Vec<Error>,

    atoms: Rc<AtomStoreCell>,
}

impl FusedIterator for Lexer<'_> {}

impl<'a> swc_ecma_lexer::common::lexer::Lexer<'a, TokenAndSpan> for Lexer<'a> {
    type CommentsBuffer = CommentsBuffer;
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
    fn push_error(&mut self, error: Error) {
        self.errors.push(error);
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
    fn comments_buffer(&self) -> Option<&Self::CommentsBuffer> {
        self.comments_buffer.as_ref()
    }

    #[inline(always)]
    fn comments_buffer_mut(&mut self) -> Option<&mut Self::CommentsBuffer> {
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
    fn wtf8_atom<'b>(&self, s: impl Into<std::borrow::Cow<'b, Wtf8>>) -> swc_atoms::Wtf8Atom {
        self.atoms.wtf8_atom(s)
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
            state: self::state::State::new(start_pos),
            syntax: syntax.into_flags(),
            target,
            errors: Default::default(),
            module_errors: Default::default(),
            atoms: Default::default(),
            token_flags: TokenFlags::empty(),
        }
    }

    /// babel: `getTokenFromCode`
    fn read_token(&mut self) -> LexResult<Token> {
        self.token_flags = TokenFlags::empty();
        let byte = match self.input.as_str().as_bytes().first() {
            Some(&v) => v,
            None => return Ok(Token::Eof),
        };

        let handler = unsafe { *(&BYTE_HANDLERS as *const ByteHandler).offset(byte as isize) };
        handler(self)
    }

    fn read_token_plus_minus<const C: u8>(&mut self) -> LexResult<Token> {
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c), if this method is called.
            self.input.bump();
        }

        // '++', '--'
        Ok(if self.input.cur() == Some(C as char) {
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
        })
    }

    fn read_token_bang_or_eq<const C: u8>(&mut self) -> LexResult<Token> {
        let start = self.cur_pos();
        let had_line_break_before_last = self.had_line_break_before_last();

        unsafe {
            // Safety: cur() is Some(c) if this method is called.
            self.input.bump();
        }

        Ok(if self.input.eat_byte(b'=') {
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
        })
    }
}

impl Lexer<'_> {
    #[inline(never)]
    fn read_token_lt_gt<const C: u8>(&mut self) -> LexResult<Token> {
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();
        self.bump();

        if self.syntax.typescript()
            && self.ctx.contains(Context::InType)
            && !self.ctx.contains(Context::ShouldNotLexLtOrGtAsType)
        {
            if C == b'<' {
                return Ok(Token::Lt);
            } else if C == b'>' {
                return Ok(Token::Gt);
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

        Ok(token)
    }

    fn read_token_back_quote(&mut self) -> LexResult<Token> {
        let start = self.cur_pos();
        self.scan_template_token(start, true)
    }

    fn scan_template_token(
        &mut self,
        start: BytePos,
        started_with_backtick: bool,
    ) -> LexResult<Token> {
        debug_assert!(self.cur() == Some(if started_with_backtick { '`' } else { '}' }));
        let mut cooked = Ok(Wtf8Buf::with_capacity(8));
        self.bump(); // `}` or `\``
        let mut cooked_slice_start = self.cur_pos();
        let raw_slice_start = cooked_slice_start;
        let raw_atom = |this: &mut Self| {
            let last_pos = this.cur_pos();
            let s = unsafe { this.input.slice(raw_slice_start, last_pos) };
            this.atoms.atom(s)
        };
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
            if c == '`' {
                consume_cooked!();
                let cooked = cooked.map(|cooked| self.atoms.wtf8_atom(&*cooked));
                let raw = raw_atom(self);
                self.bump();
                return Ok(if started_with_backtick {
                    self.set_token_value(Some(TokenValue::Template { raw, cooked }));
                    Token::NoSubstitutionTemplateLiteral
                } else {
                    self.set_token_value(Some(TokenValue::Template { raw, cooked }));
                    Token::TemplateTail
                });
            } else if c == '$' && self.input.peek() == Some('{') {
                consume_cooked!();
                let cooked = cooked.map(|cooked| self.atoms.wtf8_atom(&*cooked));
                let raw = raw_atom(self);
                self.input.bump_bytes(2);
                return Ok(if started_with_backtick {
                    self.set_token_value(Some(TokenValue::Template { raw, cooked }));
                    Token::TemplateHead
                } else {
                    self.set_token_value(Some(TokenValue::Template { raw, cooked }));
                    Token::TemplateMiddle
                });
            } else if c == '\\' {
                consume_cooked!();

                match self.read_escaped_char(true) {
                    Ok(Some(escaped)) => {
                        if let Ok(ref mut cooked) = cooked {
                            cooked.push(escaped);
                        }
                    }
                    Ok(None) => {}
                    Err(error) => {
                        cooked = Err(error);
                    }
                }

                cooked_slice_start = self.cur_pos();
            } else if c.is_line_terminator() {
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
                    cooked.push_char(c);
                }
                cooked_slice_start = self.cur_pos();
            } else {
                self.bump();
            }
        }

        self.error(start, SyntaxError::UnterminatedTpl)?
    }
}
