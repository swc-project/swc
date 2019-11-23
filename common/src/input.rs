use crate::syntax_pos::{BytePos, SourceFile};
use std::str;

#[derive(Clone)]
pub struct SourceFileInput<'a> {
    fm: &'a SourceFile,
    start_pos: BytePos,
    last_pos: BytePos,
    orig: &'a str,
    iter: str::CharIndices<'a>,
}

impl<'a> From<&'a SourceFile> for SourceFileInput<'a> {
    fn from(fm: &'a SourceFile) -> Self {
        let src = &fm.src;

        SourceFileInput {
            start_pos: fm.start_pos,
            last_pos: fm.start_pos,
            orig: src,
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

    fn cur(&mut self) -> Option<char> {
        self.iter.clone().nth(0).map(|i| i.1)
    }

    fn peek(&mut self) -> Option<char> {
        self.iter.clone().nth(1).map(|i| i.1)
    }

    fn peek_ahead(&mut self) -> Option<char> {
        self.iter.clone().nth(2).map(|i| i.1)
    }

    fn slice(&mut self, start: BytePos, end: BytePos) -> &str {
        assert!(start <= end, "Cannot slice {:?}..{:?}", start, end);
        let s = self.orig;

        let start_idx = (start - self.fm.start_pos).0 as usize;
        let end_idx = (end - self.fm.start_pos).0 as usize;

        let ret = &s[start_idx..end_idx];

        self.iter = s[end_idx..].char_indices();
        self.last_pos = end;
        self.start_pos = end;

        ret
    }

    fn find<F>(&mut self, mut pred: F) -> Option<BytePos>
    where
        F: FnMut(char) -> bool,
    {
        let s = self.iter.as_str();
        let mut last = 0;

        for (i, c) in s.char_indices() {
            if pred(c) {
                last = i + c.len_utf8();
                break;
            }
        }
        if last == 0 {
            return None;
        }

        self.last_pos = self.last_pos + BytePos(last as _);
        self.start_pos = self.last_pos;
        self.iter = s[last..].char_indices();

        Some(self.last_pos)
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

    fn reset_to(&mut self, to: BytePos) {
        let orig = self.orig;
        let idx = (to - self.fm.start_pos).0 as usize;

        let s = &orig[idx..];
        self.iter = s.char_indices();
        self.start_pos = to;
        self.last_pos = to;
    }

    fn is_at_start(&self) -> bool {
        self.fm.start_pos == self.last_pos
    }
}

pub trait Input: Clone {
    fn cur(&mut self) -> Option<char>;
    fn peek(&mut self) -> Option<char>;
    fn peek_ahead(&mut self) -> Option<char>;
    fn bump(&mut self);

    fn is_at_start(&self) -> bool;

    fn cur_pos(&mut self) -> BytePos;

    fn last_pos(&self) -> BytePos;

    fn slice(&mut self, start: BytePos, end: BytePos) -> &str;

    /// Takes items from stream, testing each one with predicate. returns the
    /// range of items which passed predicate.
    fn uncons_while<F>(&mut self, f: F) -> &str
    where
        F: FnMut(char) -> bool;

    /// This method modifies [last_pos()] and [cur_pos()].
    fn find<F>(&mut self, f: F) -> Option<BytePos>
    where
        F: FnMut(char) -> bool;

    fn reset_to(&mut self, to: BytePos);
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{FileName, FilePathMapping, SourceMap};
    use std::sync::Arc;

    fn with_test_sess<F>(src: &str, f: F)
    where
        F: FnOnce(SourceFileInput<'_>),
    {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Real("testing".into()), src.into());

        f((&*fm).into())
    }

    #[test]
    fn src_input_slice_1() {
        let _ = with_test_sess("foo/d", |mut i| {
            assert_eq!(i.slice(BytePos(0), BytePos(1)), "f");
            assert_eq!(i.last_pos, BytePos(1));
            assert_eq!(i.start_pos, BytePos(1));
            assert_eq!(i.cur(), Some('o'));

            assert_eq!(i.slice(BytePos(1), BytePos(3)), "oo");
            assert_eq!(i.slice(BytePos(0), BytePos(3)), "foo");
            assert_eq!(i.last_pos, BytePos(3));
            assert_eq!(i.start_pos, BytePos(3));
            assert_eq!(i.cur(), Some('/'));
        });
    }

    #[test]
    fn src_input_reset_to_1() {
        let _ = with_test_sess("foad", |mut i| {
            assert_eq!(i.slice(BytePos(0), BytePos(2)), "fo");
            assert_eq!(i.last_pos, BytePos(2));
            assert_eq!(i.start_pos, BytePos(2));
            assert_eq!(i.cur(), Some('a'));
            i.reset_to(BytePos(0));

            assert_eq!(i.cur(), Some('f'));
            assert_eq!(i.last_pos, BytePos(0));
            assert_eq!(i.start_pos, BytePos(0));
        });
    }

    #[test]
    fn src_input_smoke_01() {
        let _ = with_test_sess("foo/d", |mut i| {
            assert_eq!(i.cur_pos(), BytePos(0));
            assert_eq!(i.last_pos, BytePos(0));
            assert_eq!(i.start_pos, BytePos(0));
            assert_eq!(i.uncons_while(|c| c.is_alphabetic()), "foo");

            // assert_eq!(i.cur_pos(), BytePos(4));
            assert_eq!(i.last_pos, BytePos(3));
            assert_eq!(i.start_pos, BytePos(3));
            assert_eq!(i.cur(), Some('/'));

            i.bump();
            assert_eq!(i.last_pos, BytePos(4));
            assert_eq!(i.cur(), Some('d'));

            i.bump();
            assert_eq!(i.last_pos, BytePos(5));
            assert_eq!(i.cur(), None);
        });
    }

    #[test]
    fn src_input_find_01() {
        let _ = with_test_sess("foo/d", |mut i| {
            assert_eq!(i.cur_pos(), BytePos(0));
            assert_eq!(i.last_pos, BytePos(0));
            assert_eq!(i.start_pos, BytePos(0));

            assert_eq!(i.find(|c| c == '/'), Some(BytePos(4)));
            assert_eq!(i.start_pos, BytePos(4));
            assert_eq!(i.last_pos, BytePos(4));
            assert_eq!(i.cur(), Some('d'));
        });
    }

    //    #[test]
    //    fn src_input_smoke_02() {
    //        let _ = crate::with_test_sess("℘℘/℘℘", | mut i| {
    //            assert_eq!(i.iter.as_str(), "℘℘/℘℘");
    //            assert_eq!(i.cur_pos(), BytePos(0));
    //            assert_eq!(i.last_pos, BytePos(0));
    //            assert_eq!(i.start_pos, BytePos(0));
    //            assert_eq!(i.uncons_while(|c| c.is_ident_part()), "℘℘");
    //
    //            assert_eq!(i.iter.as_str(), "/℘℘");
    //            assert_eq!(i.last_pos, BytePos(6));
    //            assert_eq!(i.start_pos, BytePos(6));
    //            assert_eq!(i.cur(), Some('/'));
    //            i.bump();
    //            assert_eq!(i.last_pos, BytePos(7));
    //            assert_eq!(i.start_pos, BytePos(6));
    //
    //            assert_eq!(i.iter.as_str(), "℘℘");
    //            assert_eq!(i.uncons_while(|c| c.is_ident_part()), "℘℘");
    //            assert_eq!(i.last_pos, BytePos(13));
    //            assert_eq!(i.start_pos, BytePos(13));
    //
    //            Ok(())
    //        });
    //    }
}
