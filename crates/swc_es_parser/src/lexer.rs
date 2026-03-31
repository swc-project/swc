use std::borrow::Cow;

use swc_atoms::Atom;
use swc_common::{
    comments::Comments,
    input::{Input, StringInput},
    BytePos, Span,
};

use self::{
    search::byte_search,
    tables::{
        DOUBLE_QUOTE_STRING_END_TABLE, NOT_ASCII_ID_CONTINUE_TABLE, SINGLE_QUOTE_STRING_END_TABLE,
        TEMPLATE_LITERAL_SCAN_TABLE,
    },
};
use crate::{
    error::{Error, ErrorCode, Severity},
    syntax::Syntax,
    token::{Keyword, Token, TokenFlags, TokenKind, TokenValue},
};

mod search;
mod tables;
mod whitespace;

/// Checkpoint for lexer backtracking.
#[derive(Clone)]
pub struct LexerCheckpoint<'a> {
    input: StringInput<'a>,
    had_line_break_before: bool,
    is_first_token: bool,
    errors_len: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct RegexLiteral {
    pub span: Span,
    pub exp: Atom,
    pub flags: Atom,
}

/// ECMAScript lexer.
#[derive(Clone)]
pub struct Lexer<'a> {
    syntax: Syntax,
    input: StringInput<'a>,
    comments: Option<&'a dyn Comments>,
    had_line_break_before: bool,
    is_first_token: bool,
    errors: Vec<Error>,
}

impl<'a> Lexer<'a> {
    /// Creates a new lexer.
    pub fn new(syntax: Syntax, input: StringInput<'a>, comments: Option<&'a dyn Comments>) -> Self {
        Self {
            syntax,
            input,
            comments,
            had_line_break_before: false,
            is_first_token: true,
            errors: Vec::new(),
        }
    }

    /// Returns the current parser syntax.
    pub fn syntax(&self) -> Syntax {
        self.syntax
    }

    #[inline(always)]
    fn input(&self) -> &StringInput<'a> {
        &self.input
    }

    #[inline(always)]
    fn input_mut(&mut self) -> &mut StringInput<'a> {
        &mut self.input
    }

    /// Saves lexer state.
    pub fn checkpoint_save(&self) -> LexerCheckpoint<'a> {
        LexerCheckpoint {
            input: self.input.clone(),
            had_line_break_before: self.had_line_break_before,
            is_first_token: self.is_first_token,
            errors_len: self.errors.len(),
        }
    }

    /// Restores lexer state.
    pub fn checkpoint_load(&mut self, checkpoint: LexerCheckpoint<'a>) {
        self.input = checkpoint.input;
        self.had_line_break_before = checkpoint.had_line_break_before;
        self.is_first_token = checkpoint.is_first_token;
        self.errors.truncate(checkpoint.errors_len);
    }

    /// Takes recoverable lexer errors.
    pub fn take_errors(&mut self) -> Vec<Error> {
        std::mem::take(&mut self.errors)
    }

    pub(crate) fn rescan_regex_literal(&mut self, start: BytePos) -> Result<RegexLiteral, Error> {
        unsafe {
            self.input.reset_to(start);
        }

        debug_assert_eq!(self.input.cur_as_ascii(), Some(b'/'));

        let span_start = self.input.cur_pos();
        self.bump_ascii();
        let pattern_start = self.input.cur_pos();
        let mut escaped = false;
        let mut in_class = false;

        while let Some(ch) = self.input.cur_as_char() {
            if matches!(ch, '\n' | '\r' | '\u{2028}' | '\u{2029}') {
                return Err(Error::new(
                    Span::new_with_checked(span_start, self.input.cur_pos()),
                    Severity::Fatal,
                    ErrorCode::UnexpectedToken,
                    "unterminated regular expression literal",
                ));
            }

            if escaped {
                escaped = false;
                self.bump_char();
                continue;
            }

            match ch {
                '[' => in_class = true,
                ']' if in_class => in_class = false,
                '/' if !in_class => break,
                '\\' => escaped = true,
                _ => {}
            }

            self.bump_char();
        }

        let pattern_end = self.input.cur_pos();
        if self.input.cur_as_ascii() != Some(b'/') {
            return Err(Error::new(
                Span::new_with_checked(span_start, pattern_end),
                Severity::Fatal,
                ErrorCode::UnexpectedToken,
                "unterminated regular expression literal",
            ));
        }

        let pattern = unsafe { self.input.slice_str(pattern_start, pattern_end) };
        self.bump_ascii();

        let flags = if self.is_ident_start()
            || (self.input.cur_as_ascii() == Some(b'\\') && self.input.peek() == Some(b'u'))
        {
            let (value, _) = self.read_word_as_str_with();
            Atom::new(value)
        } else {
            Atom::new("")
        };

        self.had_line_break_before = false;
        self.is_first_token = false;

        Ok(RegexLiteral {
            span: Span::new_with_checked(span_start, self.input.cur_pos()),
            exp: Atom::new(pattern),
            flags,
        })
    }

    /// Reads the next token from input.
    pub fn next_token(&mut self) -> Token {
        self.skip_space_and_comments();
        let had_line_break_before = self.had_line_break_before;

        let start = self.input.cur_pos();
        let cur = match self.input.cur_as_ascii() {
            Some(cur) => cur,
            None => {
                if self.input.cur_as_char().is_some() {
                    if self.is_ident_start() {
                        let token = self.read_word(had_line_break_before);
                        self.had_line_break_before = false;
                        return token;
                    }

                    let ch = self.input.cur_as_char().unwrap_or('\0');
                    self.bump_char();
                    let span = Span::new_with_checked(start, self.input.cur_pos());
                    if ch != '\\' {
                        self.errors.push(Error::new(
                            span,
                            Severity::Error,
                            ErrorCode::UnexpectedToken,
                            "unexpected character",
                        ));
                    }
                    self.had_line_break_before = false;
                    return Token {
                        kind: TokenKind::Ident,
                        span,
                        had_line_break_before,
                        value: Some(TokenValue::Ident(Self::atom_from_char(ch))),
                        flags: TokenFlags::default(),
                    };
                }

                return Token::simple(
                    TokenKind::Eof,
                    Span::new_with_checked(start, start),
                    had_line_break_before,
                );
            }
        };

        let token = match cur {
            b'(' => self.one(TokenKind::LParen, had_line_break_before),
            b')' => self.one(TokenKind::RParen, had_line_break_before),
            b'{' => self.one(TokenKind::LBrace, had_line_break_before),
            b'}' => self.one(TokenKind::RBrace, had_line_break_before),
            b'[' => self.one(TokenKind::LBracket, had_line_break_before),
            b']' => self.one(TokenKind::RBracket, had_line_break_before),
            b';' => self.one(TokenKind::Semi, had_line_break_before),
            b',' => self.one(TokenKind::Comma, had_line_break_before),
            b'@' => self.one(TokenKind::At, had_line_break_before),
            b'#' => self.one(TokenKind::Hash, had_line_break_before),
            b':' => self.one(TokenKind::Colon, had_line_break_before),
            b'~' => self.one(TokenKind::Tilde, had_line_break_before),
            b'`' => self.read_template(had_line_break_before),
            b'.' => {
                self.bump_ascii();
                if self.input.is_str("..") {
                    self.bump_ascii();
                    self.bump_ascii();
                    Token::simple(
                        TokenKind::DotDotDot,
                        Span::new_with_checked(start, self.input.cur_pos()),
                        had_line_break_before,
                    )
                } else if matches!(self.input.cur_as_ascii(), Some(b'0'..=b'9')) {
                    self.read_number_after_dot(start, had_line_break_before)
                } else {
                    Token::simple(
                        TokenKind::Dot,
                        Span::new_with_checked(start, self.input.cur_pos()),
                        had_line_break_before,
                    )
                }
            }
            b'?' => {
                self.bump_ascii();
                if unsafe { self.input.eat_byte(b'.') } {
                    Token::simple(
                        TokenKind::QuestionDot,
                        Span::new_with_checked(start, self.input.cur_pos()),
                        had_line_break_before,
                    )
                } else if unsafe { self.input.eat_byte(b'?') } {
                    if unsafe { self.input.eat_byte(b'=') } {
                        Token::simple(
                            TokenKind::NullishEq,
                            Span::new_with_checked(start, self.input.cur_pos()),
                            had_line_break_before,
                        )
                    } else {
                        Token::simple(
                            TokenKind::Nullish,
                            Span::new_with_checked(start, self.input.cur_pos()),
                            had_line_break_before,
                        )
                    }
                } else {
                    Token::simple(
                        TokenKind::Question,
                        Span::new_with_checked(start, self.input.cur_pos()),
                        had_line_break_before,
                    )
                }
            }
            b'+' => self.plus_like(had_line_break_before),
            b'-' => self.minus_like(had_line_break_before),
            b'*' => self.star_like(had_line_break_before),
            b'/' => {
                self.binary_or_assign(TokenKind::Slash, TokenKind::SlashEq, had_line_break_before)
            }
            b'%' => self.binary_or_assign(
                TokenKind::Percent,
                TokenKind::PercentEq,
                had_line_break_before,
            ),
            b'&' => self.and_like(had_line_break_before),
            b'|' => self.or_like(had_line_break_before),
            b'^' => {
                self.binary_or_assign(TokenKind::Caret, TokenKind::CaretEq, had_line_break_before)
            }
            b'=' => self.eq_like(had_line_break_before),
            b'!' => self.bang_like(had_line_break_before),
            b'<' => self.lt_like(had_line_break_before),
            b'>' => self.gt_like(had_line_break_before),
            b'\'' | b'"' => self.read_string(had_line_break_before),
            b'0'..=b'9' => self.read_number(had_line_break_before),
            _ => {
                if self.is_ident_start()
                    || (self.input.cur_as_ascii() == Some(b'\\') && self.input.peek() == Some(b'u'))
                {
                    self.read_word(had_line_break_before)
                } else {
                    let ch = self.input.cur_as_char().unwrap_or('\0');
                    self.bump_char();
                    let span = Span::new_with_checked(start, self.input.cur_pos());
                    if ch != '\\' {
                        self.errors.push(Error::new(
                            span,
                            Severity::Error,
                            ErrorCode::UnexpectedToken,
                            "unexpected character",
                        ));
                    }
                    Token {
                        kind: TokenKind::Ident,
                        span,
                        had_line_break_before,
                        value: Some(TokenValue::Ident(Self::atom_from_char(ch))),
                        flags: TokenFlags::default(),
                    }
                }
            }
        };

        self.had_line_break_before = false;
        if token.kind != TokenKind::Eof {
            self.is_first_token = false;
        }
        token
    }

    fn plus_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();
        let kind = if unsafe { self.input.eat_byte(b'+') } {
            TokenKind::PlusPlus
        } else if unsafe { self.input.eat_byte(b'=') } {
            TokenKind::PlusEq
        } else {
            TokenKind::Plus
        };

        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn minus_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();
        let kind = if unsafe { self.input.eat_byte(b'-') } {
            TokenKind::MinusMinus
        } else if unsafe { self.input.eat_byte(b'=') } {
            TokenKind::MinusEq
        } else {
            TokenKind::Minus
        };

        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn and_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();

        let kind = if unsafe { self.input.eat_byte(b'&') } {
            if unsafe { self.input.eat_byte(b'=') } {
                TokenKind::AndAndEq
            } else {
                TokenKind::AndAnd
            }
        } else if unsafe { self.input.eat_byte(b'=') } {
            TokenKind::AmpEq
        } else {
            TokenKind::Amp
        };

        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn or_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();

        let kind = if unsafe { self.input.eat_byte(b'|') } {
            if unsafe { self.input.eat_byte(b'=') } {
                TokenKind::OrOrEq
            } else {
                TokenKind::OrOr
            }
        } else if unsafe { self.input.eat_byte(b'=') } {
            TokenKind::PipeEq
        } else {
            TokenKind::Pipe
        };

        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn eq_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();

        let kind = if unsafe { self.input.eat_byte(b'=') } {
            if unsafe { self.input.eat_byte(b'=') } {
                TokenKind::EqEqEq
            } else {
                TokenKind::EqEq
            }
        } else if unsafe { self.input.eat_byte(b'>') } {
            TokenKind::Arrow
        } else {
            TokenKind::Eq
        };

        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn bang_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();

        let kind = if unsafe { self.input.eat_byte(b'=') } {
            if unsafe { self.input.eat_byte(b'=') } {
                TokenKind::NotEqEq
            } else {
                TokenKind::NotEq
            }
        } else {
            TokenKind::Bang
        };

        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn lt_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();
        let kind = if unsafe { self.input.eat_byte(b'<') } {
            if unsafe { self.input.eat_byte(b'=') } {
                TokenKind::LtLtEq
            } else {
                TokenKind::LtLt
            }
        } else if unsafe { self.input.eat_byte(b'=') } {
            TokenKind::LtEq
        } else {
            TokenKind::Lt
        };
        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn gt_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();
        let kind = if unsafe { self.input.eat_byte(b'>') } {
            if unsafe { self.input.eat_byte(b'>') } {
                if unsafe { self.input.eat_byte(b'=') } {
                    TokenKind::GtGtGtEq
                } else {
                    TokenKind::GtGtGt
                }
            } else if unsafe { self.input.eat_byte(b'=') } {
                TokenKind::GtGtEq
            } else {
                TokenKind::GtGt
            }
        } else if unsafe { self.input.eat_byte(b'=') } {
            TokenKind::GtEq
        } else {
            TokenKind::Gt
        };
        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn binary_or_assign(
        &mut self,
        plain: TokenKind,
        assign: TokenKind,
        had_line_break_before: bool,
    ) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();
        let kind = if unsafe { self.input.eat_byte(b'=') } {
            assign
        } else {
            plain
        };
        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn star_like(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();
        let kind = if unsafe { self.input.eat_byte(b'*') } {
            if unsafe { self.input.eat_byte(b'=') } {
                TokenKind::StarStarEq
            } else {
                TokenKind::StarStar
            }
        } else if unsafe { self.input.eat_byte(b'=') } {
            TokenKind::StarEq
        } else {
            TokenKind::Star
        };

        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn one(&mut self, kind: TokenKind, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();
        Token::simple(
            kind,
            Span::new_with_checked(start, self.input.cur_pos()),
            had_line_break_before,
        )
    }

    fn value_token(
        &self,
        kind: TokenKind,
        span: Span,
        had_line_break_before: bool,
        value: TokenValue,
    ) -> Token {
        Token {
            kind,
            span,
            had_line_break_before,
            value: Some(value),
            flags: TokenFlags::default(),
        }
    }

    #[inline]
    fn atom_from_char(ch: char) -> Atom {
        let mut buf = [0u8; 4];
        let encoded = ch.encode_utf8(&mut buf);
        Atom::new(encoded as &str)
    }

    #[inline(always)]
    fn scan_decimal_digits_or_sep(&mut self) {
        while let Some(ch) = self.input.cur_as_ascii() {
            if ch == b'_' || ch.is_ascii_digit() {
                self.bump_ascii();
            } else {
                break;
            }
        }
    }

    #[inline(always)]
    fn scan_hex_digits_or_sep(&mut self) {
        while let Some(ch) = self.input.cur_as_ascii() {
            if ch == b'_' || ch.is_ascii_hexdigit() {
                self.bump_ascii();
            } else {
                break;
            }
        }
    }

    #[inline(always)]
    fn scan_octal_digits_or_sep(&mut self) {
        while let Some(ch) = self.input.cur_as_ascii() {
            if ch == b'_' || matches!(ch, b'0'..=b'7') {
                self.bump_ascii();
            } else {
                break;
            }
        }
    }

    #[inline(always)]
    fn scan_binary_digits_or_sep(&mut self) {
        while let Some(ch) = self.input.cur_as_ascii() {
            if ch == b'_' || matches!(ch, b'0' | b'1') {
                self.bump_ascii();
            } else {
                break;
            }
        }
    }

    #[inline]
    fn strip_numeric_separators<'b>(raw: &'b str) -> Cow<'b, str> {
        if !raw.as_bytes().contains(&b'_') {
            return Cow::Borrowed(raw);
        }

        let mut out = Vec::with_capacity(raw.len());
        for &byte in raw.as_bytes() {
            if byte != b'_' {
                out.push(byte);
            }
        }
        // Safety: numeric literal bytes are always valid utf-8 ascii.
        Cow::Owned(unsafe { String::from_utf8_unchecked(out) })
    }

    fn read_number(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        let mut radix = 10u32;
        let mut is_float = false;

        if self.input.cur_as_ascii() == Some(b'0')
            && matches!(
                self.input.peek(),
                Some(b'x' | b'X' | b'o' | b'O' | b'b' | b'B')
            )
        {
            self.bump_ascii();
            match self.input.cur_as_ascii().unwrap_or_default() {
                b'x' | b'X' => radix = 16,
                b'o' | b'O' => radix = 8,
                b'b' | b'B' => radix = 2,
                _ => {}
            }
            self.bump_ascii();
            match radix {
                16 => self.scan_hex_digits_or_sep(),
                8 => self.scan_octal_digits_or_sep(),
                2 => self.scan_binary_digits_or_sep(),
                _ => self.scan_decimal_digits_or_sep(),
            }
        } else {
            self.scan_decimal_digits_or_sep();

            if self.input.cur_as_ascii() == Some(b'.') {
                is_float = true;
                self.bump_ascii();
                self.scan_decimal_digits_or_sep();
            }

            if matches!(self.input.cur_as_ascii(), Some(b'e' | b'E')) {
                is_float = true;
                self.bump_ascii();
                if matches!(self.input.cur_as_ascii(), Some(b'+' | b'-')) {
                    self.bump_ascii();
                }
                if !matches!(self.input.cur_as_ascii(), Some(b'0'..=b'9' | b'_')) {
                    let span = Span::new_with_checked(start, self.input.cur_pos());
                    self.errors.push(Error::new(
                        span,
                        Severity::Error,
                        ErrorCode::InvalidNumber,
                        "numeric literal exponent should contain digits",
                    ));
                }
                self.scan_decimal_digits_or_sep();
            }
        }

        if self.input.cur_as_ascii() == Some(b'n') && !is_float {
            self.bump_ascii();
            let end = self.input.cur_pos();
            let raw = unsafe { self.input.slice_str(start, end) };
            let raw = raw.trim_end_matches('n');
            let cleaned = Self::strip_numeric_separators(raw);
            let value = if radix == 10 {
                Atom::new(cleaned)
            } else {
                Atom::new(cleaned.as_ref().get(2..).unwrap_or_default())
            };
            return self.value_token(
                TokenKind::BigInt,
                Span::new_with_checked(start, end),
                had_line_break_before,
                TokenValue::BigInt(value),
            );
        }

        let end = self.input.cur_pos();
        let raw = unsafe { self.input.slice_str(start, end) };
        let cleaned = Self::strip_numeric_separators(raw);
        let value = if radix == 10 {
            cleaned.as_ref().parse::<f64>().unwrap_or_else(|_| {
                self.errors.push(Error::new(
                    Span::new_with_checked(start, end),
                    Severity::Error,
                    ErrorCode::InvalidNumber,
                    "failed to parse number literal",
                ));
                0.0
            })
        } else {
            let digits = cleaned.get(2..).unwrap_or_default();
            u128::from_str_radix(digits, radix)
                .map(|v| v as f64)
                .unwrap_or_else(|_| {
                    self.errors.push(Error::new(
                        Span::new_with_checked(start, end),
                        Severity::Error,
                        ErrorCode::InvalidNumber,
                        "failed to parse number literal",
                    ));
                    0.0
                })
        };

        self.value_token(
            TokenKind::Num,
            Span::new_with_checked(start, end),
            had_line_break_before,
            TokenValue::Num(value),
        )
    }

    fn read_number_after_dot(
        &mut self,
        start: swc_common::BytePos,
        had_line_break_before: bool,
    ) -> Token {
        self.scan_decimal_digits_or_sep();

        if matches!(self.input.cur_as_ascii(), Some(b'e' | b'E')) {
            self.bump_ascii();
            if matches!(self.input.cur_as_ascii(), Some(b'+' | b'-')) {
                self.bump_ascii();
            }
            self.scan_decimal_digits_or_sep();
        }

        let end = self.input.cur_pos();
        let raw = unsafe { self.input.slice_str(start, end) };
        let cleaned = Self::strip_numeric_separators(raw);
        let value = cleaned.as_ref().parse::<f64>().unwrap_or_else(|_| {
            self.errors.push(Error::new(
                Span::new_with_checked(start, end),
                Severity::Error,
                ErrorCode::InvalidNumber,
                "failed to parse number literal",
            ));
            0.0
        });

        self.value_token(
            TokenKind::Num,
            Span::new_with_checked(start, end),
            had_line_break_before,
            TokenValue::Num(value),
        )
    }

    #[inline]
    fn append_chunk(&self, out: &mut Option<String>, start: BytePos, end: BytePos) {
        if start >= end {
            return;
        }
        let chunk = unsafe { self.input.slice_str(start, end) };
        match out {
            Some(buf) => buf.push_str(chunk),
            None => *out = Some(chunk.to_string()),
        }
    }

    #[inline]
    fn finalize_value(
        &self,
        mut out: Option<String>,
        content_start: BytePos,
        chunk_start: BytePos,
        value_end: BytePos,
    ) -> Atom {
        if let Some(buf) = out.as_mut() {
            if chunk_start < value_end {
                let trailing = unsafe { self.input.slice_str(chunk_start, value_end) };
                buf.push_str(trailing);
            }
            Atom::new(std::mem::take(buf))
        } else {
            let raw = unsafe { self.input.slice_str(content_start, value_end) };
            Atom::new(raw)
        }
    }

    fn read_escape_sequence(
        &mut self,
        out: &mut String,
        flags: &mut TokenFlags,
        esc_start: BytePos,
        in_template: bool,
    ) {
        match self.input.cur_as_char() {
            Some('n') => {
                self.bump_char();
                out.push('\n');
            }
            Some('r') => {
                self.bump_char();
                out.push('\r');
            }
            Some('t') => {
                self.bump_char();
                out.push('\t');
            }
            Some('b') => {
                self.bump_char();
                out.push('\u{0008}');
            }
            Some('f') => {
                self.bump_char();
                out.push('\u{000C}');
            }
            Some('v') => {
                self.bump_char();
                out.push('\u{000B}');
            }
            Some('\\') => {
                self.bump_char();
                out.push('\\');
            }
            Some('"') => {
                self.bump_char();
                out.push('"');
            }
            Some('\'') => {
                self.bump_char();
                out.push('\'');
            }
            Some('x') => {
                let checkpoint = self.input.clone();
                if let Some(decoded) = self.read_hex_escape(2) {
                    out.push(decoded);
                } else {
                    self.input = checkpoint;
                    self.bump_char();
                    flags.contains_invalid_escape = true;
                    self.errors.push(Error::new(
                        Span::new_with_checked(esc_start, self.input.cur_pos()),
                        Severity::Error,
                        ErrorCode::InvalidEscape,
                        "invalid hexadecimal escape sequence",
                    ));
                }
            }
            Some('u') => {
                let checkpoint = self.input.clone();
                if let Some(decoded) = self.read_unicode_escape_after_u() {
                    out.push(decoded);
                } else {
                    self.input = checkpoint;
                    self.bump_char();
                    flags.contains_invalid_escape = true;
                    self.errors.push(Error::new(
                        Span::new_with_checked(esc_start, self.input.cur_pos()),
                        Severity::Error,
                        ErrorCode::InvalidEscape,
                        "invalid unicode escape sequence",
                    ));
                }
            }
            Some('0') => {
                if matches!(self.input.peek(), Some(b'0'..=b'9')) {
                    let decoded = self.read_legacy_octal_escape();
                    flags.contains_legacy_octal_escape = true;
                    out.push(decoded);
                } else {
                    self.bump_char();
                    out.push('\0');
                }
            }
            Some('1'..='7') => {
                let decoded = self.read_legacy_octal_escape();
                flags.contains_legacy_octal_escape = true;
                out.push(decoded);
            }
            Some('8' | '9') => {
                let value = self.input.cur_as_char().unwrap_or('\0');
                self.bump_char();
                flags.contains_invalid_escape = true;
                self.errors.push(Error::new(
                    Span::new_with_checked(esc_start, self.input.cur_pos()),
                    Severity::Error,
                    ErrorCode::InvalidEscape,
                    "invalid decimal escape sequence",
                ));
                out.push(value);
            }
            Some('\n') if !in_template => {
                self.bump_char();
                self.had_line_break_before = true;
            }
            Some('\r') if !in_template => {
                self.bump_char();
                if self.input.cur_as_ascii() == Some(b'\n') {
                    self.bump_ascii();
                }
                self.had_line_break_before = true;
            }
            Some('\u{2028}' | '\u{2029}') if !in_template => {
                self.bump_char();
                self.had_line_break_before = true;
            }
            Some(other) => {
                self.bump_char();
                out.push(other);
            }
            None => {}
        }
    }

    fn read_string(&mut self, had_line_break_before: bool) -> Token {
        let quote = self.input.cur_as_ascii().unwrap_or(b'"');
        let table = if quote == b'"' {
            &DOUBLE_QUOTE_STRING_END_TABLE
        } else {
            &SINGLE_QUOTE_STRING_END_TABLE
        };

        let checkpoint = self.input.clone();
        let start = self.input.cur_pos();
        self.bump_ascii();

        let content_start = self.input.cur_pos();
        let mut chunk_start = content_start;
        let mut out: Option<String> = None;
        let mut terminated = false;
        let mut flags = TokenFlags::default();

        let value_end = loop {
            let matched = byte_search! {
                lexer: self,
                table: table,
                handle_eof: {
                    let value_end = self.input.cur_pos();
                    let end = value_end;

                    if self.syntax.jsx() && quote == b'\'' {
                        let saw_lt = if let Some(buf) = out.as_ref() {
                            let trailing = if chunk_start < value_end {
                                unsafe { self.input.slice_str(chunk_start, value_end) }
                            } else {
                                ""
                            };
                            buf.contains('<') || trailing.contains('<')
                        } else if content_start < value_end {
                            unsafe { self.input.slice_str(content_start, value_end) }.contains('<')
                        } else {
                            false
                        };

                        if saw_lt {
                            self.input = checkpoint;
                            self.bump_ascii();
                            let end = self.input.cur_pos();
                            return Token {
                                kind: TokenKind::Ident,
                                span: Span::new_with_checked(start, end),
                                had_line_break_before,
                                value: Some(TokenValue::Ident(Atom::new("'"))),
                                flags: TokenFlags::default(),
                            };
                        }
                    }

                    self.errors.push(Error::new(
                        Span::new_with_checked(start, end),
                        Severity::Error,
                        ErrorCode::UnterminatedString,
                        "unterminated string literal",
                    ));

                    let value = self.finalize_value(out, content_start, chunk_start, value_end);
                    return Token {
                        kind: TokenKind::Str,
                        span: Span::new_with_checked(start, end),
                        had_line_break_before,
                        value: Some(TokenValue::Str(value)),
                        flags,
                    };
                },
            };

            match matched {
                b'"' | b'\'' if matched == quote => {
                    let value_end = self.input.cur_pos();
                    self.bump_ascii();
                    terminated = true;
                    break value_end;
                }
                b'\\' => {
                    let esc_start = self.input.cur_pos();
                    self.append_chunk(&mut out, chunk_start, esc_start);
                    self.bump_ascii();
                    flags.escaped = true;
                    let buf = out.get_or_insert_with(String::new);
                    self.read_escape_sequence(buf, &mut flags, esc_start, false);
                    chunk_start = self.input.cur_pos();
                }
                b'\n' | b'\r' => {
                    break self.input.cur_pos();
                }
                _ => unreachable!("unexpected byte in string scanner"),
            }
        };

        let end = self.input.cur_pos();
        if !terminated {
            if self.syntax.jsx() && quote == b'\'' {
                let saw_lt = if let Some(buf) = out.as_ref() {
                    let trailing = if chunk_start < value_end {
                        unsafe { self.input.slice_str(chunk_start, value_end) }
                    } else {
                        ""
                    };
                    buf.contains('<') || trailing.contains('<')
                } else if content_start < value_end {
                    unsafe { self.input.slice_str(content_start, value_end) }.contains('<')
                } else {
                    false
                };

                if saw_lt {
                    self.input = checkpoint;
                    self.bump_ascii();
                    let end = self.input.cur_pos();
                    return Token {
                        kind: TokenKind::Ident,
                        span: Span::new_with_checked(start, end),
                        had_line_break_before,
                        value: Some(TokenValue::Ident(Atom::new("'"))),
                        flags: TokenFlags::default(),
                    };
                }
            }
            self.errors.push(Error::new(
                Span::new_with_checked(start, end),
                Severity::Error,
                ErrorCode::UnterminatedString,
                "unterminated string literal",
            ));
        }

        let value = self.finalize_value(out, content_start, chunk_start, value_end);
        Token {
            kind: TokenKind::Str,
            span: Span::new_with_checked(start, end),
            had_line_break_before,
            value: Some(TokenValue::Str(value)),
            flags,
        }
    }

    fn read_template(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();

        let content_start = self.input.cur_pos();
        let mut chunk_start = content_start;
        let mut out: Option<String> = None;
        let mut expr_depth = 0usize;
        let mut flags = TokenFlags::default();

        let value_end = loop {
            let matched = byte_search! {
                lexer: self,
                table: TEMPLATE_LITERAL_SCAN_TABLE,
                handle_eof: {
                    let end = self.input.cur_pos();
                    self.errors.push(Error::new(
                        Span::new_with_checked(start, end),
                        Severity::Error,
                        ErrorCode::UnterminatedString,
                        "unterminated template literal",
                    ));

                    let value = self.finalize_value(out, content_start, chunk_start, end);
                    return Token {
                        kind: TokenKind::Template,
                        span: Span::new_with_checked(start, end),
                        had_line_break_before,
                        value: Some(TokenValue::Str(value)),
                        flags,
                    };
                },
            };

            match matched {
                b'`' if expr_depth == 0 => {
                    let value_end = self.input.cur_pos();
                    self.bump_ascii();
                    break value_end;
                }
                b'\\' => {
                    let esc_start = self.input.cur_pos();
                    self.append_chunk(&mut out, chunk_start, esc_start);
                    self.bump_ascii();
                    flags.escaped = true;
                    let buf = out.get_or_insert_with(String::new);
                    self.read_escape_sequence(buf, &mut flags, esc_start, true);
                    chunk_start = self.input.cur_pos();
                }
                b'$' => {
                    self.bump_ascii();
                    if self.input.cur_as_ascii() == Some(b'{') {
                        self.bump_ascii();
                        expr_depth += 1;
                    }
                }
                b'{' => {
                    self.bump_ascii();
                    if expr_depth > 0 {
                        expr_depth += 1;
                    }
                }
                b'}' => {
                    self.bump_ascii();
                    if expr_depth > 0 {
                        expr_depth = expr_depth.saturating_sub(1);
                    }
                }
                b'`' => {
                    self.bump_ascii();
                }
                _ => unreachable!("unexpected byte in template scanner"),
            }
        };

        let end = self.input.cur_pos();

        let value = self.finalize_value(out, content_start, chunk_start, value_end);
        Token {
            kind: TokenKind::Template,
            span: Span::new_with_checked(start, end),
            had_line_break_before,
            value: Some(TokenValue::Str(value)),
            flags,
        }
    }

    fn read_legacy_octal_escape(&mut self) -> char {
        let first = self.input.cur_as_char().unwrap_or('0');
        let mut value = first.to_digit(8).unwrap_or(0);
        self.bump_char();

        let max_extra_digits = if first <= '3' { 2 } else { 1 };
        for _ in 0..max_extra_digits {
            let Some(ch) = self.input.cur_as_char() else {
                break;
            };
            if !matches!(ch, '0'..='7') {
                break;
            }
            value = value
                .saturating_mul(8)
                .saturating_add(ch.to_digit(8).unwrap_or(0));
            self.bump_char();
        }

        char::from_u32(value).unwrap_or('\0')
    }

    fn read_hex_escape(&mut self, digits: usize) -> Option<char> {
        if self.input.cur_as_char() != Some('x') {
            return None;
        }
        self.bump_char();
        let mut value = 0u32;
        for _ in 0..digits {
            let ch = self.input.cur_as_char()?;
            let digit = ch.to_digit(16)?;
            value = value.saturating_mul(16).saturating_add(digit);
            self.bump_char();
        }
        match char::from_u32(value) {
            Some(ch) => Some(ch),
            None if (0xd800..=0xdfff).contains(&value) => Some('\u{FFFD}'),
            None => None,
        }
    }

    #[inline(always)]
    fn is_ident_start_ascii(byte: u8) -> bool {
        matches!(byte, b'$' | b'_' | b'a'..=b'z' | b'A'..=b'Z')
    }

    #[inline(always)]
    fn is_ident_continue_ascii(byte: u8) -> bool {
        Self::is_ident_start_ascii(byte) || byte.is_ascii_digit()
    }

    fn read_word_as_str_with(&mut self) -> (Cow<'a, str>, bool) {
        let start = self.input.cur_pos();

        if let Some(c) = self.input.cur_as_ascii() {
            if Self::is_ident_start_ascii(c) {
                self.bump_ascii();

                let next_byte = byte_search! {
                    lexer: self,
                    table: NOT_ASCII_ID_CONTINUE_TABLE,
                    handle_eof: {
                        let value = unsafe { self.input.slice_str(start, self.input.cur_pos()) };
                        return (Cow::Borrowed(value), false);
                    },
                };

                if !next_byte.is_ascii() || next_byte == b'\\' {
                    return self.read_word_as_str_with_slow_path(start, false);
                }

                let value = unsafe { self.input.slice_str(start, self.input.cur_pos()) };
                return (Cow::Borrowed(value), false);
            }
        }

        self.read_word_as_str_with_slow_path(start, true)
    }

    #[cold]
    fn read_word_as_str_with_slow_path(
        &mut self,
        start: BytePos,
        mut first: bool,
    ) -> (Cow<'a, str>, bool) {
        let mut has_escape = false;
        let mut out: Option<String> = None;
        let mut slice_start = start;

        loop {
            if let Some(ch) = self.input.cur_as_ascii() {
                if Self::is_ident_continue_ascii(ch) || (first && Self::is_ident_start_ascii(ch)) {
                    self.bump_ascii();
                    first = false;
                    continue;
                }

                if ch == b'\\' && self.input.peek() == Some(b'u') {
                    has_escape = true;
                    self.append_chunk(&mut out, slice_start, self.input.cur_pos());
                    let buf = out.get_or_insert_with(String::new);
                    if let Some(decoded) = self.read_unicode_escape() {
                        buf.push(decoded);
                        slice_start = self.input.cur_pos();
                        first = false;
                        continue;
                    }
                    break;
                }

                break;
            }

            let Some(ch) = self.input.cur_as_char() else {
                break;
            };
            if Self::is_ident_continue_char(ch) || (first && Self::is_ident_start_char(ch)) {
                self.bump_char();
                first = false;
                continue;
            }

            break;
        }

        let end = self.input.cur_pos();
        if !has_escape {
            let value = unsafe { self.input.slice_str(start, end) };
            return (Cow::Borrowed(value), false);
        }

        let mut buf = out.unwrap_or_default();
        if slice_start < end {
            let tail = unsafe { self.input.slice_str(slice_start, end) };
            buf.push_str(tail);
        }
        (Cow::Owned(buf), true)
    }

    fn read_word(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        let (value, has_escape) = self.read_word_as_str_with();
        let end = self.input.cur_pos();

        if !has_escape {
            if let Some(keyword) = keyword_from_str(value.as_ref()) {
                return Token::simple(
                    TokenKind::Keyword(keyword),
                    Span::new_with_checked(start, end),
                    had_line_break_before,
                );
            }
        }

        Token {
            kind: TokenKind::Ident,
            span: Span::new_with_checked(start, end),
            had_line_break_before,
            value: Some(TokenValue::Ident(Atom::new(value))),
            flags: TokenFlags {
                escaped: has_escape,
                contains_legacy_octal_escape: false,
                contains_invalid_escape: false,
            },
        }
    }

    fn read_unicode_escape(&mut self) -> Option<char> {
        if self.input.cur_as_ascii() != Some(b'\\') || self.input.peek() != Some(b'u') {
            return None;
        }
        self.bump_ascii();
        self.read_unicode_escape_after_u()
    }

    fn read_unicode_escape_after_u(&mut self) -> Option<char> {
        if self.input.cur_as_ascii() != Some(b'u') {
            return None;
        }
        self.bump_ascii();

        let value = if self.input.cur_as_ascii() == Some(b'{') {
            self.bump_ascii();
            let mut value = 0u32;
            let mut has_digit = false;
            while let Some(ch) = self.input.cur_as_ascii() {
                if ch == b'}' {
                    self.bump_ascii();
                    break;
                }
                let digit = (ch as char).to_digit(16)?;
                value = value.saturating_mul(16).saturating_add(digit);
                has_digit = true;
                self.bump_ascii();
            }
            if !has_digit {
                return None;
            }
            value
        } else {
            let mut value = 0u32;
            for _ in 0..4 {
                let ch = self.input.cur_as_ascii()?;
                let digit = (ch as char).to_digit(16)?;
                value = value.saturating_mul(16).saturating_add(digit);
                self.bump_ascii();
            }
            value
        };

        match char::from_u32(value) {
            Some(ch) => Some(ch),
            None if (0xd800..=0xdfff).contains(&value) => Some('\u{FFFD}'),
            None => None,
        }
    }

    fn is_ident_start(&self) -> bool {
        match self.input.cur_as_char() {
            Some(ch) => Self::is_ident_start_char(ch),
            None => false,
        }
    }

    fn is_ident_start_char(ch: char) -> bool {
        if ch.is_ascii() {
            matches!(ch, '$' | '_' | 'a'..='z' | 'A'..='Z')
        } else {
            ch == '$' || ch == '_' || unicode_id_start::is_id_start_unicode(ch)
        }
    }

    fn is_ident_continue_char(ch: char) -> bool {
        if ch.is_ascii() {
            matches!(ch, '$' | '_' | 'a'..='z' | 'A'..='Z' | '0'..='9')
        } else {
            ch == '$'
                || ch == '\u{200c}'
                || ch == '\u{200d}'
                || unicode_id_start::is_id_continue_unicode(ch)
        }
    }

    fn bump_ascii(&mut self) {
        unsafe {
            self.input.bump_bytes(1);
        }
    }

    fn bump_char(&mut self) {
        let Some(ch) = self.input.cur_as_char() else {
            return;
        };
        unsafe {
            self.input.bump_bytes(ch.len_utf8());
        }
    }
}

fn keyword_from_str(word: &str) -> Option<Keyword> {
    Some(match word {
        "await" => Keyword::Await,
        "break" => Keyword::Break,
        "case" => Keyword::Case,
        "catch" => Keyword::Catch,
        "class" => Keyword::Class,
        "const" => Keyword::Const,
        "continue" => Keyword::Continue,
        "debugger" => Keyword::Debugger,
        "default" => Keyword::Default,
        "delete" => Keyword::Delete,
        "do" => Keyword::Do,
        "else" => Keyword::Else,
        "export" => Keyword::Export,
        "extends" => Keyword::Extends,
        "false" => Keyword::False,
        "finally" => Keyword::Finally,
        "for" => Keyword::For,
        "from" => Keyword::From,
        "function" => Keyword::Function,
        "if" => Keyword::If,
        "import" => Keyword::Import,
        "in" => Keyword::In,
        "instanceof" => Keyword::InstanceOf,
        "let" => Keyword::Let,
        "new" => Keyword::New,
        "null" => Keyword::Null,
        "return" => Keyword::Return,
        "super" => Keyword::Super,
        "switch" => Keyword::Switch,
        "this" => Keyword::This,
        "throw" => Keyword::Throw,
        "true" => Keyword::True,
        "try" => Keyword::Try,
        "typeof" => Keyword::TypeOf,
        "var" => Keyword::Var,
        "void" => Keyword::Void,
        "while" => Keyword::While,
        "with" => Keyword::With,
        "yield" => Keyword::Yield,
        "as" => Keyword::As,
        "interface" => Keyword::Interface,
        "type" => Keyword::Type,
        "enum" => Keyword::Enum,
        "implements" => Keyword::Implements,
        "public" => Keyword::Public,
        "private" => Keyword::Private,
        "protected" => Keyword::Protected,
        "static" => Keyword::Static,
        "declare" => Keyword::Declare,
        "namespace" => Keyword::Namespace,
        "module" => Keyword::Module,
        "any" => Keyword::Any,
        "number" => Keyword::Number,
        "string" => Keyword::String,
        "boolean" => Keyword::Boolean,
        "unknown" => Keyword::Unknown,
        "never" => Keyword::Never,
        _ => return None,
    })
}

impl Iterator for Lexer<'_> {
    type Item = Token;

    fn next(&mut self) -> Option<Self::Item> {
        let token = self.next_token();
        if token.kind == TokenKind::Eof {
            None
        } else {
            Some(token)
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{FileName, SourceMap};

    use super::*;
    use crate::Syntax;

    #[test]
    fn lexes_basic_program() {
        let cm = SourceMap::default();
        let fm = cm.new_source_file(FileName::Custom("lexer.js".into()).into(), "let a = 1 + 2;");

        let mut lexer = Lexer::new(Syntax::default(), StringInput::from(&*fm), None);

        assert_eq!(lexer.next_token().kind, TokenKind::Keyword(Keyword::Let));
        assert_eq!(lexer.next_token().kind, TokenKind::Ident);
        assert_eq!(lexer.next_token().kind, TokenKind::Eq);
        assert_eq!(lexer.next_token().kind, TokenKind::Num);
        assert_eq!(lexer.next_token().kind, TokenKind::Plus);
        assert_eq!(lexer.next_token().kind, TokenKind::Num);
        assert_eq!(lexer.next_token().kind, TokenKind::Semi);

        let eof = lexer.next_token();
        assert_eq!(eof.kind, TokenKind::Eof);
        assert!(eof.span.hi >= eof.span.lo);
    }
}
