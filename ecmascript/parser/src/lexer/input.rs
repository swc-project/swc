use std::str;
use swc_common::{BytePos, SourceFile};

#[derive(Debug, Clone)]
pub struct SourceFileInput<'a> {
    fm: &'a SourceFile,
    start_pos: BytePos,
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
            start_pos: fm.start_pos,
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
            .map(|(p, _)| self.start_pos + BytePos(p as u32))
            .unwrap_or(self.last_pos)
    }

    fn last_pos(&self) -> BytePos {
        self.last_pos
    }

    fn bump(&mut self) {
        if let Some((i, c)) = self.iter.next() {
            self.last_pos = self.start_pos + BytePos((i + c.len_utf8()) as u32);
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

    fn uncons_while<F>(&mut self, mut pred: F) -> &str
    where
        F: FnMut(char) -> bool,
    {
        let s = self.iter.as_str();
        let mut last = 0;

        for (i, c) in s.char_indices() {
            if pred(c) {
                last = i + c.len_utf8();
            } else {
                break;
            }
        }
        let ret = &s[..last];

        self.last_pos = self.last_pos + BytePos(last as _);
        self.start_pos = self.last_pos;
        self.iter = s[last..].char_indices();

        ret
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::lexer::util::CharExt;

    #[test]
    fn src_input_smoke_01() {
        let _ = ::with_test_sess("foo/d", |_, mut i| {
            assert_eq!(i.cur_pos(), BytePos(0));
            assert_eq!(i.last_pos, BytePos(0));
            assert_eq!(i.start_pos, BytePos(0));
            assert_eq!(i.uncons_while(|c| c.is_alphabetic()), "foo");

            // assert_eq!(i.cur_pos(), BytePos(4));
            assert_eq!(i.last_pos, BytePos(3));
            assert_eq!(i.start_pos, BytePos(3));
            assert_eq!(i.current(), Some('/'));

            i.bump();
            assert_eq!(i.last_pos, BytePos(4));
            assert_eq!(i.current(), Some('d'));

            i.bump();
            assert_eq!(i.last_pos, BytePos(5));
            assert_eq!(i.current(), None);
            Ok(())
        });
    }

    #[test]
    fn src_input_smoke_02() {
        let _ = ::with_test_sess("℘℘/℘℘", |_, mut i| {
            assert_eq!(i.iter.as_str(), "℘℘/℘℘");
            assert_eq!(i.cur_pos(), BytePos(0));
            assert_eq!(i.last_pos, BytePos(0));
            assert_eq!(i.start_pos, BytePos(0));
            assert_eq!(i.uncons_while(|c| c.is_ident_part()), "℘℘");

            assert_eq!(i.iter.as_str(), "/℘℘");
            assert_eq!(i.last_pos, BytePos(6));
            assert_eq!(i.start_pos, BytePos(6));
            assert_eq!(i.current(), Some('/'));
            i.bump();
            assert_eq!(i.last_pos, BytePos(7));
            assert_eq!(i.start_pos, BytePos(6));

            assert_eq!(i.iter.as_str(), "℘℘");
            assert_eq!(i.uncons_while(|c| c.is_ident_part()), "℘℘");
            assert_eq!(i.last_pos, BytePos(13));
            assert_eq!(i.start_pos, BytePos(13));

            Ok(())
        });
    }
}
