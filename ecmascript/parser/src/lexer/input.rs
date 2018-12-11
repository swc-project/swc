use std::str;
use swc_common::{BytePos, SourceFile};

#[derive(Debug, Clone)]
pub struct SourceFileInput<'a> {
    fm: &'a SourceFile,
    last_pos: BytePos,
    iter: str::CharIndices<'a>,
}

impl<'a> From<&'a SourceFile> for SourceFileInput<'a> {
    fn from(fm: &'a SourceFile) -> Self {
        let src = match fm.src {
            Some(ref s) => s,
            None => unreachable!("Cannot lex SourceFile without source: {}", fm.name),
        };

        SourceFileInput {
            last_pos: fm.start_pos,
            iter: src.char_indices(),
            fm,
        }
    }
}

impl<'a> Input for SourceFileInput<'a> {
    fn cur_pos(&mut self) -> BytePos {
        self.iter
            .clone()
            .next()
            .map(|(p, _)| self.fm.start_pos + BytePos(p as u32))
            .unwrap_or(self.last_pos)
    }

    fn last_pos(&self) -> BytePos {
        self.last_pos
    }

    fn bump(&mut self) {
        if let Some((i, c)) = self.iter.next() {
            self.last_pos = self.fm.start_pos + BytePos((i + c.len_utf8()) as u32);
        } else {
            unreachable!("bump should not be called when cur() == None");
        }
    }

    fn current(&mut self) -> Option<char> {
        self.iter.clone().nth(0).map(|i| i.1)
    }

    fn peek(&mut self) -> Option<char> {
        self.iter.clone().nth(1).map(|i| i.1)
    }

    fn peek_ahead(&mut self) -> Option<char> {
        self.iter.clone().nth(2).map(|i| i.1)
    }

    fn uncons_while<F>(&mut self, f: F) -> &str
    where
        F: FnMut(char) -> bool,
    {

    }
}

pub trait Input {
    fn current(&mut self) -> Option<char>;
    fn peek(&mut self) -> Option<char>;
    fn peek_ahead(&mut self) -> Option<char>;
    fn bump(&mut self);

    fn cur_pos(&mut self) -> BytePos;

    fn last_pos(&self) -> BytePos;

    /// Takes items from stream, testing each one with predicate. returns the
    /// range of items which passed predicate.
    fn uncons_while<F>(&mut self, f: F) -> &str
    where
        F: FnMut(char) -> bool;
}
