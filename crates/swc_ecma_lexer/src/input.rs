use std::{cell::RefCell, mem, mem::take, rc::Rc};

use lexer::TokenContexts;
use swc_common::{BytePos, Span};
use swc_ecma_ast::EsVersion;

use crate::{
    common::{input::Tokens, syntax::Syntax},
    error::Error,
    lexer::{self},
    token::*,
    Context,
};

#[derive(Clone)]
pub struct TokensInput {
    iter: <Vec<TokenAndSpan> as IntoIterator>::IntoIter,
    ctx: Context,
    syntax: Syntax,
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
            syntax,
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
    fn set_ctx(&mut self, ctx: Context) {
        if ctx.contains(Context::Module) && !self.module_errors.borrow().is_empty() {
            let mut module_errors = self.module_errors.borrow_mut();
            self.errors.borrow_mut().append(&mut *module_errors);
        }
        self.ctx = ctx;
    }

    fn ctx(&self) -> Context {
        self.ctx
    }

    fn syntax(&self) -> Syntax {
        self.syntax
    }

    fn target(&self) -> EsVersion {
        self.target
    }

    fn start_pos(&self) -> BytePos {
        self.start_pos
    }

    fn set_expr_allowed(&mut self, _: bool) {}

    fn set_next_regexp(&mut self, _: Option<BytePos>) {}

    fn token_context(&self) -> &TokenContexts {
        &self.token_ctx
    }

    fn token_context_mut(&mut self) -> &mut TokenContexts {
        &mut self.token_ctx
    }

    fn set_token_context(&mut self, c: TokenContexts) {
        self.token_ctx = c;
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
        self.iter
            .as_slice()
            .last()
            .map(|t| t.span.hi)
            .unwrap_or(self.start_pos)
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
    fn set_ctx(&mut self, ctx: Context) {
        self.inner.set_ctx(ctx)
    }

    fn ctx(&self) -> Context {
        self.inner.ctx()
    }

    fn syntax(&self) -> Syntax {
        self.inner.syntax()
    }

    fn target(&self) -> EsVersion {
        self.inner.target()
    }

    fn start_pos(&self) -> BytePos {
        self.inner.start_pos()
    }

    fn set_expr_allowed(&mut self, allow: bool) {
        self.inner.set_expr_allowed(allow)
    }

    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.inner.set_next_regexp(start);
    }

    fn token_context(&self) -> &TokenContexts {
        self.inner.token_context()
    }

    fn token_context_mut(&mut self) -> &mut TokenContexts {
        self.inner.token_context_mut()
    }

    fn set_token_context(&mut self, c: TokenContexts) {
        self.inner.set_token_context(c)
    }

    fn add_error(&self, error: Error) {
        self.inner.add_error(error);
    }

    fn add_module_mode_error(&self, error: Error) {
        self.inner.add_module_mode_error(error)
    }

    fn take_errors(&mut self) -> Vec<Error> {
        self.inner.take_errors()
    }

    fn take_script_module_errors(&mut self) -> Vec<Error> {
        self.inner.take_script_module_errors()
    }

    fn end_pos(&self) -> BytePos {
        self.inner.end_pos()
    }
}

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub struct Buffer<I: Tokens<TokenAndSpan>> {
    pub iter: I,
    /// Span of the previous token.
    pub prev_span: Span,
    pub cur: Option<TokenAndSpan>,
    /// Peeked token
    pub next: Option<TokenAndSpan>,
}

impl<'a, I: Tokens<TokenAndSpan>>
    crate::common::parser::buffer::Buffer<
        'a,
        super::Lexer<'a>,
        super::token::Token,
        TokenAndSpan,
        I,
    > for Buffer<I>
{
    type Next = TokenAndSpan;

    fn new(lexer: I) -> Self {
        let start_pos = lexer.start_pos();
        Buffer {
            iter: lexer,
            cur: None,
            prev_span: Span::new(start_pos, start_pos),
            next: None,
        }
    }

    #[inline(always)]
    fn set_cur(&mut self, token: TokenAndSpan) {
        self.cur = Some(token);
    }

    #[inline(always)]
    fn next(&self) -> Option<&TokenAndSpan> {
        self.next.as_ref()
    }

    #[cold]
    #[inline(never)]
    pub fn dump_cur(&mut self) -> String {
        match self.cur() {
            Some(v) => format!("{v:?}"),
            None => "<eof>".to_string(),
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
    fn cur(&mut self) -> Option<&Token> {
        if self.cur.is_none() {
            // If we have peeked a token, take it instead of calling lexer.next()
            self.cur = self.next.take().or_else(|| self.iter.next());
        }

        match &self.cur {
            Some(v) => Some(&v.token),
            None => None,
        }
    }

    fn peek<'b>(&'b mut self) -> Option<&'b Token>
    where
        TokenAndSpan: 'b,
    {
        debug_assert!(
            self.cur().is_some(),
            "parser should not call peek() without knowing current token"
        );

        if self.next().is_none() {
            let next = self.iter_mut().next();
            self.set_next(next);
        }

        self.next().map(|ts| &ts.token)
    }

    #[inline(always)]
    fn get_cur(&self) -> Option<&TokenAndSpan> {
        self.cur.as_ref()
    }

    #[inline(always)]
    fn get_cur_mut(&mut self) -> &mut Option<TokenAndSpan> {
        &mut self.cur
    }

    #[inline(always)]
    fn prev_span(&self) -> Span {
        self.prev_span
    }

    #[inline(always)]
    fn set_prev_span(&mut self, span: Span) {
        self.prev_span = span;
    }

    #[inline(always)]
    fn iter(&self) -> &I {
        &self.iter
    }

    #[inline(always)]
    fn iter_mut(&mut self) -> &mut I {
        &mut self.iter
    }
}
