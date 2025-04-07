//! Identifier processing for the lexer
//!
//! This module handles the parsing of ECMAScript/TypeScript identifiers.

use swc_atoms::Atom;
use unicode_id_start::{is_id_continue_unicode, is_id_start_unicode};

use super::Lexer;
use crate::{
    error::Result,
    token::{keyword_to_token_type, Token, TokenType, TokenValue},
    util::likely,
};

/// Fast mapping from ASCII to check if a character is valid for identifier
/// start or continuation using bit flags
static IDENT_CHAR: [u8; 128] = {
    let mut table = [0u8; 128];

    // Mark identifier start characters (a-z, A-Z, _, $)
    let mut i = 0;
    while i < 26 {
        table[(b'a' + i) as usize] |= 3; // Both start and continue
        table[(b'A' + i) as usize] |= 3; // Both start and continue
        i += 1;
    }
    table[b'_' as usize] |= 3; // Both start and continue
    table[b'$' as usize] |= 3; // Both start and continue

    // Mark digits (0-9) as continue only
    i = 0;
    while i < 10 {
        table[(b'0' + i) as usize] |= 2; // Continue only
        i += 1;
    }

    table
};

/// ASCII lowercase letters that cannot start a keyword: h, j, m, q, x, z
/// Used to fast-path identifiers that can never be keywords
static NON_KEYWORD_START: [bool; 128] = {
    let mut table = [false; 128];
    table[b'h' as usize] = true;
    table[b'j' as usize] = true;
    table[b'm' as usize] = true;
    table[b'q' as usize] = true;
    table[b'x' as usize] = true;
    table[b'z' as usize] = true;
    table
};

impl Lexer<'_> {
    /// Check if a character is a non-keyword ASCII start character
    #[inline(always)]
    pub(super) fn is_non_keyword_start(ch: u8) -> bool {
        ch < 128 && unsafe { *NON_KEYWORD_START.get_unchecked(ch as usize) }
    }

    /// Optimized path for identifiers that start with characters that can't be
    /// keywords
    #[inline(always)]
    pub(super) fn read_non_keyword_identifier(&mut self) -> Result<Token> {
        let start_pos = self.start_pos;

        // Skip the first character (already verified as identifier start)
        self.cursor.advance();

        // Read as many identifier continue chars as possible
        self.cursor.advance_while(Self::is_ascii_id_continue);

        // Extract the identifier text
        let ident_start = start_pos.0;
        let ident_end = self.cursor.position();
        let ident_bytes = unsafe { self.cursor.slice_unchecked(ident_start, ident_end) };
        let non_unicode_ident_str = unsafe { std::str::from_utf8_unchecked(ident_bytes) };

        let ident_str = if let Some(ch) = self.cursor.peek() {
            if ch == b'\\' {
                &self.read_identifier_with_unicode_escape(non_unicode_ident_str)?
            } else if !ch.is_ascii() {
                &self.read_identifier_with_utf8_charater(non_unicode_ident_str)?
            } else {
                non_unicode_ident_str
            }
        } else {
            non_unicode_ident_str
        };
        let had_line_break_bool: bool = self.had_line_break.into();
        let span = self.span();

        // For non-keyword identifiers, we can directly return without checking keyword
        // maps
        Ok(Token::new(
            TokenType::Ident,
            span,
            had_line_break_bool,
            TokenValue::Word(Atom::from(ident_str)),
        ))
    }

    /// Read an identifier or keyword
    #[inline(always)]
    pub(super) fn read_identifier(&mut self) -> Result<Token> {
        let start_pos = self.start_pos;

        // Skip the first character (already verified as identifier start)
        self.cursor.advance();

        // Read as many identifier continue chars as possible
        self.cursor.advance_while(Self::is_ascii_id_continue);

        // Extract the identifier text
        let ident_start = start_pos.0;
        let ident_end = self.cursor.position();
        let had_line_break_bool: bool = self.had_line_break.into();
        let non_unicode_ident_str = unsafe {
            std::str::from_utf8_unchecked(self.cursor.slice_unchecked(ident_start, ident_end))
        };

        let ident_str = if let Some(ch) = self.cursor.peek() {
            if ch == b'\\' {
                &self.read_identifier_with_unicode_escape(non_unicode_ident_str)?
            } else if !ch.is_ascii() {
                &self.read_identifier_with_utf8_charater(non_unicode_ident_str)?
            } else {
                non_unicode_ident_str
            }
        } else {
            non_unicode_ident_str
        };
        // Ultra-fast path for common 2-6 letter keywords using direct table lookup
        let ident_bytes = ident_str.as_bytes();
        let len = ident_str.len();

        let span = self.span();
        // Only process if first byte is an ASCII lowercase letter (all keywords start
        // with a-z)
        if len > 0 && ident_bytes[0] >= b'a' && ident_bytes[0] <= b'z' {
            // Only runs for potential keywords not in our direct lookup tables
            if let Some(token_type) = keyword_to_token_type(ident_str) {
                return Ok(Token::new(
                    token_type,
                    span,
                    had_line_break_bool,
                    TokenValue::None,
                ));
            }
        }

        // Not a keyword, return as identifier with the word value
        Ok(Token::new(
            TokenType::Ident,
            span,
            had_line_break_bool,
            TokenValue::Word(Atom::from(ident_str)),
        ))
    }

    fn read_identifier_with_unicode_escape(&mut self, non_unicode: &str) -> Result<String> {
        let mut buffer = String::from(non_unicode);
        self.identifier_with_unicode_escape_part(&mut buffer)?;

        Ok(buffer)
    }

    fn identifier_with_unicode_escape_part(&mut self, buffer: &mut String) -> Result<()> {
        while let Some(ch) = self.cursor.peek_char() {
            if ch == '\\' && self.cursor.peek_at(1) == Some(b'u') {
                // Skip the "\\u"
                self.cursor.advance_n(2);
                let unicode_escape = self.read_unicode_escape()?;
                buffer.push(unicode_escape);
            } else if Self::is_identifier_continue(ch) {
                buffer.push(ch);
                self.cursor.advance_char();
            } else {
                break;
            }
        }
        Ok(())
    }

    fn read_identifier_with_utf8_charater(&mut self, non_unicode: &str) -> Result<String> {
        let mut buffer = String::from(non_unicode);
        while let Some(ch) = self.cursor.peek_char() {
            if likely(Self::is_identifier_continue(ch)) {
                buffer.push(ch);
                self.cursor.advance_char();
            } else if ch == '\\' {
                self.identifier_with_unicode_escape_part(&mut buffer)?;
            } else {
                break;
            }
        }

        Ok(buffer)
    }

    /// Super fast check for ASCII identifier start character
    #[inline(always)]
    pub(crate) fn is_ascii_id_start(ch: u8) -> bool {
        ch < 128 && unsafe { (IDENT_CHAR.get_unchecked(ch as usize) & 1) != 0 }
    }

    /// Super fast check for ASCII identifier continue character  
    #[inline(always)]
    pub(crate) fn is_ascii_id_continue(ch: u8) -> bool {
        ch < 128 && unsafe { (IDENT_CHAR.get_unchecked(ch as usize) & 2) != 0 }
    }

    /// Check if a byte is a valid identifier start character
    #[inline(always)]
    pub(crate) fn is_identifier_start(ch: char) -> bool {
        // ASCII fast path using optimized identifier functions
        if likely(ch.is_ascii()) {
            Self::is_ascii_id_start(ch as u8)
        } else {
            is_id_start_unicode(ch)
        }
    }

    /// Check if a byte is a valid identifier continue character
    #[inline(always)]
    pub(crate) fn is_identifier_continue(ch: char) -> bool {
        // ASCII fast path using optimized identifier functions
        if likely(ch.is_ascii()) {
            Self::is_ascii_id_continue(ch as u8)
        } else {
            is_id_continue_unicode(ch)
        }
    }
}
