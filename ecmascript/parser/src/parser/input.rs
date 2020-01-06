use super::Parser;
use crate::{
    lexer::{self},
    token::*,
    Context, JscTarget, Syntax,
};
use lexer::TokenContexts;
use std::{cell::RefCell, mem, rc::Rc};
use swc_common::{BytePos, Span, DUMMY_SP};

pub trait Tokens: Clone + Iterator<Item = TokenAndSpan> {
    fn set_ctx(&mut self, ctx: Context);
    fn ctx(&self) -> Context;
    fn syntax(&self) -> Syntax;
    fn target(&self) -> JscTarget;

    fn set_expr_allowed(&mut self, allow: bool);
    fn token_context(&self) -> &lexer::TokenContexts;
    fn token_context_mut(&mut self) -> &mut lexer::TokenContexts;
    fn set_token_context(&mut self, _c: lexer::TokenContexts);
}

#[derive(Clone)]
pub struct TokensInput {
    iter: <Vec<TokenAndSpan> as IntoIterator>::IntoIter,
    ctx: Context,
    syntax: Syntax,
    target: JscTarget,
    token_ctx: TokenContexts,
}

impl TokensInput {
    pub fn new(tokens: Vec<TokenAndSpan>, ctx: Context, syntax: Syntax, target: JscTarget) -> Self {
        TokensInput {
            iter: tokens.into_iter(),
            ctx,
            syntax,
            target,
            token_ctx: Default::default(),
        }
    }
}

impl Iterator for TokensInput {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        self.iter.next()
    }
}

impl Tokens for TokensInput {
    fn set_ctx(&mut self, ctx: Context) {
        self.ctx = ctx;
    }

    fn ctx(&self) -> Context {
        self.ctx
    }

    fn syntax(&self) -> Syntax {
        self.syntax
    }
    fn target(&self) -> JscTarget {
        self.target
    }

    fn set_expr_allowed(&mut self, _: bool) {}

    fn token_context(&self) -> &TokenContexts {
        &self.token_ctx
    }

    fn token_context_mut(&mut self) -> &mut TokenContexts {
        &mut self.token_ctx
    }

    fn set_token_context(&mut self, c: TokenContexts) {
        self.token_ctx = c;
    }
}

/// Note: Lexer need access to parser's context to lex correctly.
#[derive(Debug, Clone)]
pub struct Capturing<I: Tokens> {
    inner: I,
    captured: Rc<RefCell<Vec<TokenAndSpan>>>,
}

impl<I: Tokens> Capturing<I> {
    pub fn new(input: I) -> Self {
        Capturing {
            inner: input,
            captured: Default::default(),
        }
    }
    /// Take captured tokens
    pub fn take(&mut self) -> Vec<TokenAndSpan> {
        mem::replace(&mut *self.captured.borrow_mut(), Default::default())
    }
}

impl<I: Tokens> Iterator for Capturing<I> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let next = self.inner.next();

        self.captured.borrow_mut().extend(next.clone());
        next
    }
}

impl<I: Tokens> Tokens for Capturing<I> {
    fn set_ctx(&mut self, ctx: Context) {
        self.inner.set_ctx(ctx)
    }

    fn ctx(&self) -> Context {
        self.inner.ctx()
    }

    fn syntax(&self) -> Syntax {
        self.inner.syntax()
    }
    fn target(&self) -> JscTarget {
        self.inner.target()
    }

    fn set_expr_allowed(&mut self, allow: bool) {
        self.inner.set_expr_allowed(allow)
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
}

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub(super) struct Buffer<I: Tokens> {
    iter: I,
    /// Span of the previous token.
    prev_span: Span,
    cur: Option<TokenAndSpan>,
    /// Peeked token
    next: Option<TokenAndSpan>,
}

impl<I: Tokens> Parser<'_, I> {
    pub fn input(&mut self) -> &mut I {
        &mut self.input.iter
    }
}

impl<I: Tokens> Buffer<I> {
    pub fn new(lexer: I) -> Self {
        Buffer {
            iter: lexer,
            cur: None,
            prev_span: DUMMY_SP,
            next: None,
        }
    }

    pub fn store(&mut self, token: Token) {
        debug_assert!(self.next.is_none());
        debug_assert!(self.cur.is_none());
        let span = self.prev_span;

        self.cur = Some(TokenAndSpan {
            span,
            token,
            had_line_break: false,
        });
    }

    fn bump_inner(&mut self) -> Option<Token> {
        let prev = self.cur.take();
        self.prev_span = match prev {
            Some(TokenAndSpan { span, .. }) => span,
            _ => self.prev_span,
        };

        // If we have peeked a token, take it instead of calling lexer.next()
        self.cur = self.next.take().or_else(|| self.iter.next());

        prev.map(|it| it.token)
    }

    pub fn cur_debug(&self) -> Option<&Token> {
        self.cur.as_ref().map(|it| &it.token)
    }

    /// Returns current token.
    pub fn bump(&mut self) -> Token {
        let prev = match self.cur.take() {
            Some(t) => t,

            None => unreachable!(
                "Current token is `None`. Parser should not call bump()without knowing current \
                 token"
            ),
        };
        self.prev_span = prev.span;

        prev.token
    }

    pub fn knows_cur(&self) -> bool {
        self.cur.is_some()
    }

    pub fn peek(&mut self) -> Option<&Token> {
        debug_assert!(
            self.cur.is_some(),
            "parser should not call peek() without knowing current token"
        );

        if self.next.is_none() {
            self.next = self.iter.next();
        }

        self.next.as_ref().map(|ts| &ts.token)
    }

    /// Returns true on eof.
    pub fn had_line_break_before_cur(&mut self) -> bool {
        self.cur();

        self.cur
            .as_ref()
            .map(|it| it.had_line_break)
            .unwrap_or_else(|| true)
    }

    /// This returns true on eof.
    pub fn has_linebreak_between_cur_and_peeked(&mut self) -> bool {
        let _ = self.peek();
        self.next
            .as_ref()
            .map(|item| item.had_line_break)
            .unwrap_or({
                // return true on eof.
                true
            })
    }

    /// Get current token. Returns `None` only on eof.
    pub fn cur(&mut self) -> Option<&Token> {
        if self.cur.is_none() {
            self.bump_inner();
        }
        self.cur.as_ref().map(|item| &item.token)
    }

    pub fn is(&mut self, expected: &Token) -> bool {
        match self.cur() {
            Some(t) => *expected == *t,
            _ => false,
        }
    }

    pub fn peeked_is(&mut self, expected: &Token) -> bool {
        match self.peek() {
            Some(t) => *expected == *t,
            _ => false,
        }
    }

    pub fn eat(&mut self, expected: &Token) -> bool {
        let v = self.is(expected);
        if v {
            self.bump();
        }
        v
    }

    pub fn eat_keyword(&mut self, kwd: Keyword) -> bool {
        self.eat(&Word(Word::Keyword(kwd)))
    }

    /// Returns start of current token.
    pub fn cur_pos(&mut self) -> BytePos {
        let _ = self.cur();
        self.cur
            .as_ref()
            .map(|item| item.span.lo())
            .unwrap_or_else(|| {
                // eof
                self.last_pos()
            })
    }

    pub fn cur_span(&self) -> Span {
        self.cur
            .as_ref()
            .map(|item| item.span)
            .unwrap_or(self.prev_span)
    }

    /// Returns last byte position of previous token.
    pub fn last_pos(&self) -> BytePos {
        self.prev_span.hi()
    }

    /// Returns span of the previous token.
    pub fn prev_span(&self) -> Span {
        self.prev_span
    }

    pub(crate) fn get_ctx(&self) -> Context {
        self.iter.ctx()
    }

    pub(crate) fn set_ctx(&mut self, ctx: Context) {
        self.iter.set_ctx(ctx);
    }

    pub fn syntax(&self) -> Syntax {
        self.iter.syntax()
    }
    pub fn target(&self) -> JscTarget {
        self.iter.target()
    }

    pub(crate) fn set_expr_allowed(&mut self, allow: bool) {
        self.iter.set_expr_allowed(allow)
    }

    pub(crate) fn token_context(&self) -> &lexer::TokenContexts {
        self.iter.token_context()
    }
    pub(crate) fn token_context_mut(&mut self) -> &mut lexer::TokenContexts {
        self.iter.token_context_mut()
    }
    pub(crate) fn set_token_context(&mut self, c: lexer::TokenContexts) {
        self.iter.set_token_context(c)
    }
}
