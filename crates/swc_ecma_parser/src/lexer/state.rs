use std::mem::take;

use swc_common::BytePos;
use swc_ecma_ast::EsVersion;
use swc_ecma_lexer::{
    common::lexer::{
        char::CharExt,
        comments_buffer::{BufferedComment, BufferedCommentKind},
    },
    TokenContexts,
};

use super::{Context, Input, Lexer, LexerTrait};
use crate::{
    error::Error,
    input::Tokens,
    lexer::token::{Token, TokenAndSpan, TokenValue},
    Syntax,
};

/// State of lexer.
///
/// Ported from babylon.
#[derive(Clone)]
pub struct State {
    pub is_expr_allowed: bool,
    pub next_regexp: Option<BytePos>,
    /// if line break exists between previous token and new token?
    pub had_line_break: bool,
    /// if line break exists before last?
    pub had_line_break_before_last: bool,
    /// TODO: Remove this field.
    is_first: bool,
    pub start: BytePos,
    pub cur_line: usize,
    pub line_start: BytePos,
    pub prev_hi: BytePos,
    pub tpl_start: BytePos,

    syntax: Syntax,

    pub(super) token_value: Option<TokenValue>,
    token_type: Option<Token>,
}

impl swc_ecma_lexer::common::input::Tokens<TokenAndSpan> for Lexer<'_> {
    #[inline]
    fn set_ctx(&mut self, ctx: Context) {
        if ctx.contains(Context::Module) && !self.module_errors.borrow().is_empty() {
            let mut module_errors = self.module_errors.borrow_mut();
            self.errors.borrow_mut().append(&mut *module_errors);
        }
        self.ctx = ctx
    }

    #[inline]
    fn ctx(&self) -> Context {
        self.ctx
    }

    #[inline]
    fn syntax(&self) -> Syntax {
        self.syntax
    }

    #[inline]
    fn target(&self) -> EsVersion {
        self.target
    }

    #[inline]
    fn start_pos(&self) -> BytePos {
        self.start_pos
    }

    #[inline]
    fn set_expr_allowed(&mut self, allow: bool) {
        self.state.is_expr_allowed = allow;
    }

    #[inline]
    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.state.next_regexp = start;
    }

    #[inline]
    fn token_context(&self) -> &TokenContexts {
        unreachable!();
    }

    #[inline]
    fn token_context_mut(&mut self) -> &mut TokenContexts {
        unreachable!();
    }

    #[inline]
    fn set_token_context(&mut self, _: TokenContexts) {
        unreachable!();
    }

    fn add_error(&self, error: Error) {
        self.errors.borrow_mut().push(error);
    }

    fn add_module_mode_error(&self, error: Error) {
        if self.ctx.contains(Context::Module) {
            self.add_error(error);
            return;
        }
        self.module_errors.borrow_mut().push(error);
    }

    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors.borrow_mut())
    }

    fn take_script_module_errors(&mut self) -> Vec<Error> {
        take(&mut self.module_errors.borrow_mut())
    }

    fn end_pos(&self) -> BytePos {
        self.input.end_pos()
    }
}

impl Tokens for Lexer<'_> {
    fn clone_token_value(&self) -> Option<TokenValue> {
        self.state.token_value.clone()
    }

    fn get_token_value(&self) -> Option<&TokenValue> {
        self.state.token_value.as_ref()
    }

    fn set_token_value(&mut self, token_value: Option<TokenValue>) {
        self.state.token_value = token_value;
    }

    fn take_token_value(&mut self) -> Option<TokenValue> {
        self.state.token_value.take()
    }

    fn rescan_jsx_token(
        &mut self,
        allow_multiline_jsx_text: bool,
        reset: BytePos,
    ) -> Option<TokenAndSpan> {
        unsafe {
            self.input.reset_to(reset);
        }
        Tokens::scan_jsx_token(self, allow_multiline_jsx_text)
    }

    fn scan_jsx_token(&mut self, allow_multiline_jsx_text: bool) -> Option<TokenAndSpan> {
        let start = self.cur_pos();
        let res = match self.scan_jsx_token(allow_multiline_jsx_text) {
            Ok(res) => Ok(res),
            Err(error) => {
                self.state.set_token_value(TokenValue::Error(error));
                Err(Token::Error)
            }
        };
        let token = match res.map_err(Some) {
            Ok(t) => t,
            Err(e) => e,
        };
        let span = self.span(start);
        token.map(|token| {
            // Attach span to token.
            TokenAndSpan {
                token,
                had_line_break: self.had_line_break_before_last(),
                span,
            }
        })
    }

    fn scan_jsx_identifier(&mut self) {
        // debug_assert!(self
        //     .get_token_value()
        //     .is_some_and(|t| matches!(t, TokenValue::Str { .. })));

        while let Some(ch) = self.input().cur() {
            if ch == '-' {
                todo!()
            } else {
                let old_pos = self.cur_pos();
                // TODO: scan_identifier_parts
                if self.cur_pos() == old_pos {
                    break;
                }
            }
        }
    }

    fn scan_jsx_attribute_value(&mut self) -> Option<TokenAndSpan> {
        let Some(cur) = self.cur() else {
            return self.next();
        };
        let start = self.cur_pos();

        match cur {
            '\'' | '"' => {
                let _ = self.read_str_lit::<true>();
                debug_assert!(self
                    .get_token_value()
                    .is_some_and(|t| matches!(t, TokenValue::Str { .. })));

                Some(TokenAndSpan {
                    token: Token::Str,
                    had_line_break: self.had_line_break_before_last(),
                    span: self.span(start),
                })
            }
            _ => self.next(),
        }
    }
}

impl Lexer<'_> {
    fn next_token(&mut self, start: &mut BytePos) -> Result<Option<Token>, Error> {
        if let Some(start) = self.state.next_regexp {
            return Ok(Some(self.read_regexp(start)?));
        }

        if self.state.is_first {
            if let Some(shebang) = self.read_shebang()? {
                self.state.set_token_value(TokenValue::Word(shebang));
                return Ok(Some(Token::Shebang));
            }
        }

        self.state.had_line_break = self.state.is_first;
        self.state.is_first = false;

        // skip spaces before getting next character, if we are allowed to.
        // if self.state.can_skip_space() {
        self.skip_space::<true>();
        *start = self.input.cur_pos();
        // };

        match self.input.cur() {
            Some(..) => {}
            // End of input.
            None => {
                self.consume_pending_comments();

                return Ok(None);
            }
        };

        // println!(
        //     "\tContext: ({:?}) {:?}",
        //     self.input.cur().unwrap(),
        //     self.state.context.0
        // );

        self.state.start = *start;

        self.read_token()
    }

    fn scan_jsx_token(&mut self, allow_multiline_jsx_text: bool) -> Result<Option<Token>, Error> {
        let start = self.input.cur_pos();
        debug_assert!(self.syntax.jsx());
        if self.input_mut().cur().is_none() {
            return Ok(None);
        };

        if self.input.eat_byte(b'<') {
            return Ok(Some(if self.input.eat_byte(b'/') {
                Token::JSXTagEnd
            } else {
                Token::Lt
            }));
        } else if self.input.eat_byte(b'{') {
            return Ok(Some(Token::LBrace));
        }

        let mut first_non_whitespace = 0;
        while let Some(ch) = self.input_mut().cur() {
            if ch == '{' {
                break;
            } else if ch == '<' {
                // TODO: check git conflict mark
                break;
            }

            if ch == '>' {
                todo!("error handle")
            } else if ch == '}' {
                todo!("error handle")
            }

            if first_non_whitespace == 0 && ch.is_line_terminator() {
                first_non_whitespace = -1;
            } else if !allow_multiline_jsx_text
                && ch.is_line_terminator()
                && first_non_whitespace > 0
            {
                break;
            } else if ch.is_whitespace() {
                first_non_whitespace = self.cur_pos().0 as i32;
            }

            self.bump();
        }

        let end = self.input().cur_pos();
        let value = unsafe {
            // Safety: Both of `start` and `end` are generated from `cur_pos()`
            self.input_slice(start, end)
        };
        let value = self.atom(value);

        self.state.set_token_value(TokenValue::Str {
            raw: value.clone(),
            value,
        });

        Ok(Some(Token::JSXText))
    }
}

impl Iterator for Lexer<'_> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let mut start = self.cur_pos();

        let res = match self.next_token(&mut start) {
            Ok(res) => Ok(res),
            Err(error) => {
                self.state.set_token_value(TokenValue::Error(error));
                Err(Token::Error)
            }
        };
        let token = match res.map_err(Some) {
            Ok(t) => t,
            Err(e) => e,
        };

        let span = self.span(start);
        if token.is_some() {
            if let Some(comments) = self.comments_buffer.as_mut() {
                for comment in comments.take_pending_leading() {
                    comments.push(BufferedComment {
                        kind: BufferedCommentKind::Leading,
                        pos: start,
                        comment,
                    });
                }
            }

            // self.state.update(start, token);
            self.state.prev_hi = self.last_pos();
            self.state.had_line_break_before_last = self.had_line_break_before_last();
        }

        token.map(|token| {
            // Attach span to token.
            TokenAndSpan {
                token,
                had_line_break: self.had_line_break_before_last(),
                span,
            }
        })
    }
}

impl State {
    pub fn new(syntax: Syntax, start_pos: BytePos) -> Self {
        State {
            is_expr_allowed: true,
            next_regexp: None,
            had_line_break: false,
            had_line_break_before_last: false,
            is_first: true,
            start: BytePos(0),
            cur_line: 1,
            line_start: BytePos(0),
            prev_hi: start_pos,
            tpl_start: BytePos::DUMMY,
            syntax,
            token_value: None,
            token_type: None,
        }
    }
}

impl State {
    pub(crate) fn set_token_value(&mut self, token_value: TokenValue) {
        self.token_value = Some(token_value);
    }
}

impl swc_ecma_lexer::common::lexer::state::State for State {
    type TokenKind = Token;
    type TokenType = Token;

    #[inline(always)]
    fn is_expr_allowed(&self) -> bool {
        self.is_expr_allowed
    }

    #[inline(always)]
    fn set_is_expr_allowed(&mut self, is_expr_allowed: bool) {
        self.is_expr_allowed = is_expr_allowed;
    }

    #[inline(always)]
    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.next_regexp = start;
    }

    #[inline(always)]
    fn had_line_break(&self) -> bool {
        self.had_line_break
    }

    #[inline(always)]
    fn mark_had_line_break(&mut self) {
        self.had_line_break = true;
    }

    #[inline(always)]
    fn had_line_break_before_last(&self) -> bool {
        self.had_line_break_before_last
    }

    #[inline(always)]
    fn token_contexts(&self) -> &swc_ecma_lexer::TokenContexts {
        unreachable!();
    }

    #[inline(always)]
    fn mut_token_contexts(&mut self) -> &mut swc_ecma_lexer::TokenContexts {
        unreachable!();
    }

    #[inline(always)]
    fn set_token_type(&mut self, token_type: Self::TokenType) {
        self.token_type = Some(token_type);
    }

    #[inline(always)]
    fn token_type(&self) -> Option<Self::TokenType> {
        self.token_type
    }

    #[inline(always)]
    fn set_tpl_start(&mut self, start: BytePos) {
        self.tpl_start = start;
    }

    #[inline(always)]
    fn syntax(&self) -> swc_ecma_lexer::Syntax {
        self.syntax
    }

    #[inline(always)]
    fn prev_hi(&self) -> BytePos {
        self.prev_hi
    }

    #[inline(always)]
    fn start(&self) -> BytePos {
        self.start
    }

    #[inline(always)]
    fn add_current_line(&mut self, offset: usize) {
        self.cur_line += offset;
    }

    #[inline(always)]
    fn set_line_start(&mut self, line_start: BytePos) {
        self.line_start = line_start;
    }
}
