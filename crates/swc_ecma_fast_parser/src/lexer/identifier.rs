//! Identifier processing for the lexer
//!
//! This module handles the parsing of ECMAScript/TypeScript identifiers.

use swc_atoms::Atom;

use super::Lexer;
use crate::{
    error::Result,
    token::{keyword_to_token_type, Token, TokenType, TokenValue},
    util::likely,
};

// Bit flags for keyword length categorization
const L2: u32 = 1 << 2; // Length 2
const L3: u32 = 1 << 3; // Length 3
const L4: u32 = 1 << 4; // Length 4
const L5: u32 = 1 << 5; // Length 5
const L6: u32 = 1 << 6; // Length 6
const L7: u32 = 1 << 7; // Length 7
const L8: u32 = 1 << 8; // Length 8
const L9: u32 = 1 << 9; // Length 9
const L10: u32 = 1 << 10; // Length 10

/// Lookup table for keyword first characters - includes which lengths exist for
/// that letter Lower 5 bits are set if the character is a valid first char for
/// a keyword Upper bits indicate which lengths are valid for keywords starting
/// with this character
static KEYWORD_INFO: [(bool, u32); 26] = [
    (true, L3 | L5 | L6 | L7 | L8 | L9 | L10), /* a - any, as, await, async, abstract, asserts,
                                                * assert */
    (true, L4 | L5 | L6 | L7),  // b - break, bigint, boolean
    (true, L4 | L5 | L6 | L10), // c - case, catch, class, const, constructor, continue
    (true, L2 | L6 | L7 | L8),  // d - do, delete, declare, debugger
    (true, L4 | L6 | L7),       // e - else, enum, export, extends
    (true, L3 | L4 | L5 | L7),  // f - for, from, false, finally, function
    (true, L3 | L6),            // g - get, global
    (false, 0),                 // h
    (true, L2 | L5 | L8 | L9 | L10), /* i - if, in, is, import, intrinsic, implements,
                                 * instanceof, interface */
    (false, 0),                // j
    (true, L5),                // k - keyof
    (true, L3),                // l - let
    (false, 0),                // m
    (true, L3 | L5 | L6 | L9), // n - new, never, number, namespace
    (true, L2 | L6 | L7),      // o - of, object
    (true, L7 | L8 | L9),      // p - package, private, protected, protected
    (false, 0),                // q
    (true, L6 | L7 | L8),      // r - return, require, readonly
    (true, L3 | L5 | L6 | L6), // s - set, super, switch, static, string, symbol
    (true, L4 | L5 | L6 | L8), // t - this, true, throw, typeof, target, unique
    (true, L5 | L7 | L9),      // u - using, unknown, undefined
    (true, L3 | L4),           // v - var, void
    (true, L4 | L5),           // w - with, while
    (false, 0),                // x
    (true, L5),                // y - yield
    (false, 0),                // z
];

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

impl Lexer<'_> {
    /// Read an identifier or keyword
    #[inline(always)]
    pub(super) fn read_identifier(&mut self) -> Result<Token> {
        let start_pos = self.start_pos;

        // Skip the first character (already verified as identifier start)
        self.cursor.advance();

        // Read as many identifier continue chars as possible using optimized methods
        // that prefer SIMD processing where available
        self.cursor.advance_while(Self::is_identifier_continue);

        // Extract the identifier text
        let span = self.span();
        let ident_start = start_pos.0 as usize;
        let ident_end = self.cursor.position();
        let ident_bytes = self.cursor.slice(ident_start, ident_end);
        let ident_len = ident_bytes.len();

        // Convert to string (safe, as we know it's valid UTF-8 from the input)
        let ident_str = unsafe { std::str::from_utf8_unchecked(ident_bytes) };
        let had_line_break_bool: bool = self.had_line_break.into();

        // Fast path for keywords - most keywords are 2-10 characters long
        // and start with lowercase ASCII letters a-z
        if likely((2..=10).contains(&ident_len)) {
            let first_char = ident_bytes[0];

            // Only check for keywords if first char is lowercase ASCII
            if likely(first_char.is_ascii_lowercase()) {
                let idx = (first_char - b'a') as usize;
                let (is_keyword_char, length_mask) = KEYWORD_INFO[idx];

                // Check if this first character can start a keyword AND
                // if there are keywords of this length starting with this character
                if likely(is_keyword_char && (length_mask & (1 << ident_len) != 0)) {
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
        }

        // Not a keyword, return as identifier
        Ok(Token::new(
            TokenType::Ident,
            span,
            had_line_break_bool,
            TokenValue::Word(Atom::from(ident_str)),
        ))
    }

    /// Super fast check for ASCII identifier start character
    #[inline(always)]
    pub(crate) fn is_ascii_id_start(ch: u8) -> bool {
        ch < 128 && (IDENT_CHAR[ch as usize] & 1) != 0
    }

    /// Super fast check for ASCII identifier continue character  
    #[inline(always)]
    pub(crate) fn is_ascii_id_continue(ch: u8) -> bool {
        ch < 128 && (IDENT_CHAR[ch as usize] & 2) != 0
    }
}
