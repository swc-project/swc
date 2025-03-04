//! Number literals processing for the lexer
//!
//! This module handles the parsing of numeric literals in
//! ECMAScript/TypeScript.

use swc_atoms::Atom;
use swc_common::Span;

use super::Lexer;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

impl<'a> Lexer<'a> {
    /// Read a numeric literal
    pub(super) fn read_number(&mut self) -> Result<Token> {
        let start_pos = self.start_pos;
        let start_idx = start_pos.0 as usize;

        // Check if this is a hex, binary, or octal literal
        let has_prefix = self.check_numeric_prefix();

        // Read digits
        self.read_digits();

        // Check for decimal point and read fractional part
        let has_decimal = self.check_decimal_point();

        // Check for exponent
        let has_exponent = self.check_exponent();

        // Check for BigInt suffix
        let is_bigint = self.check_bigint_suffix();

        // Extract the raw number string
        let end_idx = self.cursor.position();
        let num_bytes = self.cursor.slice(start_idx, end_idx);
        let raw_str = unsafe { std::str::from_utf8_unchecked(num_bytes) };

        let span = self.span();

        if is_bigint {
            // Parse as BigInt
            if has_decimal || has_exponent {
                return Err(Error {
                    kind: ErrorKind::InvalidNumber {
                        reason: "BigInt literals cannot have decimal points or exponents",
                    },
                    span,
                });
            }

            // Remove 'n' suffix and parse
            let bigint_str = &raw_str[0..raw_str.len() - 1];

            // Parse the BigInt value - handling different bases
            let value = if has_prefix && raw_str.len() > 2 {
                match &raw_str[0..2] {
                    "0x" | "0X" => parse_bigint_with_radix(&bigint_str[2..], 16, span)?,
                    "0b" | "0B" => parse_bigint_with_radix(&bigint_str[2..], 2, span)?,
                    "0o" | "0O" => parse_bigint_with_radix(&bigint_str[2..], 8, span)?,
                    _ => parse_bigint_with_radix(bigint_str, 10, span)?,
                }
            } else {
                parse_bigint_with_radix(bigint_str, 10, span)?
            };

            Ok(Token::new(
                TokenType::BigInt,
                span,
                self.had_line_break,
                TokenValue::BigInt {
                    value: Box::new(value),
                    raw: Atom::from(raw_str),
                },
            ))
        } else {
            // Parse as regular number
            let value = if has_prefix && raw_str.len() > 2 {
                match &raw_str[0..2] {
                    "0x" | "0X" => u64::from_str_radix(&raw_str[2..], 16)
                        .map(|v| v as f64)
                        .map_err(|_| Error {
                            kind: ErrorKind::InvalidNumber {
                                reason: "Invalid hexadecimal number",
                            },
                            span,
                        })?,
                    "0b" | "0B" => u64::from_str_radix(&raw_str[2..], 2)
                        .map(|v| v as f64)
                        .map_err(|_| Error {
                            kind: ErrorKind::InvalidNumber {
                                reason: "Invalid binary number",
                            },
                            span,
                        })?,
                    "0o" | "0O" => u64::from_str_radix(&raw_str[2..], 8)
                        .map(|v| v as f64)
                        .map_err(|_| Error {
                            kind: ErrorKind::InvalidNumber {
                                reason: "Invalid octal number",
                            },
                            span,
                        })?,
                    _ => raw_str.parse::<f64>().map_err(|_| Error {
                        kind: ErrorKind::InvalidNumber {
                            reason: "Invalid numeric literal",
                        },
                        span,
                    })?,
                }
            } else {
                raw_str.parse::<f64>().map_err(|_| Error {
                    kind: ErrorKind::InvalidNumber {
                        reason: "Invalid numeric literal",
                    },
                    span,
                })?
            };

            Ok(Token::new(
                TokenType::Num,
                span,
                self.had_line_break,
                TokenValue::Num {
                    value,
                    raw: Atom::from(raw_str),
                },
            ))
        }
    }

    /// Check if this is a numeric literal with prefix (hex, binary, octal)
    fn check_numeric_prefix(&mut self) -> bool {
        // If we see '0' as the first digit, check for prefix
        if self.cursor.peek() == Some(b'0') {
            self.cursor.advance();

            // Check for hex, binary, or octal prefix
            match self.cursor.peek() {
                Some(b'x') | Some(b'X') => {
                    // Hexadecimal
                    self.cursor.advance();
                    // Ensure we have at least one hex digit
                    if matches!(
                        self.cursor.peek(),
                        Some(b'0'..=b'9') | Some(b'a'..=b'f') | Some(b'A'..=b'F')
                    ) {
                        return true;
                    } else {
                        // Error case: 0x with no hex digits
                        // We've already consumed "0x", so don't backtrack
                        return true;
                    }
                }
                Some(b'b') | Some(b'B') => {
                    // Binary
                    self.cursor.advance();
                    // Ensure we have at least one binary digit
                    if matches!(self.cursor.peek(), Some(b'0'..=b'1')) {
                        return true;
                    } else {
                        // Error case: 0b with no binary digits
                        // We've already consumed "0b", so don't backtrack
                        return true;
                    }
                }
                Some(b'o') | Some(b'O') => {
                    // Octal
                    self.cursor.advance();
                    // Ensure we have at least one octal digit
                    if matches!(self.cursor.peek(), Some(b'0'..=b'7')) {
                        return true;
                    } else {
                        // Error case: 0o with no octal digits
                        // We've already consumed "0o", so don't backtrack
                        return true;
                    }
                }
                _ => {
                    // Not a prefix, backtrack to before the '0'
                    return false;
                }
            }
        }

        false
    }

    /// Read a sequence of digits
    fn read_digits(&mut self) {
        self.cursor.advance_while(|ch| matches!(ch, b'0'..=b'9'));
    }

    /// Check for decimal point and read fractional part
    fn check_decimal_point(&mut self) -> bool {
        if self.cursor.peek() == Some(b'.') {
            self.cursor.advance();
            self.read_digits();
            true
        } else {
            false
        }
    }

    /// Check for exponent and read exponent part
    fn check_exponent(&mut self) -> bool {
        match self.cursor.peek() {
            Some(b'e') | Some(b'E') => {
                self.cursor.advance();

                // Optional sign
                match self.cursor.peek() {
                    Some(b'+') | Some(b'-') => self.cursor.advance(),
                    _ => {}
                }

                // Must have at least one digit
                if !matches!(self.cursor.peek(), Some(b'0'..=b'9')) {
                    // Error: e/E not followed by a digit
                    // But we've already consumed the 'e', so don't backtrack
                    return true;
                }

                self.read_digits();
                true
            }
            _ => false,
        }
    }

    /// Check for BigInt suffix
    fn check_bigint_suffix(&mut self) -> bool {
        if self.cursor.peek() == Some(b'n') {
            self.cursor.advance();
            true
        } else {
            false
        }
    }
}

/// Parse a BigInt with a specific radix
fn parse_bigint_with_radix(s: &str, radix: u32, span: Span) -> Result<num_bigint::BigInt> {
    use num_bigint::BigInt;

    // Remove underscores from the string for parsing
    let s_without_underscores = s.replace('_', "");

    // Parse the BigInt with the given radix
    BigInt::parse_bytes(s_without_underscores.as_bytes(), radix).ok_or_else(|| Error {
        kind: ErrorKind::InvalidNumber {
            reason: "Invalid BigInt literal",
        },
        span,
    })
}
