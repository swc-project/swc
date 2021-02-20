use super::Parser;
use crate::{
    error::Error,
    lexer::{self},
    token::*,
    Context, JscTarget, Syntax,
};
use lexer::TokenContexts;
use std::{cell::RefCell, mem, mem::take, rc::Rc};
use swc_common::{BytePos, Span, DUMMY_SP};

/// Clone should be cheap if you are parsing typescript because typescript
/// syntax requires backtracking.
pub trait Tokens: Clone + Iterator<Item = TokenAndSpan> {
    fn set_ctx(&mut self, ctx: Context);
    fn ctx(&self) -> Context;
    fn syntax(&self) -> Syntax;
    fn target(&self) -> JscTarget;

    fn set_expr_allowed(&mut self, allow: bool);
    fn token_context(&self) -> &lexer::TokenContexts;
    fn token_context_mut(&mut self) -> &mut lexer::TokenContexts;
    fn set_token_context(&mut self, _c: lexer::TokenContexts);

    /// Implementors should use Rc<RefCell<Vec<Error>>>.
    ///
    /// It is required because parser should backtrack while parsing typescript
    /// code.
    fn add_error(&self, error: Error);

    /// Add an error which is valid syntax in script mode.
    ///
    /// This errors should be dropped if it's not a module.
    ///
    /// Implementor should check for if [Context].module, and buffer errors if
    /// module is false. Also, implementors should move errors to the error
    /// buffer on set_ctx if the parser mode become module mode.
    fn add_module_mode_error(&self, error: Error);

    fn take_errors(&mut self) -> Vec<Error>;
}

#[derive(Clone)]
pub struct TokensInput {
    iter: <Vec<TokenAndSpan> as IntoIterator>::IntoIter,
    ctx: Context,
    syntax: Syntax,
    target: JscTarget,
    token_ctx: TokenContexts,
    errors: Rc<RefCell<Vec<Error>>>,
    module_errors: Rc<RefCell<Vec<Error>>>,
}

impl TokensInput {
    pub fn new(tokens: Vec<TokenAndSpan>, ctx: Context, syntax: Syntax, target: JscTarget) -> Self {
        TokensInput {
            iter: tokens.into_iter(),
            ctx,
            syntax,
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

impl Tokens for TokensInput {
    fn set_ctx(&mut self, ctx: Context) {
        if ctx.module && !self.module_errors.borrow().is_empty() {
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

    fn add_error(&self, error: Error) {
        self.errors.borrow_mut().push(error);
    }

    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors.borrow_mut())
    }

    fn add_module_mode_error(&self, error: Error) {
        if self.ctx.module {
            self.add_error(error);
            return;
        }
        self.module_errors.borrow_mut().push(error);
    }
}

/// Note: Lexer need access to parser's context to lex correctly.
#[derive(Debug)]
pub struct Capturing<I: Tokens> {
    inner: I,
    captured: Rc<RefCell<Vec<TokenAndSpan>>>,
}

impl<I: Tokens> Clone for Capturing<I> {
    fn clone(&self) -> Self {
        Capturing {
            inner: self.inner.clone(),
            captured: self.captured.clone(),
        }
    }
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

    fn add_error(&self, error: Error) {
        self.inner.add_error(error);
    }

    fn take_errors(&mut self) -> Vec<Error> {
        self.inner.take_errors()
    }

    fn add_module_mode_error(&self, error: Error) {
        self.inner.add_module_mode_error(error)
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

impl<I: Tokens> Parser<I> {
    pub fn input(&mut self) -> &mut I {
        &mut self.input.iter
    }
    pub(crate) fn input_ref(&self) -> &I {
        &self.input.iter
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

    #[inline]
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

    #[cold]
    #[inline(never)]
    pub fn dump_cur(&mut self) -> String {
        match self.cur() {
            Some(v) => format!("{:?}", v),
            None => format!("<eof>"),
        }
    }

    /// Returns current token.
    pub fn bump(&mut self) -> Token {
        #[cold]
        #[inline(never)]
        fn invalid_state() -> ! {
            unreachable!(
                "Current token is `None`. Parser should not call bump() without knowing current \
                 token"
            )
        }

        let prev = match self.cur.take() {
            Some(t) => t,
            None => invalid_state(),
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
    #[inline]
    pub fn cur(&mut self) -> Option<&Token> {
        if self.cur.is_none() {
            self.bump_inner();
        }
        self.cur.as_ref().map(|item| &item.token)
    }

    #[inline]
    pub fn is(&mut self, expected: &Token) -> bool {
        match self.cur() {
            Some(t) => *expected == *t,
            _ => false,
        }
    }

    #[inline]
    pub fn peeked_is(&mut self, expected: &Token) -> bool {
        match self.peek() {
            Some(t) => *expected == *t,
            _ => false,
        }
    }

    #[inline]
    pub fn eat(&mut self, expected: &Token) -> bool {
        let v = self.is(expected);
        if v {
            self.bump();
        }
        v
    }

    #[inline]
    pub fn eat_keyword(&mut self, kwd: Keyword) -> bool {
        match self.cur() {
            Some(Token::Word(Word::Keyword(k))) if *k == kwd => {
                self.bump();
                true
            }
            _ => false,
        }
    }

    /// Returns start of current token.
    #[inline]
    pub fn cur_pos(&mut self) -> BytePos {
        let _ = self.cur();
        self.cur
            .as_ref()
            .map(|item| item.span.lo)
            .unwrap_or_else(|| {
                // eof
                self.last_pos()
            })
    }

    #[inline]
    pub fn cur_span(&self) -> Span {
        let data = self
            .cur
            .as_ref()
            .map(|item| item.span)
            .unwrap_or(self.prev_span);

        Span::new(data.lo, data.hi, data.ctxt)
    }

    /// Returns last byte position of previous token.
    #[inline]
    pub fn last_pos(&self) -> BytePos {
        self.prev_span.hi
    }

    /// Returns span of the previous token.
    #[inline]
    pub fn prev_span(&self) -> Span {
        self.prev_span
    }

    #[inline]
    pub(crate) fn get_ctx(&self) -> Context {
        self.iter.ctx()
    }

    #[inline]
    pub(crate) fn set_ctx(&mut self, ctx: Context) {
        self.iter.set_ctx(ctx);
    }

    #[inline]
    pub fn syntax(&self) -> Syntax {
        self.iter.syntax()
    }
    #[inline]
    pub fn target(&self) -> JscTarget {
        self.iter.target()
    }

    #[inline]
    pub(crate) fn set_expr_allowed(&mut self, allow: bool) {
        self.iter.set_expr_allowed(allow)
    }

    #[inline]
    pub(crate) fn token_context(&self) -> &lexer::TokenContexts {
        self.iter.token_context()
    }
    #[inline]
    pub(crate) fn token_context_mut(&mut self) -> &mut lexer::TokenContexts {
        self.iter.token_context_mut()
    }
    #[inline]
    pub(crate) fn set_token_context(&mut self, c: lexer::TokenContexts) {
        self.iter.set_token_context(c)
    }
}
