//! Byte-level cursor for fast input traversal
//!
//! This cursor operates directly on UTF-8 bytes for maximum performance.

use swc_common::BytePos;
use wide::u8x16;

use crate::util::{likely, unlikely};

/// High-performance cursor for traversing input bytes
#[repr(C)] // Ensure predictable memory layout for better cache behavior
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
    #[inline(always)]
    pub fn new(input: &'a str) -> Self {
        let bytes = input.as_bytes();
        Self {
            input: bytes,
            pos: 0,
            len: bytes.len(),
        }
    }

    /// Get the current position as BytePos
    #[inline(always)]
    pub fn pos(&self) -> BytePos {
        BytePos(self.pos as u32)
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
            Some(unsafe { *self.input.get_unchecked(self.pos) })
        }
    }

    /// Peek at a byte at a specific offset from the current position
    #[inline(always)]
    pub fn peek_at(&self, offset: usize) -> Option<u8> {
        let target_pos = self.pos + offset;
        if unlikely(target_pos >= self.len) {
            None
        } else {
            // SAFETY: We've checked that target_pos < len
            Some(unsafe { *self.input.get_unchecked(target_pos) })
        }
    }

    /// Peek at multiple bytes without advancing
    #[inline(always)]
    pub fn peek_n(&self, n: usize) -> &[u8] {
        let end = (self.pos + n).min(self.len);
        // SAFETY: We've ensured end <= len
        unsafe { self.input.get_unchecked(self.pos..end) }
    }

    /// Advance the cursor by one byte
    #[inline(always)]
    pub fn advance(&mut self) {
        if likely(!self.is_eof()) {
            self.pos += 1;
        }
    }

    /// Advance the cursor by n bytes
    #[inline(always)]
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

        // First try with SIMD if we have enough data
        if self.pos + 32 <= self.len {
            self.advance_while_simd(&mut predicate);
        }

        // Fall back to scalar implementation for remainder or if SIMD wasn't used
        if self.pos < self.len {
            self.advance_while_scalar(&mut predicate);
        }

        self.pos - start
    }

    /// SIMD-accelerated implementation of advance_while
    #[inline]
    fn advance_while_simd<F>(&mut self, predicate: &mut F)
    where
        F: FnMut(u8) -> bool,
    {
        const VECTOR_SIZE: usize = 16;

        // Ensure we have enough data to process with SIMD
        if self.pos + VECTOR_SIZE > self.len {
            return;
        }

        // First, manually check a batch of bytes to determine if all match
        // This helps us build a bitmap for bytes that satisfy the predicate
        let mut predicate_bitmap = [0u8; 256];

        // Sample the first 32 bytes and build a bitmap
        // This avoids calling the predicate for every byte in every chunk
        let mut sample_count = 0;
        let end = (self.pos + 32).min(self.len);

        for i in self.pos..end {
            let byte = unsafe { *self.input.get_unchecked(i) };
            let index = byte as usize;

            // Only evaluate each byte value once
            if predicate_bitmap[index] == 0 {
                predicate_bitmap[index] = if predicate(byte) { 1 } else { 2 };
                sample_count += 1;
            }

            // Once we've sampled enough different byte values, break
            if sample_count >= 32 {
                break;
            }
        }

        // Process in chunks of 16 bytes
        'outer: while self.pos + VECTOR_SIZE <= self.len {
            // Check if the next chunk requires predicate evaluation
            // Fast path: simply check the bitmap for each byte
            let mut all_match = true;
            let mut any_mismatch = false;

            // Check individual bytes against bitmap first
            for i in 0..VECTOR_SIZE {
                let pos = self.pos + i;
                let byte = unsafe { *self.input.get_unchecked(pos) };
                let bitmap_val = predicate_bitmap[byte as usize];

                if bitmap_val == 0 {
                    // Undetermined yet, need to check predicate
                    let matches = predicate(byte);
                    predicate_bitmap[byte as usize] = if matches { 1 } else { 2 };

                    if !matches {
                        all_match = false;
                        any_mismatch = true;
                        break;
                    }
                } else if bitmap_val == 2 {
                    // Already known to not match
                    all_match = false;
                    any_mismatch = true;
                    break;
                }
                // If bitmap_val == 1, it matches the predicate (continue)
            }

            if any_mismatch {
                // We found a byte that doesn't match the predicate
                // Find exact position of first mismatch
                for i in 0..VECTOR_SIZE {
                    let pos = self.pos + i;
                    let byte = unsafe { *self.input.get_unchecked(pos) };

                    if predicate_bitmap[byte as usize] == 2
                        || (predicate_bitmap[byte as usize] == 0 && !predicate(byte))
                    {
                        // Found the first byte that doesn't match
                        self.pos = pos;
                        break 'outer;
                    }
                }
                // Shouldn't get here, but just in case
                break;
            }

            if all_match {
                // All bytes in the chunk match, move to next chunk
                self.pos += VECTOR_SIZE;
            }
        }
    }

    /// Scalar (non-SIMD) implementation of advance_while
    #[inline]
    fn advance_while_scalar<F>(&mut self, predicate: &mut F)
    where
        F: FnMut(u8) -> bool,
    {
        const BATCH_SIZE: usize = 32;

        // Process in batches if we have more than BATCH_SIZE bytes
        while self.pos + BATCH_SIZE <= self.len {
            let mut should_stop = false;

            // Check all bytes in the batch
            for i in 0..BATCH_SIZE {
                // SAFETY: We've verified bounds above
                let byte = unsafe { *self.input.get_unchecked(self.pos + i) };
                if !predicate(byte) {
                    should_stop = true;
                    break;
                }
            }

            if should_stop {
                // Found stopping byte, switch to byte-by-byte
                break;
            }

            // Skip the entire batch
            self.pos += BATCH_SIZE;
        }

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
        unsafe { self.input.get_unchecked(self.pos..) }
    }

    /// Get a slice of the input
    #[inline(always)]
    pub fn slice(&self, start: usize, end: usize) -> &'a [u8] {
        let real_start = start.min(self.len);
        let real_end = end.min(self.len);
        // SAFETY: We've validated bounds
        unsafe { self.input.get_unchecked(real_start..real_end) }
    }

    /// Get the current position
    #[inline(always)]
    pub fn position(&self) -> usize {
        self.pos
    }

    /// Reset the cursor to a specific position
    #[inline(always)]
    pub fn reset_to(&mut self, pos: BytePos) {
        self.pos = pos.0 as usize;
    }

    /// Find the next occurrence of a byte
    #[inline]
    pub fn find_byte(&self, byte: u8) -> Option<usize> {
        // If we're at or near EOF, use the standard implementation
        if unlikely(self.pos + 16 > self.len) {
            return self.find_byte_scalar(byte);
        }

        // SIMD implementation using wide crate
        self.find_byte_simd(byte)
    }

    /// SIMD-accelerated implementation of find_byte
    #[inline]
    fn find_byte_simd(&self, byte: u8) -> Option<usize> {
        let input = &self.input[self.pos..];
        let mut position = 0;

        // Process 16 bytes at a time
        while position + 16 <= input.len() {
            // Create a vector with our pattern
            let needle = u8x16::splat(byte);

            // Create a vector with current chunk of data
            let mut data = [0u8; 16];
            data.copy_from_slice(&input[position..position + 16]);
            let chunk = u8x16::new(data);

            // Compare for equality
            let mask = chunk.cmp_eq(needle);

            // Converting to array to check byte-by-byte (no move_mask available)
            let mask_array = mask.to_array();

            // Check for any matches
            #[allow(clippy::needless_range_loop)]
            for i in 0..16 {
                if mask_array[i] != 0 {
                    return Some(self.pos + position + i);
                }
            }

            position += 16;
        }

        // Handle the remainder with the scalar implementation
        if position < input.len() {
            return input[position..]
                .iter()
                .position(|&b| b == byte)
                .map(|pos| self.pos + position + pos);
        }

        None
    }

    /// Standard fallback implementation
    #[inline]
    fn find_byte_scalar(&self, byte: u8) -> Option<usize> {
        self.input[self.pos..]
            .iter()
            .position(|&b| b == byte)
            .map(|pos| self.pos + pos)
    }
}
