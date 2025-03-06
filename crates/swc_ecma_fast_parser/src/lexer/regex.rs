//! Regular expression literals processing for the lexer
//!
//! This module handles the parsing of RegExp literals in ECMAScript/TypeScript.

use swc_atoms::Atom;

use super::Lexer;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

impl Lexer<'_> {
    /// Read a regular expression literal
    /// Assumes the initial '/' has been consumed
    pub(super) fn read_regex(&mut self, had_line_break: bool) -> Result<Token> {
        let start_pos = self.start_pos;
        let start_idx = start_pos.0;

        // Read the pattern
        let mut in_class = false; // Whether we're in a character class [...]
        let mut escaped = false; // Whether the previous character was escaped

        // Regular expression pattern
        loop {
            match self.cursor.peek() {
                // End of pattern
                Some(b'/') if !in_class && !escaped => {
                    self.cursor.advance();
                    break;
                }

                // End of file (unterminated regex)
                None => {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidRegExp {
                            reason: "Unterminated regular expression literal",
                        },
                        span,
                    });
                }

                // Line break (illegal in regex literals)
                Some(b'\n') | Some(b'\r') => {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidRegExp {
                            reason: "Line break in regular expression literal",
                        },
                        span,
                    });
                }

                // Start of character class
                Some(b'[') if !escaped => {
                    in_class = true;
                    self.cursor.advance();
                    escaped = false;
                }

                // End of character class
                Some(b']') if in_class && !escaped => {
                    in_class = false;
                    self.cursor.advance();
                    escaped = false;
                }

                // Escape sequence
                Some(b'\\') if !escaped => {
                    self.cursor.advance();
                    escaped = true;
                }

                // Regular character
                Some(_) => {
                    self.cursor.advance();
                    escaped = false;
                }
            }
        }

        // Read the flags
        let mut flags = String::new();
        while let Some(ch) = self.cursor.peek() {
            if Self::is_identifier_continue(ch) {
                flags.push(ch as char);
                self.cursor.advance();
            } else {
                break;
            }
        }

        // Validate flags (basic validation)
        let mut seen_flags = [false; 128];
        for ch in flags.bytes() {
            if ch as usize >= seen_flags.len() || seen_flags[ch as usize] {
                let span = self.span();
                return Err(Error {
                    kind: ErrorKind::InvalidRegExp {
                        reason: "Duplicate flag in regular expression",
                    },
                    span,
                });
            }
            seen_flags[ch as usize] = true;
        }

        // Extract the raw regex
        let end_idx = self.cursor.position();
        let regex_bytes = self.cursor.slice(start_idx, end_idx);
        let regex_str = unsafe { std::str::from_utf8_unchecked(regex_bytes) };

        // Split into pattern and flags (skip the leading and trailing '/')
        let pattern_end = regex_str.rfind('/').unwrap_or(0);
        let pattern = &regex_str[1..pattern_end];

        let span = self.span();

        Ok(Token::new(
            TokenType::Regex,
            span,
            had_line_break,
            TokenValue::Regex {
                exp: Atom::from(pattern),
                flags: Atom::from(flags),
            },
        ))
    }

    /// Check if the slash is the start of a regex literal
    pub(super) fn is_regex_start(&self) -> bool {
        // We generally decide this based on context (whether a slash could be a
        // division operator) Usually, a slash starts a regex if the previous
        // token can precede an expression and is not a ++ or -- operator (which
        // would make the slash a division operator)
        self.current.before_expr()
            && self.current.token_type != TokenType::PlusPlus
            && self.current.token_type != TokenType::MinusMinus
    }
}
