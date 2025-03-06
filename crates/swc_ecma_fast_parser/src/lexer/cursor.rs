//! Byte-level cursor for fast input traversal
//!
//! This cursor operates directly on UTF-8 bytes for maximum performance.

#[cfg(target_arch = "x86_64")]
use std::arch::x86_64::*;

use swc_common::BytePos;

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
    /// Optimized with SIMD when available
    #[inline]
    pub fn advance_while<F>(&mut self, mut predicate: F) -> usize
    where
        F: FnMut(u8) -> bool,
    {
        let start = self.pos;

        // First process in batches for common ASCII cases
        #[cfg(target_arch = "x86_64")]
        {
            if is_x86_feature_detected!("avx2") {
                unsafe {
                    self.advance_while_avx2(&mut predicate);
                }
            } else if is_x86_feature_detected!("sse2") {
                unsafe {
                    self.advance_while_sse2(&mut predicate);
                }
            } else {
                self.advance_while_scalar(&mut predicate);
            }
        }

        #[cfg(not(target_arch = "x86_64"))]
        {
            self.advance_while_scalar(&mut predicate);
        }

        self.pos - start
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

    /// SSE2 implementation of advance_while for x86_64
    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "sse2")]
    #[inline]
    unsafe fn advance_while_sse2<F>(&mut self, predicate: &mut F) -> ()
    where
        F: FnMut(u8) -> bool,
    {
        const VECTOR_SIZE: usize = 16;

        // Process 16 bytes at a time with SSE2
        while self.pos + VECTOR_SIZE <= self.len {
            // Load 16 bytes
            let data_ptr = self.input.as_ptr().add(self.pos);
            let data = _mm_loadu_si128(data_ptr as *const __m128i);

            // Check each byte individually
            let mut mask = 0;
            for i in 0..VECTOR_SIZE {
                let byte = *data_ptr.add(i);
                if !predicate(byte) {
                    mask |= 1 << i;
                    break;
                }
            }

            // If any byte failed the predicate, stop
            if mask != 0 {
                // Find the first failing byte
                let trailing_zeros = mask.trailing_zeros() as usize;
                self.pos += trailing_zeros;
                return;
            }

            // All bytes passed, advance by vector size
            self.pos += VECTOR_SIZE;
        }

        // Handle remaining bytes one by one
        while let Some(byte) = self.peek() {
            if !predicate(byte) {
                break;
            }
            self.advance();
        }
    }

    /// AVX2 implementation of advance_while for x86_64
    #[cfg(target_arch = "x86_64")]
    #[target_feature(enable = "avx2")]
    #[inline]
    unsafe fn advance_while_avx2<F>(&mut self, predicate: &mut F) -> ()
    where
        F: FnMut(u8) -> bool,
    {
        const VECTOR_SIZE: usize = 32;

        // Process 32 bytes at a time with AVX2
        while self.pos + VECTOR_SIZE <= self.len {
            // Load 32 bytes
            let data_ptr = self.input.as_ptr().add(self.pos);
            let data = _mm256_loadu_si256(data_ptr as *const __m256i);

            // Check each byte individually
            let mut mask = 0u32;
            for i in 0..VECTOR_SIZE {
                let byte = *data_ptr.add(i);
                if !predicate(byte) {
                    mask |= 1 << i;
                    break;
                }
            }

            // If any byte failed the predicate, stop
            if mask != 0 {
                // Find the first failing byte
                let trailing_zeros = mask.trailing_zeros() as usize;
                self.pos += trailing_zeros;
                return;
            }

            // All bytes passed, advance by vector size
            self.pos += VECTOR_SIZE;
        }

        // Handle smaller chunks with SSE2
        unsafe {
            self.advance_while_sse2(predicate);
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

    /// Find the next occurrence of a byte
    #[inline]
    pub fn find_byte(&self, byte: u8) -> Option<usize> {
        // Fast path with SIMD for x86_64
        #[cfg(target_arch = "x86_64")]
        if self.len - self.pos >= 16 && is_x86_feature_detected!("sse2") {
            return unsafe { simd_find_byte(self.input, self.pos, self.len, byte) };
        }

        // Standard fallback implementation
        self.input[self.pos..]
            .iter()
            .position(|&b| b == byte)
            .map(|pos| self.pos + pos)
    }
}

/// SIMD-accelerated byte search
#[cfg(target_arch = "x86_64")]
#[target_feature(enable = "sse2")]
#[inline]
unsafe fn simd_find_byte(haystack: &[u8], start: usize, end: usize, needle: u8) -> Option<usize> {
    let mut pos = start;

    // Create a vector with the needle byte repeated 16 times
    let needle_vec = _mm_set1_epi8(needle as i8);

    // Process 16 bytes at a time
    while pos + 16 <= end {
        // Load 16 bytes from the haystack
        let chunk = _mm_loadu_si128(haystack.as_ptr().add(pos) as *const __m128i);

        // Compare each byte with the needle
        let cmp = _mm_cmpeq_epi8(chunk, needle_vec);
        let mask = _mm_movemask_epi8(cmp);

        // If any byte matches, find the first match
        if mask != 0 {
            let trailing_zeros = mask.trailing_zeros() as usize;
            return Some(pos + trailing_zeros);
        }

        pos += 16;
    }

    // Check remaining bytes one by one
    while pos < end {
        if *haystack.get_unchecked(pos) == needle {
            return Some(pos);
        }
        pos += 1;
    }

    None
}

#[cfg(target_arch = "x86_64")]
use simd::*;
