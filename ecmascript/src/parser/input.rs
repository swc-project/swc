//! Note: this module requires `#![feature(nll)]`.
use swc_common::Span;
use token::*;

/// Input for parser.
pub trait Input: Iterator<Item = TokenAndSpan> {
    fn had_line_break_after_last(&self) -> bool;
}

/// This struct is responsible for managing current token and peeked token.
pub(super) struct ParserInput<I: Input> {
    iter: I,
    cur: Option<Token>,
    cur_span: Span,
    last_span: Span,
    /// Peeked token
    next: Option<TokenAndSpan>,
}

impl<I: Input> ParserInput<I> {
    /// Returns previous token.
    fn bump_inner(&mut self) -> Option<Token> {
        let prev = self.cur.take();
        self.last_span = self.cur_span;

        // If we have peeked a token, take it instead of calling lexer.next()
        let (next, next_span) = match self.next.take().or_else(|| self.iter.next()) {
            Some(TokenAndSpan { token, span }) => (Some(token), span),
            None => (None, Default::default()),
        };
        self.cur = next;
        self.cur_span = next_span;

        prev
    }
    pub fn bump(&mut self) -> Token {
        self.bump_inner().expect(
            "Current token is `None`. Parser should not call bump()\
             without knowing current token",
        )
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

    pub fn has_linebreak_between_cur_and_peeked(&mut self) -> bool {
        let _ = self.peek();
        self.iter.had_line_break_after_last()
    }

    /// Get current token. Returns `None` only on eof.
    pub fn cur(&mut self) -> Option<&Token> {
        match self.cur {
            Some(..) => self.cur.as_ref(),
            None => {
                self.bump_inner();
                self.cur.as_ref()
            }
        }
    }

    pub fn is(&mut self, expected: &Token) -> bool {
        match self.cur() {
            Some(t) => *expected == *t,
            _ => false,
        }
    }

    pub fn eat(&mut self, expected: &Token) -> bool {
        match self.cur() {
            Some(t) => {
                if *expected == *t {
                    self.bump();
                    true
                } else {
                    false
                }
            }
            _ => false,
        }
    }
    pub fn eat_keyword(&mut self, kwd: Keyword) -> bool {
        self.eat(&Word(Keyword(kwd)))
    }

    pub const fn cur_span(&self) -> Span {
        self.cur_span
    }
    pub const fn last_span(&self) -> Span {
        self.last_span
    }
}
