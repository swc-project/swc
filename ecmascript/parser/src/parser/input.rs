use crate::{
    lexer::{self, Input, Lexer},
    token::*,
    Context, Syntax,
};
use swc_common::{BytePos, Span, DUMMY_SP};

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub(super) struct ParserInput<'a, I: Input> {
    iter: Lexer<'a, I>,
    /// Span of the previous token.
    prev_span: Span,
    cur: Option<TokenAndSpan>,
    /// Peeked token
    next: Option<TokenAndSpan>,
}

impl<'a, I: Input> ParserInput<'a, I> {
    pub fn new(lexer: Lexer<'a, I>) -> Self {
        ParserInput {
            iter: lexer,
            cur: None,
            prev_span: DUMMY_SP,
            next: None,
        }
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
        assert!(
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
    pub const fn prev_span(&self) -> Span {
        self.prev_span
    }

    pub const fn get_ctx(&self) -> Context {
        self.iter.ctx
    }

    pub fn set_ctx(&mut self, ctx: Context) {
        self.iter.ctx = ctx;
    }

    pub const fn syntax(&self) -> Syntax {
        self.iter.syntax
    }

    pub fn set_expr_allowed(&mut self, allow: bool) {
        self.iter.set_expr_allowed(allow)
    }

    pub(crate) const fn token_context(&self) -> &lexer::TokenContexts {
        self.iter.token_context()
    }
    pub(crate) fn set_token_context(&mut self, c: lexer::TokenContexts) {
        self.iter.set_token_context(c)
    }
}
