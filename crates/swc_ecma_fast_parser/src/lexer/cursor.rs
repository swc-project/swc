//! Byte-level cursor for fast input traversal
//!
//! This cursor operates directly on UTF-8 bytes for maximum performance.

#[cfg(target_arch = "x86_64")]
use std::arch::x86_64::*;
use std::slice;

use swc_common::BytePos;

/// High-performance cursor for traversing input bytes
#[repr(C)] // Ensure predictable memory layout
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
        if self.is_eof() {
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
        if target_pos >= self.len {
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

    /// Peek at exactly n bytes, returning None if not enough bytes are
    /// available
    #[inline(always)]
    pub fn peek_bytes(&self, n: usize) -> Option<&[u8]> {
        if self.pos + n <= self.len {
            // SAFETY: We've checked bounds
            Some(unsafe { self.input.get_unchecked(self.pos..self.pos + n) })
        } else {
            None
        }
    }

    /// Peek at the start byte of the current character (handles multi-byte
    /// UTF-8)
    #[inline(always)]
    pub fn peek_char_start(&self) -> Option<u8> {
        self.peek()
    }

    /// Advance the cursor by one byte
    #[inline(always)]
    pub fn advance(&mut self) {
        if !self.is_eof() {
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

        // First process in batches for common ASCII cases
        #[cfg(target_arch = "x86_64")]
        {
            const BATCH_SIZE: usize = 16;

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
        }

        // Byte-by-byte for the remainder
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
    #[inline(always)]
    pub fn read_n(&mut self, n: usize) -> &'a [u8] {
        let end = (self.pos + n).min(self.len);
        // SAFETY: We've ensured end <= len
        let bytes = unsafe { self.input.get_unchecked(self.pos..end) };
        self.pos = end;
        bytes
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

    /// Check if the current position matches the given string
    #[inline]
    pub fn matches_str(&self, s: &str) -> bool {
        let bytes = s.as_bytes();
        if self.pos + bytes.len() > self.len {
            return false;
        }

        // Fast direct byte comparison
        let input_slice = unsafe { self.input.get_unchecked(self.pos..(self.pos + bytes.len())) };

        // Use SIMD comparison when available for longer strings
        #[cfg(target_arch = "x86_64")]
        if bytes.len() >= 16 && is_x86_feature_detected!("sse2") {
            return unsafe { simd_memcmp(input_slice, bytes) };
        }

        // Fallback to standard comparison
        input_slice == bytes
    }

    /// Check if the current position matches any of the given bytes
    #[inline(always)]
    pub fn matches_any(&self, bytes: &[u8]) -> bool {
        if let Some(current) = self.peek() {
            bytes.contains(&current)
        } else {
            false
        }
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

    /// Get the substring between the current position and the given byte
    /// Returns None if the byte is not found
    #[inline]
    pub fn substring_until_byte(&self, byte: u8) -> Option<&'a str> {
        self.find_byte(byte).map(|end| {
            let bytes = unsafe { self.input.get_unchecked(self.pos..end) };
            // Safety: we know this is valid UTF-8 because the original input was a &str
            unsafe { std::str::from_utf8_unchecked(bytes) }
        })
    }

    /// Fast advance until a whitespace character
    #[inline]
    pub fn skip_to_whitespace(&mut self) -> usize {
        let start = self.pos;

        // Process in chunks for better cache usage
        #[cfg(target_arch = "x86_64")]
        if is_x86_feature_detected!("sse2") {
            // Use SIMD to find whitespace
            if let Some(pos) = unsafe { simd_find_whitespace(self.input, self.pos, self.len) } {
                self.pos = pos;
                return pos - start;
            }
        }

        // Fallback to byte-by-byte
        while let Some(byte) = self.peek() {
            match byte {
                b' ' | b'\t' | b'\n' | b'\r' | 0x0c => break,
                _ => self.advance(),
            }
        }

        self.pos - start
    }

    /// Find the end of a line
    #[inline]
    pub fn find_line_end(&self) -> usize {
        // Fast path with SIMD for x86_64
        #[cfg(target_arch = "x86_64")]
        if self.len - self.pos >= 16 && is_x86_feature_detected!("sse2") {
            if let Some(pos) = unsafe { simd_find_line_end(self.input, self.pos, self.len) } {
                return pos;
            }
        }

        // Standard fallback implementation
        for i in self.pos..self.len {
            let byte = unsafe { *self.input.get_unchecked(i) };
            if byte == b'\n' || byte == b'\r' {
                return i;
            }
        }

        self.len
    }
}

// SIMD optimized implementations for x86_64
#[cfg(target_arch = "x86_64")]
mod simd {
    use super::*;

    /// SIMD optimized memory comparison
    #[target_feature(enable = "sse2")]
    #[inline]
    pub unsafe fn simd_memcmp(a: &[u8], b: &[u8]) -> bool {
        assert!(a.len() == b.len());

        let mut offset = 0;
        let len = a.len();

        // Process 16 bytes at a time
        while offset + 16 <= len {
            let a_chunk = _mm_loadu_si128(a.as_ptr().add(offset) as *const __m128i);
            let b_chunk = _mm_loadu_si128(b.as_ptr().add(offset) as *const __m128i);

            let cmp = _mm_cmpeq_epi8(a_chunk, b_chunk);
            let mask = _mm_movemask_epi8(cmp);

            if mask != 0xffff {
                return false;
            }

            offset += 16;
        }

        // Handle remaining bytes individually
        for i in offset..len {
            if a[i] != b[i] {
                return false;
            }
        }

        true
    }

    /// SIMD optimized byte search
    #[target_feature(enable = "sse2")]
    #[inline]
    pub unsafe fn simd_find_byte(
        input: &[u8],
        start: usize,
        end: usize,
        byte: u8,
    ) -> Option<usize> {
        let mut pos = start;

        // Create a vector with the target byte repeated
        let search_byte = _mm_set1_epi8(byte as i8);

        // Process 16 bytes at a time
        while pos + 16 <= end {
            let chunk = _mm_loadu_si128(input.as_ptr().add(pos) as *const __m128i);
            let cmp = _mm_cmpeq_epi8(chunk, search_byte);
            let mask = _mm_movemask_epi8(cmp);

            if mask != 0 {
                // Found a match, determine which byte
                let trailing_zeros = mask.trailing_zeros() as usize;
                return Some(pos + trailing_zeros);
            }

            pos += 16;
        }

        // Handle remaining bytes individually
        while pos < end {
            if *input.get_unchecked(pos) == byte {
                return Some(pos);
            }
            pos += 1;
        }

        None
    }

    /// SIMD optimized whitespace search
    #[target_feature(enable = "sse2")]
    #[inline]
    pub unsafe fn simd_find_whitespace(input: &[u8], start: usize, end: usize) -> Option<usize> {
        let mut pos = start;

        // Create vectors for whitespace bytes
        let space = _mm_set1_epi8(b' ' as i8);
        let tab = _mm_set1_epi8(b'\t' as i8);
        let lf = _mm_set1_epi8(b'\n' as i8);
        let cr = _mm_set1_epi8(b'\r' as i8);
        let ff = _mm_set1_epi8(0x0c as i8);

        // Process 16 bytes at a time
        while pos + 16 <= end {
            let chunk = _mm_loadu_si128(input.as_ptr().add(pos) as *const __m128i);

            // Compare with each whitespace character
            let cmp_space = _mm_cmpeq_epi8(chunk, space);
            let cmp_tab = _mm_cmpeq_epi8(chunk, tab);
            let cmp_lf = _mm_cmpeq_epi8(chunk, lf);
            let cmp_cr = _mm_cmpeq_epi8(chunk, cr);
            let cmp_ff = _mm_cmpeq_epi8(chunk, ff);

            // Combine results
            let cmp_space_tab = _mm_or_si128(cmp_space, cmp_tab);
            let cmp_lf_cr = _mm_or_si128(cmp_lf, cmp_cr);
            let cmp_combined = _mm_or_si128(cmp_space_tab, cmp_lf_cr);
            let cmp_result = _mm_or_si128(cmp_combined, cmp_ff);

            let mask = _mm_movemask_epi8(cmp_result);

            if mask != 0 {
                // Found a match, determine which byte
                let trailing_zeros = mask.trailing_zeros() as usize;
                return Some(pos + trailing_zeros);
            }

            pos += 16;
        }

        // Handle remaining bytes individually
        while pos < end {
            let byte = *input.get_unchecked(pos);
            if matches!(byte, b' ' | b'\t' | b'\n' | b'\r' | 0x0c) {
                return Some(pos);
            }
            pos += 1;
        }

        None
    }

    /// SIMD optimized line end search
    #[target_feature(enable = "sse2")]
    #[inline]
    pub unsafe fn simd_find_line_end(input: &[u8], start: usize, end: usize) -> Option<usize> {
        let mut pos = start;

        // Create vectors for line end bytes
        let lf = _mm_set1_epi8(b'\n' as i8);
        let cr = _mm_set1_epi8(b'\r' as i8);

        // Process 16 bytes at a time
        while pos + 16 <= end {
            let chunk = _mm_loadu_si128(input.as_ptr().add(pos) as *const __m128i);

            // Compare with each line end character
            let cmp_lf = _mm_cmpeq_epi8(chunk, lf);
            let cmp_cr = _mm_cmpeq_epi8(chunk, cr);

            // Combine results
            let cmp_result = _mm_or_si128(cmp_lf, cmp_cr);

            let mask = _mm_movemask_epi8(cmp_result);

            if mask != 0 {
                // Found a match, determine which byte
                let trailing_zeros = mask.trailing_zeros() as usize;
                return Some(pos + trailing_zeros);
            }

            pos += 16;
        }

        // Handle remaining bytes individually
        while pos < end {
            let byte = *input.get_unchecked(pos);
            if byte == b'\n' || byte == b'\r' {
                return Some(pos);
            }
            pos += 1;
        }

        None
    }
}

#[cfg(target_arch = "x86_64")]
use simd::*;
