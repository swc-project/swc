use super::util::CharExt;
use std::str;
use swc_common::{BytePos, FileMap};

/// Used inside lexer.
pub(super) struct LexerInput<I: Input> {
    cur: Option<(BytePos, char)>,
    last_pos: BytePos,
    input: I,
}

impl<I: Input> LexerInput<I> {
    pub fn new(input: I) -> Self {
        let mut i = LexerInput {
            last_pos: input.start_pos(),
            cur: None,
            input,
        };
        i.input.record_new_line(i.last_pos);
        i
    }

    pub fn bump(&mut self) {
        let is_new_line = match self.cur.take() {
            Some((p, prev_c)) => {
                self.last_pos = BytePos(p.0 + prev_c.len_utf8() as u32);
                prev_c.is_line_break()
            }
            None => unreachable!("bump is called without knowing current character"),
        };
        // TODO: Handle \r\n

        self.cur = self.input.next();
        if is_new_line {
            match self.cur {
                Some((p, _)) => self.input.record_new_line(p),
                None => {}
            }
        }
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
pub struct FileMapInput<'a> {
    fm: &'a FileMap,
    start_pos: BytePos,
    iter: str::CharIndices<'a>,
}

impl<'a> From<&'a FileMap> for FileMapInput<'a> {
    fn from(fm: &'a FileMap) -> Self {
        let src = match fm.src {
            Some(ref s) => s,
            None => unreachable!("Cannot lex filemap without source: {}", fm.name),
        };

        FileMapInput {
            start_pos: fm.start_pos,
            iter: src.char_indices(),
            fm,
        }
    }
}

impl<'a> Iterator for FileMapInput<'a> {
    type Item = (BytePos, char);

    fn next(&mut self) -> Option<Self::Item> {
        self.iter
            .next()
            .map(|(i, c)| (BytePos(i as u32 + self.start_pos.0), c))
    }
}
impl<'a> Input for FileMapInput<'a> {
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
    fn record_new_line(&self, pos: BytePos) {
        self.fm.next_line(pos)
    }
    fn start_pos(&self) -> BytePos {
        self.fm.start_pos
    }
}

pub trait Input: Iterator<Item = (BytePos, char)> {
    fn peek(&mut self) -> Option<(BytePos, char)>;

    fn peek_ahead(&mut self) -> Option<(BytePos, char)>;
    fn record_new_line(&self, _pos: BytePos) {}

    fn start_pos(&self) -> BytePos;

    ///Takes items from stream, testing each one with predicate. returns the
    /// range of items which passed predicate.
    fn uncons_while<F>(&mut self, f: F) -> Option<&str>
    where
        F: FnMut(char) -> bool;
}
