//! High-performance lexer for ECMAScript/TypeScript
//!
//! This lexer is designed for maximum performance and operates at the byte
//! level directly on the input string for optimal throughput.

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

/// High-performance lexer for ECMAScript/TypeScript
///
/// This lexer processes input as UTF-8 bytes for maximum performance.
pub struct Lexer<'a> {
    /// Byte-level cursor to the input source
    cursor: Cursor<'a>,

    /// Current token
    pub current: Token,

    /// Syntax configuration for the parser
    pub syntax: Syntax,

    /// Target ECMAScript version
    pub target: JscTarget,

    /// Whether the lexer is in strict mode
    pub strict_mode: bool,

    /// Whether the lexer is in JSX element context
    pub in_jsx_element: bool,

    /// Whether the lexer is in template literal context
    pub in_template: bool,

    /// Comments storage
    pub comments: Option<Rc<SingleThreadedComments>>,

    /// Start position of the current token
    start_pos: BytePos,

    /// Whether we had a line break before the current token
    had_line_break: bool,
}

impl<'a> Lexer<'a> {
    /// Create a new lexer from a string input
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
            had_line_break: false,
        };

        // Prime the lexer with the first token
        let _ = lexer.next_token();

        lexer
    }

    /// Get the next token
    pub fn next_token(&mut self) -> Result<Token> {
        // Skip whitespaces and comments
        self.skip_whitespace();

        // Remember if there were line breaks before this token
        let had_line_break = self.had_line_break;
        self.had_line_break = false;

        // Remember the start position of this token
        self.start_pos = self.cursor.pos();

        // If we're in JSX mode, use the JSX tokenizer
        if self.in_jsx_element {
            return self.read_jsx_token(had_line_break);
        }

        // Get the next character
        let ch = match self.cursor.peek() {
            Some(ch) => ch,
            None => {
                // End of file
                let token = Token::new(
                    TokenType::EOF,
                    self.span(),
                    had_line_break,
                    TokenValue::None,
                );
                return Ok(std::mem::replace(&mut self.current, token));
            }
        };

        // Process the character to determine the token type
        let token = self.read_token(ch, had_line_break)?;

        // Update the current token and return a clone of the previous one
        Ok(std::mem::replace(&mut self.current, token))
    }

    /// Read the next token starting with the given character
    fn read_token(&mut self, ch: u8, had_line_break: bool) -> Result<Token> {
        match ch {
            // Single-character tokens
            b'(' => self.single_char_token(TokenType::LParen, had_line_break),
            b')' => self.single_char_token(TokenType::RParen, had_line_break),
            b'{' => self.single_char_token(TokenType::LBrace, had_line_break),
            b'}' => {
                if self.in_template {
                    // End of template expression
                    self.in_template = false;
                    self.single_char_token(TokenType::RBrace, had_line_break)
                } else {
                    self.single_char_token(TokenType::RBrace, had_line_break)
                }
            }
            b'[' => self.single_char_token(TokenType::LBracket, had_line_break),
            b']' => self.single_char_token(TokenType::RBracket, had_line_break),
            b';' => self.single_char_token(TokenType::Semi, had_line_break),
            b',' => self.single_char_token(TokenType::Comma, had_line_break),
            b'~' => self.single_char_token(TokenType::Tilde, had_line_break),

            // Potentially compound tokens
            b'.' => self.read_dot(),
            b'?' => self.read_question_mark(),
            b':' => self.single_char_token(TokenType::Colon, had_line_break),
            b'!' => self.read_exclamation_mark(),
            b'+' => self.read_plus(),
            b'-' => self.read_minus(),
            b'*' => self.read_asterisk(),
            b'/' => self.read_slash(had_line_break),
            b'%' => self.read_percent(),
            b'<' => self.read_less_than(),
            b'>' => self.read_greater_than(),
            b'=' => self.read_equals(),
            b'|' => self.read_pipe(),
            b'&' => self.read_ampersand(),
            b'^' => self.read_caret(),
            b'@' => self.single_char_token(TokenType::At, had_line_break),
            b'#' => self.read_hash(),

            // String literals
            b'"' | b'\'' => self.read_string(ch),

            // Template literals
            b'`' => self.read_template(had_line_break),

            // Number literals
            b'0'..=b'9' => self.read_number(),

            // Identifiers and keywords
            _ if Self::is_identifier_start(ch) => self.read_identifier(),

            // Invalid character
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

    /// Create a span from the start position to the current position
    #[inline]
    fn span(&self) -> Span {
        Span::new(self.start_pos, self.cursor.pos())
    }

    /// Parse a single-character token
    #[inline]
    fn single_char_token(&mut self, token_type: TokenType, had_line_break: bool) -> Result<Token> {
        self.cursor.advance();
        Ok(Token::new(
            token_type,
            self.span(),
            had_line_break,
            TokenValue::None,
        ))
    }

    /// Skip whitespace and comments
    fn skip_whitespace(&mut self) {
        while let Some(ch) = self.cursor.peek() {
            match ch {
                // Line terminators
                b'\n' => {
                    self.cursor.advance();
                    self.had_line_break = true;
                }
                b'\r' => {
                    self.cursor.advance();
                    // Skip the following \n if it exists (CRLF sequence)
                    if let Some(b'\n') = self.cursor.peek() {
                        self.cursor.advance();
                    }
                    self.had_line_break = true;
                }
                // Line separator (U+2028) and paragraph separator (U+2029)
                0xE2 => {
                    let bytes = self.cursor.peek_n(3);
                    if bytes.len() == 3 && bytes[0] == 0xE2 && bytes[1] == 0x80 &&
                        (bytes[2] == 0xA8 || bytes[2] == 0xA9) {
                        self.cursor.advance_n(3);
                        self.had_line_break = true;
                        continue;
                    }
                    break;
                }
                // Whitespace
                b' ' | b'\t' | 0x0C /* form feed */ => {
                    self.cursor.advance();
                }
                // BOM
                0xEF => {
                    let bytes = self.cursor.peek_n(3);
                    if bytes.len() == 3 && bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF {
                        self.cursor.advance_n(3);
                    } else {
                        break;
                    }
                }
                // Comments
                b'/' => {
                    match self.cursor.peek_at(1) {
                        // Line comment
                        Some(b'/') => {
                            self.cursor.advance_n(2);
                            self.skip_line_comment();
                        }
                        // Block comment
                        Some(b'*') => {
                            self.cursor.advance_n(2);
                            self.skip_block_comment();
                        }
                        _ => break,
                    }
                }
                _ => break,
            }
        }
    }

    /// Skip a line comment
    fn skip_line_comment(&mut self) {
        while let Some(ch) = self.cursor.peek() {
            self.cursor.advance();
            if ch == b'\n' {
                self.had_line_break = true;
                break;
            } else if ch == b'\r' {
                self.had_line_break = true;
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
                    self.had_line_break = true;
                    break;
                }
            }
        }
    }

    /// Skip a block comment
    fn skip_block_comment(&mut self) {
        let mut had_line_break = false;

        while let Some(ch) = self.cursor.peek() {
            match ch {
                b'*' => {
                    self.cursor.advance();
                    if let Some(b'/') = self.cursor.peek() {
                        self.cursor.advance();
                        if had_line_break {
                            self.had_line_break = true;
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
                    self.cursor.advance();
                }
            }
        }

        // If we reach here, the comment was not closed
        self.had_line_break = had_line_break;
    }

    /// Check if a byte is a valid identifier start character
    #[inline]
    fn is_identifier_start(byte: u8) -> bool {
        // ASCII fast path
        match byte {
            b'a'..=b'z' | b'A'..=b'Z' | b'_' | b'$' => true,
            _ if byte >= 128 => true, // Non-ASCII, needs further checking in read_identifier
            _ => false,
        }
    }

    /// Check if a byte is a valid identifier continue character
    #[inline]
    fn is_identifier_continue(byte: u8) -> bool {
        // ASCII fast path
        match byte {
            b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'_' | b'$' => true,
            _ if byte >= 128 => true, // Non-ASCII, needs further checking in read_identifier
            _ => false,
        }
    }
}
