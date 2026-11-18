//! Verifies that a crate outside of `swc_ecma_parser` can implement
//! [`Tokens`], which requires the `unstable` module to export every type used
//! in the trait signature (e.g. `TokenFlags`).
#![cfg(feature = "unstable")]

use swc_common::{input::StringInput, BytePos, Span};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{
    error::Error,
    input::Tokens,
    lexer::Lexer,
    unstable::{TokenAndSpan, TokenFlags, TokenValue},
    Context, Parser, Syntax, SyntaxFlags,
};

/// A token source which counts the tokens produced by the wrapped [`Lexer`]
/// and forwards everything else, including the token flags.
#[derive(Clone)]
struct CountingTokens<'a> {
    inner: Lexer<'a>,
    count: usize,
}

impl<'a> Tokens for CountingTokens<'a> {
    type Checkpoint = <Lexer<'a> as Tokens>::Checkpoint;

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

    fn target(&self) -> EsVersion {
        self.inner.target()
    }

    fn checkpoint_save(&self) -> Self::Checkpoint {
        self.inner.checkpoint_save()
    }

    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint) {
        self.inner.checkpoint_load(checkpoint);
    }

    fn read_string(&self, span: Span) -> &str {
        self.inner.read_string(span)
    }

    fn start_pos(&self) -> BytePos {
        self.inner.start_pos()
    }

    fn set_expr_allowed(&mut self, allow: bool) {
        self.inner.set_expr_allowed(allow);
    }

    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.inner.set_next_regexp(start);
    }

    fn add_error(&mut self, error: Error) {
        self.inner.add_error(error);
    }

    fn add_module_mode_error(&mut self, error: Error) {
        self.inner.add_module_mode_error(error);
    }

    fn end_pos(&self) -> BytePos {
        self.inner.end_pos()
    }

    fn take_errors(&mut self) -> Vec<Error> {
        self.inner.take_errors()
    }

    fn has_errors(&self) -> bool {
        self.inner.has_errors()
    }

    fn diagnostic_checkpoint_save(&self) -> (usize, usize) {
        self.inner.diagnostic_checkpoint_save()
    }

    fn diagnostic_checkpoint_load(&mut self, checkpoint: (usize, usize)) {
        self.inner.diagnostic_checkpoint_load(checkpoint);
    }

    fn take_script_module_errors(&mut self) -> Vec<Error> {
        self.inner.take_script_module_errors()
    }

    fn set_defer_comments(&mut self, defer: bool) {
        self.inner.set_defer_comments(defer);
    }

    fn finalize_comments(&mut self) {
        self.inner.finalize_comments();
    }

    fn update_token_flags(&mut self, f: impl FnOnce(&mut TokenFlags)) {
        self.inner.update_token_flags(f);
    }

    fn token_flags(&self) -> TokenFlags {
        self.inner.token_flags()
    }

    fn clone_token_value(&self) -> Option<TokenValue> {
        self.inner.clone_token_value()
    }

    fn take_token_value(&mut self) -> Option<TokenValue> {
        self.inner.take_token_value()
    }

    fn get_token_value(&self) -> Option<&TokenValue> {
        self.inner.get_token_value()
    }

    fn set_token_value(&mut self, token_value: Option<TokenValue>) {
        self.inner.set_token_value(token_value);
    }

    fn first_token(&mut self) -> TokenAndSpan {
        self.count += 1;
        self.inner.first_token()
    }

    fn next_token(&mut self) -> TokenAndSpan {
        self.count += 1;
        self.inner.next_token()
    }

    fn scan_jsx_token(&mut self) -> TokenAndSpan {
        self.inner.scan_jsx_token()
    }

    fn scan_jsx_open_el_terminal_token(&mut self) -> TokenAndSpan {
        self.inner.scan_jsx_open_el_terminal_token()
    }

    fn rescan_jsx_open_el_terminal_token(&mut self, reset: BytePos) -> TokenAndSpan {
        self.inner.rescan_jsx_open_el_terminal_token(reset)
    }

    fn rescan_jsx_token(&mut self, reset: BytePos) -> TokenAndSpan {
        self.inner.rescan_jsx_token(reset)
    }

    fn rescan_type_gt(&mut self, span: Span) -> TokenAndSpan {
        self.inner.rescan_type_gt(span)
    }

    fn scan_jsx_identifier(&mut self, start: BytePos) -> TokenAndSpan {
        self.inner.scan_jsx_identifier(start)
    }

    fn scan_jsx_attribute_value(&mut self) -> TokenAndSpan {
        self.inner.scan_jsx_attribute_value()
    }

    fn rescan_template_token(
        &mut self,
        start: BytePos,
        start_with_back_tick: bool,
    ) -> TokenAndSpan {
        self.inner
            .rescan_template_token(start, start_with_back_tick)
    }
}

#[test]
fn token_flags_are_exported() {
    let flags = TokenFlags::UNICODE;
    assert!(flags.contains(TokenFlags::UNICODE));
    assert!(!TokenFlags::empty().contains(TokenFlags::UNICODE));
}

#[test]
fn parser_accepts_external_tokens_impl() {
    let lexer = Lexer::new(
        Syntax::default(),
        EsVersion::latest(),
        StringInput::new("const a = 1;", BytePos(0), BytePos(12)),
        None,
    );
    let tokens = CountingTokens {
        inner: lexer,
        count: 0,
    };

    let mut parser = Parser::new_from(tokens);
    parser.parse_module().expect("failed to parse module");
    assert!(parser.take_errors().is_empty());
}
