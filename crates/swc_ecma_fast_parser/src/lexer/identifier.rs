//! Identifier processing for the lexer
//!
//! This module handles the parsing of ECMAScript/TypeScript identifiers.

use swc_atoms::Atom;

use super::Lexer;
use crate::{
    error::Result,
    token::{keyword_to_token_type, Token, TokenType, TokenValue},
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

/// Direct lookup tables for common 2-6 letter keywords
/// These give a huge performance benefit by allowing direct match without any
/// loops Each table is specific to a keyword length for maximum performance
// 2-letter keywords (do, if, in, of)
static KEYWORDS_LEN2: [(u16, TokenType); 4] = [
    (u16::from_be_bytes(*b"do"), TokenType::Do),
    (u16::from_be_bytes(*b"if"), TokenType::If),
    (u16::from_be_bytes(*b"in"), TokenType::In),
    (u16::from_be_bytes(*b"of"), TokenType::Of),
];

// 3-letter keywords (for, let, new, try, var)
static KEYWORDS_LEN3: [(u32, TokenType); 5] = [
    (
        (u32::from_be_bytes([0, 0, 0, 0]) | u32::from_be_bytes(*b"for\0")) >> 8,
        TokenType::For,
    ),
    (
        (u32::from_be_bytes([0, 0, 0, 0]) | u32::from_be_bytes(*b"let\0")) >> 8,
        TokenType::Let,
    ),
    (
        (u32::from_be_bytes([0, 0, 0, 0]) | u32::from_be_bytes(*b"new\0")) >> 8,
        TokenType::New,
    ),
    (
        (u32::from_be_bytes([0, 0, 0, 0]) | u32::from_be_bytes(*b"try\0")) >> 8,
        TokenType::Try,
    ),
    (
        (u32::from_be_bytes([0, 0, 0, 0]) | u32::from_be_bytes(*b"var\0")) >> 8,
        TokenType::Var,
    ),
];

// 4-letter keywords (case, else, this, true, null, void, with)
static KEYWORDS_LEN4: [(u32, TokenType); 7] = [
    (u32::from_be_bytes(*b"case"), TokenType::Case),
    (u32::from_be_bytes(*b"else"), TokenType::Else),
    (u32::from_be_bytes(*b"null"), TokenType::Null),
    (u32::from_be_bytes(*b"this"), TokenType::This),
    (u32::from_be_bytes(*b"true"), TokenType::True),
    (u32::from_be_bytes(*b"void"), TokenType::Void),
    (u32::from_be_bytes(*b"with"), TokenType::With),
];

// 5-letter keywords (async, await, break, class, const, false, super, throw,
// while, yield)
static KEYWORDS_LEN5: [(u64, TokenType); 10] = [
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"async\0\0\0")) >> 24,
        TokenType::Async,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"await\0\0\0")) >> 24,
        TokenType::Await,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"break\0\0\0")) >> 24,
        TokenType::Break,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"class\0\0\0")) >> 24,
        TokenType::Class,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"const\0\0\0")) >> 24,
        TokenType::Const,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"false\0\0\0")) >> 24,
        TokenType::False,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"super\0\0\0")) >> 24,
        TokenType::Super,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"throw\0\0\0")) >> 24,
        TokenType::Throw,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"while\0\0\0")) >> 24,
        TokenType::While,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"yield\0\0\0")) >> 24,
        TokenType::Yield,
    ),
];

// 6-letter keywords (delete, export, import, return, static, switch, typeof)
static KEYWORDS_LEN6: [(u64, TokenType); 7] = [
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"delete\0\0")) >> 16,
        TokenType::Delete,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"export\0\0")) >> 16,
        TokenType::Export,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"import\0\0")) >> 16,
        TokenType::Import,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"return\0\0")) >> 16,
        TokenType::Return,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"static\0\0")) >> 16,
        TokenType::Static,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"switch\0\0")) >> 16,
        TokenType::Switch,
    ),
    (
        (u64::from_be_bytes([0, 0, 0, 0, 0, 0, 0, 0]) | u64::from_be_bytes(*b"typeof\0\0")) >> 16,
        TokenType::TypeOf,
    ),
];

/// Direct keyword lookup table for longer keywords
/// This allows for much faster keyword checks without going through the PHF map
/// Each entry contains the keyword and its corresponding TokenType (or None if
/// not a keyword)
struct KeywordEntry {
    keyword: &'static str,
    token_type: Option<TokenType>,
}

static KEYWORD_LOOKUP: [KeywordEntry; 25] = [
    // Common longer keywords (length > 6)
    KeywordEntry {
        keyword: "function",
        token_type: Some(TokenType::Function),
    },
    KeywordEntry {
        keyword: "continue",
        token_type: Some(TokenType::Continue),
    },
    KeywordEntry {
        keyword: "debugger",
        token_type: Some(TokenType::Debugger),
    },
    KeywordEntry {
        keyword: "default",
        token_type: Some(TokenType::Default),
    },
    KeywordEntry {
        keyword: "finally",
        token_type: Some(TokenType::Finally),
    },
    KeywordEntry {
        keyword: "extends",
        token_type: Some(TokenType::Extends),
    },
    KeywordEntry {
        keyword: "catch",
        token_type: Some(TokenType::Catch),
    },
    // TypeScript-specific common keywords
    KeywordEntry {
        keyword: "interface",
        token_type: Some(TokenType::Interface),
    },
    KeywordEntry {
        keyword: "type",
        token_type: Some(TokenType::Type),
    },
    KeywordEntry {
        keyword: "public",
        token_type: Some(TokenType::Public),
    },
    KeywordEntry {
        keyword: "private",
        token_type: Some(TokenType::Private),
    },
    KeywordEntry {
        keyword: "protected",
        token_type: Some(TokenType::Protected),
    },
    KeywordEntry {
        keyword: "abstract",
        token_type: Some(TokenType::Abstract),
    },
    KeywordEntry {
        keyword: "implements",
        token_type: Some(TokenType::Implements),
    },
    KeywordEntry {
        keyword: "readonly",
        token_type: Some(TokenType::Readonly),
    },
    KeywordEntry {
        keyword: "namespace",
        token_type: Some(TokenType::Namespace),
    },
    KeywordEntry {
        keyword: "declare",
        token_type: Some(TokenType::Declare),
    },
    KeywordEntry {
        keyword: "keyof",
        token_type: Some(TokenType::Keyof),
    },
    KeywordEntry {
        keyword: "enum",
        token_type: Some(TokenType::Enum),
    },
    KeywordEntry {
        keyword: "instanceof",
        token_type: Some(TokenType::InstanceOf),
    },
    KeywordEntry {
        keyword: "constructor",
        token_type: Some(TokenType::Constructor),
    },
    KeywordEntry {
        keyword: "undefined",
        token_type: Some(TokenType::Undefined),
    },
    KeywordEntry {
        keyword: "boolean",
        token_type: Some(TokenType::Boolean),
    },
    KeywordEntry {
        keyword: "number",
        token_type: Some(TokenType::Number),
    },
    KeywordEntry {
        keyword: "string",
        token_type: Some(TokenType::String),
    },
];

/// Fast keyword lookup by length and first character
/// This is a nested table indexed by [length][first_char] that contains indices
/// into KEYWORD_LOOKUP where length is capped at 16 chars and first_char is a
/// lowercase ASCII letter
///
/// A value of 255 indicates no entry
static KEYWORD_INDEX: [[u8; 26]; 16] = {
    let mut table = [[255u8; 26]; 16];

    // Initialize with 255 (meaning no entry)
    let mut i = 0;
    while i < KEYWORD_LOOKUP.len() {
        let entry = &KEYWORD_LOOKUP[i];
        let word = entry.keyword;
        let len = word.len();

        if len > 0 && len <= 16 {
            let first_char = word.as_bytes()[0];
            if first_char >= b'a' && first_char <= b'z' {
                // Index by (length-1) and (first_char - 'a')
                table[len - 1][(first_char - b'a') as usize] = i as u8;
            }
        }

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

        // Read as many identifier continue chars as possible
        self.cursor.advance_while(Self::is_identifier_continue);

        // Extract the identifier text
        let span = self.span();
        let ident_start = start_pos.0;
        let ident_end = self.cursor.position();
        let ident_bytes = self.cursor.slice(ident_start, ident_end);
        let ident_str = unsafe { std::str::from_utf8_unchecked(ident_bytes) };
        let had_line_break_bool: bool = self.had_line_break.into();

        // Ultra-fast path for common 2-6 letter keywords using direct table lookup
        let len = ident_bytes.len();

        // Only process if first byte is an ASCII lowercase letter (all keywords start
        // with a-z)
        if len > 0 && ident_bytes[0] >= b'a' && ident_bytes[0] <= b'z' {
            match len {
                // Direct lookup for 2-letter keywords
                2 => {
                    let word_bytes =
                        unsafe { [*ident_bytes.get_unchecked(0), *ident_bytes.get_unchecked(1)] };
                    let word_value = u16::from_be_bytes(word_bytes);

                    for &(keyword_value, token_type) in &KEYWORDS_LEN2 {
                        if word_value == keyword_value {
                            return Ok(Token::new(
                                token_type,
                                span,
                                had_line_break_bool,
                                TokenValue::None,
                            ));
                        }
                    }
                }

                // Direct lookup for 3-letter keywords
                3 => {
                    let word_bytes = unsafe {
                        [
                            *ident_bytes.get_unchecked(0),
                            *ident_bytes.get_unchecked(1),
                            *ident_bytes.get_unchecked(2),
                            0,
                        ]
                    };
                    let word_value = (u32::from_be_bytes(word_bytes)) >> 8;

                    for &(keyword_value, token_type) in &KEYWORDS_LEN3 {
                        if word_value == keyword_value {
                            return Ok(Token::new(
                                token_type,
                                span,
                                had_line_break_bool,
                                TokenValue::None,
                            ));
                        }
                    }
                }

                // Direct lookup for 4-letter keywords
                4 => {
                    let word_bytes = unsafe {
                        [
                            *ident_bytes.get_unchecked(0),
                            *ident_bytes.get_unchecked(1),
                            *ident_bytes.get_unchecked(2),
                            *ident_bytes.get_unchecked(3),
                        ]
                    };
                    let word_value = u32::from_be_bytes(word_bytes);

                    for &(keyword_value, token_type) in &KEYWORDS_LEN4 {
                        if word_value == keyword_value {
                            return Ok(Token::new(
                                token_type,
                                span,
                                had_line_break_bool,
                                TokenValue::None,
                            ));
                        }
                    }
                }

                // Direct lookup for 5-letter keywords
                5 => {
                    let word_bytes = unsafe {
                        [
                            *ident_bytes.get_unchecked(0),
                            *ident_bytes.get_unchecked(1),
                            *ident_bytes.get_unchecked(2),
                            *ident_bytes.get_unchecked(3),
                            *ident_bytes.get_unchecked(4),
                            0,
                            0,
                            0,
                        ]
                    };
                    let word_value = (u64::from_be_bytes(word_bytes)) >> 24;

                    for &(keyword_value, token_type) in &KEYWORDS_LEN5 {
                        if word_value == keyword_value {
                            return Ok(Token::new(
                                token_type,
                                span,
                                had_line_break_bool,
                                TokenValue::None,
                            ));
                        }
                    }
                }

                // Direct lookup for 6-letter keywords
                6 => {
                    let word_bytes = unsafe {
                        [
                            *ident_bytes.get_unchecked(0),
                            *ident_bytes.get_unchecked(1),
                            *ident_bytes.get_unchecked(2),
                            *ident_bytes.get_unchecked(3),
                            *ident_bytes.get_unchecked(4),
                            *ident_bytes.get_unchecked(5),
                            0,
                            0,
                        ]
                    };
                    let word_value = (u64::from_be_bytes(word_bytes)) >> 16;

                    for &(keyword_value, token_type) in &KEYWORDS_LEN6 {
                        if word_value == keyword_value {
                            return Ok(Token::new(
                                token_type,
                                span,
                                had_line_break_bool,
                                TokenValue::None,
                            ));
                        }
                    }
                }

                // Fast path for longer keywords using the lookup table
                7..=16 => {
                    // Get index in KEYWORD_LOOKUP using our index table
                    let first_char_idx = unsafe { (*ident_bytes.get_unchecked(0) - b'a') as usize };
                    let lookup_idx = unsafe {
                        *KEYWORD_INDEX
                            .get_unchecked(len - 1)
                            .get_unchecked(first_char_idx)
                    };

                    if lookup_idx != 255 {
                        // Check if the word matches the entry
                        let entry = unsafe { KEYWORD_LOOKUP.get_unchecked(lookup_idx as usize) };
                        if entry.keyword == ident_str {
                            if let Some(token_type) = entry.token_type {
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

                _ => {}
            }
        }

        // Fallback path: Check in the PHF map if this is a keyword
        // Only runs for potential keywords not in our direct lookup tables
        if let Some(token_type) = keyword_to_token_type(ident_str) {
            return Ok(Token::new(
                token_type,
                span,
                had_line_break_bool,
                TokenValue::None,
            ));
        }

        // Not a keyword, return as identifier with the word value
        Ok(Token::new(
            TokenType::Ident,
            span,
            had_line_break_bool,
            TokenValue::Word(Atom::from(ident_str)),
        ))
    }

    /// Super fast check for ASCII identifier continue character  
    #[inline(always)]
    pub(crate) fn is_ascii_id_continue(ch: u8) -> bool {
        ch < 128 && unsafe { (IDENT_CHAR.get_unchecked(ch as usize) & 2) != 0 }
    }
}
