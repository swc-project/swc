//! Template literals processing for the lexer
//!
//! This module handles the parsing of template literals in
//! ECMAScript/TypeScript.

use swc_atoms::Atom;

use super::Lexer;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

impl Lexer<'_> {
    /// Read a template literal content
    pub(super) fn read_template_content(&mut self, had_line_break: bool) -> Result<Token> {
        let start_pos = self.start_pos;
        let start_idx = start_pos.0;

        // If it starts with "${", return a DollarLBrace token
        if self.cursor.peek_at(0) == Some(b'$') && self.cursor.peek_at(1) == Some(b'{') {
            self.cursor.advance_n(2);
            // We are now expecting normal javascript syntax
            self.in_template_expr = true;

            return Ok(Token::new(
                TokenType::DollarLBrace,
                self.span(),
                had_line_break,
                TokenValue::None,
            ));
        }

        if self.cursor.peek() == Some(b'`') {
            self.cursor.advance();
            self.in_template = false;
            self.in_template_expr = false;

            return Ok(Token::new(
                TokenType::BackQuote,
                self.span(),
                had_line_break,
                TokenValue::None,
            ));
        }

        // Buffer for the processed template value (with escapes handled)
        let mut value = String::new();

        // Track if we've seen an escape sequence
        let mut has_escapes = false;

        // Flag to indicate if the template was invalid
        let mut is_invalid = false;

        // Flag to indicate if we found a "${" sequence
        let mut found_dollar_brace = false;

        // Read until the closing backtick or ${
        loop {
            match self.cursor.peek() {
                // End of template
                Some(b'`') => {
                    break;
                }

                // Start of template expression
                Some(b'$') => {
                    if self.cursor.peek_at(1) == Some(b'{') {
                        // We found a "${" - mark the flag and break the loop
                        found_dollar_brace = true;
                        // Don't consume the characters yet
                        break;
                    } else {
                        // Just a regular $ character
                        value.push('$');
                        self.cursor.advance();
                    }
                }

                // End of file (unterminated template)
                None => {
                    let span = self.span();
                    return Err(Error {
                        kind: ErrorKind::InvalidTemplate {
                            reason: "Unterminated template literal (eof)",
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
                                // Invalid octal in template
                                is_invalid = true;
                                value.push('0');
                                self.cursor.advance();
                            }
                        }

                        // Hexadecimal escape (\xHH)
                        Some(b'x') => {
                            self.cursor.advance();
                            match self.read_hex_escape(2) {
                                Ok(hex_val) => {
                                    value.push(std::char::from_u32(hex_val).unwrap_or('\u{FFFD}'));
                                }
                                Err(_) => {
                                    // Invalid escape, but we continue with template
                                    is_invalid = true;
                                    value.push_str("\\x");
                                }
                            }
                        }

                        // Unicode escape (\uHHHH)
                        Some(b'u') => {
                            self.cursor.advance();
                            match self.read_unicode_escape() {
                                Ok(ch) => {
                                    value.push(ch);
                                }
                                Err(_) => {
                                    // Invalid escape, but we continue with template
                                    is_invalid = true;
                                    value.push_str("\\u");
                                }
                            }
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
                            // In templates, \ before character that doesn't need escaping
                            // is preserved in the cooked value for standard escapes
                            if matches!(ch, b'`' | b'\\' | b'$') {
                                value.push(ch as char);
                            } else {
                                // Raw character for non-standard escapes
                                value.push('\\');
                                value.push(ch as char);
                            }
                            self.cursor.advance();
                        }

                        // EOF after backslash
                        None => {
                            let span = self.span();
                            return Err(Error {
                                kind: ErrorKind::InvalidTemplate {
                                    reason: "Unterminated template literal",
                                },
                                span,
                            });
                        }
                    }
                }

                // Line breaks are allowed in templates
                Some(b'\n') => {
                    value.push('\n');
                    self.cursor.advance();
                }
                Some(b'\r') => {
                    value.push('\r');
                    self.cursor.advance();
                    // Skip CRLF
                    if self.cursor.peek() == Some(b'\n') {
                        value.push('\n');
                        self.cursor.advance();
                    }
                }

                // Regular character
                Some(ch) => {
                    // For performance reasons, we'll read a batch of regular characters
                    if !has_escapes && ch < 128 {
                        // Fast path for ASCII characters
                        let start = self.cursor.position();
                        self.cursor.advance_while(|c| {
                            c != b'`'
                                && c != b'\\'
                                && c != b'$'
                                && c != b'\n'
                                && c != b'\r'
                                && c < 128
                        });

                        // Add all these characters at once
                        let end = self.cursor.position();
                        if end > start {
                            let slice = unsafe { self.cursor.slice_unchecked(start, end) };
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

        // Extract the raw template (including backticks)
        let end_idx = self.cursor.position();
        let raw_bytes = unsafe { self.cursor.slice_unchecked(start_idx, end_idx) };
        let raw_str = unsafe { std::str::from_utf8_unchecked(raw_bytes) };

        let span = self.span();

        // If we found a "${", return the content before "${"
        if found_dollar_brace {
            return Ok(Token::new(
                TokenType::Template,
                span,
                had_line_break,
                TokenValue::Template {
                    raw: Atom::from(raw_str),
                    cooked: if is_invalid {
                        None
                    } else {
                        Some(Atom::from(value))
                    },
                },
            ));
        }

        // Determine the token type for a regular template
        Ok(Token::new(
            TokenType::Template,
            span,
            had_line_break,
            if is_invalid {
                TokenValue::Template {
                    raw: Atom::from(raw_str),
                    cooked: None, // No cooked value for invalid templates
                }
            } else {
                TokenValue::Template {
                    raw: Atom::from(raw_str),
                    cooked: Some(Atom::from(value)),
                }
            },
        ))
    }
}
