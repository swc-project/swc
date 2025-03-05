//! Operator tokens processing for the lexer
//!
//! This module handles the parsing of operators in ECMAScript/TypeScript.

use swc_atoms::Atom;
use swc_common::Span;

use super::Lexer;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

impl<'a> Lexer<'a> {
    /// Read a dot token (. or ... or numeric with leading dot)
    pub(super) fn read_dot(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '.'

        // Check for spread operator '...'
        if self.cursor.peek() == Some(b'.') && self.cursor.peek_at(1) == Some(b'.') {
            self.cursor.advance_n(2);
            return Ok(Token::new(
                TokenType::DotDotDot,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Check for numeric literal with leading dot (e.g. .123)
        if let Some(b'0'..=b'9') = self.cursor.peek() {
            // Backtrack to include the dot in the number
            self.cursor.advance_n(usize::MAX); // Reset cursor
            return self.read_number();
        }

        // Just a single dot
        Ok(Token::new(
            TokenType::Dot,
            self.span(),
            self.had_line_break.into(),
            TokenValue::None,
        ))
    }

    /// Read a question mark token (? or ?? or ?. or ??=)
    pub(super) fn read_question_mark(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '?'

        // Check for nullish coalescing operator '??'
        if self.cursor.peek() == Some(b'?') {
            self.cursor.advance();

            // Check for nullish assignment '??='
            if self.cursor.peek() == Some(b'=') {
                self.cursor.advance();
                return Ok(Token::new(
                    TokenType::NullishEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ));
            }

            // Nullish coalescing
            return Ok(Token::new(
                TokenType::NullishCoalescing,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Check for optional chaining operator '?.'
        if self.cursor.peek() == Some(b'.') {
            self.cursor.advance();
            return Ok(Token::new(
                TokenType::OptionalChain,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Just a single question mark
        Ok(Token::new(
            TokenType::QuestionMark,
            self.span(),
            self.had_line_break.into(),
            TokenValue::None,
        ))
    }

    /// Read an exclamation mark token (! or != or !==)
    pub(super) fn read_exclamation_mark(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '!'

        // Check for inequality operator '!='
        if self.cursor.peek() == Some(b'=') {
            self.cursor.advance();

            // Check for strict inequality '!=='
            if self.cursor.peek() == Some(b'=') {
                self.cursor.advance();
                return Ok(Token::new(
                    TokenType::NotEqEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ));
            }

            // Non-strict inequality
            return Ok(Token::new(
                TokenType::NotEq,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Just a single exclamation mark
        Ok(Token::new(
            TokenType::Bang,
            self.span(),
            self.had_line_break.into(),
            TokenValue::None,
        ))
    }

    /// Read a plus token (+ or ++ or +=)
    pub(super) fn read_plus(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '+'

        match self.cursor.peek() {
            // Increment operator '++'
            Some(b'+') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::PlusPlus,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Addition assignment '+='
            Some(b'=') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::PlusEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Just a single plus
            _ => Ok(Token::new(
                TokenType::Plus,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            )),
        }
    }

    /// Read a minus token (- or -- or -=)
    pub(super) fn read_minus(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '-'

        match self.cursor.peek() {
            // Decrement operator '--'
            Some(b'-') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::MinusMinus,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Subtraction assignment '-='
            Some(b'=') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::MinusEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Just a single minus
            _ => Ok(Token::new(
                TokenType::Minus,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            )),
        }
    }

    /// Read an asterisk token (* or ** or *= or **=)
    pub(super) fn read_asterisk(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '*'

        // Check for exponentiation operator '**'
        if self.cursor.peek() == Some(b'*') {
            self.cursor.advance();

            // Check for exponentiation assignment '**='
            if self.cursor.peek() == Some(b'=') {
                self.cursor.advance();
                return Ok(Token::new(
                    TokenType::ExpEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ));
            }

            // Just exponentiation
            return Ok(Token::new(
                TokenType::Exp,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Check for multiplication assignment '*='
        if self.cursor.peek() == Some(b'=') {
            self.cursor.advance();
            return Ok(Token::new(
                TokenType::MulEq,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Just a single asterisk
        Ok(Token::new(
            TokenType::Asterisk,
            self.span(),
            self.had_line_break.into(),
            TokenValue::None,
        ))
    }

    /// Read a slash token (/ or /= or start of regex)
    pub(super) fn read_slash(&mut self, had_line_break: bool) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '/'

        // Check for division assignment '/='
        if self.cursor.peek() == Some(b'=') {
            self.cursor.advance();
            return Ok(Token::new(
                TokenType::DivEq,
                self.span(),
                had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Check if this could be a regex literal
        if self.is_regex_start() {
            return self.read_regex(had_line_break);
        }

        // Just a single slash (division operator)
        Ok(Token::new(
            TokenType::Slash,
            self.span(),
            had_line_break.into(),
            TokenValue::None,
        ))
    }

    /// Read a percent token (% or %=)
    pub(super) fn read_percent(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '%'

        // Check for modulo assignment '%='
        if self.cursor.peek() == Some(b'=') {
            self.cursor.advance();
            return Ok(Token::new(
                TokenType::ModEq,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Just a single percent
        Ok(Token::new(
            TokenType::Percent,
            self.span(),
            self.had_line_break.into(),
            TokenValue::None,
        ))
    }

    /// Read a less-than token (< or <= or << or <=)
    pub(super) fn read_less_than(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '<'

        // Check for JSX mode
        if self.in_jsx_element {
            self.cursor.advance_n(usize::MAX); // Reset cursor to start position
            return self.read_jsx_token(self.had_line_break.into());
        }

        match self.cursor.peek() {
            // Less than or equal '<='
            Some(b'=') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::LtEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Left shift '<<'
            Some(b'<') => {
                self.cursor.advance();

                // Check for left shift assignment '<<='
                if self.cursor.peek() == Some(b'=') {
                    self.cursor.advance();
                    return Ok(Token::new(
                        TokenType::LShift,
                        self.span(),
                        self.had_line_break.into(),
                        TokenValue::None,
                    ));
                }

                // Just left shift
                Ok(Token::new(
                    TokenType::LShift,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Just a single less-than
            _ => Ok(Token::new(
                TokenType::Lt,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            )),
        }
    }

    /// Read a greater-than token (> or >= or >> or >>>)
    pub(super) fn read_greater_than(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '>'

        match self.cursor.peek() {
            // Greater than or equal '>='
            Some(b'=') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::GtEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Right shift '>>'
            Some(b'>') => {
                self.cursor.advance();

                // Check for zero-fill right shift '>>>'
                if self.cursor.peek() == Some(b'>') {
                    self.cursor.advance();

                    // Check for zero-fill right shift assignment '>>>='
                    if self.cursor.peek() == Some(b'=') {
                        self.cursor.advance();
                        return Ok(Token::new(
                            TokenType::ZeroFillRShift,
                            self.span(),
                            self.had_line_break.into(),
                            TokenValue::None,
                        ));
                    }

                    // Just zero-fill right shift
                    return Ok(Token::new(
                        TokenType::ZeroFillRShift,
                        self.span(),
                        self.had_line_break.into(),
                        TokenValue::None,
                    ));
                }

                // Check for right shift assignment '>>='
                if self.cursor.peek() == Some(b'=') {
                    self.cursor.advance();
                    return Ok(Token::new(
                        TokenType::RShift,
                        self.span(),
                        self.had_line_break.into(),
                        TokenValue::None,
                    ));
                }

                // Just right shift
                Ok(Token::new(
                    TokenType::RShift,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Just a single greater-than
            _ => Ok(Token::new(
                TokenType::Gt,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            )),
        }
    }

    /// Read an equals token (= or == or === or => or =)
    pub(super) fn read_equals(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '='

        match self.cursor.peek() {
            // Arrow function '=>'
            Some(b'>') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::Arrow,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Equality operator '=='
            Some(b'=') => {
                self.cursor.advance();

                // Check for strict equality '==='
                if self.cursor.peek() == Some(b'=') {
                    self.cursor.advance();
                    return Ok(Token::new(
                        TokenType::EqEqEq,
                        self.span(),
                        self.had_line_break.into(),
                        TokenValue::None,
                    ));
                }

                // Just non-strict equality
                Ok(Token::new(
                    TokenType::EqEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Just a single equals
            _ => Ok(Token::new(
                TokenType::Eq,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            )),
        }
    }

    /// Read a pipe token (| or || or |= or ||=)
    pub(super) fn read_pipe(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '|'

        match self.cursor.peek() {
            // Logical OR operator '||'
            Some(b'|') => {
                self.cursor.advance();

                // Check for logical OR assignment '||='
                if self.cursor.peek() == Some(b'=') {
                    self.cursor.advance();
                    return Ok(Token::new(
                        TokenType::LogicalOrEq,
                        self.span(),
                        self.had_line_break.into(),
                        TokenValue::None,
                    ));
                }

                // Just logical OR
                Ok(Token::new(
                    TokenType::LogicalOr,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Bitwise OR assignment '|='
            Some(b'=') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::BitOrEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Just a single pipe
            _ => Ok(Token::new(
                TokenType::Pipe,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            )),
        }
    }

    /// Read an ampersand token (& or && or &= or &&=)
    pub(super) fn read_ampersand(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '&'

        match self.cursor.peek() {
            // Logical AND operator '&&'
            Some(b'&') => {
                self.cursor.advance();

                // Check for logical AND assignment '&&='
                if self.cursor.peek() == Some(b'=') {
                    self.cursor.advance();
                    return Ok(Token::new(
                        TokenType::LogicalAndEq,
                        self.span(),
                        self.had_line_break.into(),
                        TokenValue::None,
                    ));
                }

                // Just logical AND
                Ok(Token::new(
                    TokenType::LogicalAnd,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Bitwise AND assignment '&='
            Some(b'=') => {
                self.cursor.advance();
                Ok(Token::new(
                    TokenType::BitAndEq,
                    self.span(),
                    self.had_line_break.into(),
                    TokenValue::None,
                ))
            }

            // Just a single ampersand
            _ => Ok(Token::new(
                TokenType::Ampersand,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            )),
        }
    }

    /// Read a caret token (^ or ^=)
    pub(super) fn read_caret(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '^'

        // Check for bitwise XOR assignment '^='
        if self.cursor.peek() == Some(b'=') {
            self.cursor.advance();
            return Ok(Token::new(
                TokenType::BitXorEq,
                self.span(),
                self.had_line_break.into(),
                TokenValue::None,
            ));
        }

        // Just a single caret
        Ok(Token::new(
            TokenType::Caret,
            self.span(),
            self.had_line_break.into(),
            TokenValue::None,
        ))
    }

    /// Read a hash token (#)
    pub(super) fn read_hash(&mut self) -> Result<Token> {
        self.cursor.advance(); // Skip the initial '#'

        // Check for shebang at the start of the file
        if self.cursor.position() == 1 && self.cursor.peek() == Some(b'!') {
            // This is a shebang, read until the end of the line
            self.cursor.advance(); // Skip the '!'
            let start = self.cursor.position();
            while let Some(ch) = self.cursor.peek() {
                if ch == b'\n' || ch == b'\r' {
                    break;
                }
                self.cursor.advance();
            }
            let end = self.cursor.position();
            let shebang_str =
                unsafe { std::str::from_utf8_unchecked(self.cursor.slice(start, end)) };

            return Ok(Token::new(
                TokenType::Shebang,
                self.span(),
                self.had_line_break.into(),
                TokenValue::Shebang(Atom::from(shebang_str)),
            ));
        }

        // Just a hash token (for private fields)
        Ok(Token::new(
            TokenType::Hash,
            self.span(),
            self.had_line_break.into(),
            TokenValue::None,
        ))
    }
}
