//! Note: this module requires `#![feature(nll)]`.
use swc_common::{BytePos, Span};
use token::*;

/// Input for parser.
pub trait Input: Iterator<Item = TokenAndSpan> {
    fn had_line_break_before_last(&self) -> bool;
}

/// This struct is responsible for managing current token and peeked token.
pub(super) struct ParserInput<I: Input> {
    iter: ItemIter<I>,
    cur: Option<Item>,
    /// Last of previous span
    last_pos: BytePos,
    /// Peeked token
    next: Option<Item>,
}

/// One token
#[derive(Debug)]
struct Item {
    token: Token,
    /// Had a line break before this token?
    had_line_break: bool,
    span: Span,
}
struct ItemIter<I: Input>(I);
impl<I: Input> ItemIter<I> {
    fn next(&mut self) -> Option<Item> {
        match self.0.next() {
            Some(TokenAndSpan { token, span }) => Some(Item {
                token,
                span,
                had_line_break: self.0.had_line_break_before_last(),
            }),
            None => None,
        }
    }
}

impl<I: Input> ParserInput<I> {
    pub const fn new(lexer: I) -> Self {
        ParserInput {
            iter: ItemIter(lexer),
            cur: None,
            last_pos: BytePos(0),
            next: None,
        }
    }

    fn bump_inner(&mut self) -> Option<Token> {
        let prev = self.cur.take();
        self.last_pos = prev.as_ref()
            .map(|item| item.span.end)
            .unwrap_or(BytePos(0));

        // If we have peeked a token, take it instead of calling lexer.next()
        self.cur = self.next.take().or_else(|| self.iter.next());

        prev.map(|it| it.token)
    }

    pub fn cur_debug(&self) -> Option<&Token> {
        self.cur.as_ref().map(|it| &it.token)
    }

    /// Returns current token.
    pub fn bump(&mut self) -> Token {
        self.bump_inner().expect(
            "Current token is `None`. Parser should not call bump()without knowing current token",
        )
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

    /// This returns true on eof.
    pub fn had_line_break_before_cur(&self) -> bool {
        self.cur
            .as_ref()
            .map(|it| it.had_line_break)
            .unwrap_or(true)
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
    /// Returns start of current token.
    pub fn cur_pos(&self) -> BytePos {
        self.cur
            .as_ref()
            .map(|item| item.span.start)
            .unwrap_or(BytePos(0))
    }
    /// Returns last of previous token.
    pub const fn last_pos(&self) -> BytePos {
        self.last_pos
    }
}
