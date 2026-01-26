use std::{cell::RefCell, mem, mem::take, rc::Rc};

use lexer::TokenContexts;
use swc_common::{BytePos, Span};
use swc_ecma_ast::EsVersion;

use crate::{
    common::{
        input::Tokens,
        lexer::token::TokenFactory,
        parser::token_and_span::TokenAndSpan as TokenAndSpanTrait,
        syntax::{Syntax, SyntaxFlags},
    },
    error::Error,
    lexer::{self},
    token::*,
    Context,
};

#[derive(Clone)]
pub struct TokensInput {
    iter: <Vec<TokenAndSpan> as IntoIterator>::IntoIter,
    ctx: Context,
    syntax: SyntaxFlags,
    start_pos: BytePos,
    target: EsVersion,
    token_ctx: TokenContexts,
    errors: Rc<RefCell<Vec<Error>>>,
    module_errors: Rc<RefCell<Vec<Error>>>,
}

impl TokensInput {
    pub fn new(tokens: Vec<TokenAndSpan>, ctx: Context, syntax: Syntax, target: EsVersion) -> Self {
        let start_pos = tokens.first().map(|t| t.span.lo).unwrap_or(BytePos(0));

        TokensInput {
            iter: tokens.into_iter(),
            ctx,
            syntax: syntax.into_flags(),
            start_pos,
            target,
            token_ctx: Default::default(),
            errors: Default::default(),
            module_errors: Default::default(),
        }
    }
}

impl Iterator for TokensInput {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next()
    }
}

impl Tokens<TokenAndSpan> for TokensInput {
    type Checkpoint = Self;

    fn checkpoint_save(&self) -> Self::Checkpoint {
        self.clone()
    }

    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint) {
        *self = checkpoint;
    }

    fn set_ctx(&mut self, ctx: Context) {
        if ctx.contains(Context::Module) && !self.module_errors.borrow().is_empty() {
            let mut module_errors = self.module_errors.borrow_mut();
            self.errors.borrow_mut().append(&mut *module_errors);
        }
        self.ctx = ctx;
    }

    fn ctx_mut(&mut self) -> &mut Context {
        &mut self.ctx
    }

    #[inline(always)]
    fn ctx(&self) -> Context {
        self.ctx
    }

    #[inline(always)]
    fn syntax(&self) -> SyntaxFlags {
        self.syntax
    }

    #[inline(always)]
    fn target(&self) -> EsVersion {
        self.target
    }

    #[inline(always)]
    fn start_pos(&self) -> BytePos {
        self.start_pos
    }

    #[inline(always)]
    fn set_expr_allowed(&mut self, _: bool) {}

    #[inline(always)]
    fn set_next_regexp(&mut self, _: Option<BytePos>) {}

    #[inline(always)]
    fn token_context(&self) -> &TokenContexts {
        &self.token_ctx
    }

    #[inline(always)]
    fn token_context_mut(&mut self) -> &mut TokenContexts {
        &mut self.token_ctx
    }

    #[inline(always)]
    fn set_token_context(&mut self, c: TokenContexts) {
        self.token_ctx = c;
    }

    #[inline(always)]
    fn add_error(&mut self, error: Error) {
        self.errors.borrow_mut().push(error);
    }

    #[inline(always)]
    fn add_module_mode_error(&mut self, error: Error) {
        if self.ctx.contains(Context::Module) {
            self.add_error(error);
            return;
        }
        self.module_errors.borrow_mut().push(error);
    }

    #[inline(always)]
    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors.borrow_mut())
    }

    #[inline(always)]
    fn take_script_module_errors(&mut self) -> Vec<Error> {
        take(&mut self.module_errors.borrow_mut())
    }

    fn end_pos(&self) -> BytePos {
        self.iter
            .as_slice()
            .last()
            .map(|t| t.span.hi)
            .unwrap_or(self.start_pos)
    }

    #[inline]
    fn update_token_flags(&mut self, _: impl FnOnce(&mut lexer::TokenFlags)) {
        // TODO: Implement this method if needed.
    }

    fn token_flags(&self) -> lexer::TokenFlags {
        Default::default()
    }
}

/// Note: Lexer need access to parser's context to lex correctly.
#[derive(Debug)]
pub struct Capturing<I: Tokens<TokenAndSpan>> {
    inner: I,
    captured: Rc<RefCell<Vec<TokenAndSpan>>>,
}

impl<I: Tokens<TokenAndSpan>> Clone for Capturing<I> {
    fn clone(&self) -> Self {
        Capturing {
            inner: self.inner.clone(),
            captured: self.captured.clone(),
        }
    }
}

impl<I: Tokens<TokenAndSpan>> Capturing<I> {
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

impl<I: Tokens<TokenAndSpan>> Iterator for Capturing<I> {
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

                v.push(ts.clone());

                Some(ts)
            }
            None => None,
        }
    }
}

impl<I: Tokens<TokenAndSpan>> Tokens<TokenAndSpan> for Capturing<I> {
    type Checkpoint = I::Checkpoint;

    fn checkpoint_save(&self) -> Self::Checkpoint {
        self.inner.checkpoint_save()
    }

    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint) {
        self.inner.checkpoint_load(checkpoint);
    }

    #[inline(always)]
    fn set_ctx(&mut self, ctx: Context) {
        self.inner.set_ctx(ctx)
    }

    fn ctx_mut(&mut self) -> &mut Context {
        self.inner.ctx_mut()
    }

    #[inline(always)]
    fn ctx(&self) -> Context {
        self.inner.ctx()
    }

    #[inline(always)]
    fn syntax(&self) -> SyntaxFlags {
        self.inner.syntax()
    }

    #[inline(always)]
    fn target(&self) -> EsVersion {
        self.inner.target()
    }

    #[inline(always)]
    fn start_pos(&self) -> BytePos {
        self.inner.start_pos()
    }

    #[inline(always)]
    fn set_expr_allowed(&mut self, allow: bool) {
        self.inner.set_expr_allowed(allow)
    }

    #[inline(always)]
    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.inner.set_next_regexp(start);
    }

    #[inline(always)]
    fn token_context(&self) -> &TokenContexts {
        self.inner.token_context()
    }

    #[inline(always)]
    fn token_context_mut(&mut self) -> &mut TokenContexts {
        self.inner.token_context_mut()
    }

    #[inline(always)]
    fn set_token_context(&mut self, c: TokenContexts) {
        self.inner.set_token_context(c)
    }

    #[inline(always)]
    fn add_error(&mut self, error: Error) {
        self.inner.add_error(error);
    }

    #[inline(always)]
    fn add_module_mode_error(&mut self, error: Error) {
        self.inner.add_module_mode_error(error)
    }

    #[inline(always)]
    fn take_errors(&mut self) -> Vec<Error> {
        self.inner.take_errors()
    }

    fn take_script_module_errors(&mut self) -> Vec<Error> {
        self.inner.take_script_module_errors()
    }

    fn end_pos(&self) -> BytePos {
        self.inner.end_pos()
    }

    #[inline]
    fn update_token_flags(&mut self, _: impl FnOnce(&mut lexer::TokenFlags)) {
        // TODO: Implement this method if needed.
    }

    fn token_flags(&self) -> lexer::TokenFlags {
        Default::default()
    }
}

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub struct Buffer<I: Tokens<TokenAndSpan>> {
    pub iter: I,
    /// Span of the previous token.
    pub prev_span: Span,
    pub cur: TokenAndSpan,
    /// Peeked token
    pub next: Option<TokenAndSpan>,
}

impl<I: Tokens<TokenAndSpan>> Buffer<I> {
    fn bump(&mut self) -> Token {
        let next = if let Some(next) = self.next.take() {
            next
        } else if let Some(next) = self.iter.next() {
            next
        } else {
            TokenAndSpan::new(Token::Eof, self.prev_span, true)
        };
        let prev = mem::replace(&mut self.cur, next);
        self.prev_span = prev.span();
        prev.token
    }
}

impl<'a, I: Tokens<TokenAndSpan>> crate::common::parser::buffer::Buffer<'a> for Buffer<I> {
    type I = I;
    type Next = TokenAndSpan;
    type Token = Token;
    type TokenAndSpan = TokenAndSpan;

    fn new(lexer: I) -> Self {
        let start_pos = lexer.start_pos();
        let prev_span = Span::new_with_checked(start_pos, start_pos);
        Buffer {
            iter: lexer,
            cur: TokenAndSpan::new(Token::Eof, prev_span, false),
            prev_span,
            next: None,
        }
    }

    #[inline(always)]
    fn set_cur(&mut self, token: TokenAndSpan) {
        self.cur = token;
    }

    #[inline(always)]
    fn next(&self) -> Option<&TokenAndSpan> {
        self.next.as_ref()
    }

    #[inline(always)]
    fn set_next(&mut self, token: Option<TokenAndSpan>) {
        self.next = token;
    }

    #[inline(always)]
    fn next_mut(&mut self) -> &mut Option<TokenAndSpan> {
        &mut self.next
    }

    #[inline]
    fn cur(&self) -> &Token {
        &self.cur.token
    }

    fn peek<'b>(&'b mut self) -> Option<&'b Token>
    where
        TokenAndSpan: 'b,
    {
        debug_assert!(
            self.cur() != &Token::Eof,
            "parser should not call peek() without knowing current token"
        );

        if self.next().is_none() {
            let next = self.iter.next();
            self.set_next(next);
        }

        self.next().map(|ts| &ts.token)
    }

    #[inline(always)]
    fn get_cur(&self) -> &TokenAndSpan {
        &self.cur
    }

    #[inline(always)]
    fn prev_span(&self) -> Span {
        self.prev_span
    }

    #[inline(always)]
    fn iter(&self) -> &I {
        &self.iter
    }

    #[inline(always)]
    fn iter_mut(&mut self) -> &mut I {
        &mut self.iter
    }

    fn bump(&mut self) {
        let _ = Buffer::bump(self);
    }

    fn expect_word_token_and_bump(&mut self) -> swc_atoms::Atom {
        let t = self.bump();
        t.take_word(self).unwrap()
    }

    fn expect_jsx_name_token_and_bump(&mut self) -> swc_atoms::Atom {
        let t = self.bump();
        t.take_jsx_name(self)
    }

    fn expect_jsx_text_token_and_bump(&mut self) -> (swc_atoms::Atom, swc_atoms::Atom) {
        let t = self.bump();
        t.take_jsx_text(self)
    }

    fn expect_number_token_and_bump(&mut self) -> (f64, swc_atoms::Atom) {
        let t = self.bump();
        t.take_num(self)
    }

    fn expect_string_token_and_bump(&mut self) -> (swc_atoms::Wtf8Atom, swc_atoms::Atom) {
        let t = self.bump();
        t.take_str(self)
    }

    fn expect_bigint_token_and_bump(&mut self) -> (Box<num_bigint::BigInt>, swc_atoms::Atom) {
        let t = self.bump();
        t.take_bigint(self)
    }

    fn expect_regex_token_and_bump(&mut self) -> (swc_atoms::Atom, swc_atoms::Atom) {
        let t = self.bump();
        t.take_regexp(self)
    }

    fn expect_template_token_and_bump(
        &mut self,
    ) -> (
        crate::common::lexer::LexResult<swc_atoms::Wtf8Atom>,
        swc_atoms::Atom,
    ) {
        let t = self.bump();
        t.take_template(self)
    }

    fn expect_error_token_and_bump(&mut self) -> crate::error::Error {
        let t = self.bump();
        t.take_error(self)
    }

    fn expect_shebang_token_and_bump(&mut self) -> swc_atoms::Atom {
        let t = self.bump();
        t.take_shebang(self)
    }

    #[cold]
    #[inline(never)]
    fn dump_cur(&self) -> String {
        let cur = self.cur();
        format!("{cur:?}")
    }
}
