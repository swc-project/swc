//! Number literal processing for the lexer
//!
//! This module handles the parsing of numeric literals in
//! ECMAScript/TypeScript.

use std::borrow::Cow;

use swc_atoms::Atom;

use super::Lexer;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

// Digit value lookup table for fast parsing
static DIGIT_VALUES: [u8; 256] = {
    let mut table = [255u8; 256];

    // Decimal digits
    let mut i = 0;
    while i < 10 {
        table[b'0' as usize + i] = i as u8;
        i += 1;
    }

    // Hex digits
    let mut i = 0;
    while i < 6 {
        table[b'a' as usize + i] = (10 + i) as u8;
        table[b'A' as usize + i] = (10 + i) as u8;
        i += 1;
    }

    table
};

impl<'a> Lexer<'a> {
    /// Read a numeric literal
    #[inline]
    pub(super) fn read_number(&mut self) -> Result<Token> {
        let start_pos = self.start_pos;
        let start_idx = start_pos.0;

        // Check for leading dot (e.g. .123)
        let starts_with_dot = self.cursor.peek() == Some(b'.');
        if starts_with_dot {
            self.cursor.advance();

            // Make sure it's followed by a digit
            if !matches!(self.cursor.peek(), Some(b'0'..=b'9')) {
                // Just a dot, not a number
                return Ok(Token::new(
                    TokenType::Dot,
                    self.span(),
                    bool::from(self.had_line_break),
                    TokenValue::None,
                ));
            }
        }

        // First check for a binary, octal, or hex literal
        let mut is_binary = false;
        let mut is_octal = false;
        let mut is_hex = false;

        if !starts_with_dot && self.cursor.peek() == Some(b'0') {
            self.cursor.advance();

            match self.cursor.peek() {
                // Binary literal: 0b or 0B
                Some(b'b') | Some(b'B') => {
                    self.cursor.advance();
                    is_binary = true;

                    // Must have at least one binary digit
                    if !matches!(self.cursor.peek(), Some(b'0'..=b'1')) {
                        let span = self.span();
                        return Err(Error {
                            kind: ErrorKind::InvalidNumber {
                                reason: "expected binary digit",
                            },
                            span,
                        });
                    }
                }
                // Octal literal: 0o or 0O
                Some(b'o') | Some(b'O') => {
                    self.cursor.advance();
                    is_octal = true;

                    // Must have at least one octal digit
                    if !matches!(self.cursor.peek(), Some(b'0'..=b'7')) {
                        let span = self.span();
                        return Err(Error {
                            kind: ErrorKind::InvalidNumber {
                                reason: "expected octal digit",
                            },
                            span,
                        });
                    }
                }
                // Hex literal: 0x or 0X
                Some(b'x') | Some(b'X') => {
                    self.cursor.advance();
                    is_hex = true;

                    // Must have at least one hex digit
                    if !matches!(
                        self.cursor.peek(),
                        Some(b'0'..=b'9') | Some(b'a'..=b'f') | Some(b'A'..=b'F')
                    ) {
                        let span = self.span();
                        return Err(Error {
                            kind: ErrorKind::InvalidNumber {
                                reason: "expected hex digit",
                            },
                            span,
                        });
                    }
                }
                // Decimal literal starting with 0
                _ => {}
            }
        }

        // Read the rest of the digits
        if is_binary {
            // Binary literals: 0b[01]+
            self.cursor
                .advance_while(|ch| matches!(ch, b'0'..=b'1' | b'_'));
        } else if is_octal {
            // Octal literals: 0o[0-7]+
            self.cursor
                .advance_while(|ch| matches!(ch, b'0'..=b'7' | b'_'));
        } else if is_hex {
            // Hex literals: 0x[0-9a-fA-F]+
            self.cursor
                .advance_while(|ch| matches!(ch, b'0'..=b'9' | b'a'..=b'f' | b'A'..=b'F' | b'_'));
        } else {
            // Decimal literals

            // Read integer part
            if !starts_with_dot {
                self.cursor
                    .advance_while(|ch| matches!(ch, b'0'..=b'9' | b'_'));
            }

            // Read fractional part if present
            if self.cursor.peek() == Some(b'.')
                && (starts_with_dot || !matches!(self.cursor.peek_at(1), Some(b'.')))
            {
                // Consume the dot
                self.cursor.advance();

                // Read decimal digits after the dot
                self.cursor
                    .advance_while(|ch| matches!(ch, b'0'..=b'9' | b'_'));
            }

            // Read exponent part if present
            if matches!(self.cursor.peek(), Some(b'e') | Some(b'E')) {
                self.cursor.advance();

                // Optional sign
                if matches!(self.cursor.peek(), Some(b'+') | Some(b'-')) {
                    self.cursor.advance();
                }

                // Must have at least one digit in exponent
                if !matches!(self.cursor.peek(), Some(b'0'..=b'9')) {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidNumber {
                            reason: "invalid numeric separator",
                        },
                        span,
                    });
                }

                // Read exponent digits
                self.cursor
                    .advance_while(|ch| matches!(ch, b'0'..=b'9' | b'_'));
            }
        }

        // Check if this is a BigInt literal (ends with n)
        let is_bigint = self.cursor.peek() == Some(b'n');
        if is_bigint {
            self.cursor.advance(); // Consume the 'n'

            // BigInt can't have decimal points or exponents
            if !is_binary && !is_octal && !is_hex {
                let raw_str = self.extract_number_str(start_idx);
                if raw_str.contains('.') || raw_str.contains('e') || raw_str.contains('E') {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidBigInt,
                        span,
                    });
                }
            }

            return self.create_bigint_token(start_idx);
        }

        // Parse the number directly for faster processing
        let value = if is_binary {
            self.parse_binary_number(start_idx)
        } else if is_octal {
            self.parse_octal_number(start_idx)
        } else if is_hex {
            self.parse_hex_number(start_idx)
        } else {
            self.parse_decimal_number(start_idx, starts_with_dot)
        };

        // Extract the raw string representation
        let raw_str = self.extract_number_str(start_idx);

        // Create and return the token
        let span = self.span();
        Ok(Token::new(
            TokenType::Num,
            span,
            bool::from(self.had_line_break),
            TokenValue::Num {
                value,
                raw: Atom::from(raw_str),
            },
        ))
    }

    /// Extract the raw string representation of a number
    #[inline]
    fn extract_number_str(&self, start_idx: u32) -> Cow<'a, str> {
        let end_idx = self.cursor.position();
        let num_slice = self.cursor.slice(start_idx, end_idx);
        // Filter out the underscore separators
        if num_slice.contains(&b'_') {
            let mut result = String::with_capacity(num_slice.len());
            for &byte in num_slice {
                if byte != b'_' {
                    result.push(byte as char);
                }
            }
            Cow::Owned(result)
        } else {
            // Fast path: no underscores
            Cow::Borrowed(unsafe { std::str::from_utf8_unchecked(num_slice) })
        }
    }

    /// Parse a binary number (0b...)
    #[inline]
    fn parse_binary_number(&self, start_idx: u32) -> f64 {
        let start = start_idx + 2; // Skip '0b'
        let end = self.cursor.position();

        let mut value: u64 = 0;
        for i in start..end {
            let byte = unsafe { *self.cursor.slice(i, i + 1).get_unchecked(0) };
            if byte == b'_' {
                continue;
            }
            value = value * 2 + (byte - b'0') as u64;
        }

        value as f64
    }

    /// Parse an octal number (0o...)
    #[inline]
    fn parse_octal_number(&self, start_idx: u32) -> f64 {
        let start = start_idx + 2; // Skip '0o'
        let end = self.cursor.position();

        let mut value: u64 = 0;
        for i in start..end {
            let byte = unsafe { *self.cursor.slice(i, i + 1).get_unchecked(0) };
            if byte == b'_' {
                continue;
            }
            value = value * 8 + (byte - b'0') as u64;
        }

        value as f64
    }

    /// Parse a hexadecimal number (0x...)
    #[inline]
    fn parse_hex_number(&self, start_idx: u32) -> f64 {
        let start = start_idx + 2; // Skip '0x'
        let end = self.cursor.position();

        let mut value: u64 = 0;
        for i in start..end {
            let byte = unsafe { *self.cursor.slice(i, i + 1).get_unchecked(0) };
            if byte == b'_' {
                continue;
            }
            let digit = DIGIT_VALUES[byte as usize];
            value = value * 16 + digit as u64;
        }

        value as f64
    }

    /// Parse a decimal number
    #[inline]
    fn parse_decimal_number(&self, start_idx: u32, _starts_with_dot: bool) -> f64 {
        // For decimal numbers with possible fractional and exponent parts,
        // use the Rust standard library's parser which is highly optimized
        let raw_str = self.extract_number_str(start_idx);
        raw_str.parse::<f64>().unwrap_or(f64::NAN)
    }

    /// Create a BigInt token
    #[inline]
    fn create_bigint_token(&self, start_idx: u32) -> Result<Token> {
        use num_bigint::BigInt;

        let end_idx = self.cursor.position();
        let span = self.span();

        // Extract the raw string excluding the 'n' suffix
        let raw_str = {
            let num_slice = self.cursor.slice(start_idx, end_idx - 1);
            if num_slice.contains(&b'_') {
                // Filter out underscores
                let mut result = String::with_capacity(num_slice.len());
                for &byte in num_slice {
                    if byte != b'_' {
                        result.push(byte as char);
                    }
                }
                Cow::Owned(result)
            } else {
                // Fast path: no underscores
                Cow::Borrowed(unsafe { std::str::from_utf8_unchecked(num_slice) })
            }
        };

        // Parse the BigInt value
        let value = if raw_str.starts_with("0b") || raw_str.starts_with("0B") {
            // Binary
            BigInt::parse_bytes(&raw_str.as_bytes()[2..], 2)
        } else if raw_str.starts_with("0o") || raw_str.starts_with("0O") {
            // Octal
            BigInt::parse_bytes(&raw_str.as_bytes()[2..], 8)
        } else if raw_str.starts_with("0x") || raw_str.starts_with("0X") {
            // Hexadecimal
            BigInt::parse_bytes(&raw_str.as_bytes()[2..], 16)
        } else {
            // Decimal
            BigInt::parse_bytes(raw_str.as_bytes(), 10)
        };

        // Create the token
        if let Some(value) = value {
            Ok(Token::new(
                TokenType::BigInt,
                span,
                bool::from(self.had_line_break),
                TokenValue::BigInt {
                    value: Box::new(value),
                    raw: Atom::from(raw_str),
                },
            ))
        } else {
            Err(Error {
                kind: ErrorKind::InvalidBigInt,
                span,
            })
        }
    }
}
