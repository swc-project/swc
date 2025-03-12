//! String literals processing for the lexer
//!
//! This module handles the parsing of string literals in ECMAScript/TypeScript.

use swc_atoms::Atom;
use swc_common::Span;
use wide::u8x16;

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

// SIMD vectors for common string end characters
static BACKSLASH_SMID_VEC: u8x16 = u8x16::new([b'\\'; 16]);
static NEWLINE_SMID_VEC: u8x16 = u8x16::new([b'\n'; 16]);
static CARRIAGE_SMID_VEC: u8x16 = u8x16::new([b'\r'; 16]);

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
        let raw_start = start_pos.0;
        let raw_end = self.cursor.position();
        let raw_bytes = unsafe { self.cursor.slice_unchecked(raw_start, raw_end) };
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
            let value_bytes = unsafe { self.cursor.slice_unchecked(raw_start + 1, raw_end - 1) };
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
    fn find_string_end(&self, quote: u8) -> Option<u32> {
        let pos = 0;
        let rest = self.cursor.rest();

        // Try the SIMD implementation first, falling back to standard if needed
        self.find_string_end_simd(pos, rest, quote)
            .or_else(|| self.find_string_end_standard(pos, rest, quote))
    }

    /// SIMD-accelerated implementation for finding end of string
    #[inline]
    fn find_string_end_simd(&self, start_pos: u32, rest: &[u8], quote: u8) -> Option<u32> {
        // Safety check for small inputs - process with standard method
        if rest.len() < 32 || start_pos >= rest.len() as u32 {
            return None;
        }

        let mut pos = start_pos;

        // Create vectors for quick comparison
        let quote_vec = u8x16::splat(quote);

        // Process in chunks of 16 bytes using SIMD
        while pos + 16 <= rest.len() as u32 {
            // Load 16 bytes
            let chunk_bytes = &rest[pos as usize..(pos + 16) as usize];
            let mut bytes = [0u8; 16];
            bytes.copy_from_slice(chunk_bytes);
            let chunk = u8x16::new(bytes);

            // Check for presence of special characters with a single combined mask
            let quote_mask = chunk.cmp_eq(quote_vec);
            let backslash_mask = chunk.cmp_eq(BACKSLASH_SMID_VEC);
            let newline_mask = chunk.cmp_eq(NEWLINE_SMID_VEC);
            let carriage_mask = chunk.cmp_eq(CARRIAGE_SMID_VEC);
            // Combine all masks with OR operation
            let combined_mask = quote_mask | backslash_mask | newline_mask | carriage_mask;

            // Convert combined mask to array to check if any special character was found
            let mask_array = combined_mask.to_array();

            // Check if any element in the mask array is non-zero
            #[allow(clippy::needless_range_loop)]
            for i in 0..16 {
                if mask_array[i] != 0 {
                    // We found a character that needs special handling
                    // Process from here using the standard algorithm
                    return self.find_string_end_standard(pos + i as u32, rest, quote);
                }
            }

            // If we get here, the chunk doesn't contain any special characters
            pos += 16;
        }

        // Process remainder with standard algorithm
        if pos < rest.len() as u32 {
            return self.find_string_end_standard(pos, rest, quote);
        }

        None
    }

    /// Standard (non-SIMD) implementation of string end finding
    #[inline]
    fn find_string_end_standard(&self, start_pos: u32, rest: &[u8], quote: u8) -> Option<u32> {
        let mut pos = start_pos;
        let mut in_escape = false;

        // Safety check for empty input
        if rest.is_empty() || pos >= rest.len() as u32 {
            return None;
        }

        while pos < rest.len() as u32 {
            let ch = unsafe { *rest.get_unchecked(pos as usize) };

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
                if pos >= rest.len() as u32 {
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
