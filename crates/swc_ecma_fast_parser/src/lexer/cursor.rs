//! Byte-level cursor for fast input traversal
//!
//! This cursor operates directly on UTF-8 bytes for maximum performance.

use std::slice;

use swc_common::BytePos;

/// High-performance cursor for traversing input bytes
pub struct Cursor<'a> {
    /// Input source as bytes
    input: &'a [u8],

    /// Current position in bytes
    pos: usize,

    /// Length of the input in bytes
    len: usize,
}

impl<'a> Cursor<'a> {
    /// Create a new cursor from a string
    pub fn new(input: &'a str) -> Self {
        let bytes = input.as_bytes();
        Self {
            input: bytes,
            pos: 0,
            len: bytes.len(),
        }
    }

    /// Get the current position as BytePos
    #[inline]
    pub fn pos(&self) -> BytePos {
        BytePos(self.pos as u32)
    }

    /// Check if the cursor is at the end of the input
    #[inline]
    pub fn is_eof(&self) -> bool {
        self.pos >= self.len
    }

    /// Peek at the current byte without advancing
    #[inline]
    pub fn peek(&self) -> Option<u8> {
        if self.is_eof() {
            None
        } else {
            Some(self.input[self.pos])
        }
    }

    /// Peek at a byte at a specific offset from the current position
    #[inline]
    pub fn peek_at(&self, offset: usize) -> Option<u8> {
        let target_pos = self.pos + offset;
        if target_pos >= self.len {
            None
        } else {
            Some(self.input[target_pos])
        }
    }

    /// Peek at multiple bytes without advancing
    #[inline]
    pub fn peek_n(&self, n: usize) -> &[u8] {
        let end = (self.pos + n).min(self.len);
        &self.input[self.pos..end]
    }

    /// Peek at exactly n bytes, returning None if not enough bytes are
    /// available
    #[inline]
    pub fn peek_bytes(&self, n: usize) -> Option<&[u8]> {
        if self.pos + n <= self.len {
            Some(&self.input[self.pos..self.pos + n])
        } else {
            None
        }
    }

    /// Peek at the start byte of the current character (handles multi-byte
    /// UTF-8)
    #[inline]
    pub fn peek_char_start(&self) -> Option<u8> {
        self.peek()
    }

    /// Advance the cursor by one byte
    #[inline]
    pub fn advance(&mut self) {
        if !self.is_eof() {
            self.pos += 1;
        }
    }

    /// Advance the cursor by n bytes
    #[inline]
    pub fn advance_n(&mut self, n: usize) {
        self.pos = (self.pos + n).min(self.len);
    }

    /// Advance until the predicate returns false or EOF is reached
    #[inline]
    pub fn advance_while<F>(&mut self, mut predicate: F) -> usize
    where
        F: FnMut(u8) -> bool,
    {
        let start = self.pos;
        while let Some(byte) = self.peek() {
            if !predicate(byte) {
                break;
            }
            self.advance();
        }
        self.pos - start
    }

    /// Read a specific number of bytes from the current position
    /// and advance the cursor
    #[inline]
    pub fn read_n(&mut self, n: usize) -> &'a [u8] {
        let end = (self.pos + n).min(self.len);
        let bytes = &self.input[self.pos..end];
        self.pos = end;
        bytes
    }

    /// Get slice from the current position to the end
    #[inline]
    pub fn rest(&self) -> &'a [u8] {
        &self.input[self.pos..]
    }

    /// Get a slice of the input
    #[inline]
    pub fn slice(&self, start: usize, end: usize) -> &'a [u8] {
        let real_start = start.min(self.len);
        let real_end = end.min(self.len);
        &self.input[real_start..real_end]
    }

    /// Check if the current position matches the given string
    #[inline]
    pub fn matches_str(&self, s: &str) -> bool {
        let bytes = s.as_bytes();
        if self.pos + bytes.len() > self.len {
            return false;
        }

        // Fast direct byte comparison
        let input_slice = &self.input[self.pos..(self.pos + bytes.len())];
        input_slice == bytes
    }

    /// Check if the current position matches any of the given bytes
    #[inline]
    pub fn matches_any(&self, bytes: &[u8]) -> bool {
        if let Some(current) = self.peek() {
            bytes.contains(&current)
        } else {
            false
        }
    }

    /// Get the current position
    #[inline]
    pub fn position(&self) -> usize {
        self.pos
    }

    /// Find the next occurrence of a byte
    #[inline]
    pub fn find_byte(&self, byte: u8) -> Option<usize> {
        self.input[self.pos..]
            .iter()
            .position(|&b| b == byte)
            .map(|pos| self.pos + pos)
    }

    /// Get the substring between the current position and the given byte
    /// Returns None if the byte is not found
    #[inline]
    pub fn substring_until_byte(&self, byte: u8) -> Option<&'a str> {
        self.find_byte(byte).map(|end| {
            let bytes = &self.input[self.pos..end];
            // Safety: we know this is valid UTF-8 because the original input was a &str
            unsafe { std::str::from_utf8_unchecked(bytes) }
        })
    }
}
