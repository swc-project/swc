//! String literals processing for the lexer
//!
//! This module handles the parsing of string literals in ECMAScript/TypeScript.

use swc_atoms::Atom;

use super::Lexer;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

impl<'a> Lexer<'a> {
    /// Read a string literal
    pub(super) fn read_string(&mut self, quote: u8) -> Result<Token> {
        let start_pos = self.start_pos;
        let start_idx = start_pos.0 as usize;

        // Skip the opening quote
        self.cursor.advance();

        // Buffer for the processed string value (with escapes handled)
        let mut value = String::new();

        // Track if we've seen an escape sequence
        let mut has_escapes = false;

        // Read until the closing quote
        loop {
            match self.cursor.peek() {
                // End of string
                Some(ch) if ch == quote => {
                    self.cursor.advance();
                    break;
                }

                // End of file (unterminated string)
                None => {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidString {
                            reason: "Unterminated string literal",
                        },
                        span,
                    });
                }

                // Line break (illegal in string literals)
                Some(b'\n') | Some(b'\r') => {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidString {
                            reason: "Line break in string literal",
                        },
                        span,
                    });
                }

                // Escape sequence
                Some(b'\\') => {
                    has_escapes = true;
                    self.cursor.advance();

                    // Process escape sequence
                    match self.cursor.peek() {
                        // Common escape sequences
                        Some(b'n') => {
                            value.push('\n');
                            self.cursor.advance();
                        }
                        Some(b'r') => {
                            value.push('\r');
                            self.cursor.advance();
                        }
                        Some(b't') => {
                            value.push('\t');
                            self.cursor.advance();
                        }
                        Some(b'b') => {
                            value.push('\u{0008}');
                            self.cursor.advance();
                        }
                        Some(b'f') => {
                            value.push('\u{000C}');
                            self.cursor.advance();
                        }
                        Some(b'v') => {
                            value.push('\u{000B}');
                            self.cursor.advance();
                        }
                        Some(b'0') => {
                            // Null character (not followed by another digit)
                            if !matches!(self.cursor.peek_at(1), Some(b'0'..=b'9')) {
                                value.push('\0');
                                self.cursor.advance();
                            } else {
                                let span = self.span();
                                return Err(Error {
                                    kind: ErrorKind::InvalidString {
                                        reason: "Octal escape sequences are not allowed in strict \
                                                 mode",
                                    },
                                    span,
                                });
                            }
                        }

                        // Hexadecimal escape (\xHH)
                        Some(b'x') => {
                            self.cursor.advance();
                            let hex_val = self.read_hex_escape(2)?;
                            value.push(std::char::from_u32(hex_val).unwrap_or('\u{FFFD}'));
                        }

                        // Unicode escape (\uHHHH)
                        Some(b'u') => {
                            self.cursor.advance();
                            value.push(self.read_unicode_escape()?);
                        }

                        // Line continuation
                        Some(b'\r') => {
                            self.cursor.advance();
                            // Skip CRLF
                            if self.cursor.peek() == Some(b'\n') {
                                self.cursor.advance();
                            }
                            // Line continuation, no character added
                        }
                        Some(b'\n') => {
                            self.cursor.advance();
                            // Line continuation, no character added
                        }

                        // Any other character escaped just represents itself
                        Some(ch) => {
                            value.push(ch as char);
                            self.cursor.advance();
                        }

                        // EOF after backslash
                        None => {
                            let span = self.span();
                            return Err(Error {
                                kind: ErrorKind::InvalidString {
                                    reason: "Unterminated string literal",
                                },
                                span,
                            });
                        }
                    }
                }

                // Regular character
                Some(ch) => {
                    // For performance reasons, we'll read a batch of regular characters
                    if !has_escapes && ch < 128 {
                        // Fast path for ASCII characters
                        let start = self.cursor.position();
                        self.cursor.advance_while(|c| {
                            c != quote && c != b'\\' && c != b'\n' && c != b'\r' && c < 128
                        });

                        // Add all these characters at once
                        let end = self.cursor.position();
                        if end > start {
                            let slice = self.cursor.slice(start, end);
                            value.push_str(unsafe { std::str::from_utf8_unchecked(slice) });
                        }
                    } else {
                        // Slow path for non-ASCII or after an escape
                        value.push(ch as char);
                        self.cursor.advance();
                    }
                }
            }
        }

        // Extract the raw string (including quotes)
        let end_idx = self.cursor.position();
        let raw_bytes = self.cursor.slice(start_idx, end_idx);
        let raw_str = unsafe { std::str::from_utf8_unchecked(raw_bytes) };

        let span = self.span();

        Ok(Token::new(
            TokenType::Str,
            span,
            self.had_line_break,
            TokenValue::Str {
                value: Atom::from(value),
                raw: Atom::from(raw_str),
            },
        ))
    }

    // Common escape sequence handling moved to common.rs
}
