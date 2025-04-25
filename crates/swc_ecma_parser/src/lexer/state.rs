use std::mem::take;

use smallvec::smallvec;
use swc_common::{BytePos, Span};
use swc_ecma_ast::EsVersion;
use swc_ecma_lexer::{
    common::lexer::{
        char::CharExt,
        comments_buffer::{BufferedComment, BufferedCommentKind},
        state::State as StateTrait,
    },
    TokenContext, TokenContexts,
};

use super::{Context, Input, Lexer, LexerTrait};
use crate::{
    error::{Error, SyntaxError},
    lexer::token::{Token, TokenAndSpan, TokenValue},
    Syntax,
};

/// State of lexer.
///
/// Ported from babylon.
#[derive(Clone)]
pub(super) struct State {
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

    context: TokenContexts,
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
        self.set_expr_allowed(allow)
    }

    #[inline]
    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.state.next_regexp = start;
    }

    #[inline]
    fn token_context(&self) -> &TokenContexts {
        &self.state.context
    }

    #[inline]
    fn token_context_mut(&mut self) -> &mut TokenContexts {
        &mut self.state.context
    }

    #[inline]
    fn set_token_context(&mut self, c: TokenContexts) {
        self.state.context = c;
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

impl crate::parser::input::Tokens for Lexer<'_> {
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
}

impl Lexer<'_> {
    /// Consume pending comments.
    ///
    /// This is called when the input is exhausted.
    #[cold]
    #[inline(never)]
    fn consume_pending_comments(&mut self) {
        if let Some(comments) = self.comments.as_mut() {
            let comments_buffer = self.comments_buffer.as_mut().unwrap();
            let last = self.state.prev_hi;

            // move the pending to the leading or trailing
            for c in comments_buffer.take_pending_leading() {
                // if the file had no tokens and no shebang, then treat any
                // comments in the leading comments buffer as leading.
                // Otherwise treat them as trailing.
                if last == self.start_pos {
                    comments_buffer.push(BufferedComment {
                        kind: BufferedCommentKind::Leading,
                        pos: last,
                        comment: c,
                    });
                } else {
                    comments_buffer.push(BufferedComment {
                        kind: BufferedCommentKind::Trailing,
                        pos: last,
                        comment: c,
                    });
                }
            }

            // now fill the user's passed in comments
            for comment in comments_buffer.take_comments() {
                match comment.kind {
                    BufferedCommentKind::Leading => {
                        comments.add_leading(comment.pos, comment.comment);
                    }
                    BufferedCommentKind::Trailing => {
                        comments.add_trailing(comment.pos, comment.comment);
                    }
                }
            }
        }
    }

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
        if self.state.can_skip_space() {
            self.skip_space::<true>();
            *start = self.input.cur_pos();
        };

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

        if self.syntax.jsx()
            && !self.ctx.contains(Context::InPropertyName)
            && !self.ctx.contains(Context::InType)
        {
            //jsx
            if self.state.context.current() == Some(TokenContext::JSXExpr) {
                return self.read_jsx_token();
            }

            let c = self.cur();
            if let Some(c) = c {
                if self.state.context.current() == Some(TokenContext::JSXOpeningTag)
                    || self.state.context.current() == Some(TokenContext::JSXClosingTag)
                {
                    if c.is_ident_start() {
                        return self.read_jsx_word().map(Some);
                    }

                    if c == '>' {
                        unsafe {
                            // Safety: cur() is Some('>')
                            self.input.bump();
                        }
                        return Ok(Some(Token::JSXTagEnd));
                    }

                    if (c == '\'' || c == '"')
                        && self.state.context.current() == Some(TokenContext::JSXOpeningTag)
                    {
                        return self.read_jsx_str(c).map(Some);
                    }
                }

                if c == '<' && self.state.is_expr_allowed && self.input.peek() != Some('!') {
                    let had_line_break_before_last = self.had_line_break_before_last();
                    let cur_pos = self.input.cur_pos();

                    unsafe {
                        // Safety: cur() is Some('<')
                        self.input.bump();
                    }

                    if had_line_break_before_last && self.is_str("<<<<<< ") {
                        let span = Span::new(cur_pos, cur_pos + BytePos(7));

                        self.emit_error_span(span, SyntaxError::TS1185);
                        self.skip_line_comment(6);
                        self.skip_space::<true>();
                        return self.read_token();
                    }

                    return Ok(Some(Token::JSXTagStart));
                }
            }
        }

        if let Some(TokenContext::Tpl {}) = self.state.context.current() {
            let start = self.state.tpl_start;
            return self.read_tmpl_token(start).map(Some);
        }

        self.read_token()
    }
}

impl Iterator for Lexer<'_> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let mut start = self.cur_pos();

        let res = self.next_token(&mut start);
        let res = match res {
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

            self.state.update(start, token);
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
        let context = TokenContexts(smallvec![TokenContext::BraceStmt]);

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
            context,
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

    fn is_expr_allowed(&self) -> bool {
        self.is_expr_allowed
    }

    fn set_expr_allowed(&mut self, allow: bool) {
        self.is_expr_allowed = allow;
    }

    fn had_line_break(&self) -> bool {
        self.had_line_break
    }

    fn had_line_break_before_last(&self) -> bool {
        self.had_line_break_before_last
    }

    fn token_contexts(&self) -> &swc_ecma_lexer::TokenContexts {
        &self.context
    }

    fn mut_token_contexts(&mut self) -> &mut swc_ecma_lexer::TokenContexts {
        &mut self.context
    }

    fn set_token_type(&mut self, token_type: Self::TokenType) {
        self.token_type = Some(token_type);
    }

    fn token_type(&self) -> Option<Self::TokenType> {
        self.token_type
    }

    fn set_tpl_start(&mut self, start: BytePos) {
        self.tpl_start = start;
    }

    fn syntax(&self) -> swc_ecma_lexer::Syntax {
        self.syntax
    }
}
