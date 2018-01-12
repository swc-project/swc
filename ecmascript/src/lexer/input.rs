use std::cmp::Ordering;
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
        let pos = self.cur
            .take()
            .unwrap_or_else(|| unreachable!("bump called on eof"))
            .0;

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

/// Implements PartialEq<char>
#[derive(Debug, Clone, Copy)]
pub struct OptChar(Option<(BytePos, char)>);

impl From<Option<(BytePos, char)>> for OptChar {
    fn from(opt: Option<(BytePos, char)>) -> Self {
        OptChar(opt)
    }
}

impl PartialEq<char> for OptChar {
    fn eq(&self, rhs: &char) -> bool {
        match self.0 {
            Some((_, c)) if c == *rhs => true,
            _ => false,
        }
    }
}

impl PartialOrd<char> for OptChar {
    fn partial_cmp(&self, other: &char) -> Option<Ordering> {
        self.0.map(|(_, c)| c.cmp(other))
    }
}

impl OptChar {
    pub fn is_digit(self, radix: u32) -> bool {
        self.0.map(|c| c.1.is_digit(radix)).unwrap_or(false)
    }

    /// # Panics
    ///
    /// panics if `self` is `None`
    pub fn as_char(self) -> char {
        self.0.unwrap().1
    }

    pub const fn into_inner(self) -> Option<(BytePos, char)> {
        self.0
    }

    pub fn is_some(&self) -> bool {
        self.0.is_some()
    }
    pub fn is_none(&self) -> bool {
        self.0.is_none()
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
