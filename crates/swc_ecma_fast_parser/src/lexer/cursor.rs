//! Byte-level cursor for fast input traversal
//!
//! This cursor operates directly on UTF-8 bytes for maximum performance.

use assume::assume;
use swc_common::BytePos;

use crate::util::unlikely;

/// High-performance cursor for traversing input bytes
#[repr(C)] // Ensure predictable memory layout for better cache behavior
pub struct Cursor<'a> {
    /// Current position in bytes
    pos: u32,

    /// Length of the input in bytes
    len: u32,

    /// Input source as bytes
    input: &'a [u8],
}

impl<'a> Cursor<'a> {
    /// Create a new cursor from a string
    #[inline(always)]
    pub fn new(input: &'a str) -> Self {
        let bytes = input.as_bytes();
        Self {
            input: bytes,
            pos: 0,
            len: bytes.len() as u32,
        }
    }

    /// Get the current position as BytePos
    #[inline(always)]
    pub fn pos(&self) -> BytePos {
        BytePos(self.pos)
    }

    /// Check if the cursor is at the end of the input
    #[inline(always)]
    pub fn is_eof(&self) -> bool {
        self.pos >= self.len
    }

    /// Peek at the current byte without advancing
    #[inline(always)]
    pub fn peek(&self) -> Option<u8> {
        if unlikely(self.is_eof()) {
            None
        } else {
            // SAFETY: We've checked that pos < len
            Some(unsafe { *self.input.get_unchecked(self.pos as usize) })
        }
    }

    /// Peek at the current character without advancing
    #[inline(always)]
    pub fn peek_char(&self) -> Option<char> {
        self.peek().and_then(|b| {
            if b.is_ascii() {
                Some(b as char)
            } else {
                let rest_str = unsafe { std::str::from_utf8_unchecked(self.rest()) };
                rest_str.chars().next()
            }
        })
    }

    /// Peek at a byte at a specific offset from the current position
    #[inline(always)]
    pub fn peek_at(&self, offset: u32) -> Option<u8> {
        let target_pos = self.pos + offset;
        if unlikely(target_pos >= self.len) {
            None
        } else {
            // SAFETY: We've checked that target_pos < len
            Some(unsafe { *self.input.get_unchecked(target_pos as usize) })
        }
    }

    /// Peek at multiple bytes without advancing
    #[inline(always)]
    pub fn peek_n(&self, n: u32) -> &[u8] {
        let end = (self.pos + n).min(self.len);
        // SAFETY: We've ensured end <= len
        unsafe { self.input.get_unchecked(self.pos as usize..end as usize) }
    }

    /// Advance the cursor by one byte
    #[inline(always)]
    pub fn advance(&mut self) {
        assume!(unsafe: !self.is_eof());
        self.pos += 1;
    }

    /// Advance the cursor by one character
    #[inline(always)]
    pub fn advance_char(&mut self) {
        assume!(unsafe: !self.is_eof());
        let byte = self.peek().unwrap();
        if byte.is_ascii() {
            self.advance();
        } else {
            let rest_str = unsafe { std::str::from_utf8_unchecked(self.rest()) };
            let ch = rest_str.chars().next().unwrap();
            self.advance_n(ch.len_utf8() as u32);
        }
    }

    /// Advance the cursor by n bytes
    #[inline(always)]
    pub fn advance_n(&mut self, n: u32) {
        assume!(unsafe: self.pos + n <= self.len);
        self.pos += n;
    }

    /// Advance until the predicate returns false or EOF is reached
    #[inline]
    pub fn advance_while<F>(&mut self, predicate: F) -> u32
    where
        F: Fn(u8) -> bool,
    {
        let start = self.pos;

        self.advance_while_scalar(&predicate);

        self.pos - start
    }

    /// Scalar (non-SIMD) implementation of advance_while
    #[inline]
    fn advance_while_scalar<F>(&mut self, predicate: &F)
    where
        F: Fn(u8) -> bool,
    {
        // Warning: Do not scalarize if we do not use SIMD
        // const BATCH_SIZE: u32 = 32;

        // // Process in batches if we have more than BATCH_SIZE bytes
        // while self.pos + BATCH_SIZE <= self.len {
        //     let mut should_stop = false;

        //     // Check all bytes in the batch
        //     for i in 0..BATCH_SIZE {
        //         // SAFETY: We've verified bounds above
        //         let byte = unsafe { *self.input.get_unchecked((self.pos + i) as
        // usize) };         if !predicate(byte) {
        //             should_stop = true;
        //             break;
        //         }
        //     }

        //     if should_stop {
        //         // Found stopping byte, switch to byte-by-byte
        //         break;
        //     }

        //     // Skip the entire batch
        //     self.pos += BATCH_SIZE;
        // }

        // Byte-by-byte for the remainder
        while let Some(byte) = self.peek() {
            if !predicate(byte) {
                break;
            }
            self.advance();
        }
    }

    /// Get slice from the current position to the end
    #[inline(always)]
    pub fn rest(&self) -> &'a [u8] {
        // SAFETY: pos is always <= len
        unsafe { self.input.get_unchecked(self.pos as usize..) }
    }

    /// Get a slice of the input without bounds checking.
    ///
    /// # Safety
    ///
    /// The caller must ensure that `start <= end <= self.len`.
    #[inline(always)]
    pub unsafe fn slice_unchecked(&self, start: u32, end: u32) -> &'a [u8] {
        assume!(unsafe: start <= end);
        assume!(unsafe: end <= self.len);
        self.input.get_unchecked(start as usize..end as usize)
    }

    /// Get the current position
    #[inline(always)]
    pub fn position(&self) -> u32 {
        self.pos
    }

    /// Reset the cursor to a specific position
    #[inline(always)]
    pub fn reset_to(&mut self, pos: BytePos) {
        self.pos = pos.0;
    }
}
