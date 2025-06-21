use std::mem::take;

use swc_common::BytePos;
use swc_ecma_ast::EsVersion;
use swc_ecma_lexer::{
    common::lexer::{
        char::CharExt,
        comments_buffer::{BufferedComment, BufferedCommentKind},
        state::State as StateTrait,
        LexResult,
    },
    error::SyntaxError,
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
    /// if line break exists between previous token and new token?
    pub had_line_break: bool,
    /// if line break exists before last?
    pub had_line_break_before_last: bool,
    /// TODO: Remove this field.
    is_first: bool,
    pub next_regexp: Option<BytePos>,
    pub start: BytePos,
    pub prev_hi: BytePos,

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
    fn set_expr_allowed(&mut self, _: bool) {}

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

    #[inline]
    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors.borrow_mut())
    }

    #[inline]
    fn take_script_module_errors(&mut self) -> Vec<Error> {
        take(&mut self.module_errors.borrow_mut())
    }

    #[inline]
    fn end_pos(&self) -> BytePos {
        self.input.end_pos()
    }

    #[inline]
    fn update_token_flags(&mut self, f: impl FnOnce(&mut swc_ecma_lexer::lexer::TokenFlags)) {
        f(&mut self.token_flags)
    }

    #[inline]
    fn token_flags(&self) -> swc_ecma_lexer::lexer::TokenFlags {
        self.token_flags
    }
}

impl crate::input::Tokens for Lexer<'_> {
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

    fn rescan_jsx_open_el_terminal_token(&mut self, reset: BytePos) -> Option<TokenAndSpan> {
        unsafe {
            self.input.reset_to(reset);
        }
        Tokens::scan_jsx_open_el_terminal_token(self)
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
        if let Some(token) = token {
            if let Some(comments) = self.comments_buffer.as_mut() {
                for comment in comments.take_pending_leading() {
                    comments.push(BufferedComment {
                        kind: BufferedCommentKind::Leading,
                        pos: start,
                        comment,
                    });
                }
            }

            self.state.set_token_type(token);
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

    fn scan_jsx_open_el_terminal_token(&mut self) -> Option<TokenAndSpan> {
        self.skip_space::<true>();
        let start = self.input.cur_pos();
        let res = match self.scan_jsx_attrs_terminal_token() {
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
        if let Some(token) = token {
            if let Some(comments) = self.comments_buffer.as_mut() {
                for comment in comments.take_pending_leading() {
                    comments.push(BufferedComment {
                        kind: BufferedCommentKind::Leading,
                        pos: start,
                        comment,
                    });
                }
            }

            self.state.set_token_type(token);
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

    fn scan_jsx_identifier(&mut self, start: BytePos) -> TokenAndSpan {
        let token = self.state.token_type.unwrap();
        debug_assert!(token.is_word());
        let mut v = String::with_capacity(16);
        while let Some(ch) = self.input().cur() {
            if ch == '-' {
                v.push(ch);
                self.bump();
            } else {
                let old_pos = self.cur_pos();
                v.push_str(&self.scan_identifier_parts());
                if self.cur_pos() == old_pos {
                    break;
                }
            }
        }
        let v = if !v.is_empty() {
            let v = if token.is_known_ident() {
                format!("{}{}", token.to_string(None), v)
            } else if let Some(TokenValue::Word(value)) = self.state.token_value.take() {
                format!("{value}{v}")
            } else {
                format!("{}{}", token.to_string(None), v)
            };
            self.atom(v)
        } else if token.is_known_ident() {
            self.atom(token.to_string(None))
        } else if let Some(TokenValue::Word(value)) = self.state.token_value.take() {
            value
        } else {
            self.atom(token.to_string(None))
        };
        self.state.set_token_value(TokenValue::Word(v));
        TokenAndSpan {
            token: Token::JSXName,
            had_line_break: self.had_line_break_before_last(),
            span: self.span(start),
        }
    }

    fn scan_jsx_attribute_value(&mut self) -> Option<TokenAndSpan> {
        let Some(cur) = self.cur() else {
            return self.next();
        };
        let start = self.cur_pos();

        match cur {
            '\'' | '"' => {
                let token = self.read_jsx_str(cur).ok()?;
                debug_assert!(self
                    .get_token_value()
                    .is_some_and(|t| matches!(t, TokenValue::Str { .. })));
                debug_assert!(token == Token::Str);
                Some(TokenAndSpan {
                    token,
                    had_line_break: self.had_line_break_before_last(),
                    span: self.span(start),
                })
            }
            _ => self.next(),
        }
    }

    fn rescan_template_token(
        &mut self,
        start: BytePos,
        start_with_back_tick: bool,
    ) -> Option<TokenAndSpan> {
        unsafe { self.input.reset_to(start) };
        let res = self
            .scan_template_token(start, start_with_back_tick)
            .map(Some);
        let token = match res
            .map_err(|e| {
                self.state.set_token_value(TokenValue::Error(e));
                Token::Error
            })
            .map_err(Some)
        {
            Ok(t) => t,
            Err(e) => e,
        };
        let span = if start_with_back_tick {
            self.span(start)
        } else {
            // `+ BytePos(1)` is used to skip `{`
            self.span(start + BytePos(1))
        };
        if let Some(token) = token {
            if let Some(comments) = self.comments_buffer.as_mut() {
                for comment in comments.take_pending_leading() {
                    comments.push(BufferedComment {
                        kind: BufferedCommentKind::Leading,
                        pos: start,
                        comment,
                    });
                }
            }

            self.state.set_token_type(token);
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

        self.skip_space::<true>();
        *start = self.input.cur_pos();

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
        debug_assert!(self.syntax.jsx());

        if self.input_mut().as_str().is_empty() {
            return Ok(None);
        };

        if self.input.eat_byte(b'<') {
            return Ok(Some(if self.input.eat_byte(b'/') {
                Token::LessSlash
            } else {
                Token::Lt
            }));
        } else if self.input.eat_byte(b'{') {
            return Ok(Some(Token::LBrace));
        }

        let start = self.input.cur_pos();
        let mut first_non_whitespace = 0;
        let mut chunk_start = start;
        let mut value = String::new();

        while let Some(ch) = self.input_mut().cur() {
            if ch == '{' {
                break;
            } else if ch == '<' {
                // TODO: check git conflict mark
                break;
            }

            if ch == '>' {
                self.emit_error(
                    self.input().cur_pos(),
                    SyntaxError::UnexpectedTokenWithSuggestions {
                        candidate_list: vec!["`{'>'}`", "`&gt;`"],
                    },
                );
            } else if ch == '}' {
                self.emit_error(
                    self.input().cur_pos(),
                    SyntaxError::UnexpectedTokenWithSuggestions {
                        candidate_list: vec!["`{'}'}`", "`&rbrace;`"],
                    },
                );
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

            if ch == '&' {
                let cur_pos = self.input().cur_pos();

                let s = unsafe {
                    // Safety: We already checked for the range
                    self.input_slice(chunk_start, cur_pos)
                };
                value.push_str(s);

                if let Ok(jsx_entity) = self.read_jsx_entity() {
                    value.push(jsx_entity.0);

                    chunk_start = self.input.cur_pos();
                }
            } else {
                self.bump();
            }
        }

        let end = self.input().cur_pos();
        let raw = unsafe {
            // Safety: Both of `start` and `end` are generated from `cur_pos()`
            self.input_slice(start, end)
        };
        let value = if value.is_empty() {
            self.atom(raw)
        } else {
            let s = unsafe {
                // Safety: We already checked for the range
                self.input_slice(chunk_start, end)
            };
            value.push_str(s);
            self.atom(value)
        };

        let raw: swc_atoms::Atom = self.atom(raw);

        self.state.set_token_value(TokenValue::Str { raw, value });

        self.state.start = start;

        Ok(Some(Token::JSXText))
    }

    fn scan_jsx_attrs_terminal_token(&mut self) -> LexResult<Option<Token>> {
        if self.input_mut().as_str().is_empty() {
            Ok(None)
        } else if self.input.eat_byte(b'>') {
            Ok(Some(Token::Gt))
        } else if self.input.eat_byte(b'/') {
            Ok(Some(Token::Slash))
        } else {
            self.read_token()
        }
    }

    fn scan_identifier_parts(&mut self) -> String {
        let mut v = String::with_capacity(16);
        while let Some(ch) = self.input().cur() {
            if ch.is_ident_part() {
                v.push(ch);
                self.input_mut().bump_bytes(ch.len_utf8());
            } else if ch == '\\' {
                self.bump(); // bump '\'
                if !self.is(b'u') {
                    self.emit_error(self.cur_pos(), SyntaxError::InvalidUnicodeEscape);
                    continue;
                }
                self.bump(); // bump 'u'
                let Ok(chars) = self.read_unicode_escape() else {
                    self.emit_error(self.cur_pos(), SyntaxError::InvalidUnicodeEscape);
                    break;
                };
                for c in chars {
                    v.extend(c);
                }
                self.token_flags |= swc_ecma_lexer::lexer::TokenFlags::UNICODE;
            } else {
                break;
            }
        }
        v
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
        if let Some(token) = token {
            if let Some(comments) = self.comments_buffer.as_mut() {
                for comment in comments.take_pending_leading() {
                    comments.push(BufferedComment {
                        kind: BufferedCommentKind::Leading,
                        pos: start,
                        comment,
                    });
                }
            }

            self.state.set_token_type(token);
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
    pub fn new(start_pos: BytePos) -> Self {
        State {
            had_line_break: false,
            had_line_break_before_last: false,
            is_first: true,
            next_regexp: None,
            start: BytePos(0),
            prev_hi: start_pos,
            token_value: None,
            token_type: None,
        }
    }

    pub(crate) fn set_token_value(&mut self, token_value: TokenValue) {
        self.token_value = Some(token_value);
    }
}

impl swc_ecma_lexer::common::lexer::state::State for State {
    type TokenKind = Token;
    type TokenType = Token;

    #[inline(always)]
    fn is_expr_allowed(&self) -> bool {
        unreachable!("is_expr_allowed should not be called in Parser/State")
    }

    #[inline(always)]
    fn set_is_expr_allowed(&mut self, _: bool) {
        // noop
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
    fn syntax(&self) -> swc_ecma_lexer::Syntax {
        unreachable!("syntax is not stored in State, but in Lexer")
    }

    #[inline(always)]
    fn prev_hi(&self) -> BytePos {
        self.prev_hi
    }

    #[inline(always)]
    fn start(&self) -> BytePos {
        self.start
    }
}
