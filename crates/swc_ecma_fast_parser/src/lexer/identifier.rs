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

impl<'a> Lexer<'a> {
    /// Read an identifier or keyword
    pub(super) fn read_identifier(&mut self) -> Result<Token> {
        let start_pos = self.start_pos;

        // Skip the first character (already verified as identifier start)
        self.cursor.advance();

        // Read as many identifier continue chars as possible
        self.cursor
            .advance_while(|ch| Self::is_identifier_continue(ch));

        // Extract the identifier text
        let span = self.span();
        let ident_start = start_pos.0 as usize;
        let ident_end = self.cursor.position();
        let ident_bytes = self.cursor.slice(ident_start, ident_end);

        // Convert to string (safe, as we know it's valid UTF-8 from the input)
        let ident_str = unsafe { std::str::from_utf8_unchecked(ident_bytes) };

        // Check if this is a keyword
        if let Some(keyword_type) = keyword_to_token_type(ident_str) {
            Ok(Token::new(
                keyword_type,
                span,
                self.had_line_break,
                TokenValue::None,
            ))
        } else {
            // Regular identifier
            Ok(Token::new(
                TokenType::Ident,
                span,
                self.had_line_break,
                TokenValue::Word(Atom::from(ident_str)),
            ))
        }
    }

    /// Check if an identifier can contain escaped unicode
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
    pub(super) fn check_contextual_keyword(&self, token: &Token, keyword: &str) -> bool {
        if let Some(ident) = token.ident_value() {
            ident.as_str() == keyword
        } else {
            false
        }
    }

    /// Check if an identifier token matches a specific string
    pub(super) fn is_token_identifier_eq(&self, token: &Token, value: &str) -> bool {
        if let Some(ident) = token.ident_value() {
            ident.as_str() == value
        } else {
            false
        }
    }

    /// Check if current token is specific identifier
    pub(super) fn is_current_identifier_eq(&self, value: &str) -> bool {
        self.is_token_identifier_eq(&self.current, value)
    }
}
