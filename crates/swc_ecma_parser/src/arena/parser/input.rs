use debug_unreachable::debug_unreachable;
use swc_common::{BytePos, Span};

use super::Parser;
use crate::{
    lexer::{self},
    token::*,
    Context, EsVersion, Syntax, Tokens,
};

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub(crate) struct Buffer<I: Tokens> {
    iter: I,
    /// Span of the previous token.
    prev_span: Span,
    cur: Option<TokenAndSpan>,
    /// Peeked token
    next: Option<TokenAndSpan>,
}

impl<'a, I: Tokens> Parser<'a, I> {
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
