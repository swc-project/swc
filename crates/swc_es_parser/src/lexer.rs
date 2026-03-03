use swc_atoms::Atom;
use swc_common::{
    comments::Comments,
    input::{Input, StringInput},
    Span,
};

use crate::{
    error::{Error, ErrorCode, Severity},
    syntax::Syntax,
    token::{Keyword, Token, TokenKind, TokenValue},
};

/// Checkpoint for lexer backtracking.
#[derive(Clone)]
pub struct LexerCheckpoint<'a> {
    input: StringInput<'a>,
    had_line_break_before: bool,
    is_first_token: bool,
    errors_len: usize,
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
                        value: Some(TokenValue::Ident(Atom::new(ch.to_string()))),
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
                if self.input.eat_byte(b'.') {
                    Token::simple(
                        TokenKind::QuestionDot,
                        Span::new_with_checked(start, self.input.cur_pos()),
                        had_line_break_before,
                    )
                } else if self.input.eat_byte(b'?') {
                    if self.input.eat_byte(b'=') {
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
                        value: Some(TokenValue::Ident(Atom::new(ch.to_string()))),
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
        let kind = if self.input.eat_byte(b'+') {
            TokenKind::PlusPlus
        } else if self.input.eat_byte(b'=') {
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
        let kind = if self.input.eat_byte(b'-') {
            TokenKind::MinusMinus
        } else if self.input.eat_byte(b'=') {
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

        let kind = if self.input.eat_byte(b'&') {
            if self.input.eat_byte(b'=') {
                TokenKind::AndAndEq
            } else {
                TokenKind::AndAnd
            }
        } else if self.input.eat_byte(b'=') {
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

        let kind = if self.input.eat_byte(b'|') {
            if self.input.eat_byte(b'=') {
                TokenKind::OrOrEq
            } else {
                TokenKind::OrOr
            }
        } else if self.input.eat_byte(b'=') {
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

        let kind = if self.input.eat_byte(b'=') {
            if self.input.eat_byte(b'=') {
                TokenKind::EqEqEq
            } else {
                TokenKind::EqEq
            }
        } else if self.input.eat_byte(b'>') {
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

        let kind = if self.input.eat_byte(b'=') {
            if self.input.eat_byte(b'=') {
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
        let kind = if self.input.eat_byte(b'<') {
            if self.input.eat_byte(b'=') {
                TokenKind::LtLtEq
            } else {
                TokenKind::LtLt
            }
        } else if self.input.eat_byte(b'=') {
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
        let kind = if self.input.eat_byte(b'>') {
            if self.input.eat_byte(b'>') {
                if self.input.eat_byte(b'=') {
                    TokenKind::GtGtGtEq
                } else {
                    TokenKind::GtGtGt
                }
            } else if self.input.eat_byte(b'=') {
                TokenKind::GtGtEq
            } else {
                TokenKind::GtGt
            }
        } else if self.input.eat_byte(b'=') {
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
        let kind = if self.input.eat_byte(b'=') {
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
        let kind = if self.input.eat_byte(b'*') {
            if self.input.eat_byte(b'=') {
                TokenKind::StarStarEq
            } else {
                TokenKind::StarStar
            }
        } else if self.input.eat_byte(b'=') {
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

    fn read_number(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        let mut radix = 10u32;
        let mut is_float = false;

        let eat_digits_with_sep = |lexer: &mut Self, valid: &mut dyn FnMut(u8) -> bool| {
            while let Some(ch) = lexer.input.cur_as_ascii() {
                if ch == b'_' || valid(ch) {
                    lexer.bump_ascii();
                } else {
                    break;
                }
            }
        };

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
            let mut valid = |ch: u8| match radix {
                16 => ch.is_ascii_hexdigit(),
                8 => (b'0'..=b'7').contains(&ch),
                2 => matches!(ch, b'0' | b'1'),
                _ => ch.is_ascii_digit(),
            };
            eat_digits_with_sep(self, &mut valid);
        } else {
            let mut is_dec = |ch: u8| ch.is_ascii_digit();
            eat_digits_with_sep(self, &mut is_dec);

            if self.input.cur_as_ascii() == Some(b'.') {
                is_float = true;
                self.bump_ascii();
                let mut is_dec = |ch: u8| ch.is_ascii_digit();
                eat_digits_with_sep(self, &mut is_dec);
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
                let mut is_dec = |ch: u8| ch.is_ascii_digit();
                eat_digits_with_sep(self, &mut is_dec);
            }
        }

        if self.input.cur_as_ascii() == Some(b'n') && !is_float {
            self.bump_ascii();
            let end = self.input.cur_pos();
            let raw = unsafe { self.input.slice_str(start, end) };
            let mut value = raw.trim_end_matches('n').replace('_', "");
            if radix != 10 && value.len() >= 2 {
                value = value[2..].to_string();
            }
            return Token {
                kind: TokenKind::BigInt,
                span: Span::new_with_checked(start, end),
                had_line_break_before,
                value: Some(TokenValue::BigInt(Atom::new(value))),
            };
        }

        let end = self.input.cur_pos();
        let raw = unsafe { self.input.slice_str(start, end) };
        let cleaned = raw.replace('_', "");
        let value = if radix == 10 {
            cleaned.parse::<f64>().unwrap_or_else(|_| {
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

        Token {
            kind: TokenKind::Num,
            span: Span::new_with_checked(start, end),
            had_line_break_before,
            value: Some(TokenValue::Num(value)),
        }
    }

    fn read_number_after_dot(
        &mut self,
        start: swc_common::BytePos,
        had_line_break_before: bool,
    ) -> Token {
        while matches!(self.input.cur_as_ascii(), Some(b'0'..=b'9' | b'_')) {
            self.bump_ascii();
        }

        if matches!(self.input.cur_as_ascii(), Some(b'e' | b'E')) {
            self.bump_ascii();
            if matches!(self.input.cur_as_ascii(), Some(b'+' | b'-')) {
                self.bump_ascii();
            }
            while matches!(self.input.cur_as_ascii(), Some(b'0'..=b'9' | b'_')) {
                self.bump_ascii();
            }
        }

        let end = self.input.cur_pos();
        let raw = unsafe { self.input.slice_str(start, end) };
        let cleaned = raw.replace('_', "");
        let value = cleaned.parse::<f64>().unwrap_or_else(|_| {
            self.errors.push(Error::new(
                Span::new_with_checked(start, end),
                Severity::Error,
                ErrorCode::InvalidNumber,
                "failed to parse number literal",
            ));
            0.0
        });

        Token {
            kind: TokenKind::Num,
            span: Span::new_with_checked(start, end),
            had_line_break_before,
            value: Some(TokenValue::Num(value)),
        }
    }

    fn read_string(&mut self, had_line_break_before: bool) -> Token {
        let quote = self.input.cur_as_ascii().unwrap_or(b'"');
        let checkpoint = self.input.clone();
        let start = self.input.cur_pos();
        self.bump_ascii();

        let mut out = String::new();
        let mut terminated = false;
        let mut saw_lt = false;

        while let Some(ch) = self.input.cur_as_char() {
            if ch as u32 <= 0x7f && ch as u8 == quote {
                self.bump_ascii();
                terminated = true;
                break;
            }

            if ch == '\\' {
                self.bump_char();
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
                    Some('\n') => {
                        self.bump_char();
                        self.had_line_break_before = true;
                    }
                    Some('\r') => {
                        self.bump_char();
                        if self.input.cur_as_ascii() == Some(b'\n') {
                            self.bump_ascii();
                        }
                        self.had_line_break_before = true;
                    }
                    Some('\u{2028}' | '\u{2029}') => {
                        self.bump_char();
                        self.had_line_break_before = true;
                    }
                    Some(other) => {
                        self.bump_char();
                        out.push(other);
                    }
                    None => break,
                }
                continue;
            }

            if ch == '\n' || ch == '\r' {
                break;
            }

            if ch == '<' {
                saw_lt = true;
            }
            self.bump_char();
            out.push(ch);
        }

        let end = self.input.cur_pos();
        if !terminated {
            if self.syntax.jsx() && quote == b'\'' && saw_lt {
                self.input = checkpoint;
                self.bump_ascii();
                let end = self.input.cur_pos();
                return Token {
                    kind: TokenKind::Ident,
                    span: Span::new_with_checked(start, end),
                    had_line_break_before,
                    value: Some(TokenValue::Ident(Atom::new("'"))),
                };
            }
            self.errors.push(Error::new(
                Span::new_with_checked(start, end),
                Severity::Error,
                ErrorCode::UnterminatedString,
                "unterminated string literal",
            ));
        }

        Token {
            kind: TokenKind::Str,
            span: Span::new_with_checked(start, end),
            had_line_break_before,
            value: Some(TokenValue::Str(Atom::new(out))),
        }
    }

    fn read_template(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        self.bump_ascii();

        let mut out = String::new();
        let mut terminated = false;
        let mut expr_depth = 0usize;

        while let Some(ch) = self.input.cur_as_char() {
            if ch == '`' && expr_depth == 0 {
                self.bump_char();
                terminated = true;
                break;
            }

            if ch == '\\' {
                self.bump_char();
                match self.input.cur_as_char() {
                    Some(next) => {
                        self.bump_char();
                        out.push(next);
                    }
                    None => break,
                }
                continue;
            }

            if ch == '$' && self.input.peek() == Some(b'{') {
                self.bump_ascii();
                self.bump_ascii();
                out.push('$');
                out.push('{');
                expr_depth += 1;
                continue;
            }

            if ch == '{' && expr_depth > 0 {
                self.bump_char();
                out.push('{');
                expr_depth += 1;
                continue;
            }

            if ch == '}' && expr_depth > 0 {
                self.bump_char();
                out.push('}');
                expr_depth = expr_depth.saturating_sub(1);
                continue;
            }

            self.bump_char();
            out.push(ch);
        }

        let end = self.input.cur_pos();
        if !terminated {
            self.errors.push(Error::new(
                Span::new_with_checked(start, end),
                Severity::Error,
                ErrorCode::UnterminatedString,
                "unterminated template literal",
            ));
        }

        Token {
            kind: TokenKind::Template,
            span: Span::new_with_checked(start, end),
            had_line_break_before,
            value: Some(TokenValue::Str(Atom::new(out))),
        }
    }

    fn read_word(&mut self, had_line_break_before: bool) -> Token {
        let start = self.input.cur_pos();
        let mut out = String::new();
        let mut has_escape = false;

        loop {
            let Some(ch) = self.input.cur_as_char() else {
                break;
            };

            if ch == '\\' && self.input.peek() == Some(b'u') {
                if let Some(decoded) = self.read_unicode_escape() {
                    has_escape = true;
                    out.push(decoded);
                    continue;
                }
                break;
            }

            if out.is_empty() {
                if Self::is_ident_start_char(ch) {
                    self.bump_char();
                    out.push(ch);
                    continue;
                }
                break;
            }

            if Self::is_ident_continue_char(ch) {
                self.bump_char();
                out.push(ch);
                continue;
            }
            break;
        }

        let end = self.input.cur_pos();
        if out.is_empty() {
            let raw = unsafe { self.input.slice_str(start, end) };
            return Token {
                kind: TokenKind::Ident,
                span: Span::new_with_checked(start, end),
                had_line_break_before,
                value: Some(TokenValue::Ident(Atom::new(raw))),
            };
        }

        if !has_escape {
            if let Some(keyword) = keyword_from_str(&out) {
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
            value: Some(TokenValue::Ident(if has_escape {
                let raw = unsafe { self.input.slice_str(start, end) };
                Atom::new(raw)
            } else {
                Atom::new(out)
            })),
        }
    }

    fn read_unicode_escape(&mut self) -> Option<char> {
        if self.input.cur_as_ascii() != Some(b'\\') || self.input.peek() != Some(b'u') {
            return None;
        }
        self.bump_ascii();
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

        char::from_u32(value)
    }

    fn skip_space_and_comments(&mut self) {
        loop {
            match self.input.cur_as_ascii() {
                Some(b' ' | b'\t' | b'\x0b' | b'\x0c') => self.bump_ascii(),
                Some(b'\n' | b'\r') => {
                    self.bump_ascii();
                    self.had_line_break_before = true;
                }
                Some(b'<') if self.input.is_str("<!--") => {
                    self.bump_ascii();
                    self.bump_ascii();
                    self.bump_ascii();
                    self.bump_ascii();
                    while let Some(c) = self.input.cur_as_ascii() {
                        if c == b'\n' || c == b'\r' {
                            break;
                        }
                        self.bump_ascii();
                    }
                }
                Some(b'-')
                    if self.input.is_str("-->")
                        && (self.had_line_break_before || self.is_first_token) =>
                {
                    self.bump_ascii();
                    self.bump_ascii();
                    self.bump_ascii();
                    while let Some(c) = self.input.cur_as_ascii() {
                        if c == b'\n' || c == b'\r' {
                            break;
                        }
                        self.bump_ascii();
                    }
                }
                Some(b'/') if self.input.peek() == Some(b'/') => {
                    self.bump_ascii();
                    self.bump_ascii();
                    while let Some(c) = self.input.cur_as_ascii() {
                        if c == b'\n' || c == b'\r' {
                            break;
                        }
                        self.bump_ascii();
                    }
                }
                Some(b'/') if self.input.peek() == Some(b'*') => {
                    let start = self.input.cur_pos();
                    self.bump_ascii();
                    self.bump_ascii();
                    let mut terminated = false;

                    while let Some(c) = self.input.cur_as_char() {
                        if c == '*' && self.input.peek() == Some(b'/') {
                            self.bump_ascii();
                            self.bump_ascii();
                            terminated = true;
                            break;
                        }

                        if matches!(c, '\n' | '\r' | '\u{2028}' | '\u{2029}') {
                            self.had_line_break_before = true;
                        }
                        self.bump_char();
                    }

                    if !terminated {
                        self.errors.push(Error::new(
                            Span::new_with_checked(start, self.input.cur_pos()),
                            Severity::Error,
                            ErrorCode::UnterminatedBlockComment,
                            "unterminated block comment",
                        ));
                        break;
                    }
                }
                _ => {
                    let Some(ch) = self.input.cur_as_char() else {
                        break;
                    };
                    if ch.is_whitespace() || ch == '\u{feff}' {
                        if matches!(ch, '\n' | '\r' | '\u{2028}' | '\u{2029}') {
                            self.had_line_break_before = true;
                        }
                        self.bump_char();
                        continue;
                    }
                    break;
                }
            }
        }

        if self.comments.is_some() {
            // Comments are intentionally not persisted yet.
            // This branch exists to keep constructor contracts explicit.
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
