use std::fmt::Debug;
use swc_common::BytePos;

/// Used inside lexer.
pub(super) struct LexerInput<I: Input> {
    cur: Option<(BytePos, char)>,
    input: I,
}

impl<I: Input> LexerInput<I> {
    pub const fn new(input: I) -> Self {
        LexerInput { input, cur: None }
    }

    pub fn bump(&mut self) -> BytePos {
        self.cur.take().expect("bump called on eof").0
    }
    pub fn peek(&mut self) -> OptChar {
        self.input.peek()
    }

    pub fn current(&mut self) -> OptChar {
        match self.cur {
            Some(c) => OptChar(Some(c)),
            None => {
                let next = self.input.next();
                self.cur = next;
                OptChar(next)
            }
        }
    }
}

/// Implements PartialEq<char>
#[derive(Debug, Clone, Copy)]
pub struct OptChar(pub Option<(BytePos, char)>);
impl OptChar {
    /// # Panics
    ///
    /// panics if `self` is `None`
    pub fn pos(self) -> BytePos {
        self.0.unwrap().0
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
}

impl PartialEq<char> for OptChar {
    fn eq(&self, rhs: &char) -> bool {
        match self.0 {
            Some((_, c)) if c == *rhs => true,
            _ => false,
        }
    }
}

pub trait Input: Iterator<Item = (BytePos, char)> {
    type Error: Debug;
    fn peek(&mut self) -> OptChar;

    fn chunk(&self, _from: BytePos, _to: BytePos) -> Option<&str> {
        None
    }
}

impl<'a, I> Input for &'a mut I
where
    I: Input,
{
    type Error = I::Error;

    fn peek(&mut self) -> OptChar {
        <I as Input>::peek(*self)
    }
    fn chunk(&self, from: BytePos, to: BytePos) -> Option<&str> {
        <I as Input>::chunk(*self, from, to)
    }
}
