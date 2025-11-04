use std::str;

use debug_unreachable::debug_unreachable;

use crate::syntax_pos::{BytePos, SourceFile};

pub type SourceFileInput<'a> = StringInput<'a>;

/// Cached character with its byte length for efficient lookahead
#[derive(Clone, Copy, Debug)]
struct CachedChar {
    ch: char,
    len: u8,
}

/// Implementation of [Input].
#[derive(Clone)]
pub struct StringInput<'a> {
    last_pos: BytePos,
    /// Current cursor
    iter: str::Chars<'a>,
    orig: &'a str,
    /// Original start position.
    orig_start: BytePos,
    orig_end: BytePos,
    /// Cache for decoded characters to avoid repeated UTF-8 decoding.
    /// cache[0] = current char, cache[1] = peek, cache[2] = peek_ahead
    cache: [Option<CachedChar>; 3],
    /// Number of valid entries in the cache
    cache_len: u8,
}

impl<'a> StringInput<'a> {
    /// `start` and `end` can be arbitrary value, but start should be less than
    /// or equal to end.
    ///
    ///
    /// `swc` get this value from [SourceMap] because code generator depends on
    /// some methods of [SourceMap].
    /// If you are not going to use methods from
    /// [SourceMap], you may use any value.
    pub fn new(src: &'a str, start: BytePos, end: BytePos) -> Self {
        assert!(start <= end);

        let mut input = StringInput {
            last_pos: start,
            orig: src,
            iter: src.chars(),
            orig_start: start,
            orig_end: end,
            cache: [None; 3],
            cache_len: 0,
        };
        input.fill_cache();
        input
    }

    /// Fills the cache with up to 3 decoded characters from the iterator.
    /// This avoids repeated UTF-8 decoding when calling cur(), peek(),
    /// peek_ahead().
    #[inline]
    fn fill_cache(&mut self) {
        let mut temp_iter = self.iter.clone();
        for i in self.cache_len as usize..3 {
            if let Some(ch) = temp_iter.next() {
                self.cache[i] = Some(CachedChar {
                    ch,
                    len: ch.len_utf8() as u8,
                });
                self.cache_len += 1;
            } else {
                break;
            }
        }
    }

    /// Shifts the cache left by one position and fills the last slot.
    /// Called after consuming a character via bump().
    /// Note: The iterator must already be advanced before calling this.
    #[inline]
    fn shift_cache(&mut self) {
        // Shift existing cached entries to the left
        self.cache[0] = self.cache[1];
        self.cache[1] = self.cache[2];
        self.cache[2] = None;

        // Decrease cache length
        if self.cache_len > 0 {
            self.cache_len -= 1;
        }

        // Try to fill the new empty slot at the end
        // The new cache[2] should be the character at iter.clone().nth(2)
        if self.cache_len < 3 {
            let mut temp_iter = self.iter.clone();
            // Skip cache[0] and cache[1] to get to cache[2]
            for _ in 0..2 {
                if temp_iter.next().is_none() {
                    return;
                }
            }
            if let Some(ch) = temp_iter.next() {
                self.cache[2] = Some(CachedChar {
                    ch,
                    len: ch.len_utf8() as u8,
                });
                self.cache_len += 1;
            }
        }
    }

    /// Invalidates the cache. Called when the iterator position changes
    /// arbitrarily.
    #[inline]
    fn invalidate_cache(&mut self) {
        self.cache = [None; 3];
        self.cache_len = 0;
        self.fill_cache();
    }

    #[inline(always)]
    pub fn as_str(&self) -> &str {
        self.iter.as_str()
    }

    #[inline(always)]
    /// Compared to [StringInput::slice], this function doesn't set
    /// `self.last_pos = end` because in most cases this property has been
    /// satisfied but the compiler cannot optimize it.
    ///
    /// Caution: This function should only be used internally and will be
    /// changed in the future.
    ///
    /// # Safety
    /// - start should be less than or equal to end.
    /// - start and end should be in the valid range of input.
    pub unsafe fn slice_to_cur(&mut self, start: BytePos) -> &'a str {
        let end = self.last_pos;

        debug_assert!(start <= end, "Cannot slice {start:?}..{end:?}");
        let s = self.orig;

        let start_idx = (start - self.orig_start).0 as usize;
        let end_idx = (end - self.orig_start).0 as usize;

        debug_assert!(end_idx <= s.len());

        let ret = unsafe { s.get_unchecked(start_idx..end_idx) };

        self.iter = unsafe { s.get_unchecked(end_idx..) }.chars();
        self.invalidate_cache();

        ret
    }

    #[inline]
    pub fn bump_bytes(&mut self, n: usize) {
        let s = self.iter.as_str();
        self.iter = unsafe { s.get_unchecked(n..) }.chars();
        self.last_pos.0 += n as u32;
        self.invalidate_cache();
    }

    #[inline]
    pub fn bump_one(&mut self) {
        if self.cache[0].is_some() {
            self.iter.next();
            self.last_pos.0 += 1;
            self.shift_cache();
        } else {
            unsafe {
                debug_unreachable!("bump should not be called when cur() == None");
            }
        }
    }

    pub fn start_pos(&self) -> BytePos {
        self.orig_start
    }

    #[inline(always)]
    pub fn end_pos(&self) -> BytePos {
        self.orig_end
    }
}

/// Creates an [Input] from [SourceFile]. This is an alias for
///
/// ```ignore
///    StringInput::new(&fm.src, fm.start_pos, fm.end_pos)
/// ```
impl<'a> From<&'a SourceFile> for StringInput<'a> {
    fn from(fm: &'a SourceFile) -> Self {
        StringInput::new(&fm.src, fm.start_pos, fm.end_pos)
    }
}

impl<'a> Input<'a> for StringInput<'a> {
    #[inline]
    fn cur(&self) -> Option<char> {
        self.cache[0].map(|c| c.ch)
    }

    #[inline]
    fn peek(&self) -> Option<char> {
        self.cache[1].map(|c| c.ch)
    }

    #[inline]
    fn peek_ahead(&self) -> Option<char> {
        self.cache[2].map(|c| c.ch)
    }

    #[inline]
    unsafe fn bump(&mut self) {
        if let Some(cached) = self.cache[0] {
            self.iter.next(); // Advance the iterator
            self.last_pos = self.last_pos + BytePos(cached.len as u32);
            self.shift_cache();
        } else {
            unsafe {
                debug_unreachable!("bump should not be called when cur() == None");
            }
        }
    }

    #[inline]
    fn cur_as_ascii(&self) -> Option<u8> {
        let first_byte = *self.as_str().as_bytes().first()?;
        if first_byte <= 0x7f {
            Some(first_byte)
        } else {
            None
        }
    }

    #[inline]
    fn is_at_start(&self) -> bool {
        self.orig_start == self.last_pos
    }

    /// TODO(kdy1): Remove this?
    #[inline]
    fn cur_pos(&self) -> BytePos {
        self.last_pos
    }

    #[inline]
    fn last_pos(&self) -> BytePos {
        self.last_pos
    }

    #[inline]
    unsafe fn slice(&mut self, start: BytePos, end: BytePos) -> &'a str {
        debug_assert!(start <= end, "Cannot slice {start:?}..{end:?}");
        let s = self.orig;

        let start_idx = (start - self.orig_start).0 as usize;
        let end_idx = (end - self.orig_start).0 as usize;

        debug_assert!(end_idx <= s.len());

        let ret = unsafe { s.get_unchecked(start_idx..end_idx) };

        self.iter = unsafe { s.get_unchecked(end_idx..) }.chars();
        self.last_pos = end;
        self.invalidate_cache();

        ret
    }

    #[inline]
    fn uncons_while<F>(&mut self, mut pred: F) -> &'a str
    where
        F: FnMut(char) -> bool,
    {
        let last = {
            let mut last = 0;
            for c in self.iter.clone() {
                if pred(c) {
                    last += c.len_utf8();
                } else {
                    break;
                }
            }
            last
        };

        let s = self.iter.as_str();
        debug_assert!(last <= s.len());
        let ret = unsafe { s.get_unchecked(..last) };

        self.last_pos = self.last_pos + BytePos(last as _);
        self.iter = unsafe { s.get_unchecked(last..) }.chars();
        self.invalidate_cache();

        ret
    }

    #[inline]
    unsafe fn reset_to(&mut self, to: BytePos) {
        if self.last_pos == to {
            // No need to reset.
            return;
        }

        let orig = self.orig;
        let idx = (to - self.orig_start).0 as usize;

        debug_assert!(idx <= orig.len());
        let s = unsafe { orig.get_unchecked(idx..) };
        self.iter = s.chars();
        self.last_pos = to;
        self.invalidate_cache();
    }

    #[inline]
    fn is_byte(&self, c: u8) -> bool {
        self.iter
            .as_str()
            .as_bytes()
            .first()
            .map(|b| *b == c)
            .unwrap_or(false)
    }

    #[inline]
    fn is_str(&self, s: &str) -> bool {
        self.as_str().starts_with(s)
    }

    #[inline]
    fn eat_byte(&mut self, c: u8) -> bool {
        if self.is_byte(c) {
            self.iter.next();
            self.last_pos = self.last_pos + BytePos(1_u32);
            self.shift_cache();
            true
        } else {
            false
        }
    }
}

pub trait Input<'a>: Clone {
    fn cur(&self) -> Option<char>;
    fn peek(&self) -> Option<char>;
    fn peek_ahead(&self) -> Option<char>;

    /// # Safety
    ///
    /// This should be called only when `cur()` returns `Some`. i.e.
    /// when the Input is not empty.
    unsafe fn bump(&mut self);

    /// Returns [None] if it's end of input **or** current character is not an
    /// ascii character.
    #[inline]
    fn cur_as_ascii(&self) -> Option<u8> {
        self.cur().and_then(|i| {
            if i.is_ascii() {
                return Some(i as u8);
            }
            None
        })
    }

    fn is_at_start(&self) -> bool;

    fn cur_pos(&self) -> BytePos;

    fn last_pos(&self) -> BytePos;

    /// # Safety
    ///
    /// - start should be less than or equal to end.
    /// - start and end should be in the valid range of input.
    unsafe fn slice(&mut self, start: BytePos, end: BytePos) -> &'a str;

    /// Takes items from stream, testing each one with predicate. returns the
    /// range of items which passed predicate.
    fn uncons_while<F>(&mut self, f: F) -> &'a str
    where
        F: FnMut(char) -> bool;

    /// # Safety
    ///
    /// - `to` be in the valid range of input.
    unsafe fn reset_to(&mut self, to: BytePos);

    /// Implementors can override the method to make it faster.
    ///
    /// `c` must be ASCII.
    #[inline]
    #[allow(clippy::wrong_self_convention)]
    fn is_byte(&self, c: u8) -> bool {
        match self.cur() {
            Some(ch) => ch == c as char,
            _ => false,
        }
    }

    /// Implementors can override the method to make it faster.
    ///
    /// `s` must be ASCII only.
    fn is_str(&self, s: &str) -> bool;

    /// Implementors can override the method to make it faster.
    ///
    /// `c` must be ASCII.
    #[inline]
    fn eat_byte(&mut self, c: u8) -> bool {
        if self.is_byte(c) {
            unsafe {
                // Safety: We are sure that the input is not empty
                self.bump();
            }
            true
        } else {
            false
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{sync::Lrc, FileName, FilePathMapping, SourceMap};

    fn with_test_sess<F>(src: &'static str, f: F)
    where
        F: FnOnce(StringInput<'_>),
    {
        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Real("testing".into()).into(), src);

        f((&*fm).into())
    }

    #[test]
    fn src_input_slice_1() {
        with_test_sess("foo/d", |mut i| {
            assert_eq!(unsafe { i.slice(BytePos(1), BytePos(2)) }, "f");
            assert_eq!(i.last_pos, BytePos(2));
            assert_eq!(i.cur(), Some('o'));

            assert_eq!(unsafe { i.slice(BytePos(2), BytePos(4)) }, "oo");
            assert_eq!(unsafe { i.slice(BytePos(1), BytePos(4)) }, "foo");
            assert_eq!(i.last_pos, BytePos(4));
            assert_eq!(i.cur(), Some('/'));
        });
    }

    #[test]
    fn src_input_reset_to_1() {
        with_test_sess("load", |mut i| {
            assert_eq!(unsafe { i.slice(BytePos(1), BytePos(3)) }, "lo");
            assert_eq!(i.last_pos, BytePos(3));
            assert_eq!(i.cur(), Some('a'));
            unsafe { i.reset_to(BytePos(1)) };

            assert_eq!(i.cur(), Some('l'));
            assert_eq!(i.last_pos, BytePos(1));
        });
    }

    #[test]
    fn src_input_smoke_01() {
        with_test_sess("foo/d", |mut i| {
            assert_eq!(i.cur_pos(), BytePos(1));
            assert_eq!(i.last_pos, BytePos(1));
            assert_eq!(i.uncons_while(|c| c.is_alphabetic()), "foo");

            // assert_eq!(i.cur_pos(), BytePos(4));
            assert_eq!(i.last_pos, BytePos(4));
            assert_eq!(i.cur(), Some('/'));

            unsafe {
                i.bump();
            }
            assert_eq!(i.last_pos, BytePos(5));
            assert_eq!(i.cur(), Some('d'));

            unsafe {
                i.bump();
            }
            assert_eq!(i.last_pos, BytePos(6));
            assert_eq!(i.cur(), None);
        });
    }

    // #[test]
    // fn src_input_find_01() {
    //     with_test_sess("foo/d", |mut i| {
    //         assert_eq!(i.cur_pos(), BytePos(1));
    //         assert_eq!(i.last_pos, BytePos(1));

    //         assert_eq!(i.find(|c| c == '/'), Some(BytePos(5)));
    //         assert_eq!(i.last_pos, BytePos(5));
    //         assert_eq!(i.cur(), Some('d'));
    //     });
    // }

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
