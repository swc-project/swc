use crate::{
    error::{Error, ErrorKind},
    parser::{input::ParserInput, PResult},
};
use swc_atoms::{js_word, JsWord};
use swc_common::{input::Input, BytePos, Span};
use swc_css_ast::{Token, TokenAndSpan};

mod value;

pub(crate) type LexResult<T> = Result<T, ErrorKind>;

#[derive(Debug)]
pub struct Lexer<I>
where
    I: Input,
{
    input: I,
    start_pos: BytePos,
    /// Used to override last_pos
    last_pos: Option<BytePos>,
}

impl<I> Lexer<I>
where
    I: Input,
{
    pub fn new(input: I) -> Self {
        let start_pos = input.last_pos();
        Lexer {
            input,
            start_pos,
            last_pos: None,
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub struct LexerState {
    pos: BytePos,
}

impl<I> ParserInput for Lexer<I>
where
    I: Input,
{
    type State = LexerState;

    fn next(&mut self) -> PResult<TokenAndSpan> {
        self.start_pos = self.input.cur_pos();

        let token = self.read_token();
        let end = self.last_pos.take().unwrap_or_else(|| self.input.cur_pos());
        let span = Span::new(self.start_pos, end, Default::default());

        token
            .map(|token| TokenAndSpan { span, token })
            .map_err(|kind| Error::new(span, kind))
    }

    fn skip_whitespaces(&mut self) -> PResult<()> {
        let start = self.input.cur_pos();

        let token = self.skip_ws();
        let end = self.input.cur_pos();
        let span = Span::new(start, end, Default::default());

        token.map_err(|kind| Error::new(span, kind))
    }

    fn start_pos(&mut self) -> swc_common::BytePos {
        self.input.cur_pos()
    }

    fn state(&mut self) -> Self::State {
        LexerState {
            pos: self.input.cur_pos(),
        }
    }

    fn reset(&mut self, state: &Self::State) {
        self.input.reset_to(state.pos);
    }
}

impl<I> Lexer<I>
where
    I: Input,
{
    fn read_token(&mut self) -> LexResult<Token> {
        if self.input.cur().is_none() {
            return Err(ErrorKind::Eof);
        }

        if self.input.is_byte(b'/') && self.input.peek() == Some('*') {
            self.skip_block_comment()?;
            self.skip_ws()?;
            self.start_pos = self.input.cur_pos();

            return self.read_token();
        }

        macro_rules! try_delim {
            ($b:tt,$tok:tt) => {{
                if self.input.eat_byte($b) {
                    return Ok(tok!($tok));
                }
            }};
        }

        // TODO: it is delim tokens
        try_delim!(b'^', "^");
        try_delim!(b'%', "%");
        try_delim!(b'>', ">");

        // TODO: Plus can start a number
        try_delim!(b'/', "/");

        if let Some(c) = self.input.cur() {
            if is_whitespace(c) {
                self.skip_ws()?;

                return Ok(tok!(" "));
            }
        }

        if self.input.is_byte(b'"') {
            return self.read_str(None);
        }

        if self.input.is_byte(b'#') {
            let c = self.input.cur().unwrap();

            self.input.bump();

            if is_name_continue(self.input.cur().unwrap()) || self.is_valid_escape()? {
                let is_id = self.would_start_ident()?;
                let name = self.read_name()?;

                return Ok(Token::Hash {
                    is_id,
                    value: name.0,
                    raw: name.1,
                });
            }

            return Ok(Token::Delim { value: c });
        }

        if self.input.is_byte(b'\'') {
            return self.read_str(None);
        }

        try_delim!(b'(', "(");

        try_delim!(b')', ")");

        if self.input.is_byte(b'+') {
            let pos = self.input.cur_pos();
            let c = self.input.cur().unwrap();

            self.input.bump();

            if self.would_start_number()? {
                self.input.reset_to(pos);

                return self.read_number();
            }

            return Ok(Token::Delim { value: c });
        }

        try_delim!(b',', ",");

        if self.input.is_byte(b'-') {
            let pos = self.input.cur_pos();
            let c = self.input.cur().unwrap();

            self.input.bump();

            if self.would_start_number()? {
                self.input.reset_to(pos);

                return self.read_number();
            } else if self.input.cur() == Some('-') && self.input.peek() == Some('>') {
                self.input.bump();
                self.input.bump();

                return Ok(Token::CDC);
            } else if self.would_start_ident()? {
                self.input.reset_to(pos);

                return self
                    .read_name()
                    .map(|(value, raw)| Token::Ident { value, raw });
            }

            return Ok(Token::Delim { value: c });
        }

        if self.input.is_byte(b'.') {
            let pos = self.input.cur_pos();
            let c = self.input.cur().unwrap();

            self.input.bump();

            if self.would_start_number()? {
                self.input.reset_to(pos);

                return self.read_number();
            }

            return Ok(Token::Delim { value: c });
        }

        try_delim!(b':', ":");

        try_delim!(b';', ";");

        if self.input.is_byte(b'<') {
            let c = self.input.cur().unwrap();

            self.input.bump();

            // <!--
            if self.input.is_byte(b'!')
                && self.input.peek() == Some('-')
                && self.input.peek_ahead() == Some('-')
            {
                self.input.bump(); // !
                self.input.bump(); // -
                self.input.bump(); // -

                return Ok(tok!("<!--"));
            }

            return Ok(Token::Delim { value: c });
        }

        if self.input.is_byte(b'@') {
            let c = self.input.cur().unwrap();

            self.input.bump();

            if self.would_start_ident()? {
                return self.read_at_keyword();
            }

            return Ok(Token::Delim { value: c });
        }

        try_delim!(b'[', "[");

        if self.input.is_byte(b'\\') {
            let c = self.input.cur().unwrap();

            if self.is_valid_escape()? {
                return self.read_ident_like();
            }

            self.input.bump();

            return Ok(Token::Delim { value: c });
        }

        try_delim!(b']', "]");

        try_delim!(b'{', "{");

        try_delim!(b'}', "}");

        if let Some('0'..='9') = self.input.cur() {
            return self.read_number();
        }

        if let Some(c) = self.input.cur() {
            if is_name_start(c) {
                return self.read_ident_like();
            }
        }

        // TODO: Return an <EOF-token>.
        if self.input.cur().is_none() {
            unreachable!()
        }

        let c = self.input.cur().unwrap();

        self.input.bump();

        return Ok(Token::Delim { value: c });
    }

    fn would_start_number(&mut self) -> LexResult<bool> {
        let first = self.input.cur();

        if first.is_none() {
            return Ok(false);
        }

        match first {
            Some('+') | Some('-') => {
                if let Some(second) = self.input.peek() {
                    return match second {
                        second if second.is_digit(10) => Ok(true),
                        '.' => {
                            if let Some(third) = self.input.peek_ahead() {
                                if third.is_digit(10) {
                                    return Ok(true);
                                }
                            }

                            Ok(false)
                        }
                        _ => Ok(false),
                    };
                }

                Ok(false)
            }
            Some('.') => {
                if let Some(second) = self.input.peek() {
                    if second.is_digit(10) {
                        return Ok(true);
                    }
                }

                Ok(false)
            }
            Some(first) if first.is_digit(10) => Ok(true),
            _ => Ok(false),
        }
    }

    fn is_valid_escape(&mut self) -> LexResult<bool> {
        if self.input.cur() != Some('\\') {
            return Ok(false);
        }

        let c = self.input.peek();

        match c {
            Some(c) => Ok(!is_newline(c)),
            None => Ok(false),
        }
    }

    /// Ported from `consumeIdentLike` of `esbuild`
    // TODO: rewrite https://www.w3.org/TR/css-syntax-3/#consume-an-ident-like-token
    fn read_ident_like(&mut self) -> LexResult<Token> {
        let name = self.read_name()?;

        // TODO: rewrite https://www.w3.org/TR/css-syntax-3/#consume-ident-like-token
        if name.0.to_ascii_lowercase() == js_word!("url") && self.input.is_byte(b'(') {
            let pos = self.input.cur_pos();

            self.input.bump();
            let pos_whitespace = self.input.cur_pos();
            self.skip_ws()?;

            match self.input.cur() {
                Some('"' | '\'') => self.input.reset_to(pos),
                _ => {
                    self.input.reset_to(pos_whitespace);

                    return self.read_url();
                }
            }
        }

        Ok(Token::Ident {
            value: name.0,
            raw: name.1,
        })
    }

    fn read_str(&mut self, mut ending_code_point: Option<char>) -> LexResult<Token> {
        if ending_code_point.is_none() {
            ending_code_point = self.input.cur();
        }

        let mut value = String::new();
        let mut raw = String::new();

        raw.push(ending_code_point.unwrap());

        self.input.bump();

        loop {
            match self.input.cur() {
                Some(c) => match c {
                    // Ending code point
                    c if c == ending_code_point.unwrap() => {
                        raw.push(c);
                        self.input.bump();
                        self.last_pos = Some(self.input.cur_pos());

                        break;
                    }

                    // Newline
                    c if is_newline(c) => {
                        raw.push(c);
                        self.input.bump();

                        return Ok(Token::BadStr {
                            value: value.into(),
                            raw: raw.into(),
                        });
                    }

                    // U+005C REVERSE SOLIDUS (\)
                    c if c == '\\' => {
                        // If the next input code point is EOF, do nothing.
                        if self.input.peek().is_none() {
                            break;
                        }

                        // Otherwise, if the next input code point is a newline, consume it.
                        if is_newline(self.input.peek().unwrap()) {
                            raw.push(c);
                            self.input.bump();
                            raw.push(self.input.cur().unwrap());
                            self.input.bump();
                        }
                        // Otherwise, (the stream starts with a valid escape) consume an escaped
                        // code point and append the returned code point to
                        // the <string-token>’s value.
                        else if self.is_valid_escape()? {
                            let escape = self.read_escape()?;

                            value.push(escape.0);
                            raw.push_str(&escape.1);
                        }
                    }

                    // Anything else
                    // Append the current input code point to the <string-token>’s value.
                    c => {
                        value.push(c);
                        raw.push(c);

                        self.input.bump();
                    }
                },

                // EOF
                // This is a parse error. Return the <string-token>.
                None => {
                    return Err(ErrorKind::Eof);
                }
            }
        }

        Ok(Token::Str {
            value: value.into(),
            raw: raw.into(),
        })
    }

    fn read_url(&mut self) -> LexResult<Token> {
        let mut value = String::new();
        let mut raw = String::new();
        let start_pos = self.input.cur_pos();
        self.skip_ws()?;
        let end_pos = self.input.cur_pos();
        raw.push_str(&self.input.slice(start_pos, end_pos));

        loop {
            self.last_pos = None;

            match self.input.cur() {
                Some(c) if c == ')' => {
                    self.input.bump();

                    return Ok(Token::Url {
                        value: value.into(),
                        raw: raw.into(),
                    });
                }

                None => {
                    // TODO: This is a parse error. Return the <url-token>.
                    return Err(ErrorKind::Eof);
                }

                Some(c) if is_whitespace(c) => {
                    raw.push(c);
                    self.input.bump();
                    let start_pos = self.input.cur_pos();
                    self.skip_ws()?;
                    let end_pos = self.input.cur_pos();

                    raw.push_str(&self.input.slice(start_pos, end_pos));

                    let c = self.input.cur();

                    match c {
                        Some(c) if c == ')' => {
                            self.input.bump();

                            return Ok(Token::Url {
                                value: value.into(),
                                raw: raw.into(),
                            });
                        }
                        None => {
                            // TODO: This is a parse error. Return the <url-token>.
                            return Err(ErrorKind::Eof);
                        }
                        _ => {}
                    }

                    // TODO: break + Error recovery + 4.3.14. Consume the remnants of a bad url
                    return Err(ErrorKind::UnterminatedUrl);
                }

                Some(c) if c == '"' || c == '\'' || c == '(' || is_non_printable(c) => {
                    // TODO: break + Error recovery + 4.3.14. Consume the remnants of a bad url
                    return Err(ErrorKind::UnterminatedUrl);
                }

                Some('\\') => {
                    if !self.is_valid_escape()? {
                        // TODO: break + Error recovery + 4.3.14. Consume the remnants of a bad url
                        return Err(ErrorKind::InvalidEscape);
                    }

                    let escaped = self.read_escape()?;

                    value.push(escaped.0);
                    raw.push_str(&escaped.1);
                }

                Some(c) => {
                    value.push(c);
                    raw.push(c);

                    self.input.bump();
                }
            }
        }
    }

    fn read_escape(&mut self) -> LexResult<(char, String)> {
        // TODO: from spec - `\` should be consumed before run this https://www.w3.org/TR/css-syntax-3/#consume-escaped-code-point
        assert!(
            self.input.eat_byte(b'\\'),
            "read_escape: Expected a backslash"
        );

        let mut raw = String::new();

        raw.push('\\');

        let c = self.input.cur();
        let c = match c {
            Some(v) => v,
            None => return Err(ErrorKind::InvalidEscape),
        };

        if c.is_digit(16) {
            let mut hex = c.to_digit(16).unwrap();

            raw.push(self.input.cur().unwrap());

            self.input.bump();

            // Consume as many hex digits as possible, but no more than 5.
            // Note that this means 1-6 hex digits have been consumed in total.
            for _ in 0..5 {
                let next = self.input.cur();
                let digit = match next.and_then(|c| c.to_digit(16)) {
                    Some(v) => v,
                    None => break,
                };

                raw.push(next.unwrap());

                self.input.bump();

                hex = hex * 16 + digit;
            }

            self.last_pos = Some(self.input.cur_pos());

            if is_whitespace(self.input.cur().unwrap()) {
                raw.push(self.input.cur().unwrap());

                self.input.bump();
            }

            let hex = char::from_u32(hex).ok_or_else(|| ErrorKind::InvalidEscape)?;

            return Ok((hex, raw));
        }

        raw.push(c);

        self.input.bump();

        Ok((c, raw))
    }

    fn read_at_keyword(&mut self) -> LexResult<Token> {
        let name = self.read_name()?;

        Ok(Token::AtKeyword {
            value: name.0,
            raw: name.1,
        })
    }

    /// Ported from `wouldStartIdentifier` of `esbuild`.
    fn would_start_ident(&mut self) -> LexResult<bool> {
        match self.input.cur() {
            Some(cur) => {
                if is_name_start(cur) {
                    return Ok(true);
                }

                if cur == '-' {
                    if let Some(c) = self.input.peek() {
                        if is_name_start(c) {
                            return Ok(true);
                        }
                        match c {
                            '-' => return Ok(true),

                            '\\' => match self.input.peek_ahead() {
                                Some(c2) => return Ok(!is_newline(c2)),
                                None => return Ok(false),
                            },

                            _ => {}
                        }
                    }
                }
            }
            None => {}
        }

        Ok(self.is_valid_escape()?)
    }

    /// Ported from `consumeName` of esbuild.
    ///
    /// https://github.com/evanw/esbuild/blob/a9456dfbf08ab50607952eefb85f2418968c124c/internal/css_lexer/css_lexer.go#L548
    fn read_name(&mut self) -> LexResult<(JsWord, JsWord)> {
        let start = self.input.cur_pos();
        self.input.uncons_while(is_name_continue);
        let end = self.input.last_pos();

        if !self.is_valid_escape()? {
            let first = self.input.slice(start, end);
            return Ok((first.into(), first.into()));
        }

        let mut raw = String::new();
        let mut buf = String::new();

        let first = self.input.slice(start, end);

        buf.push_str(first);
        raw.push_str(first);

        let escaped = self.read_escape()?;

        buf.push(escaped.0);
        raw.push_str(&escaped.1);

        loop {
            let c = self.input.cur();
            let c = match c {
                Some(v) => v,
                None => break,
            };

            if is_name_continue(c) {
                self.last_pos = None;
                self.input.bump();

                buf.push(c);
                raw.push(c)
            } else if self.is_valid_escape()? {
                let escaped = self.read_escape()?;

                buf.push(escaped.0);
                raw.push_str(&escaped.1);
            } else {
                break;
            }
        }

        Ok((buf.into(), raw.into()))
    }

    fn skip_ws(&mut self) -> LexResult<()> {
        loop {
            if self.input.cur().is_none() {
                break;
            }

            if is_whitespace(self.input.cur().unwrap()) {
                self.input.bump();
                continue;
            }

            break;
        }

        Ok(())
    }

    /// Expects current char to be '/' and next char to be '*'.
    fn skip_block_comment(&mut self) -> LexResult<()> {
        debug_assert_eq!(self.input.cur(), Some('/'));
        debug_assert_eq!(self.input.peek(), Some('*'));

        self.input.bump();
        self.input.bump();

        // let slice_start = self.input.cur_pos();
        let mut was_star = if self.input.is_byte(b'*') {
            self.input.bump();
            true
        } else {
            false
        };

        while let Some(c) = self.input.cur() {
            if was_star && c == '/' {
                debug_assert_eq!(self.input.cur(), Some('/'));
                self.input.bump(); // '/'

                return Ok(());
            }

            was_star = c == '*';
            self.input.bump();
        }

        Err(ErrorKind::UnterminatedBlockComment)
    }
}

#[inline(always)]
fn is_uppercase_letter(c: char) -> bool {
    match c {
        'A'..='Z' => true,
        _ => false,
    }
}

#[inline(always)]
fn is_lowercase_letter(c: char) -> bool {
    match c {
        'a'..='z' => true,
        _ => false,
    }
}

#[inline(always)]
fn is_letter(c: char) -> bool {
    is_uppercase_letter(c) || is_lowercase_letter(c)
}

#[inline(always)]
fn is_non_ascii(c: char) -> bool {
    c as u32 >= 0x80
}

pub(crate) fn is_name_start(c: char) -> bool {
    match c {
        // TODO: `\x00` is not valid
        c if is_letter(c) || is_non_ascii(c) || c == '_' || c == '\x00' => true,
        _ => false,
    }
}

pub(crate) fn is_name_continue(c: char) -> bool {
    is_name_start(c)
        || match c {
            c if c.is_digit(10) || c == '-' => true,
            _ => false,
        }
}

fn is_newline(c: char) -> bool {
    match c {
        '\n' | '\r' | '\x0C' => true,

        _ => false,
    }
}

fn is_whitespace(c: char) -> bool {
    match c {
        c if c == ' ' || c == '\t' || is_newline(c) => true,

        _ => false,
    }
}

fn is_non_printable(c: char) -> bool {
    match c {
        '\x00'..='\x08' | '\x0B' | '\x0E'..='\x1F' | '\x7F' => true,
        _ => false,
    }
}
