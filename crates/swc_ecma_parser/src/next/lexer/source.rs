//! Pointer-based source cursor derived from OXC's lexer source.
//!
//! The design is based on `oxc_parser::lexer::source` at commit
//! `b6d2a29e47358a288dbfb2a635550243511ec497`. It is adapted to SWC's
//! absolute [`BytePos`] spans and to the workspace MSRV.

use std::{marker::PhantomData, slice, str};

use swc_common::BytePos;

/// Source text and the lexer's current byte position.
///
/// # Invariants
///
/// - `start <= current <= end` and all three pointers belong to the same
///   immutable UTF-8 allocation.
/// - `start` and `end` never change after construction.
/// - `current` is on a UTF-8 character boundary whenever control returns to
///   parser or lexer code that can read a `char` or create a source slice.
pub(super) struct Source<'a> {
    start: *const u8,
    end: *const u8,
    current: *const u8,
    start_pos: BytePos,
    end_pos: BytePos,
    _marker: PhantomData<&'a str>,
}

impl<'a> Source<'a> {
    pub(super) fn new(source: &'a str, start_pos: BytePos, end_pos: BytePos) -> Self {
        debug_assert_eq!(
            end_pos,
            start_pos + BytePos(u32::try_from(source.len()).unwrap_or(u32::MAX))
        );

        let start = source.as_ptr();
        // SAFETY: `source.len()` bytes starting at `start` are one allocation.
        // The one-past-the-end pointer is only compared or used as a slice end.
        let end = unsafe { start.add(source.len()) };

        Self {
            start,
            end,
            current: start,
            start_pos,
            end_pos,
            _marker: PhantomData,
        }
    }

    #[inline(always)]
    pub(super) fn as_str(&self) -> &'a str {
        // SAFETY: The cursor invariants keep `current..end` in the original
        // UTF-8 allocation and on UTF-8 boundaries.
        unsafe { self.str_between(self.current, self.end) }
    }

    #[inline(always)]
    pub(super) fn cur(&self) -> Option<u8> {
        if self.current == self.end {
            None
        } else {
            // SAFETY: `current < end`, so one byte is initialized and readable.
            Some(unsafe { *self.current })
        }
    }

    #[inline(always)]
    pub(super) fn peek(&self) -> Option<u8> {
        if self.remaining_len() < 2 {
            None
        } else {
            // SAFETY: At least two bytes remain in the allocation.
            Some(unsafe { *self.current.add(1) })
        }
    }

    #[inline(always)]
    pub(super) unsafe fn bump_bytes(&mut self, count: usize) {
        debug_assert!(count <= self.remaining_len());
        // SAFETY: Caller guarantees that `count` stays in bounds and leaves the
        // cursor on a UTF-8 boundary before character or slicing APIs are used.
        self.current = unsafe { self.current.add(count) };
    }

    #[inline(always)]
    pub(super) fn cur_as_ascii(&self) -> Option<u8> {
        let byte = self.cur()?;
        byte.is_ascii().then_some(byte)
    }

    #[inline(always)]
    pub(super) fn cur_as_char(&self) -> Option<char> {
        self.as_str().chars().next()
    }

    #[inline(always)]
    pub(super) fn is_at_start(&self) -> bool {
        self.current == self.start
    }

    #[inline(always)]
    pub(super) fn cur_pos(&self) -> BytePos {
        self.start_pos + BytePos(self.consumed_len() as u32)
    }

    /// Return a source slice without changing the cursor.
    ///
    /// # Safety
    ///
    /// `start` and `end` must be ordered absolute positions inside this source
    /// and both must lie on UTF-8 boundaries.
    #[inline(always)]
    pub(super) unsafe fn slice_str(&self, start: BytePos, end: BytePos) -> &'a str {
        debug_assert!(start <= end);
        debug_assert!(self.start_pos <= start && end <= self.end_pos);
        let start_offset = (start - self.start_pos).0 as usize;
        let end_offset = (end - self.start_pos).0 as usize;
        // SAFETY: The caller supplies in-bounds UTF-8 boundary offsets.
        unsafe { self.str_between(self.start.add(start_offset), self.start.add(end_offset)) }
    }

    #[inline]
    pub(super) fn uncons_while(&mut self, mut predicate: impl FnMut(char) -> bool) -> &'a str {
        let source = self.as_str();
        let mut length = 0;
        for character in source.chars() {
            if !predicate(character) {
                break;
            }
            length += character.len_utf8();
        }

        let value = &source[..length];
        // SAFETY: `length` was formed by complete UTF-8 characters in the
        // remaining source and therefore is in bounds and on a boundary.
        unsafe { self.bump_bytes(length) };
        value
    }

    /// Move the cursor to an absolute byte position.
    ///
    /// # Safety
    ///
    /// `position` must be inside this source and on a UTF-8 boundary.
    #[inline(always)]
    pub(super) unsafe fn reset_to(&mut self, position: BytePos) {
        debug_assert!(self.start_pos <= position && position <= self.end_pos);
        let offset = (position - self.start_pos).0 as usize;
        // SAFETY: Caller guarantees `offset` is in bounds.
        self.current = unsafe { self.start.add(offset) };
    }

    #[inline(always)]
    pub(super) fn is_str(&self, value: &str) -> bool {
        self.as_str().starts_with(value)
    }

    /// Advance by one byte if it equals `byte`.
    ///
    /// # Safety
    ///
    /// `byte` must be ASCII so advancing one byte preserves a UTF-8 boundary.
    #[inline(always)]
    pub(super) unsafe fn eat_byte(&mut self, byte: u8) -> bool {
        debug_assert!(byte.is_ascii());
        if self.cur() != Some(byte) {
            return false;
        }
        // SAFETY: A matching ASCII byte exists at the current position.
        unsafe { self.bump_bytes(1) };
        true
    }

    #[inline(always)]
    fn consumed_len(&self) -> usize {
        // SAFETY: Both pointers belong to the same allocation and `current`
        // never precedes `start`.
        unsafe { self.current.offset_from(self.start) as usize }
    }

    #[inline(always)]
    fn remaining_len(&self) -> usize {
        // SAFETY: Both pointers belong to the same allocation and `end` never
        // precedes `current`.
        unsafe { self.end.offset_from(self.current) as usize }
    }

    /// Construct a string between two source pointers.
    ///
    /// # Safety
    ///
    /// Both pointers must be ordered, inside the source allocation, and on
    /// UTF-8 boundaries.
    #[inline(always)]
    unsafe fn str_between(&self, start: *const u8, end: *const u8) -> &'a str {
        debug_assert!((self.start as usize) <= start as usize);
        debug_assert!((start as usize) <= end as usize);
        debug_assert!((end as usize) <= self.end as usize);
        // SAFETY: The caller upholds pointer ordering and UTF-8 boundaries.
        let length = unsafe { end.offset_from(start) as usize };
        let bytes = unsafe { slice::from_raw_parts(start, length) };
        unsafe { str::from_utf8_unchecked(bytes) }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;

    use super::Source;

    #[test]
    fn cursor_tracks_absolute_positions_and_rewinds() {
        let mut source = Source::new("a안녕z", BytePos(10), BytePos(18));
        assert_eq!(source.cur(), Some(b'a'));
        assert_eq!(source.cur_pos(), BytePos(10));

        // SAFETY: ASCII `a` occupies one byte.
        unsafe { source.bump_bytes(1) };
        assert_eq!(source.cur_as_char(), Some('안'));
        assert_eq!(source.cur_pos(), BytePos(11));

        // SAFETY: BytePos(17) is the start of the final ASCII character.
        unsafe { source.reset_to(BytePos(17)) };
        assert_eq!(source.cur(), Some(b'z'));
        assert_eq!(source.as_str(), "z");
    }
}
