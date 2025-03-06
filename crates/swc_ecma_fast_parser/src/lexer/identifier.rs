//! Identifier processing for the lexer
//!
//! This module handles the parsing of ECMAScript/TypeScript identifiers.

use swc_atoms::Atom;
use swc_common::Span;

use super::{Cursor, Lexer};
use crate::{
    error::{Error, ErrorKind, Result},
    token::{keyword_to_token_type, Token, TokenType, TokenValue},
};

/// Lookup table for keyword first characters
const KEYWORD_FIRST_CHAR: [bool; 26] = [
    true,  // a
    true,  // b
    true,  // c
    true,  // d
    true,  // e
    true,  // f
    true,  // g
    false, // h
    true,  // i
    false, // j
    false, // k
    true,  // l
    false, // m
    true,  // n
    true,  // o
    true,  // p
    false, // q
    true,  // r
    true,  // s
    true,  // t
    true,  // u
    true,  // v
    true,  // w
    false, // x
    true,  // y
    false, // z
];

impl<'a> Lexer<'a> {
    /// Read an identifier or keyword
    pub(super) fn read_identifier(&mut self) -> Result<Token> {
        let start_pos = self.start_pos;

        // Skip the first character (already verified as identifier start)
        self.cursor.advance();

        // Read as many identifier continue chars as possible
        self.cursor.advance_while(Self::is_identifier_continue);

        // Extract the identifier text
        let span = self.span();
        let ident_start = start_pos.0 as usize;
        let ident_end = self.cursor.position();
        let ident_bytes = self.cursor.slice(ident_start, ident_end);

        // Convert to string (safe, as we know it's valid UTF-8 from the input)
        let ident_str = unsafe { std::str::from_utf8_unchecked(ident_bytes) };
        let had_line_break_bool: bool = self.had_line_break.into();

        // Check if this could be a keyword
        if ident_bytes.len() >= 2 && ident_bytes.len() <= 10 {
            let first_char = ident_bytes[0];

            // Fast path: check if the first character could be a keyword
            if first_char.is_ascii_lowercase() && KEYWORD_FIRST_CHAR[(first_char - b'a') as usize] {
                // It could be a keyword, check the full string
                if let Some(token_type) = keyword_to_token_type(ident_str) {
                    return Ok(Token::new(
                        token_type,
                        span,
                        had_line_break_bool,
                        TokenValue::None,
                    ));
                }
            }
        }

        // Not a keyword, return as identifier
        Ok(Token::new(
            TokenType::Ident,
            span,
            had_line_break_bool,
            TokenValue::Word(Atom::from(ident_str)),
        ))
    }

    /// Check if an identifier can contain escaped unicode
    #[inline]
    pub(super) fn read_escaped_identifier(&mut self) -> Result<Token> {
        // Implementation for escaped unicode identifiers
        // (This is a placeholder - a full implementation would handle escaped
        // sequences)
        let span = self.span();
        Err(Error {
            kind: ErrorKind::InvalidIdentifier {
                reason: "Unicode escape sequences in identifiers not implemented",
            },
            span,
        })
    }

    /// Check if an identifier is a contextual keyword in the current context
    #[inline(always)]
    pub(super) fn check_contextual_keyword(&self, token: &Token, keyword: &str) -> bool {
        if let Some(ident) = token.ident_value() {
            ident.as_str() == keyword
        } else {
            false
        }
    }

    /// Check if an identifier token matches a specific string
    #[inline(always)]
    pub(super) fn is_token_identifier_eq(&self, token: &Token, value: &str) -> bool {
        if let Some(ident) = token.ident_value() {
            ident.as_str() == value
        } else {
            false
        }
    }

    /// Check if current token is specific identifier
    #[inline(always)]
    pub(super) fn is_current_identifier_eq(&self, value: &str) -> bool {
        self.is_token_identifier_eq(&self.current, value)
    }
}
