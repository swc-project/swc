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

use std::rc::Rc;

use cursor::Cursor;
use swc_common::{BytePos, Span, DUMMY_SP};

use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
    JscTarget, SingleThreadedComments, Syntax,
};

/// Represents line break detection
#[derive(Clone, Copy, PartialEq, Eq)]
enum LineBreak {
    None = 0,
    Present = 1,
}

impl From<bool> for LineBreak {
    #[inline(always)]
    fn from(b: bool) -> Self {
        if b {
            LineBreak::Present
        } else {
            LineBreak::None
        }
    }
}

impl From<LineBreak> for bool {
    #[inline(always)]
    fn from(lb: LineBreak) -> Self {
        match lb {
            LineBreak::None => false,
            LineBreak::Present => true,
        }
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

    /// Whether we had a line break before the current token
    had_line_break: LineBreak,
}

// Small lookup table for faster character checks (ASCII only)
static ASCII_LOOKUP: [u8; 128] = {
    let mut table = [0u8; 128];

    // Mark whitespace characters
    table[b' ' as usize] = 1;
    table[b'\t' as usize] = 1;
    table[b'\n' as usize] = 2; // Mark as line break
    table[b'\r' as usize] = 2; // Mark as line break
    table[0x0c_usize] = 1; // Form feed

    // Mark identifier start characters
    let mut i = 0;
    while i < 26 {
        table[(b'a' + i) as usize] |= 4; // lowercase
        table[(b'A' + i) as usize] |= 4; // uppercase
        i += 1;
    }
    table[b'_' as usize] |= 4;
    table[b'$' as usize] |= 4;

    // Mark identifier continue characters (includes digits)
    i = 0;
    while i < 10 {
        table[(b'0' + i) as usize] |= 8;
        i += 1;
    }

    table
};

impl<'a> Lexer<'a> {
    /// Create a new lexer from a string input
    #[inline]
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
            comments,
            start_pos: BytePos(0),
            had_line_break: LineBreak::None,
        };

        // Prime the lexer with the first token
        let _ = lexer.next_token();

        lexer
    }

    /// Get the next token
    #[inline]
    pub fn next_token(&mut self) -> Result<Token> {
        // Skip whitespaces and comments
        self.skip_whitespace();

        // Remember if there were line breaks before this token
        let had_line_break = self.had_line_break;
        self.had_line_break = LineBreak::None;

        // Remember the start position of this token
        self.start_pos = self.cursor.pos();

        // If we're in JSX mode, use the JSX tokenizer
        if self.in_jsx_element {
            return self.read_jsx_token(had_line_break.into());
        }

        // Get the next character - fast path for EOF
        let ch = match self.cursor.peek() {
            Some(ch) => ch,
            None => {
                // End of file
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
        // Fast path for common tokens
        if ch < 128 {
            match ch {
                // Single-character tokens - most frequent first for better branch prediction
                b'{' => self.single_char_token(TokenType::LBrace, had_line_break),
                b'}' => {
                    if self.in_template {
                        // End of template expression
                        self.in_template = false;
                    }
                    self.single_char_token(TokenType::RBrace, had_line_break)
                }
                b'(' => self.single_char_token(TokenType::LParen, had_line_break),
                b')' => self.single_char_token(TokenType::RParen, had_line_break),
                b'[' => self.single_char_token(TokenType::LBracket, had_line_break),
                b']' => self.single_char_token(TokenType::RBracket, had_line_break),
                b';' => self.single_char_token(TokenType::Semi, had_line_break),
                b',' => self.single_char_token(TokenType::Comma, had_line_break),
                b':' => self.single_char_token(TokenType::Colon, had_line_break),
                b'~' => self.single_char_token(TokenType::Tilde, had_line_break),
                b'@' => self.single_char_token(TokenType::At, had_line_break),

                // String literals - group together for better branch prediction
                b'"' | b'\'' => self.read_string(ch),
                b'`' => self.read_template(had_line_break),

                // Number literals
                b'0'..=b'9' => self.read_number(),

                // Potentially compound operators - ordered by frequency
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
                b'#' => self.read_hash(),

                // Identifiers - check with lookup table for ASCII (fast path)
                _ if (ASCII_LOOKUP[ch as usize] & 4) != 0 => self.read_identifier(),

                // Fallback for ASCII
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
        } else {
            // Non-ASCII character path
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

    /// Parse a single-character token
    #[inline(always)]
    fn single_char_token(&mut self, token_type: TokenType, had_line_break: bool) -> Result<Token> {
        self.cursor.advance();
        Ok(Token::new(
            token_type,
            self.span(),
            had_line_break,
            TokenValue::None,
        ))
    }

    /// Skip whitespace and comments - optimized hot path
    #[inline]
    fn skip_whitespace(&mut self) {
        // Hot loop for ASCII whitespace - most common case
        while let Some(ch) = self.cursor.peek() {
            if ch < 128 {
                let lookup = ASCII_LOOKUP[ch as usize];

                // Fast path for common whitespace
                if (lookup & 1) != 0 {
                    self.cursor.advance();
                    continue;
                }

                // Fast path for line breaks
                if (lookup & 2) != 0 {
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
                }

                // Handle comments
                if ch == b'/' {
                    match self.cursor.peek_at(1) {
                        // Line comment - very common in JS
                        Some(b'/') => {
                            self.cursor.advance_n(2);
                            self.skip_line_comment();
                            continue;
                        }
                        // Block comment
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
                // Handle Unicode whitespace
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
                    // BOM
                    let bytes = self.cursor.peek_n(3);
                    if bytes.len() == 3 && bytes[0] == 0xef && bytes[1] == 0xbb && bytes[2] == 0xbf
                    {
                        self.cursor.advance_n(3);
                        continue;
                    }
                }
                break;
            }
        }
    }

    /// Skip a line comment - optimized with batch processing
    #[inline]
    fn skip_line_comment(&mut self) {
        // Fast path using find_byte
        if let Some(newline_pos) = self.cursor.find_byte(b'\n') {
            // Skip to the newline
            let from_cursor = newline_pos - self.cursor.position();
            self.cursor.advance_n(from_cursor);
            self.cursor.advance(); // Skip the newline
            self.had_line_break = LineBreak::Present;
            return;
        }

        // Slower fallback path
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

    /// Skip a block comment - optimized for faster scanning
    #[inline]
    fn skip_block_comment(&mut self) {
        let mut had_line_break = false;

        // Use a specialized loop for faster scanning
        'outer: while let Some(ch) = self.cursor.peek() {
            match ch {
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
                _ => {
                    // Skip chunks of non-special characters
                    let mut count = 1;
                    while count < 64 {
                        match self.cursor.peek_at(count) {
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
        // ASCII fast path using lookup table
        if byte < 128 {
            (ASCII_LOOKUP[byte as usize] & 4) != 0
        } else {
            // Non-ASCII, needs further checking in read_identifier
            true
        }
    }

    /// Check if a byte is a valid identifier continue character
    #[inline(always)]
    fn is_identifier_continue(byte: u8) -> bool {
        // ASCII fast path using lookup table
        if byte < 128 {
            (ASCII_LOOKUP[byte as usize] & (4 | 8)) != 0
        } else {
            // Non-ASCII, needs further checking in read_identifier
            true
        }
    }
}
