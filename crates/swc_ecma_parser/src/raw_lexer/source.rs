use std::ops::Add;

use super::RawLexer;

/// Represents a source of bytes with a start and end position.
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
    pub fn next_byte(&mut self) -> Option<u8> {
        if self.is_eof() {
            None
        } else {
            let byte = *unsafe { self.bytes.get_unchecked(self.pos as usize) };
            self.pos = self.pos.add(1);
            Some(byte)
        }
    }

    /// Returns the byte at the current position without advancing the source
    /// position.
    ///
    /// If the source has reached the end (EOF), it returns `None`. Otherwise,
    /// it returns the byte at the current position.
    pub fn peek_byte(&self) -> Option<u8> {
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
    pub fn peek_2_byte(&self) -> Option<u8> {
        if self.is_eof() || self.pos.add(1) >= self.end {
            None
        } else {
            let byte = *unsafe { self.bytes.get_unchecked((self.pos + 1) as usize) };
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
        self.pos == self.end
    }

    /// Advances the source position by the length of the next character and
    /// returns the character.
    ///
    /// If the source has reached the end (EOF), it returns `None`. Otherwise,
    /// it returns the next character, advances the position by the length
    /// of the character in UTF-8, and returns the character.
    pub fn next_char(&mut self) -> Option<char> {
        if self.is_eof() {
            None
        } else {
            let remain = self.remainder();

            remain.chars().next().and_then(|ch| {
                self.pos += ch.len_utf8() as u32;
                Some(ch)
            })
        }
    }

    /// Returns the next character without advancing the source position.
    ///
    /// If the source has reached the end (EOF), it returns `None`. Otherwise,
    /// it returns the next character.
    pub fn peek_char(&self) -> Option<char> {
        if self.is_eof() {
            None
        } else {
            self.remainder().chars().next()
        }
    }

    /// Peeks two characters ahead without advancing the source position.
    ///
    /// If the source has reached the end (EOF), it returns `None`. Otherwise,
    /// it returns the second character.
    pub fn peek_2_char(&self) -> Option<char> {
        if self.is_eof() {
            None
        } else {
            self.remainder().chars().skip(1).next()
        }
    }

    /// Returns the remaining part of the source as a string slice.
    ///
    /// This method returns a string slice starting from the current position to
    /// the end of the source. It uses `std::str::from_utf8_unchecked` to
    /// convert the byte slice to a string slice.
    pub fn remainder(&self) -> &str {
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
    pub fn consume_until(&mut self, f: impl Fn(u8) -> bool) -> &str {
        let start = self.pos;
        while let Some(byte) = self.peek_byte() {
            if f(byte) {
                break;
            }
            self.next_byte();
        }
        let end = self.pos;
        let slice = &self.bytes[start as usize..end as usize];
        // TODO: confirm if this is safe
        unsafe { std::str::from_utf8_unchecked(slice) }
    }
}

impl RawLexer<'_> {
    /// Returns the byte at the current position without advancing the source
    /// position.
    pub(super) fn peek_byte(&self) -> Option<u8> {
        self.source.peek_byte()
    }

    /// Peeks two bytes ahead without advancing the source position.
    pub(super) fn peek_2_byte(&self) -> Option<u8> {
        self.source.peek_2_byte()
    }

    /// Advances the source position by one byte and returns the byte at the old
    /// position.
    pub(super) fn next_byte(&mut self) -> Option<u8> {
        self.source.next_byte()
    }

    /// Advances the source position by the length of the next character and
    pub(super) fn consume_until(&mut self, f: impl Fn(u8) -> bool) -> &str {
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
    pub(super) fn consume_byte(&mut self) -> bool {
        match self.source.next_byte() {
            Some(_) => true,
            None => false,
        }
    }

    /// Consumes the next character from the source and returns true if
    /// successful.
    ///
    /// This method attempts to consume the next character from the source. If a
    /// character is successfully consumed, it returns `true`. If the source
    /// has reached the end (EOF), it returns `false`.
    #[inline(always)]
    pub(super) fn consume_char(&mut self) -> bool {
        match self.source.next_char() {
            Some(_) => true,
            None => false,
        }
    }
}
