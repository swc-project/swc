use std::{cell::RefCell, mem, rc::Rc};

use swc_ecma_lexer::common::syntax::SyntaxFlags;

use crate::{input::Tokens, lexer::token::TokenAndSpan};

#[derive(Debug)]
pub struct Capturing<I> {
    inner: I,
    captured: Rc<RefCell<Vec<TokenAndSpan>>>,
}

impl<I: Clone> Clone for Capturing<I> {
    fn clone(&self) -> Self {
        Capturing {
            inner: self.inner.clone(),
            captured: self.captured.clone(),
        }
    }
}

impl<I> Capturing<I> {
    pub fn new(input: I) -> Self {
        Capturing {
            inner: input,
            captured: Default::default(),
        }
    }

    pub fn tokens(&self) -> Rc<RefCell<Vec<TokenAndSpan>>> {
        self.captured.clone()
    }

    /// Take captured tokens
    pub fn take(&mut self) -> Vec<TokenAndSpan> {
        mem::take(&mut *self.captured.borrow_mut())
    }
}

impl<I: Iterator<Item = TokenAndSpan>> Iterator for Capturing<I> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let next = self.inner.next();

        match next {
            Some(ts) => {
                let mut v = self.captured.borrow_mut();

                // remove tokens that could change due to backtracing
                while let Some(last) = v.last() {
                    if last.span.lo >= ts.span.lo {
                        v.pop();
                    } else {
                        break;
                    }
                }

                v.push(ts);

                Some(ts)
            }
            None => None,
        }
    }
}

impl<I: swc_ecma_lexer::common::input::Tokens<TokenAndSpan>>
    swc_ecma_lexer::common::input::Tokens<TokenAndSpan> for Capturing<I>
{
    fn set_ctx(&mut self, ctx: swc_ecma_lexer::common::context::Context) {
        self.inner.set_ctx(ctx);
    }

    fn ctx(&self) -> swc_ecma_lexer::common::context::Context {
        self.inner.ctx()
    }

    fn ctx_mut(&mut self) -> &mut swc_ecma_lexer::common::context::Context {
        self.inner.ctx_mut()
    }

    fn syntax(&self) -> SyntaxFlags {
        self.inner.syntax()
    }

    fn target(&self) -> swc_ecma_ast::EsVersion {
        self.inner.target()
    }

    fn set_expr_allowed(&mut self, allow: bool) {
        self.inner.set_expr_allowed(allow);
    }

    fn set_next_regexp(&mut self, start: Option<swc_common::BytePos>) {
        self.inner.set_next_regexp(start);
    }

    fn token_context(&self) -> &swc_ecma_lexer::lexer::TokenContexts {
        self.inner.token_context()
    }

    fn token_context_mut(&mut self) -> &mut swc_ecma_lexer::lexer::TokenContexts {
        self.inner.token_context_mut()
    }

    fn set_token_context(&mut self, c: swc_ecma_lexer::lexer::TokenContexts) {
        self.inner.set_token_context(c);
    }

    fn add_error(&self, error: swc_ecma_lexer::error::Error) {
        self.inner.add_error(error);
    }

    fn add_module_mode_error(&self, error: swc_ecma_lexer::error::Error) {
        self.inner.add_module_mode_error(error);
    }

    fn end_pos(&self) -> swc_common::BytePos {
        self.inner.end_pos()
    }

    fn take_errors(&mut self) -> Vec<swc_ecma_lexer::error::Error> {
        self.inner.take_errors()
    }

    fn take_script_module_errors(&mut self) -> Vec<swc_ecma_lexer::error::Error> {
        self.inner.take_script_module_errors()
    }

    fn update_token_flags(&mut self, f: impl FnOnce(&mut swc_ecma_lexer::lexer::TokenFlags)) {
        self.inner.update_token_flags(f);
    }

    fn token_flags(&self) -> swc_ecma_lexer::lexer::TokenFlags {
        self.inner.token_flags()
    }
}

impl<I: Tokens> Tokens for Capturing<I> {
    fn clone_token_value(&self) -> Option<super::TokenValue> {
        self.inner.clone_token_value()
    }

    fn take_token_value(&mut self) -> Option<super::TokenValue> {
        self.inner.take_token_value()
    }

    fn get_token_value(&self) -> Option<&super::TokenValue> {
        self.inner.get_token_value()
    }

    fn set_token_value(&mut self, token_value: Option<super::TokenValue>) {
        self.inner.set_token_value(token_value);
    }

    fn scan_jsx_token(&mut self, allow_multiline_jsx_text: bool) -> Option<TokenAndSpan> {
        self.inner.scan_jsx_token(allow_multiline_jsx_text)
    }

    fn scan_jsx_open_el_terminal_token(&mut self) -> Option<TokenAndSpan> {
        self.inner.scan_jsx_open_el_terminal_token()
    }

    fn rescan_jsx_open_el_terminal_token(
        &mut self,
        reset: swc_common::BytePos,
    ) -> Option<TokenAndSpan> {
        self.inner.rescan_jsx_open_el_terminal_token(reset)
    }

    fn rescan_jsx_token(
        &mut self,
        allow_multiline_jsx_text: bool,
        reset: swc_common::BytePos,
    ) -> Option<TokenAndSpan> {
        self.inner.rescan_jsx_token(allow_multiline_jsx_text, reset)
    }

    fn scan_jsx_identifier(&mut self, start: swc_common::BytePos) -> TokenAndSpan {
        self.inner.scan_jsx_identifier(start)
    }

    fn scan_jsx_attribute_value(&mut self) -> Option<TokenAndSpan> {
        self.inner.scan_jsx_attribute_value()
    }

    fn rescan_template_token(
        &mut self,
        start: swc_common::BytePos,
        start_with_back_tick: bool,
    ) -> Option<TokenAndSpan> {
        self.inner
            .rescan_template_token(start, start_with_back_tick)
    }
}
