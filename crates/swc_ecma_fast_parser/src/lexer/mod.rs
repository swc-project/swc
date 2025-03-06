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
use swc_common::{BytePos, Span, DUMMY_SP};

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
            let char_type = ASCII_LOOKUP[ch as usize];

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
                self.read_identifier()
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
            if Self::is_identifier_start(ch) {
                self.read_identifier()
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
        // Fast path skipping of multiple spaces using SIMD (if available)
        #[cfg(target_arch = "x86_64")]
        if self.cursor.position() + 16 <= self.cursor.rest().len()
            && is_x86_feature_detected!("sse2")
        {
            unsafe {
                self.skip_whitespace_simd();
            }
        }

        // Hot loop for ASCII whitespace and comments - most common case
        while let Some(ch) = self.cursor.peek() {
            if likely(ch < 128) {
                let char_type = ASCII_LOOKUP[ch as usize];

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

    /// SIMD-accelerated whitespace skipping (only used when applicable)
    #[cfg(target_arch = "x86_64")]
    #[inline(always)]
    unsafe fn skip_whitespace_simd(&mut self) {
        use std::arch::x86_64::*;

        const VECTOR_SIZE: usize = 16;
        let input = self.cursor.rest();

        // While we have enough bytes to process with SIMD
        while self.cursor.position() + VECTOR_SIZE <= input.len() {
            let data_ptr = input.as_ptr().add(self.cursor.position());
            let data = _mm_loadu_si128(data_ptr as *const __m128i);

            // Create masks for common whitespace: space, tab, newline, carriage return
            let space_mask = _mm_cmpeq_epi8(data, _mm_set1_epi8(b' ' as i8));
            let tab_mask = _mm_cmpeq_epi8(data, _mm_set1_epi8(b'\t' as i8));

            // Combine the masks
            let whitespace_mask = _mm_or_si128(space_mask, tab_mask);

            // Check if we have all whitespace
            let mask = _mm_movemask_epi8(whitespace_mask);

            if mask == 0xffff {
                // All 16 bytes are whitespace, skip them all
                self.cursor.advance_n(VECTOR_SIZE);
                continue;
            }

            // Find the first non-whitespace character
            let trailing_zeros = (!mask as u16).trailing_zeros() as usize;
            if trailing_zeros > 0 {
                self.cursor.advance_n(trailing_zeros);
            }

            // Check for line breaks or comments in normal path
            break;
        }
    }

    /// Skip a line comment - optimized with SIMD and batch processing
    #[inline(always)]
    fn skip_line_comment(&mut self) {
        // Fast path using find_byte (which uses SIMD internally when available)
        if let Some(newline_pos) = self.cursor.find_byte(b'\n') {
            // Skip to the newline
            let from_cursor = newline_pos - self.cursor.position();
            self.cursor.advance_n(from_cursor);
            self.cursor.advance(); // Skip the newline
            self.had_line_break = LineBreak::Present;
            return;
        }

        // Slower fallback path for when no newline is found
        while let Some(ch) = self.cursor.peek() {
            self.cursor.advance();
            if ch == b'\n' {
                self.had_line_break = LineBreak::Present;
                break;
            } else if ch == b'\r' {
                self.had_line_break = LineBreak::Present;
                // Skip the following \n if it exists (CRLF sequence)
                if let Some(b'\n') = self.cursor.peek() {
                    self.cursor.advance();
                }
                break;
            } else if ch == 0xe2 {
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
                    // SIMD-accelerated search for end marker
                    #[cfg(target_arch = "x86_64")]
                    if is_x86_feature_detected!("sse2") {
                        let rest = self.cursor.rest();
                        if let Some(pos) =
                            unsafe { cursor::simd_find_byte(rest, 0, rest.len(), b'*') }
                        {
                            // Skip directly to the potential end marker
                            self.cursor.advance_n(pos);
                            continue;
                        } else {
                            // No end marker found, skip the entire rest
                            self.cursor.advance_n(rest.len());
                            break 'outer;
                        }
                    }

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

    /// Check if a byte is a valid identifier start character
    #[inline(always)]
    fn is_identifier_start(byte: u8) -> bool {
        // ASCII fast path using optimized identifier functions
        if likely(byte < 128) {
            Self::is_ascii_id_start(byte)
        } else {
            // Non-ASCII, needs further checking in read_identifier
            true
        }
    }

    /// Check if a byte is a valid identifier continue character
    #[inline(always)]
    fn is_identifier_continue(byte: u8) -> bool {
        // ASCII fast path using optimized identifier functions
        if likely(byte < 128) {
            Self::is_ascii_id_continue(byte)
        } else {
            // Non-ASCII, needs further checking in read_identifier
            true
        }
    }
}
