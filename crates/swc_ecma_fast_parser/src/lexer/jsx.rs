//! JSX syntax processing for the lexer
//!
//! This module handles the parsing of JSX syntax in React-style templates.

use swc_atoms::Atom;

use super::Lexer;
use crate::{
    error::Result,
    token::{Token, TokenType, TokenValue},
};

impl Lexer<'_> {
    /// Read a JSX token when inside JSX context
    pub(super) fn read_jsx_token(&mut self, had_line_break: bool) -> Result<Token> {
        match self.cursor.peek() {
            // Start of JSX element or fragment
            Some(b'<') => {
                self.cursor.advance();

                // Check for JSX fragment opening
                if self.cursor.peek() == Some(b'>') {
                    self.cursor.advance();
                    Ok(Token::new(
                        TokenType::JSXTagStart,
                        self.span(),
                        had_line_break,
                        TokenValue::None,
                    ))
                } else {
                    Ok(Token::new(
                        TokenType::JSXTagStart,
                        self.span(),
                        had_line_break,
                        TokenValue::None,
                    ))
                }
            }

            // End of JSX element or fragment
            Some(b'>') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::Gt,
                    self.span(),
                    had_line_break,
                    TokenValue::None,
                ))
            }

            // JSX closing tag or fragment closing
            Some(b'/') => {
                self.cursor.advance();

                if self.cursor.peek() == Some(b'>') {
                    self.cursor.advance();

                    // Self-closing tag
                    Ok(Token::new(
                        TokenType::JSXTagEnd,
                        self.span(),
                        had_line_break,
                        TokenValue::None,
                    ))
                } else {
                    // Closing tag start
                    Ok(Token::new(
                        TokenType::Slash,
                        self.span(),
                        had_line_break,
                        TokenValue::None,
                    ))
                }
            }

            // JSX attribute value start
            Some(b'=') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::Eq,
                    self.span(),
                    had_line_break,
                    TokenValue::None,
                ))
            }

            // JSX quoted attribute value
            Some(b'"') | Some(b'\'') => self.read_string(self.cursor.peek().unwrap()),

            // JSX expression in attributes or children
            Some(b'{') => {
                self.cursor.advance();
                self.in_jsx_element = false; // Exit JSX context
                Ok(Token::new(
                    TokenType::LBrace,
                    self.span(),
                    had_line_break,
                    TokenValue::None,
                ))
            }

            // JSX text content
            _ => self.read_jsx_text(had_line_break),
        }
    }

    /// Read JSX text content
    fn read_jsx_text(&mut self, had_line_break: bool) -> Result<Token> {
        let start_pos = self.start_pos;
        let start_idx = start_pos.0 as usize;

        let mut text = String::new();

        // Read until we find <, {, or >
        loop {
            match self.cursor.peek() {
                Some(b'<') | Some(b'{') | Some(b'>') | None => {
                    break;
                }
                Some(_) => {
                    // For performance, read chunks of text at once if possible
                    let start = self.cursor.position();
                    self.cursor
                        .advance_while(|c| c != b'<' && c != b'{' && c != b'>');
                    let end = self.cursor.position();

                    if end > start {
                        let slice = self.cursor.slice(start, end);
                        text.push_str(unsafe { std::str::from_utf8_unchecked(slice) });
                    }
                }
            }
        }

        // Skip whitespace-only JSX text
        if text.trim().is_empty() {
            // Return either a new token or the next token
            if self.cursor.peek().is_none() {
                return Ok(Token::new(
                    TokenType::EOF,
                    self.span(),
                    had_line_break,
                    TokenValue::None,
                ));
            } else {
                return self.read_jsx_token(had_line_break);
            }
        }

        // Extract the raw text
        let end_idx = self.cursor.position();
        let raw_bytes = self.cursor.slice(start_idx, end_idx);
        let raw_str = unsafe { std::str::from_utf8_unchecked(raw_bytes) };

        let span = self.span();

        Ok(Token::new(
            TokenType::JSXText,
            span,
            self.had_line_break.into(),
            TokenValue::Str {
                value: Atom::from(text),
                raw: Atom::from(raw_str),
            },
        ))
    }
}
