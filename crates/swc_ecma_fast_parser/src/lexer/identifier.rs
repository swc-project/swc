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

/// Direct keyword lookup table for common keywords
/// This allows for much faster keyword checks without going through the PHF map
/// Each entry contains the keyword and its corresponding TokenType (or None if
/// not a keyword)
///
/// Format: (keyword, Some(token_type)) or (keyword, None)
/// For performance reasons, we only include keywords we expect to be common
struct KeywordEntry {
    keyword: &'static str,
    token_type: Option<TokenType>,
}

static KEYWORD_LOOKUP: [KeywordEntry; 46] = [
    // Most common keywords first
    KeywordEntry {
        keyword: "function",
        token_type: Some(TokenType::Function),
    },
    KeywordEntry {
        keyword: "return",
        token_type: Some(TokenType::Return),
    },
    KeywordEntry {
        keyword: "const",
        token_type: Some(TokenType::Const),
    },
    KeywordEntry {
        keyword: "let",
        token_type: Some(TokenType::Let),
    },
    KeywordEntry {
        keyword: "var",
        token_type: Some(TokenType::Var),
    },
    KeywordEntry {
        keyword: "if",
        token_type: Some(TokenType::If),
    },
    KeywordEntry {
        keyword: "else",
        token_type: Some(TokenType::Else),
    },
    KeywordEntry {
        keyword: "for",
        token_type: Some(TokenType::For),
    },
    KeywordEntry {
        keyword: "while",
        token_type: Some(TokenType::While),
    },
    KeywordEntry {
        keyword: "class",
        token_type: Some(TokenType::Class),
    },
    KeywordEntry {
        keyword: "import",
        token_type: Some(TokenType::Import),
    },
    KeywordEntry {
        keyword: "export",
        token_type: Some(TokenType::Export),
    },
    KeywordEntry {
        keyword: "true",
        token_type: Some(TokenType::True),
    },
    KeywordEntry {
        keyword: "false",
        token_type: Some(TokenType::False),
    },
    KeywordEntry {
        keyword: "null",
        token_type: Some(TokenType::Null),
    },
    KeywordEntry {
        keyword: "this",
        token_type: Some(TokenType::This),
    },
    KeywordEntry {
        keyword: "new",
        token_type: Some(TokenType::New),
    },
    KeywordEntry {
        keyword: "try",
        token_type: Some(TokenType::Try),
    },
    KeywordEntry {
        keyword: "catch",
        token_type: Some(TokenType::Catch),
    },
    KeywordEntry {
        keyword: "finally",
        token_type: Some(TokenType::Finally),
    },
    KeywordEntry {
        keyword: "throw",
        token_type: Some(TokenType::Throw),
    },
    KeywordEntry {
        keyword: "break",
        token_type: Some(TokenType::Break),
    },
    KeywordEntry {
        keyword: "continue",
        token_type: Some(TokenType::Continue),
    },
    KeywordEntry {
        keyword: "switch",
        token_type: Some(TokenType::Switch),
    },
    KeywordEntry {
        keyword: "case",
        token_type: Some(TokenType::Case),
    },
    KeywordEntry {
        keyword: "default",
        token_type: Some(TokenType::Default),
    },
    KeywordEntry {
        keyword: "typeof",
        token_type: Some(TokenType::TypeOf),
    },
    KeywordEntry {
        keyword: "instanceof",
        token_type: Some(TokenType::InstanceOf),
    },
    KeywordEntry {
        keyword: "in",
        token_type: Some(TokenType::In),
    },
    KeywordEntry {
        keyword: "do",
        token_type: Some(TokenType::Do),
    },
    KeywordEntry {
        keyword: "void",
        token_type: Some(TokenType::Void),
    },
    KeywordEntry {
        keyword: "await",
        token_type: Some(TokenType::Await),
    },
    KeywordEntry {
        keyword: "yield",
        token_type: Some(TokenType::Yield),
    },
    KeywordEntry {
        keyword: "async",
        token_type: Some(TokenType::Async),
    },
    KeywordEntry {
        keyword: "of",
        token_type: Some(TokenType::Of),
    },
    KeywordEntry {
        keyword: "extends",
        token_type: Some(TokenType::Extends),
    },
    KeywordEntry {
        keyword: "super",
        token_type: Some(TokenType::Super),
    },
    KeywordEntry {
        keyword: "delete",
        token_type: Some(TokenType::Delete),
    },
    KeywordEntry {
        keyword: "debugger",
        token_type: Some(TokenType::Debugger),
    },
    KeywordEntry {
        keyword: "with",
        token_type: Some(TokenType::With),
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
        keyword: "static",
        token_type: Some(TokenType::Static),
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

        // Fast path for keyword checking using direct lookup tables
        let len = ident_bytes.len();
        if len > 0 && len <= 16 {
            let first_byte = ident_bytes[0];
            if first_byte >= b'a' && first_byte <= b'z' {
                // Get index in KEYWORD_LOOKUP using our index table
                let lookup_idx = KEYWORD_INDEX[len - 1][(first_byte - b'a') as usize];

                if lookup_idx != 255 {
                    // Check if the word matches the entry
                    let entry = &KEYWORD_LOOKUP[lookup_idx as usize];
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
        }

        // Slow path: Check in the PHF map if this is a keyword
        // Only runs for potential keywords not in our direct lookup table
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
