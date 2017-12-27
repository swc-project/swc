use std::cmp::Ordering;
use std::fmt::Debug;
use std::str;
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
        let pos = self.cur
            .take()
            .unwrap_or_else(|| unreachable!("bump called on eof"))
            .0;

        self.cur = self.input.next();

        pos
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

#[derive(Debug, Clone)]
pub struct CharIndices<'a>(pub str::CharIndices<'a>);

impl<'a> Input for CharIndices<'a> {
    type Error = ();

    fn peek(&mut self) -> OptChar {
        OptChar::from(self.clone().next())
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
    /// # Panics
    ///
    /// panics if `self` is `None`
    pub fn pos(self) -> BytePos {
        self.0.unwrap().0
    }

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
