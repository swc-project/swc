use std::ops::Add;

use super::{
    unicode::{CR, LF, LS, PS},
    RawLexer,
};

/// Represents a source of bytes with a start and end position.
#[derive(Clone)]
pub(super) struct Source<'source> {
    /// The slice of bytes that makes up the source.
    bytes: &'source [u8],

    /// Represents the current position within the source.
    pos: u32,

    /// The ending position within the source.
    end: u32,
}

impl<'source> Source<'source> {
    /// Creates a new `Source` instance from a given string slice.
    ///
    /// This method converts the string slice into a byte slice and initializes
    /// the `Source` instance with the byte slice, starting position at 0, and
    /// ending position at the length of the byte slice.
    pub fn new(source: &'source str) -> Self {
        let bytes = source.as_bytes();
        Self {
            bytes,
            pos: 0,
            end: bytes.len() as u32,
        }
    }

    /// Advances the source position by one byte and returns the byte at the old
    /// position.
    ///
    /// If the source has reached the end (EOF), it returns `None`. Otherwise,
    /// it returns the byte at the current position, increments the position
    /// by one, and returns the byte.
    #[inline(always)]
    fn next_byte(&mut self) -> Option<u8> {
        if self.is_eof() {
            None
        } else {
            let byte = *unsafe { self.bytes.get_unchecked(self.pos as usize) };
            self.pos = self.pos.add(1);
            Some(byte)
        }
    }

    /// Consumes a byte from the source.
    ///
    /// This method checks if the current position is less than the end
    /// position. If it is, it increments the position by one.
    #[inline(always)]
    fn consume_byte(&mut self) -> bool {
        if self.pos < self.end {
            self.pos = self.pos.add(1);
            true
        } else {
            false
        }
    }

    /// Consumes `n` bytes from the source.
    ///
    /// This method checks if the current position plus `n` is less than the end
    /// position. If it is, it increments the position by `n` and returns
    /// `true`. Otherwise, it returns `false`.
    #[inline(always)]
    fn consume_n_byte(&mut self, n: u32) -> bool {
        if self.pos.add(n) < self.end {
            self.pos = self.pos.add(n);
            true
        } else {
            false
        }
    }

    /// Returns the byte at the current position without advancing the source
    /// position.
    ///
    /// If the source has reached the end (EOF), it returns `None`. Otherwise,
    /// it returns the byte at the current position.
    #[inline(always)]
    fn peek_byte(&self) -> Option<u8> {
        if self.is_eof() {
            None
        } else {
            let byte = *unsafe { self.bytes.get_unchecked(self.pos as usize) };
            Some(byte)
        }
    }

    /// Peeks two bytes ahead without advancing the source position.
    ///
    /// This method is not implemented yet. It should return the next two bytes
    /// as a `u8` if they are available, or `None` if the source has
    /// reached the end (EOF).
    #[inline(always)]
    fn peek_2_byte(&self) -> Option<u8> {
        if self.pos.add(1) >= self.end {
            None
        } else {
            let byte = *unsafe { self.bytes.get_unchecked((self.pos + 1) as usize) };
            Some(byte)
        }
    }

    /// Peeks `n` bytes ahead without advancing the source position.
    ///
    /// This method checks if the current position plus `n` is beyond the end
    /// position. If it is, it returns `None`. Otherwise, it returns the byte
    /// at the position `n` bytes ahead.
    #[inline(always)]
    fn peek_n_byte(&self, n: u32) -> Option<u8> {
        if self.pos.add(n) >= self.end {
            None
        } else {
            // Safety: The position is checked to be within bounds before accessing the
            // byte.
            let byte = *unsafe { self.bytes.get_unchecked((self.pos + n) as usize) };

            Some(byte)
        }
    }

    /// Checks if the source has reached the end (EOF).
    ///
    /// This method compares the current position with the end position. If they
    /// are equal, it means the source has reached the end, and it returns
    /// `true`. Otherwise, it returns `false`.
    #[inline(always)]
    pub fn is_eof(&self) -> bool {
        self.pos >= self.end
    }

    /// Advances the source position by the length of the next character and
    /// returns the character.
    ///
    /// If the source has reached the end (EOF), it returns `None`. Otherwise,
    /// it returns the next character, advances the position by the length
    /// of the character in UTF-8, and returns the character.
    #[inline(always)]
    fn next_char(&mut self) -> Option<char> {
        self.peek_byte().and_then(|next_byte| {
            if next_byte.is_ascii() {
                self.pos = self.pos.add(1);

                return Some(next_byte as char);
            }

            self.remainder().chars().next().and_then(|ch| {
                self.pos += ch.len_utf8() as u32;
                Some(ch)
            })
        })
    }

    /// Returns the next character without advancing the source position.
    ///
    /// If the source has reached the end (EOF), it returns `None`. Otherwise,
    /// it returns the next character.
    #[inline(always)]
    fn peek_char(&self) -> Option<char> {
        self.peek_byte().and_then(|next_byte| {
            if next_byte.is_ascii() {
                return Some(next_byte as char);
            }

            self.remainder().chars().next()
        })
    }

    /// Peeks two characters ahead without advancing the source position.
    ///
    /// This method checks if the source has reached the end (EOF) or if there
    /// is at least one more character ahead. If the source has reached the
    /// end (EOF), it returns `None`. Otherwise, it returns the second
    /// character.
    #[inline(always)]
    fn peek_2_char(&self) -> Option<char> {
        if self.pos.add(1) >= self.end {
            None
        } else {
            // If there is at least one more character ahead, return the second character.
            self.remainder().chars().skip(1).next()
        }
    }

    /// Returns the remaining part of the source as a string slice.
    ///
    /// This method returns a string slice starting from the current position to
    /// the end of the source. It uses `std::str::from_utf8_unchecked` to
    /// convert the byte slice to a string slice.
    #[inline(always)]
    fn remainder(&self) -> &str {
        let start = self.pos;

        assert!(start <= self.end);

        unsafe { std::str::from_utf8_unchecked(&self.bytes[start as usize..]) }
    }

    /// Returns the current position within the source.
    ///
    /// This method returns the current position of the source as a `u32` value.
    #[inline(always)]
    pub fn offset(&self) -> u32 {
        self.pos
    }

    /// Consumes the next character from the source and returns true if
    #[inline(always)]
    fn consume_until(&mut self, f: impl Fn(char) -> bool) -> &str {
        let start = self.pos;
        while let Some(ch) = self.next_char() {
            if f(ch) {
                break;
            }
        }
        let end = self.pos;
        let slice = &self.bytes[start as usize..end as usize];
        // TODO: confirm if this is safe
        unsafe { std::str::from_utf8_unchecked(slice) }
    }

    /// Extracts a string slice from the source starting from the given `start`
    /// position to the current position.
    ///
    /// This method calculates the end position based on the current offset of
    /// the source, then extracts a byte slice from the source bytes
    /// starting from the `start` position to the `end` position. Finally, it
    /// converts the byte slice to a string slice using
    /// `std::str::from_utf8_unchecked` and returns it.
    ///
    /// # Safety
    /// This method assumes that the byte slice extracted from the source is
    /// valid UTF-8. If the slice is not valid UTF-8, the behavior is
    /// undefined.
    fn str_from_start_to_current(&self, start: u32) -> &str {
        assert!(start <= self.end);

        let end = self.offset();

        let buffer = &self.bytes[start as usize..end as usize];

        unsafe { std::str::from_utf8_unchecked(buffer) }
    }

    fn str_from_pos(&self, start: u32, end: u32) -> &str {
        assert!(start <= end);
        assert!(end <= self.end);

        let buffer = &self.bytes[start as usize..end as usize];

        unsafe { std::str::from_utf8_unchecked(buffer) }
    }
}

impl RawLexer<'_> {
    /// Returns the byte at the current position without advancing the source
    /// position.
    #[inline(always)]
    pub(super) fn peek_byte(&self) -> Option<u8> {
        self.source.peek_byte()
    }

    /// Peeks two bytes ahead without advancing the source position.
    #[inline(always)]
    pub(super) fn peek_2_byte(&self) -> Option<u8> {
        self.source.peek_2_byte()
    }

    /// Peeks the next character without advancing the source position.
    ///
    /// It returns the character at the next position
    /// if it exists, otherwise returns `None`.
    #[inline(always)]
    pub(super) fn peek_char(&self) -> Option<char> {
        self.source.peek_char()
    }

    /// Peeks two characters ahead without advancing the source position.
    ///
    /// It returns the character at the second
    /// position ahead if it exists, otherwise returns `None`.
    #[inline(always)]
    pub(super) fn peek_2_char(&self) -> Option<char> {
        self.source.peek_2_char()
    }

    // pub(super) fn peek_2_char(&self) -> Option<char> {
    //     self.source.peek_2_char()
    // }

    /// Advances the source position by the length of the next character and
    /// returns the character.
    ///
    /// This method attempts to consume the next character from the source. If a
    /// character is successfully consumed, it returns `Some(char)`. If the
    /// source has reached the end (EOF), it returns `None`.
    #[inline(always)]
    pub(super) fn next_char(&mut self) -> Option<char> {
        self.source.next_char()
    }

    /// Peeks ahead `n` bytes without advancing the source position.
    ///
    /// This method peeks ahead `n` bytes in the source without advancing the
    /// current position. It returns the byte at the `n`th position ahead if
    /// it exists, otherwise returns `None`.
    #[inline(always)]
    pub(super) fn peek_n_byte(&self, n: u32) -> Option<u8> {
        self.source.peek_n_byte(n)
    }

    /// Advances the source position by one byte and returns the byte at the old
    /// position.
    #[inline(always)]
    pub(super) fn next_byte(&mut self) -> Option<u8> {
        self.source.next_byte()
    }

    /// Consumes `n` bytes from the source.
    ///
    /// This method checks if the current position plus `n` is less than the end
    /// position. If it is, it increments the position by `n` and returns
    /// `true`. Otherwise, it returns `false`.
    #[inline(always)]
    pub(super) fn consume_n_byte(&mut self, n: u32) -> bool {
        self.source.consume_n_byte(n)
    }

    /// Advances the source position by the length of the next character and
    #[inline(always)]
    pub(super) fn consume_until(&mut self, f: impl Fn(char) -> bool) -> &str {
        self.source.consume_until(f)
    }

    #[inline(always)]
    /// Returns the current position within the source.
    pub(super) fn offset(&self) -> u32 {
        self.source.offset()
    }

    /// Consumes the next byte from the source and returns true if successful.
    ///
    /// This method attempts to consume the next byte from the source. If a byte
    /// is successfully consumed, it returns `true`. If the source has
    /// reached the end (EOF), it returns `false`.
    #[inline(always)]
    pub(super) fn consume_byte(&mut self) -> bool {
        self.source.consume_byte()
    }

    /// Consumes the next character from the source and returns true if
    /// successful.
    ///
    /// This method attempts to consume the next character from the source. If a
    /// character is successfully consumed, it returns `true`. If the source
    /// has reached the end (EOF), it returns `false`.
    #[inline(always)]
    pub(super) fn consume_char(&mut self) -> bool {
        self.source.next_char().is_some()
    }

    /// Returns a string slice from the start position to the current position.
    ///
    /// This method takes a `start` position as an argument and returns a string
    /// slice from that position to the current position within the source.
    pub(super) fn str_from_start_to_current(&self, start: u32) -> &str {
        self.source.str_from_start_to_current(start)
    }

    pub fn str_from_pos(&self, start: u32, end: u32) -> &str {
        self.source.str_from_pos(start, end)
    }

    #[inline(always)]
    pub fn consume_single_line(&mut self) -> &str {
        self.token.is_on_new_line = true;
        let line = self.consume_until(|ch| matches!(ch, LF | CR | LS | PS));
        line
    }
}
