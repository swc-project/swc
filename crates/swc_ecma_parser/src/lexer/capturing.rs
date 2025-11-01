use std::mem;

use swc_atoms::Atom;
use swc_common::BytePos;

use crate::{
    error::Error,
    input::Tokens,
    lexer::{token::TokenAndSpan, TokenFlags},
    syntax::SyntaxFlags,
    Context,
};

#[derive(Debug)]
pub struct Capturing<I> {
    inner: I,
    captured: Vec<TokenAndSpan>,
}

pub struct CapturingCheckpoint<I: Tokens> {
    pos: usize,
    inner: I::Checkpoint,
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

    pub fn tokens(&self) -> &[TokenAndSpan] {
        &self.captured
    }

    /// Take captured tokens
    pub fn take(&mut self) -> Vec<TokenAndSpan> {
        mem::take(&mut self.captured)
    }

    fn capture(&mut self, ts: TokenAndSpan) {
        let v = &mut self.captured;

        // remove tokens that could change due to backtracing
        while let Some(last) = v.last() {
            if last.span.lo >= ts.span.lo {
                v.pop();
            } else {
                break;
            }
        }

        v.push(ts);
    }
}

impl<I: Iterator<Item = TokenAndSpan>> Iterator for Capturing<I> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let next = self.inner.next();

        match next {
            Some(ts) => {
                self.capture(ts);
                Some(ts)
            }
            None => None,
        }
    }
}

impl<I: Tokens> Tokens for Capturing<I> {
    type Checkpoint = CapturingCheckpoint<I>;

    fn checkpoint_save(&self) -> Self::Checkpoint {
        Self::Checkpoint {
            pos: self.captured.len(),
            inner: self.inner.checkpoint_save(),
        }
    }

    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint) {
        self.captured.truncate(checkpoint.pos);
        self.inner.checkpoint_load(checkpoint.inner);
    }

    fn set_ctx(&mut self, ctx: Context) {
        self.inner.set_ctx(ctx);
    }

    fn ctx(&self) -> Context {
        self.inner.ctx()
    }

    fn ctx_mut(&mut self) -> &mut Context {
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

    fn add_error(&mut self, error: Error) {
        self.inner.add_error(error);
    }

    fn add_module_mode_error(&mut self, error: Error) {
        self.inner.add_module_mode_error(error);
    }

    fn end_pos(&self) -> swc_common::BytePos {
        self.inner.end_pos()
    }

    fn take_errors(&mut self) -> Vec<Error> {
        self.inner.take_errors()
    }

    fn take_script_module_errors(&mut self) -> Vec<Error> {
        self.inner.take_script_module_errors()
    }

    fn update_token_flags(&mut self, f: impl FnOnce(&mut TokenFlags)) {
        self.inner.update_token_flags(f);
    }

    fn token_flags(&self) -> TokenFlags {
        self.inner.token_flags()
    }

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

    fn scan_regex(&mut self, start: BytePos) -> (TokenAndSpan, Option<(Atom, Atom)>) {
        let result = self.inner.scan_regex(start);
        self.capture(result.0);
        result
    }

    fn scan_jsx_token(&mut self, allow_multiline_jsx_text: bool) -> TokenAndSpan {
        self.inner.scan_jsx_token(allow_multiline_jsx_text)
    }

    fn scan_jsx_open_el_terminal_token(&mut self) -> TokenAndSpan {
        self.inner.scan_jsx_open_el_terminal_token()
    }

    fn rescan_jsx_open_el_terminal_token(&mut self, reset: swc_common::BytePos) -> TokenAndSpan {
        let ts = self.inner.rescan_jsx_open_el_terminal_token(reset);
        self.capture(ts);
        ts
    }

    fn rescan_jsx_token(
        &mut self,
        allow_multiline_jsx_text: bool,
        reset: swc_common::BytePos,
    ) -> TokenAndSpan {
        let ts = self.inner.rescan_jsx_token(allow_multiline_jsx_text, reset);
        self.capture(ts);
        ts
    }

    fn scan_jsx_identifier(&mut self, start: swc_common::BytePos) -> TokenAndSpan {
        let ts = self.inner.scan_jsx_identifier(start);
        self.capture(ts);
        ts
    }

    fn scan_jsx_attribute_value(&mut self) -> TokenAndSpan {
        let ts = self.inner.scan_jsx_attribute_value();
        self.capture(ts);
        ts
    }

    fn rescan_template_token(
        &mut self,
        start: swc_common::BytePos,
        start_with_back_tick: bool,
    ) -> TokenAndSpan {
        let ts = self
            .inner
            .rescan_template_token(start, start_with_back_tick);
        self.capture(ts);
        ts
    }
}
