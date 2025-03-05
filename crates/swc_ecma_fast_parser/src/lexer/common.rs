//! Common helpers for the lexer
//!
//! This module contains shared functionality used across different lexer
//! modules.

use super::Lexer;
use crate::error::{Error, ErrorKind, Result};

impl<'a> Lexer<'a> {
    /// Read a hexadecimal escape sequence of specified length
    pub(super) fn read_hex_escape(&mut self, len: usize) -> Result<u32> {
        let mut result = 0u32;

        for _ in 0..len {
            let digit = match self.cursor.peek() {
                Some(b'0'..=b'9') => self.cursor.peek().unwrap() - b'0',
                Some(b'a'..=b'f') => self.cursor.peek().unwrap() - b'a' + 10,
                Some(b'A'..=b'F') => self.cursor.peek().unwrap() - b'A' + 10,
                _ => {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidString {
                            reason: "Invalid hexadecimal escape sequence",
                        },
                        span,
                    });
                }
            };

            result = (result << 4) | (digit as u32);
            self.cursor.advance();
        }

        Ok(result)
    }

    /// Read a Unicode escape sequence
    pub(super) fn read_unicode_escape(&mut self) -> Result<char> {
        match self.cursor.peek() {
            // Unicode code point escape: \u{HHHHHH}
            Some(b'{') => {
                self.cursor.advance();
                let mut codepoint = 0u32;
                let mut digit_count = 0;

                loop {
                    match self.cursor.peek() {
                        Some(b'}') => {
                            self.cursor.advance();
                            break;
                        }
                        Some(b'0'..=b'9') => {
                            let digit = self.cursor.peek().unwrap() - b'0';
                            codepoint = (codepoint << 4) | (digit as u32);
                            self.cursor.advance();
                            digit_count += 1;
                        }
                        Some(b'a'..=b'f') => {
                            let digit = self.cursor.peek().unwrap() - b'a' + 10;
                            codepoint = (codepoint << 4) | (digit as u32);
                            self.cursor.advance();
                            digit_count += 1;
                        }
                        Some(b'A'..=b'F') => {
                            let digit = self.cursor.peek().unwrap() - b'A' + 10;
                            codepoint = (codepoint << 4) | (digit as u32);
                            self.cursor.advance();
                            digit_count += 1;
                        }
                        _ => {
                            let span = self.span();
                            return Err(Error {
                                kind: ErrorKind::InvalidString {
                                    reason: "Invalid Unicode escape sequence",
                                },
                                span,
                            });
                        }
                    }

                    // Too many digits or value is too large
                    if digit_count > 6 || codepoint > 0x10ffff {
                        let span = self.span();
                        return Err(Error {
                            kind: ErrorKind::InvalidString {
                                reason: "Unicode codepoint must be less than or equal to 0x10FFFF",
                            },
                            span,
                        });
                    }
                }

                if digit_count == 0 {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidString {
                            reason: "Empty Unicode escape sequence",
                        },
                        span,
                    });
                }

                std::char::from_u32(codepoint).ok_or_else(|| Error {
                    kind: ErrorKind::InvalidString {
                        reason: "Invalid Unicode codepoint",
                    },
                    span: self.span(),
                })
            }

            // Regular 4-digit Unicode escape: \uHHHH
            _ => {
                let codepoint = self.read_hex_escape(4)?;
                std::char::from_u32(codepoint).ok_or_else(|| Error {
                    kind: ErrorKind::InvalidString {
                        reason: "Invalid Unicode codepoint",
                    },
                    span: self.span(),
                })
            }
        }
    }
}
