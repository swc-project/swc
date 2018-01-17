use std::fmt::Debug;
use std::str;
use swc_common::BytePos;

/// Used inside lexer.
pub(super) struct LexerInput<I: Input> {
    cur: Option<(BytePos, char)>,
    last_pos: BytePos,
    input: I,
}

impl<I: Input> LexerInput<I> {
    pub const fn new(input: I) -> Self {
        LexerInput {
            input,
            last_pos: BytePos(0),
            cur: None,
        }
    }

    pub fn bump(&mut self) {
        let pos = match self.cur.take() {
            Some((p, prev_c)) => BytePos(p.0 + prev_c.len_utf8() as u32),
            None => unreachable!("bump is called without knowing current character"),
        };

        self.cur = self.input.next();
        self.last_pos = pos;
    }

    pub fn peek(&mut self) -> Option<char> {
        self.input.peek().map(|(_, c)| c)
    }

    /// Get char at `cur + 2`.
    pub fn peek_ahead(&mut self) -> Option<char> {
        self.input.peek_ahead().map(|(_, c)| c)
    }

    pub fn current(&mut self) -> Option<char> {
        match self.cur {
            Some((_, c)) => Some(c),
            None => {
                let next = self.input.next();
                self.cur = next;
                self.cur.map(|(_, c)| c)
            }
        }
    }

    pub fn cur_pos(&mut self) -> BytePos {
        self.current();
        self.cur.map(|(p, _)| p).unwrap_or(self.last_pos)
    }
    pub fn last_pos(&self) -> BytePos {
        self.last_pos
    }
}

#[derive(Debug, Clone)]
pub struct CharIndices<'a>(pub str::CharIndices<'a>);

impl<'a> Input for CharIndices<'a> {
    type Error = ();

    fn peek(&mut self) -> Option<(BytePos, char)> {
        self.clone().nth(0)
    }

    fn peek_ahead(&mut self) -> Option<(BytePos, char)> {
        self.clone().nth(1)
    }
    fn uncons_while<F>(&mut self, f: F) -> Option<&str>
    where
        F: FnMut(char) -> bool,
    {
        //TODO?
        None
    }
}
impl<'a> Iterator for CharIndices<'a> {
    type Item = (BytePos, char);

    fn next(&mut self) -> Option<Self::Item> {
        self.0.next().map(|(i, c)| (BytePos(i as _), c))
    }
}

pub trait Input: Iterator<Item = (BytePos, char)> {
    type Error: Debug;
    fn peek(&mut self) -> Option<(BytePos, char)>;

    fn peek_ahead(&mut self) -> Option<(BytePos, char)>;

    ///Takes items from stream, testing each one with predicate. returns the
    /// range of items which passed predicate.
    fn uncons_while<F>(&mut self, f: F) -> Option<&str>
    where
        F: FnMut(char) -> bool;
}

impl<'a, I> Input for &'a mut I
where
    I: Input,
{
    type Error = I::Error;

    fn peek(&mut self) -> Option<(BytePos, char)> {
        <I as Input>::peek(*self)
    }

    fn peek_ahead(&mut self) -> Option<(BytePos, char)> {
        <I as Input>::peek_ahead(*self)
    }

    fn uncons_while<F>(&mut self, f: F) -> Option<&str>
    where
        F: FnMut(char) -> bool,
    {
        <I as Input>::uncons_while(self, f)
    }
}
