use std::{cell::RefCell, mem, mem::take, rc::Rc};

use debug_unreachable::debug_unreachable;
use lexer::TokenContexts;
use swc_common::{BytePos, Span};

use super::Parser;
use crate::{
    error::Error,
    lexer::{self},
    token::*,
    Context, EsVersion, Syntax,
};

/// Clone should be cheap if you are parsing typescript because typescript
/// syntax requires backtracking.
pub trait Tokens: Clone + Iterator<Item = TokenAndSpan> {
    fn set_ctx(&mut self, ctx: Context);
    fn ctx(&self) -> Context;
    fn syntax(&self) -> Syntax;
    fn target(&self) -> EsVersion;

    fn start_pos(&self) -> BytePos {
        BytePos(0)
    }

    fn set_expr_allowed(&mut self, allow: bool);
    fn set_next_regexp(&mut self, start: Option<BytePos>);

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

    fn end_pos(&self) -> BytePos;

    fn take_errors(&mut self) -> Vec<Error>;

    /// If the program was parsed as a script, this contains the module
    /// errors should the program be identified as a module in the future.
    fn take_script_module_errors(&mut self) -> Vec<Error>;
}

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
        if self.ctx.module {
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

    pub fn tokens(&self) -> Rc<RefCell<Vec<TokenAndSpan>>> {
        self.captured.clone()
    }

    /// Take captured tokens
    pub fn take(&mut self) -> Vec<TokenAndSpan> {
        mem::take(&mut *self.captured.borrow_mut())
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
        let start_pos = lexer.start_pos();
        Buffer {
            iter: lexer,
            cur: None,
            prev_span: Span::new(start_pos, start_pos),
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

    #[allow(dead_code)]
    pub fn cur_debug(&self) -> Option<&Token> {
        self.cur.as_ref().map(|it| &it.token)
    }

    #[cold]
    #[inline(never)]
    pub fn dump_cur(&mut self) -> String {
        match self.cur() {
            Some(v) => format!("{:?}", v),
            None => "<eof>".to_string(),
        }
    }

    /// Returns current token.
    pub fn bump(&mut self) -> Token {
        let prev = match self.cur.take() {
            Some(t) => t,
            None => unsafe {
                debug_unreachable!(
                    "Current token is `None`. Parser should not call bump() without knowing \
                     current token"
                )
            },
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
            // If we have peeked a token, take it instead of calling lexer.next()
            self.cur = self.next.take().or_else(|| self.iter.next());
        }

        match &self.cur {
            Some(v) => Some(&v.token),
            None => None,
        }
    }

    #[inline]
    pub fn cut_lshift(&mut self) {
        debug_assert!(
            self.is(&tok!("<<")),
            "parser should only call cut_lshift when encountering LShift token"
        );
        self.cur = Some(TokenAndSpan {
            token: tok!('<'),
            span: self.cur_span().with_lo(self.cur_span().lo + BytePos(1)),
            had_line_break: false,
        });
    }

    pub fn merge_lt_gt(&mut self) {
        debug_assert!(
            self.is(&tok!('<')) || self.is(&tok!('>')),
            "parser should only call merge_lt_gt when encountering '<' or '>' token"
        );

        let span = self.cur_span();

        if self.peek().is_none() {
            return;
        }

        let next = self.next.as_ref().unwrap();

        if span.hi != next.span.lo {
            return;
        }

        let cur = self.cur.take().unwrap();
        let next = self.next.take().unwrap();

        let token = match (&cur.token, &next.token) {
            (tok!('>'), tok!('>')) => tok!(">>"),
            (tok!('>'), tok!('=')) => tok!(">="),
            (tok!('>'), tok!(">>")) => tok!(">>>"),
            (tok!('>'), tok!(">=")) => tok!(">>="),
            (tok!('>'), tok!(">>=")) => tok!(">>>="),
            (tok!('<'), tok!('<')) => tok!("<<"),
            (tok!('<'), tok!('=')) => tok!("<="),
            (tok!('<'), tok!("<=")) => tok!("<<="),

            _ => {
                self.cur = Some(cur);
                self.next = Some(next);
                return;
            }
        };
        let span = span.with_hi(next.span.hi);

        self.cur = Some(TokenAndSpan {
            token,
            span,
            had_line_break: cur.had_line_break,
        });
    }

    #[inline]
    pub fn is(&mut self, expected: &Token) -> bool {
        match self.cur() {
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

        Span::new(data.lo, data.hi)
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
    pub fn target(&self) -> EsVersion {
        self.iter.target()
    }

    #[inline]
    pub(crate) fn set_expr_allowed(&mut self, allow: bool) {
        self.iter.set_expr_allowed(allow)
    }

    #[inline]
    pub fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.iter.set_next_regexp(start);
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

    #[inline]
    pub(crate) fn end_pos(&self) -> BytePos {
        self.iter.end_pos()
    }
}
