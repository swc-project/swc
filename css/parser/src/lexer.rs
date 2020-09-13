use logos::Logos;
use swc_common::{BytePos, Span};

use crate::token::Token;

/// Wrapper for
pub(crate) struct Lexer<'i> {
    inner: logos::Lexer<'i, Token>,
    start_pos: BytePos,
    prev_hi: BytePos,
    cur: Option<(Token, logos::Span, &'i str)>,
}

impl<'i> Lexer<'i> {
    #[inline]
    pub fn bump(&mut self) {
        let _ = self.cur();

        self.cur.take();

        self.prev_hi = self.prev_hi + BytePos(self.inner.slice().len() as _);
    }

    #[inline]
    pub fn new(start_pos: BytePos, s: &'i str) -> Self {
        Lexer {
            start_pos,
            cur: None,
            inner: Token::lexer(s),
            prev_hi: start_pos,
        }
    }

    #[inline]
    pub fn cur_pos(&mut self) -> BytePos {
        let _ = self.cur();

        let span = self.span();

        span.lo
    }

    #[inline]
    pub fn span(&mut self) -> Span {
        let _ = self.cur();

        let s = match self.cur.as_ref() {
            Some(v) => v.1.clone(),
            _ => return Span::new(self.prev_hi, self.prev_hi, Default::default()),
        };

        Span::new(
            BytePos(s.start as _),
            BytePos(s.end as _),
            Default::default(),
        )
    }

    pub const fn prev_hi(&self) -> BytePos {
        self.prev_hi
    }

    #[inline]
    pub fn cur(&mut self) -> Option<Token> {
        match self.cur {
            Some(_) => {}
            None => {
                self.prev_hi = self.start_pos + BytePos(self.inner.span().end as u32);
                let token = self.inner.next()?;
                self.cur = Some((token, self.inner.span(), self.inner.slice()));
            }
        }

        self.cur.as_ref().map(|v| v.0)
    }

    #[inline]
    pub fn slice(&mut self) -> &'i str {
        let _cur = self.cur();

        match self.cur {
            Some(ref v) => v.2,
            None => "",
        }
    }

    #[inline]
    pub fn make_span(&self, start: BytePos) -> Span {
        Span::new(start, self.prev_hi, Default::default())
    }
}
