use std::str;

use debug_unreachable::debug_unreachable;

use crate::syntax_pos::{BytePos, SourceFile};

pub type SourceFileInput<'a> = StringInput<'a>;

#[derive(Clone)]
/// Represents a fast input for string operations.
pub struct StringInput<'a> {
    /// The byte slice of the input string.
    inner: &'a [u8],
    /// The current offset in the byte slice.
    offset: u32,
    /// The starting position of the input.
    start_pos: BytePos,
    /// The ending position of the input.
    end_pos: BytePos,
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

impl<'a> StringInput<'a> {
    pub fn new(src: &'a str, start: BytePos, end: BytePos) -> Self {
        assert!(start <= end);

        StringInput {
            inner: src.as_bytes(),
            offset: 0,
            start_pos: start,
            end_pos: end,
        }
    }

    #[inline(always)]
    // FIXME: as_str should be replace by self.remain()
    pub fn as_str(&self) -> &str {
        self.remain()
    }

    #[inline]
    pub fn bump_bytes(&mut self, n: usize) {
        self.offset += n as u32;
    }

    pub fn start_pos(&self) -> BytePos {
        self.start_pos
    }

    pub fn end_pos(&self) -> BytePos {
        self.end_pos
    }

    #[inline(always)]
    fn remain_n_byte(&self, n: usize) -> &str {
        unsafe { str::from_utf8_unchecked(self.inner.get_unchecked(self.offset as usize + n..)) }
    }

    #[inline(always)]
    fn remain(&self) -> &str {
        unsafe { str::from_utf8_unchecked(self.inner.get_unchecked(self.offset as usize..)) }
    }

    #[inline(always)]
    fn peek_n_byte(&self, n: usize) -> Option<u8> {
        if self.offset as usize + n < self.inner.len() {
            Some(unsafe { *self.inner.get_unchecked(self.offset as usize + n) })
        } else {
            None
        }
    }

    #[inline(always)]
    fn peek_n_char(&self, n: usize) -> Option<char> {
        let byte = self.peek_n_byte(n)?;
        if byte.is_ascii() {
            Some(byte as char)
        } else {
            // SAFETY: The byte offset onw is guaranteed to be non-empty due to the initial
            // check.
            self.remain_n_byte(n).chars().next()
        }
    }
}

impl Input for StringInput<'_> {
    // Returns the current character at the cursor position.
    // If the character is ASCII, it is returned directly.
    // Otherwise, the function returns the next character from the remaining string.
    #[inline]
    fn cur(&mut self) -> Option<char> {
        self.peek_n_char(0)
    }

    #[inline]
    /// Peeks the next character in the input without advancing the cursor.
    fn peek(&mut self) -> Option<char> {
        self.peek_n_char(1)
    }

    /// Peeks the character two positions ahead in the input without advancing
    /// the cursor. If the character is ASCII, it is returned directly.
    /// Otherwise, the function returns the next character from the remaining
    /// string.
    #[inline]
    fn peek_ahead(&mut self) -> Option<char> {
        self.peek_n_char(2)
    }

    #[inline]
    /// Advances the cursor position by the length of the next Unicode scalar
    /// value. This function is unsafe because it assumes the input is valid
    /// UTF-8.
    unsafe fn bump(&mut self) {
        // Attempt to peek the next byte without advancing the cursor
        if let Some(byte) = self.peek_n_byte(0) {
            // If the byte is an ASCII character, bump the cursor by 1 byte
            if byte.is_ascii() {
                self.bump_bytes(1);
            } else {
                // If the byte is not ASCII, bump the cursor by the length of the next Unicode
                // scalar value
                let ch = self.remain().chars().next().expect("Must have next char");
                self.bump_bytes(ch.len_utf8());
            }
        } else {
            // If there's no next byte, it means cur() would return None, which is an
            // invalid state
            unsafe {
                debug_unreachable!("bump should not be called when cur() == None");
            }
        }
    }

    /// Checks if the cursor is at the start of the input.
    #[inline]
    fn is_at_start(&self) -> bool {
        // Returns true if the current offset is 0, indicating the cursor is at the
        // start.
        self.offset == 0
    }

    #[inline]
    fn cur_pos(&mut self) -> BytePos {
        self.start_pos + BytePos(self.offset)
    }

    #[inline]
    fn last_pos(&self) -> BytePos {
        self.start_pos + BytePos(self.offset)
    }

    /// Slices the input string from `start` to `end` and updates the cursor
    /// position.
    ///
    /// This function is unsafe because it uses `str::from_utf8_unchecked` to
    /// convert the byte slice to a string slice without checking if the
    /// byte slice is valid UTF-8.
    ///
    /// # Safety
    /// The caller must ensure that the byte slice from `start_idx` to `end_idx`
    /// is valid UTF-8.
    ///
    /// # Panics
    /// Panics if `start` is greater than `end`.
    ///
    /// # Returns
    /// A string slice from `start` to `end`.
    unsafe fn slice(&mut self, start: BytePos, end: BytePos) -> &str {
        // Assert that start is less than or equal to end
        debug_assert!(start <= end, "Cannot slice {:?}..{:?}", start, end);
        // Calculate the start and end indices in the byte slice
        let start_idx = (start - self.start_pos).0 as usize;
        let end_idx = (end - self.start_pos).0 as usize;
        // Assert that the end index is within the bounds of the byte slice
        debug_assert!(end_idx <= self.inner.len());

        // Update the cursor position to the end index
        self.offset = end_idx as u32;

        // Convert the byte slice to a string slice without checking if it's valid UTF-8
        str::from_utf8_unchecked(&self.inner[start_idx..end_idx])
    }

    /// Consumes characters from the input while a predicate is true.
    ///
    /// This function iterates over the remaining characters in the input,
    /// applying the given predicate to each character. It stops when the
    /// predicate returns `false` for a character. The function then returns a
    /// string slice from the original position to the position after the
    /// last character that satisfied the predicate.
    ///
    /// # Safety
    /// This function uses `str::from_utf8_unchecked` to convert the byte slice
    /// to a string slice without checking if the byte slice is valid UTF-8.
    /// The caller must ensure that the byte slice from the original position to
    /// the new position is valid UTF-8.
    ///
    /// # Returns
    /// A string slice from the original position to the position after the last
    /// character that satisfied the predicate.
    fn uncons_while<F>(&mut self, mut pred: F) -> &str
    where
        F: FnMut(char) -> bool,
    {
        // The number of bytes moved
        let mut moved = 0;

        // Iterate over the remaining characters in the input
        for ch in self.remain().chars() {
            // If the predicate is true for the current character, increment the moved count
            // by the character's UTF-8 length
            if pred(ch) {
                moved += ch.len_utf8();
            } else {
                // If the predicate is false, break the loop
                break;
            }
        }

        // Assert that the number of bytes moved does not exceed the total number of
        // bytes in the input
        debug_assert!(moved <= self.inner.len());

        let origin_offset = self.offset; // Store the original offset

        // Update the offset by the number of bytes moved
        self.offset += moved as u32;

        // Convert the byte slice from the original offset to the new offset to a string
        // slice without checking if it's valid UTF-8
        let ret = unsafe {
            str::from_utf8_unchecked(
                self.inner
                    .get_unchecked(origin_offset as usize..self.offset as usize),
            )
        };

        ret
    }

    /// Finds the position of the first character that satisfies the predicate.
    ///
    /// This method iterates over the remaining characters in the input and
    /// increments the `moved` counter by the UTF-8 length of each character.
    /// When the predicate is true for a character, the iteration stops.
    ///
    /// If no character satisfies the predicate, the method returns `None`.
    /// Otherwise, it updates the `offset` by the number of bytes moved and
    /// returns the new position as a `BytePos`.
    ///
    /// # Returns
    /// An `Option` containing the position of the first character that
    /// satisfies the predicate, or `None` if no such character is found.
    fn find<F>(&mut self, mut pred: F) -> Option<BytePos>
    where
        F: FnMut(char) -> bool,
    {
        // The number of bytes moved
        let mut moved = 0;

        // Iterate over the remaining characters in the input
        for ch in self.remain().chars() {
            // Increment the moved counter by the UTF-8 length of the current character
            moved += ch.len_utf8();
            // If the predicate is true for the current character, break the loop
            if pred(ch) {
                break;
            }
        }

        // If no character satisfied the predicate, return None
        if moved == 0 {
            return None;
        }

        // Assert that the number of bytes moved does not exceed the total number of
        // bytes in the input
        debug_assert!(moved <= self.inner.len());

        // Update the offset by the number of bytes moved
        self.offset += moved as u32;

        Some(self.start_pos + BytePos(self.offset))
    }

    /// Checks if the remaining input starts with a given byte.
    ///
    /// It is used in the parsing process to match specific patterns.
    ///
    /// Returns a boolean value indicating whether the input starts
    /// with the given byte.
    fn is_byte(&mut self, c: u8) -> bool {
        match self.peek_n_byte(0) {
            Some(byte) => byte == c,
            None => false,
        }
    }

    /// Resets the input position to a specified BytePos.
    ///
    /// This method calculates the new offset from the start position to the
    /// specified position and updates the current offset. It asserts that
    /// the new offset does not exceed the total number of bytes in the
    /// input.
    ///
    /// # Safety
    ///
    /// This method is marked as unsafe because it directly manipulates the
    /// internal state of the input without performing additional checks. It
    /// is the caller's responsibility to ensure that the provided `to`
    /// position is valid and does not exceed the bounds of the input.
    ///
    /// # Parameters
    ///
    /// * `to`: The new position to which the input should be reset.
    ///
    /// # Effects
    ///
    /// Updates the `offset` field of the input to the new position.
    unsafe fn reset_to(&mut self, to: BytePos) {
        let new_offset = (to - self.start_pos).0;
        debug_assert!(new_offset <= self.inner.len() as u32);
        self.offset = new_offset;
    }

    /// Checks if the remaining input starts with a given string.
    ///
    /// It is used in the parsing process to match specific patterns.
    ///
    /// Returns a boolean value indicating whether the input starts
    /// with the given string.
    fn is_str(&self, s: &str) -> bool {
        self.remain().starts_with(s)
    }
}
pub trait Input: Clone {
    fn cur(&mut self) -> Option<char>;
    fn peek(&mut self) -> Option<char>;
    fn peek_ahead(&mut self) -> Option<char>;

    /// # Safety
    ///
    /// This should be called only when `cur()` returns `Some`. i.e.
    /// when the Input is not empty.
    unsafe fn bump(&mut self);

    /// Returns [None] if it's end of input **or** current character is not an
    /// ascii character.
    #[inline]
    fn cur_as_ascii(&mut self) -> Option<u8> {
        self.cur().and_then(|i| {
            if i.is_ascii() {
                return Some(i as u8);
            }
            None
        })
    }

    fn is_at_start(&self) -> bool;

    fn cur_pos(&mut self) -> BytePos;

    fn last_pos(&self) -> BytePos;

    /// # Safety
    ///
    /// - start should be less than or equal to end.
    /// - start and end should be in the valid range of input.
    unsafe fn slice(&mut self, start: BytePos, end: BytePos) -> &str;

    /// Takes items from stream, testing each one with predicate. returns the
    /// range of items which passed predicate.
    fn uncons_while<F>(&mut self, f: F) -> &str
    where
        F: FnMut(char) -> bool;

    /// This method modifies [last_pos()] and [cur_pos()].
    fn find<F>(&mut self, f: F) -> Option<BytePos>
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
    fn is_byte(&mut self, c: u8) -> bool {
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
    use std::sync::Arc;

    use super::*;
    use crate::{FileName, FilePathMapping, SourceMap};

    fn with_test_sess<F>(src: &str, f: F)
    where
        F: FnOnce(StringInput<'_>),
    {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
        let fm = cm.new_source_file(FileName::Real("testing".into()).into(), src.into());

        f((&*fm).into())
    }

    #[test]
    fn src_input_slice_1() {
        with_test_sess("foo/d", |mut i| {
            assert_eq!(unsafe { i.slice(BytePos(1), BytePos(2)) }, "f");
            assert_eq!(i.last_pos(), BytePos(2));
            assert_eq!(i.cur(), Some('o'));

            assert_eq!(unsafe { i.slice(BytePos(2), BytePos(4)) }, "oo");
            assert_eq!(unsafe { i.slice(BytePos(1), BytePos(4)) }, "foo");
            assert_eq!(i.last_pos(), BytePos(4));
            assert_eq!(i.cur(), Some('/'));
        });
    }

    #[test]
    fn src_input_reset_to_1() {
        with_test_sess("load", |mut i| {
            assert_eq!(unsafe { i.slice(BytePos(1), BytePos(3)) }, "lo");
            assert_eq!(i.last_pos(), BytePos(3));
            assert_eq!(i.cur(), Some('a'));
            unsafe { i.reset_to(BytePos(1)) };

            assert_eq!(i.cur(), Some('l'));
            assert_eq!(i.last_pos(), BytePos(1));
        });
    }

    #[test]
    fn src_input_smoke_01() {
        with_test_sess("foo/d", |mut i| {
            assert_eq!(i.cur_pos(), BytePos(1));
            assert_eq!(i.last_pos(), BytePos(1));
            assert_eq!(i.uncons_while(|c| c.is_alphabetic()), "foo");

            // assert_eq!(i.cur_pos(), BytePos(4));
            assert_eq!(i.last_pos(), BytePos(4));
            assert_eq!(i.cur(), Some('/'));

            unsafe {
                i.bump();
            }
            assert_eq!(i.last_pos(), BytePos(5));
            assert_eq!(i.cur(), Some('d'));

            unsafe {
                i.bump();
            }
            assert_eq!(i.last_pos(), BytePos(6));
            assert_eq!(i.cur(), None);
        });
    }

    #[test]
    fn src_input_find_01() {
        with_test_sess("foo/d", |mut i| {
            assert_eq!(i.cur_pos(), BytePos(1));
            assert_eq!(i.last_pos(), BytePos(1));

            assert_eq!(i.find(|c| c == '/'), Some(BytePos(5)));
            assert_eq!(i.last_pos(), BytePos(5));
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
