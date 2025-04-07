//! High-performance lexer for ECMAScript/TypeScript
//!
//! This lexer is designed for maximum performance and operates at the byte
//! level directly on the input string for optimal throughput.

#![allow(clippy::redundant_closure_call)]

mod common;
mod cursor;
mod identifier;
mod jsx;
mod number;
mod operators;
mod regex;
mod string;
mod template;
#[cfg(test)]
mod tests;

use std::rc::Rc;

use cursor::Cursor;
use memchr::memchr2;
use swc_common::{BytePos, Span, DUMMY_SP};
use wide::u8x16;

use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
    util::{likely, unlikely},
    JscTarget, SingleThreadedComments, Syntax,
};

/// Represents line break detection
/// Optimized to fit in a single byte and provide performant conversions
#[derive(Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
enum LineBreak {
    None = 0,
    Present = 1,
}

impl From<bool> for LineBreak {
    #[inline(always)]
    fn from(b: bool) -> Self {
        // Use direct transmute for faster conversion - avoid branching
        unsafe { std::mem::transmute(b as u8) }
    }
}

impl From<LineBreak> for bool {
    #[inline(always)]
    fn from(lb: LineBreak) -> Self {
        // Direct conversion to boolean with no branching
        lb as u8 != 0
    }
}

/// High-performance lexer for ECMAScript/TypeScript
///
/// This lexer processes input as UTF-8 bytes for maximum performance.
#[repr(C)] // Ensure predictable memory layout
pub struct Lexer<'a> {
    /// Current token
    pub current: Token,

    /// Byte-level cursor to the input source
    cursor: Cursor<'a>,

    /// Syntax configuration for the parser
    pub syntax: Syntax,

    /// Target ECMAScript version
    pub target: JscTarget,

    /// Start position of the current token
    start_pos: BytePos,

    /// Comments storage
    pub comments: Option<Rc<SingleThreadedComments>>,

    /// Whether the lexer is in strict mode
    pub strict_mode: bool,

    /// Whether the lexer is in JSX element context
    pub in_jsx_element: bool,

    /// Whether the lexer is in template literal context
    pub in_template: bool,

    pub in_template_expr: bool,

    /// Whether we had a line break before the current token
    had_line_break: LineBreak,
}

// Bit flags for character classification - used in lookup tables
const CHAR_WHITESPACE: u8 = 0b0000_0001;
const CHAR_LINEBREAK: u8 = 0b0000_0010;
const CHAR_ID_START: u8 = 0b0000_0100;
const CHAR_ID_CONTINUE: u8 = 0b0000_1000;
const CHAR_DIGIT: u8 = 0b0001_0000;
const CHAR_HEX_DIGIT: u8 = 0b0010_0000;
const CHAR_OPERATOR: u8 = 0b0100_0000;
const CHAR_SPECIAL: u8 = 0b1000_0000;

// SIMD vectors for common whitespace characters
static SPACE_SIMD_VEC: u8x16 = u8x16::new([b' '; 16]);
static TAB_SIMD_VEC: u8x16 = u8x16::new([b'\t'; 16]);
static FORM_FEED_SMID_VEC: u8x16 = u8x16::new([0x0c; 16]);
static VECR_TAB_SMID_VEC: u8x16 = u8x16::new([0x0b; 16]);

// Extended lookup table for faster character checks (ASCII only)
static ASCII_LOOKUP: [u8; 256] = {
    let mut table = [0u8; 256];

    // Mark whitespace characters
    table[b' ' as usize] = CHAR_WHITESPACE;
    table[b'\t' as usize] = CHAR_WHITESPACE;
    table[b'\n' as usize] = CHAR_WHITESPACE | CHAR_LINEBREAK;
    table[b'\r' as usize] = CHAR_WHITESPACE | CHAR_LINEBREAK;
    table[0x0c_usize] = CHAR_WHITESPACE; // Form feed
    table[0x0b_usize] = CHAR_WHITESPACE; // Vertical tab

    // Mark identifier start characters (a-z, A-Z, _, $)
    let mut i = 0;
    while i < 26 {
        table[(b'a' + i) as usize] |=
            CHAR_ID_START | CHAR_ID_CONTINUE | (CHAR_HEX_DIGIT * ((i < 6) as u8));
        table[(b'A' + i) as usize] |=
            CHAR_ID_START | CHAR_ID_CONTINUE | (CHAR_HEX_DIGIT * ((i < 6) as u8));
        i += 1;
    }
    table[b'_' as usize] |= CHAR_ID_START | CHAR_ID_CONTINUE;
    table[b'$' as usize] |= CHAR_ID_START | CHAR_ID_CONTINUE;

    // Mark digits (0-9)
    i = 0;
    while i < 10 {
        table[(b'0' + i) as usize] |= CHAR_ID_CONTINUE | CHAR_DIGIT | CHAR_HEX_DIGIT;
        i += 1;
    }

    // Mark common operators
    table[b'+' as usize] |= CHAR_OPERATOR;
    table[b'-' as usize] |= CHAR_OPERATOR;
    table[b'*' as usize] |= CHAR_OPERATOR;
    table[b'/' as usize] |= CHAR_OPERATOR;
    table[b'%' as usize] |= CHAR_OPERATOR;
    table[b'=' as usize] |= CHAR_OPERATOR;
    table[b'<' as usize] |= CHAR_OPERATOR;
    table[b'>' as usize] |= CHAR_OPERATOR;
    table[b'&' as usize] |= CHAR_OPERATOR;
    table[b'|' as usize] |= CHAR_OPERATOR;
    table[b'^' as usize] |= CHAR_OPERATOR;
    table[b'!' as usize] |= CHAR_OPERATOR;
    table[b'~' as usize] |= CHAR_OPERATOR | CHAR_SPECIAL; // Both special char and operator
    table[b'?' as usize] |= CHAR_OPERATOR;
    table[b'.' as usize] |= CHAR_OPERATOR;
    table[b':' as usize] |= CHAR_SPECIAL; // Colon is only a special char, not an operator

    // Mark special characters (frequently used in parsing decisions)
    table[b'{' as usize] |= CHAR_SPECIAL;
    table[b'}' as usize] |= CHAR_SPECIAL;
    table[b'(' as usize] |= CHAR_SPECIAL;
    table[b')' as usize] |= CHAR_SPECIAL;
    table[b'[' as usize] |= CHAR_SPECIAL;
    table[b']' as usize] |= CHAR_SPECIAL;
    table[b';' as usize] |= CHAR_SPECIAL;
    table[b',' as usize] |= CHAR_SPECIAL;
    table[b'"' as usize] |= CHAR_SPECIAL;
    table[b'\'' as usize] |= CHAR_SPECIAL;
    table[b'`' as usize] |= CHAR_SPECIAL;
    table[b'#' as usize] |= CHAR_SPECIAL;
    table[b'@' as usize] |= CHAR_SPECIAL;

    table
};

// Token type dispatch table to avoid large match statements - this stores
// TokenType by character
static TOKEN_DISPATCH: [TokenType; 128] = {
    let mut table = [TokenType::Invalid; 128];

    // Single-character tokens
    table[b'(' as usize] = TokenType::LParen;
    table[b')' as usize] = TokenType::RParen;
    table[b'{' as usize] = TokenType::LBrace;
    table[b'}' as usize] = TokenType::RBrace;
    table[b'[' as usize] = TokenType::LBracket;
    table[b']' as usize] = TokenType::RBracket;
    table[b';' as usize] = TokenType::Semi;
    table[b',' as usize] = TokenType::Comma;
    table[b':' as usize] = TokenType::Colon;
    table[b'~' as usize] = TokenType::Tilde;
    table[b'@' as usize] = TokenType::At;

    table
};

impl<'a> Lexer<'a> {
    /// Create a new lexer from a string input
    #[inline(always)]
    pub fn new(
        input: &'a str,
        target: JscTarget,
        syntax: Syntax,
        comments: Option<Rc<SingleThreadedComments>>,
    ) -> Self {
        let cursor = Cursor::new(input);
        let dummy_token = Token::new(TokenType::EOF, DUMMY_SP, false, TokenValue::None);

        let mut lexer = Self {
            cursor,
            current: dummy_token,
            syntax,
            target,
            strict_mode: false,
            in_jsx_element: false,
            in_template: false,
            in_template_expr: false,
            comments,
            start_pos: BytePos(0),
            had_line_break: LineBreak::None,
        };

        // Prime the lexer with the first token
        let _ = lexer.next_token();

        lexer
    }

    /// Get the next token
    #[inline(always)]
    pub fn next_token(&mut self) -> Result<Token> {
        if likely(!self.in_template || self.in_template_expr) {
            // Skip whitespaces and comments
            self.skip_whitespace();
        }

        // Remember if there were line breaks before this token
        let had_line_break = self.had_line_break;
        self.had_line_break = LineBreak::None;

        // Remember the start position of this token
        self.start_pos = self.cursor.pos();

        // If we're in JSX mode, use the JSX tokenizer
        if unlikely(self.in_jsx_element) {
            return self.read_jsx_token(had_line_break.into());
        }

        // Get the next character - fast path for EOF
        let ch = match self.cursor.peek() {
            Some(ch) => ch,
            None => {
                // End of file - reuse the same EOF token object
                let token = Token::new(
                    TokenType::EOF,
                    self.span(),
                    had_line_break.into(),
                    TokenValue::None,
                );
                return Ok(std::mem::replace(&mut self.current, token));
            }
        };

        // Process the character to determine the token type
        let token = self.read_token(ch, had_line_break.into())?;

        // Update the current token and return a clone of the previous one
        Ok(std::mem::replace(&mut self.current, token))
    }

    /// Read the next token starting with the given character
    #[inline(always)]
    fn read_token(&mut self, ch: u8, had_line_break: bool) -> Result<Token> {
        if unlikely(self.in_template && !self.in_template_expr) {
            return self.read_template_content(had_line_break);
        }

        // Fast path for ASCII tokens using lookup table
        if likely(ch < 128) {
            let char_type = unsafe { *ASCII_LOOKUP.get_unchecked(ch as usize) };

            // Fast path for single-character tokens (very common)
            if char_type & CHAR_SPECIAL != 0 {
                match ch {
                    // Group frequent tokens together for better branch prediction
                    // Use direct table lookup for single-character tokens
                    b'{' | b'}' | b'(' | b')' | b'[' | b']' | b';' | b',' | b':' | b'~' | b'@' => {
                        // Special case for closing brace in template
                        if unlikely(ch == b'}' && self.in_template) {
                            // End of template expression
                            self.in_template_expr = false;
                        }

                        let token_type = unsafe { *TOKEN_DISPATCH.get_unchecked(ch as usize) };
                        self.cursor.advance();

                        Ok(Token::new(
                            token_type,
                            self.span(),
                            had_line_break,
                            TokenValue::None,
                        ))
                    }

                    // String literals - group together for better branch prediction
                    b'"' | b'\'' => self.read_string(ch),
                    b'`' => {
                        self.in_template = true;
                        self.cursor.advance();

                        Ok(Token::new(
                            TokenType::BackQuote,
                            self.span(),
                            had_line_break,
                            TokenValue::None,
                        ))
                    }

                    // Other special characters that need custom handling
                    b'#' => self.read_hash(),

                    // This should not happen given our table design, but handle it anyway
                    _ => {
                        self.cursor.advance();
                        let span = self.span();
                        Err(Error {
                            kind: ErrorKind::General {
                                message: format!("Unexpected character: '{}'", ch as char),
                            },
                            span,
                        })
                    }
                }
            }
            // Check for digits (numeric literals)
            else if char_type & CHAR_DIGIT != 0 {
                self.read_number()
            }
            // Check for operator characters
            else if char_type & CHAR_OPERATOR != 0 {
                // Dispatch to specific operator handlers based on the character
                match ch {
                    b'.' => self.read_dot(),
                    b'=' => self.read_equals(),
                    b'+' => self.read_plus(),
                    b'-' => self.read_minus(),
                    b'/' => self.read_slash(had_line_break),
                    b'<' => self.read_less_than(),
                    b'>' => self.read_greater_than(),
                    b'!' => self.read_exclamation_mark(),
                    b'?' => self.read_question_mark(),
                    b'*' => self.read_asterisk(),
                    b'%' => self.read_percent(),
                    b'|' => self.read_pipe(),
                    b'&' => self.read_ampersand(),
                    b'^' => self.read_caret(),
                    _ => {
                        // This should never happen with our table design
                        self.cursor.advance();
                        let span = self.span();
                        Err(Error {
                            kind: ErrorKind::General {
                                message: format!("Unexpected character: '{}'", ch as char),
                            },
                            span,
                        })
                    }
                }
            }
            // Identifier start characters
            else if char_type & CHAR_ID_START != 0 {
                // Fast path for identifiers that can't be keywords
                if Self::is_non_keyword_start(ch) {
                    self.read_non_keyword_identifier()
                } else {
                    self.read_identifier()
                }
            }
            // Any other ASCII character (error case)
            else {
                self.cursor.advance();
                let span = self.span();
                Err(Error {
                    kind: ErrorKind::General {
                        message: format!("Unexpected character: '{}'", ch as char),
                    },
                    span,
                })
            }
        } else {
            // Non-ASCII character path (less common)
            if Self::is_identifier_start(ch as char) {
                self.read_non_keyword_identifier()
            } else {
                self.cursor.advance();
                let span = self.span();
                Err(Error {
                    kind: ErrorKind::General {
                        message: format!("Unexpected character: '{}'", ch as char),
                    },
                    span,
                })
            }
        }
    }

    /// Create a span from the start position to the current position
    #[inline(always)]
    fn span(&self) -> Span {
        Span::new(self.start_pos, self.cursor.pos())
    }

    /// Skip whitespace and comments - optimized hot path
    #[inline(always)]
    fn skip_whitespace(&mut self) {
        // Process whitespace in SIMD batches when possible
        while !self.cursor.is_eof() {
            // First, handle SIMD optimized whitespace skipping for common ASCII whitespace
            if self.process_whitespace_simd() {
                continue;
            }

            // Fallback to standard processing for comments and special cases
            let ch = match self.cursor.peek() {
                Some(c) => c,
                None => break,
            };

            // Handle ASCII characters
            if likely(ch < 128) {
                let char_type = unsafe { *ASCII_LOOKUP.get_unchecked(ch as usize) };

                // Fast path for common whitespace
                if char_type & CHAR_WHITESPACE != 0 {
                    // Special handling for line breaks
                    if unlikely(char_type & CHAR_LINEBREAK != 0) {
                        if ch == b'\n' {
                            self.cursor.advance();
                            self.had_line_break = LineBreak::Present;
                            continue;
                        } else if ch == b'\r' {
                            self.cursor.advance();
                            // Skip the following \n if it exists (CRLF sequence)
                            if let Some(b'\n') = self.cursor.peek() {
                                self.cursor.advance();
                            }
                            self.had_line_break = LineBreak::Present;
                            continue;
                        }
                    } else {
                        // Regular whitespace (space, tab, etc.)
                        self.cursor.advance();
                        continue;
                    }
                }

                // Handle comments - uses frequency-based ordering
                if ch == b'/' {
                    match self.cursor.peek_at(1) {
                        // Line comment - very common in JS
                        Some(b'/') => {
                            self.cursor.advance_n(2);
                            self.skip_line_comment();
                            continue;
                        }
                        // Block comment - less common
                        Some(b'*') => {
                            self.cursor.advance_n(2);
                            self.skip_block_comment();
                            continue;
                        }
                        _ => break,
                    }
                }

                // Not whitespace or comment
                break;
            } else {
                // Handle Unicode whitespace - rare case
                if ch == 0xe2 {
                    // Check for line separator (U+2028) and paragraph separator (U+2029)
                    let bytes = self.cursor.peek_n(3);
                    if bytes.len() == 3
                        && bytes[0] == 0xe2
                        && bytes[1] == 0x80
                        && (bytes[2] == 0xa8 || bytes[2] == 0xa9)
                    {
                        self.cursor.advance_n(3);
                        self.had_line_break = LineBreak::Present;
                        continue;
                    }
                } else if ch == 0xef {
                    // BOM - extremely rare in middle of file
                    let bytes = self.cursor.peek_n(3);
                    if bytes.len() == 3 && bytes[0] == 0xef && bytes[1] == 0xbb && bytes[2] == 0xbf
                    {
                        self.cursor.advance_n(3);
                        continue;
                    }
                }
                // Not Unicode whitespace
                break;
            }
        }
    }

    /// Process whitespace using SIMD acceleration
    /// Returns true if it processed something, false if it found a
    /// non-whitespace character
    #[inline]
    fn process_whitespace_simd(&mut self) -> bool {
        // Need at least 16 bytes to use SIMD
        let rest_len = self.cursor.rest().len();
        if rest_len < 16 || self.cursor.position() + 16 > rest_len as u32 {
            return false;
        }

        // Get current 16 bytes and load them directly into SIMD vector
        let input = self.cursor.rest();
        let data = unsafe {
            // SAFETY: We've checked that we have at least 16 bytes
            let mut bytes = [0u8; 16];
            std::ptr::copy_nonoverlapping(input.as_ptr(), bytes.as_mut_ptr(), 16);
            u8x16::new(bytes)
        };

        // Handle special characters separately for better branch prediction
        let first_byte = unsafe { *input.get_unchecked(0) };

        // Check for special cases that need individual handling
        match first_byte {
            b'\n' => {
                self.cursor.advance();
                self.had_line_break = LineBreak::Present;
                return true;
            }
            b'\r' => {
                self.cursor.advance();
                if let Some(b'\n') = self.cursor.peek() {
                    self.cursor.advance();
                }
                self.had_line_break = LineBreak::Present;
                return true;
            }
            b'/' => {
                // Check if this could be a comment start
                if let Some(b'/') | Some(b'*') = self.cursor.peek_at(1) {
                    return false; // Let the caller handle comments
                }
                return false; // Not a whitespace
            }
            0xe2 => {
                // Check for line separator (U+2028) and paragraph separator (U+2029)
                let bytes = self.cursor.peek_n(3);
                if bytes.len() == 3
                    && bytes[0] == 0xe2
                    && bytes[1] == 0x80
                    && (bytes[2] == 0xa8 || bytes[2] == 0xa9)
                {
                    self.cursor.advance_n(3);
                    self.had_line_break = LineBreak::Present;
                    return true;
                }
                return false;
            }
            _ => {}
        }

        // Fast path for regular whitespace (space, tab, form feed, vertical tab)
        // Compare with our whitespace vectors
        let is_space = data.cmp_eq(SPACE_SIMD_VEC);
        let is_tab = data.cmp_eq(TAB_SIMD_VEC);
        let is_ff = data.cmp_eq(FORM_FEED_SMID_VEC);
        let is_vt = data.cmp_eq(VECR_TAB_SMID_VEC);

        // Combine masks for regular whitespace
        let is_basic_ws = is_space | is_tab | is_ff | is_vt;

        // Convert SIMD mask to array to process consecutive whitespace
        let ws_array = is_basic_ws.to_array();

        // If the first byte is whitespace, process consecutive whitespace
        if ws_array[0] != 0 {
            // Count consecutive whitespace characters
            let mut count = 0;
            for ws_char in ws_array {
                if ws_char == 0 {
                    break;
                }
                count += 1;
            }

            // Skip all consecutive basic whitespace characters at once
            if count > 0 {
                self.cursor.advance_n(count);
                return true;
            }
        }

        // No whitespace found
        false
    }

    #[inline(always)]
    fn skip_line_comment(&mut self) {
        // Fast path using memchr2 to find either \n or \r
        if let Some(pos) = memchr2(b'\n', b'\r', self.cursor.rest()) {
            let ch = self.cursor.rest()[pos];
            self.cursor.advance_n(pos as u32);

            if ch == b'\n' {
                // Simple newline
                self.cursor.advance(); // Skip the newline
                self.had_line_break = LineBreak::Present;
            } else {
                // Carriage return - check if followed by newline (CRLF)
                self.cursor.advance(); // Skip the \r
                if let Some(b'\n') = self.cursor.peek() {
                    self.cursor.advance(); // Skip the \n in CRLF
                }
                self.had_line_break = LineBreak::Present;
            }
            return;
        }

        // Slower fallback path for Unicode line breaks or when no line break is found
        while let Some(ch) = self.cursor.peek() {
            self.cursor.advance();
            if ch == 0xe2 {
                // Check for line separator (U+2028) and paragraph separator (U+2029)
                let bytes = self.cursor.peek_n(2);
                if bytes.len() == 2 && bytes[0] == 0x80 && (bytes[1] == 0xa8 || bytes[1] == 0xa9) {
                    self.cursor.advance_n(2); // Already advanced the first byte
                    self.had_line_break = LineBreak::Present;
                    break;
                }
            }
        }
    }

    /// Skip a block comment - optimized for faster scanning with chunk-based
    /// approach
    #[inline(always)]
    fn skip_block_comment(&mut self) {
        let mut had_line_break = false;

        // Use a specialized loop with chunk-based scanning for non-special chars
        'outer: while let Some(ch) = self.cursor.peek() {
            match ch {
                // Check for end of comment
                b'*' => {
                    self.cursor.advance();
                    if let Some(b'/') = self.cursor.peek() {
                        self.cursor.advance();
                        if had_line_break {
                            self.had_line_break = LineBreak::Present;
                        }
                        return;
                    }
                }
                // Handle line breaks
                b'\n' => {
                    self.cursor.advance();
                    had_line_break = true;
                }
                b'\r' => {
                    self.cursor.advance();
                    // Skip the following \n if it exists (CRLF sequence)
                    if let Some(b'\n') = self.cursor.peek() {
                        self.cursor.advance();
                    }
                    had_line_break = true;
                }
                // Handle Unicode line breaks
                0xe2 => {
                    // Check for line separator (U+2028) and paragraph separator (U+2029)
                    let bytes = self.cursor.peek_n(3);
                    if bytes.len() == 3
                        && bytes[0] == 0xe2
                        && bytes[1] == 0x80
                        && (bytes[2] == 0xa8 || bytes[2] == 0xa9)
                    {
                        self.cursor.advance_n(3);
                        had_line_break = true;
                        continue;
                    }
                    self.cursor.advance();
                }
                // Fast path: skip chunks of regular characters
                _ => {
                    // Process in larger chunks for better efficiency
                    let mut count = 1;
                    // Use a much larger chunk size (512) for better throughput
                    while count < 512 {
                        match self.cursor.peek_at(count) {
                            // Stop at special characters that need special handling
                            Some(b'*') | Some(b'\n') | Some(b'\r') | Some(0xe2) => break,
                            Some(_) => count += 1,
                            None => {
                                // End of input
                                self.cursor.advance_n(count);
                                break 'outer;
                            }
                        }
                    }
                    self.cursor.advance_n(count);
                }
            }
        }

        // If we reach here, the comment was not closed
        if had_line_break {
            self.had_line_break = LineBreak::Present;
        }
    }
}
