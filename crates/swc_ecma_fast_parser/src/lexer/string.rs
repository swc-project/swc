//! String literals processing for the lexer
//!
//! This module handles the parsing of string literals in ECMAScript/TypeScript.

use swc_atoms::Atom;
use swc_common::Span;

use super::Lexer;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

// Pre-computed lookup table for escape sequences
static ESCAPE_LOOKUP: [u8; 128] = {
    let mut table = [0u8; 128];
    table[b'\\' as usize] = b'\\';
    table[b'n' as usize] = b'\n';
    table[b'r' as usize] = b'\r';
    table[b't' as usize] = b'\t';
    table[b'b' as usize] = b'\x08';
    table[b'f' as usize] = b'\x0C';
    table[b'v' as usize] = b'\x0B';
    table[b'\'' as usize] = b'\'';
    table[b'"' as usize] = b'"';
    table[b'`' as usize] = b'`';
    table[b'0' as usize] = b'\0';
    table
};

// Buffer for string construction - using thread_local to avoid allocation
thread_local! {
    static STRING_BUFFER: std::cell::RefCell<Vec<u8>> = std::cell::RefCell::new(Vec::with_capacity(1024));
}

impl Lexer<'_> {
    /// Read a string literal
    #[inline]
    pub(super) fn read_string(&mut self, quote: u8) -> Result<Token> {
        let start_pos = self.start_pos;

        // Skip the opening quote
        self.cursor.advance();

        // Fast path: if there are no escape sequences or line terminators, we can
        // directly extract the string without processing each character
        let mut has_escapes = false;

        // Try to find the closing quote
        match self.find_string_end(quote) {
            Some(end) => {
                // Fast path - no escapes
                let end_pos = self.cursor.position() + end;
                // Skip to the end quote
                self.cursor.advance_n(end);
                // Skip the closing quote
                self.cursor.advance();
                end_pos
            }
            None => {
                // Slower path - contains escapes, line terminators, or unterminated
                has_escapes = true;

                // Process each character using a local buffer
                let mut buffer = Vec::with_capacity(128);
                let mut found_closing_quote = false;

                while let Some(ch) = self.cursor.peek() {
                    // Check for unterminated string
                    if self.cursor.is_eof() {
                        let span = Span::new(start_pos, self.cursor.pos());
                        return Err(Error {
                            kind: ErrorKind::UnterminatedString,
                            span,
                        });
                    }

                    // Check for closing quote
                    if ch == quote {
                        self.cursor.advance();
                        found_closing_quote = true;
                        break;
                    }

                    // Check for line terminators (not allowed in strings)
                    if ch == b'\r' || ch == b'\n' {
                        let span = Span::new(start_pos, self.cursor.pos());
                        return Err(Error {
                            kind: ErrorKind::UnterminatedString,
                            span,
                        });
                    }

                    // Check for escape sequences
                    if ch == b'\\' {
                        self.cursor.advance();

                        // Get the next character
                        match self.cursor.peek() {
                            Some(b'x') => {
                                // Hexadecimal escape \xNN
                                self.cursor.advance();
                                let hex_value = self.read_hex_escape(2)? as u8;
                                buffer.push(hex_value);
                            }
                            Some(b'u') => {
                                // Unicode escape \uNNNN or \u{NNNNNN}
                                self.cursor.advance();
                                let code_point_char = self.read_unicode_escape()?;
                                let mut utf8_buf = [0u8; 4];
                                let utf8_str = code_point_char.encode_utf8(&mut utf8_buf);
                                buffer.extend_from_slice(utf8_str.as_bytes());
                            }
                            Some(escape_char @ 0..=127) => {
                                // Simple escape sequence
                                self.cursor.advance();
                                let replacement = ESCAPE_LOOKUP[escape_char as usize];
                                if replacement != 0 {
                                    buffer.push(replacement);
                                } else if (b'0'..=b'7').contains(&escape_char) {
                                    // Octal escape (legacy)
                                    buffer.push(self.read_octal_escape(escape_char)?);
                                } else {
                                    // Any other character is escaped as itself
                                    buffer.push(escape_char);
                                }
                            }
                            Some(ch) => {
                                // Any other escape sequence
                                self.cursor.advance();
                                buffer.push(ch);
                            }
                            None => {
                                // Unterminated escape sequence
                                let span = Span::new(start_pos, self.cursor.pos());
                                return Err(Error {
                                    kind: ErrorKind::UnterminatedString,
                                    span,
                                });
                            }
                        }
                    } else {
                        // Regular character
                        buffer.push(ch);
                        self.cursor.advance();
                    }
                }

                if !found_closing_quote {
                    let span = Span::new(start_pos, self.cursor.pos());
                    return Err(Error {
                        kind: ErrorKind::UnterminatedString,
                        span,
                    });
                }

                // Save the buffer in thread_local for reuse
                STRING_BUFFER.with(|tls_buffer| {
                    let mut tls = tls_buffer.borrow_mut();
                    tls.clear();
                    tls.extend_from_slice(&buffer);
                });

                self.cursor.position()
            }
        };

        // Extract the raw string (including quotes)
        let raw_start = start_pos.0 as usize;
        let raw_end = self.cursor.position();
        let raw_bytes = self.cursor.slice(raw_start, raw_end);
        let raw_str = unsafe { std::str::from_utf8_unchecked(raw_bytes) };

        // Extract the string value if we used the fast path
        let string_value = if has_escapes {
            // Use the thread-local buffer for the string value
            STRING_BUFFER.with(|buffer| {
                let buffer = buffer.borrow();
                Atom::from(unsafe { std::str::from_utf8_unchecked(&buffer) })
            })
        } else {
            // Direct extraction (excluding quotes)
            let value_bytes = self.cursor.slice(raw_start + 1, raw_end - 1);
            Atom::from(unsafe { std::str::from_utf8_unchecked(value_bytes) })
        };

        // Create token
        let span = Span::new(start_pos, self.cursor.pos());

        Ok(Token::new(
            TokenType::Str,
            span,
            bool::from(self.had_line_break),
            TokenValue::Str {
                value: string_value,
                raw: Atom::from(raw_str),
            },
        ))
    }

    /// Find the end of a string without processing escape sequences
    #[inline]
    fn find_string_end(&self, quote: u8) -> Option<usize> {
        let mut pos = 0;
        let rest = self.cursor.rest();

        // Use SIMD for longer strings when available
        #[cfg(target_arch = "x86_64")]
        if rest.len() >= 16 && is_x86_feature_detected!("sse2") {
            // Fast SIMD search to find either quote or escape character
            use std::arch::x86_64::*;

            unsafe {
                let quote_vector = _mm_set1_epi8(quote as i8);
                let escape_vector = _mm_set1_epi8(b'\\' as i8);
                let newline_vector = _mm_set1_epi8(b'\n' as i8);
                let carriage_vector = _mm_set1_epi8(b'\r' as i8);

                while pos + 16 <= rest.len() {
                    let chunk = _mm_loadu_si128(rest.as_ptr().add(pos) as *const __m128i);

                    // Check for quote, escape, or line terminators
                    let cmp_quote = _mm_cmpeq_epi8(chunk, quote_vector);
                    let cmp_escape = _mm_cmpeq_epi8(chunk, escape_vector);
                    let cmp_newline = _mm_cmpeq_epi8(chunk, newline_vector);
                    let cmp_carriage = _mm_cmpeq_epi8(chunk, carriage_vector);

                    // Combine all special characters
                    let cmp_special = _mm_or_si128(
                        _mm_or_si128(cmp_quote, cmp_escape),
                        _mm_or_si128(cmp_newline, cmp_carriage),
                    );

                    let mask = _mm_movemask_epi8(cmp_special);

                    if mask != 0 {
                        // Found a special character
                        let offset = mask.trailing_zeros() as usize;

                        // Check what kind of special character we found
                        let special_char = *rest.get_unchecked(pos + offset);

                        if special_char == quote {
                            // Check if it's escaped by counting backslashes
                            let mut escape_count = 0;
                            if offset > 0 {
                                let mut i = offset - 1;
                                while i != usize::MAX && *rest.get_unchecked(pos + i) == b'\\' {
                                    escape_count += 1;
                                    if i == 0 {
                                        break;
                                    }
                                    i -= 1;
                                }
                            }

                            // If even number of backslashes, quote is not escaped
                            if escape_count % 2 == 0 {
                                return Some(pos + offset);
                            }
                        }

                        // For all other cases, fall back to standard algorithm
                        // This ensures we handle all edge cases correctly
                        return self.find_string_end_standard(pos + offset, rest, quote);
                    } else {
                        // No special characters in this chunk
                        pos += 16;
                    }
                }
            }
        }

        // Standard fallback for the remaining characters
        self.find_string_end_standard(pos, rest, quote)
    }

    /// Standard (non-SIMD) implementation of string end finding
    #[inline]
    fn find_string_end_standard(&self, start_pos: usize, rest: &[u8], quote: u8) -> Option<usize> {
        let mut pos = start_pos;
        let mut in_escape = false;

        // Safety check for empty input
        if rest.is_empty() || pos >= rest.len() {
            return None;
        }

        while pos < rest.len() {
            let ch = unsafe { *rest.get_unchecked(pos) };

            if in_escape {
                // Skip the escaped character
                in_escape = false;
                pos += 1;
                continue;
            }

            if ch == b'\\' {
                // Mark that we're in an escape sequence
                in_escape = true;
                pos += 1;
                // If we're at the end after a backslash, it's unterminated
                if pos >= rest.len() {
                    return None;
                }
            } else if ch == quote {
                // Found unescaped quote
                return Some(pos);
            } else if ch == b'\n' || ch == b'\r' {
                // Line terminator in string is an error
                return None;
            } else {
                pos += 1;
            }
        }

        // String is unterminated
        None
    }

    /// Read an octal escape sequence
    #[inline]
    fn read_octal_escape(&mut self, first: u8) -> Result<u8> {
        let mut value = first - b'0';

        // Read up to 2 more octal digits
        for _ in 0..2 {
            match self.cursor.peek() {
                Some(c @ b'0'..=b'7') => {
                    // Ensure we don't overflow u8
                    let next_value = (value as u16) * 8 + (c - b'0') as u16;
                    if next_value > 255 {
                        break;
                    }
                    value = next_value as u8;
                    self.cursor.advance();
                }
                _ => break,
            }
        }

        Ok(value)
    }
}
