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

        macro_rules! try_delim {
            ($b:tt,$tok:tt) => {{
                if self.input.eat_byte($b) {
                    return Ok(tok!($tok));
                }
            }};
        }

        if self.input.is_byte(b'/') {
            if self.input.peek() == Some('/') {
                self.skip_line_comment(2)?;
                self.skip_ws()?;
                self.start_pos = self.input.cur_pos();
                return self.read_token();
            } else if self.input.peek() == Some('*') {
                self.skip_block_comment()?;
                self.skip_ws()?;
                self.start_pos = self.input.cur_pos();
                return self.read_token();
            }
        }

        try_delim!(b'(', "(");
        try_delim!(b')', ")");

        try_delim!(b'[', "[");
        try_delim!(b']', "]");

        try_delim!(b'{', "{");
        try_delim!(b'}', "}");

        try_delim!(b',', ",");
        try_delim!(b'=', "=");
        try_delim!(b'*', "*");
        try_delim!(b'$', "$");
        try_delim!(b':', ":");
        try_delim!(b';', ";");
        try_delim!(b'^', "^");
        try_delim!(b'%', "%");
        try_delim!(b'!', "!");
        try_delim!(b'>', ">");
        try_delim!(b'~', "~");
        try_delim!(b'&', "&");
        try_delim!(b'|', "|");

        // TODO: Plus can start a number
        try_delim!(b'/', "/");

        if self.input.eat_byte(b'@') {
            return self.read_at_keyword();
        }

        if self.input.is_byte(b'<') {
            return self.read_less_than();
        }

        if self.input.is_byte(b'-') {
            return self.read_minus();
        }

        if self.input.is_byte(b'.') {
            return self.read_dot();
        }

        if self.input.is_byte(b'+') {
            return self.read_plus();
        }

        if self.input.is_byte(b'\\') {
            if self.is_valid_escape()? {
                return self.read_ident_like();
            } else {
                return Err(ErrorKind::InvalidEscape);
            }
        }

        match self.input.cur() {
            Some(c) => match c {
                '0'..='9' => return self.read_number(),

                ' ' | '\n' | '\t' => {
                    self.skip_ws()?;
                    return Ok(tok!(" "));
                }

                '\'' | '"' => return self.read_str().map(|value| Token::Str { value }),

                '#' => {
                    self.input.bump();

                    if let Some(c) = self.input.cur() {
                        Ok(if is_name_continue(c) || self.is_valid_escape()? {
                            let is_id = self.would_start_ident()?;

                            let value = self.read_name()?;

                            Token::Hash { is_id, value }
                        } else {
                            // TODO: Verify if this is ok.
                            Token::Hash {
                                is_id: false,
                                value: js_word!(""),
                            }
                        })
                    } else {
                        Err(ErrorKind::Eof)
                    }
                }

                _ => {
                    if is_name_start(c) {
                        return self.read_ident_like();
                    }

                    todo!("read_token (cur = {:?})", c)
                }
            },
            None => {
                unreachable!()
            }
        }
    }

    /// Ported from `isValidEscape` of `esbuild`
    fn is_valid_escape(&mut self) -> LexResult<bool> {
        if self.input.cur().is_none() {
            return Ok(false);
        }
        if self.input.cur().unwrap() != '\\' {
            return Ok(false);
        }
        let c = self.input.peek();

        match c {
            Some(c) => Ok(!is_newline(c)),
            None => Ok(false),
        }
    }

    /// Ported from `consumeIdentLike` of `esbuild`
    fn read_ident_like(&mut self) -> LexResult<Token> {
        let name = self.read_name()?;

        if self.input.is_byte(b'(') {
            if name.len() == 3 {
                if name.to_ascii_lowercase() == js_word!("url") {
                    self.skip_ws()?;

                    match self.input.peek() {
                        Some('"' | '\'') => {}
                        _ => {
                            self.input.bump();
                            return self.read_url();
                        }
                    }
                }
            }
        }

        Ok(Token::Ident(name))
    }

    /// Ported from `consumeURL` of `esbuild`.
    fn read_url(&mut self) -> LexResult<Token> {
        let mut url = String::new();

        loop {
            self.last_pos = None;

            if self.input.eat_byte(b')') {
                return Ok(Token::Url { value: url.into() });
            }

            if self.input.cur().is_none() {
                return Err(ErrorKind::UnterminatedUrl);
            }

            match self.input.cur().unwrap() {
                ' ' | '\t' | '\n' | '\r' => {
                    // TOOD: Add `\f` of golang.
                    self.input.bump();
                    self.skip_ws()?;

                    if !self.input.eat_byte(b')') {
                        // TODO: break + Error recovery
                        return Err(ErrorKind::UnterminatedUrl);
                    }
                    return Ok(Token::Url { value: url.into() });
                }

                '"' | '\'' | '(' => {
                    // TODO: break + Error recovery
                    return Err(ErrorKind::UnterminatedUrl);
                }

                '\\' => {
                    if !self.is_valid_escape()? {
                        // TODO: break + Error recovery
                        return Err(ErrorKind::InvalidEscape);
                    }

                    url.push(self.read_escape()?);
                }

                c => {
                    url.push(c);

                    // TODO: Validate that c is a valid character for a URL.

                    self.input.bump();
                }
            }
        }
    }

    /// Ported from `consumeEscape` of `esbuild`.
    fn read_escape(&mut self) -> LexResult<char> {
        assert!(
            self.input.eat_byte(b'\\'),
            "read_escape: Expected a backslash"
        );

        let c = self.input.cur();
        let c = match c {
            Some(v) => v,
            None => return Err(ErrorKind::InvalidEscape),
        };

        if c.is_digit(16) {
            let mut hex = c.to_digit(16).unwrap();
            self.input.bump();

            for _ in 0..5 {
                let next = self.input.cur();
                let next = match next.and_then(|c| c.to_digit(16)) {
                    Some(v) => v,
                    None => break,
                };
                self.input.bump();
                hex = hex * 16 + next;
            }

            self.last_pos = Some(self.input.cur_pos());
            self.input.eat_byte(b' ');

            let hex = char::from_u32(hex).ok_or_else(|| ErrorKind::InvalidEscape)?;
            return Ok(hex);
        }

        self.input.bump();

        Ok(c)
    }

    fn read_dot(&mut self) -> LexResult<Token> {
        if let Some(next) = self.input.peek() {
            if next == '.' || next.is_digit(10) {
                return self.read_number();
            }
        }

        self.input.bump();
        Ok(tok!("."))
    }

    fn read_plus(&mut self) -> LexResult<Token> {
        if let Some(next) = self.input.peek() {
            if next == '.' || next.is_digit(10) {
                return self.read_number();
            }
        }

        self.input.bump();
        Ok(tok!("+"))
    }

    fn read_at_keyword(&mut self) -> LexResult<Token> {
        let word = self.read_name()?;

        Ok(Token::AtKeyword(word))
    }

    fn read_less_than(&mut self) -> LexResult<Token> {
        assert_eq!(self.input.cur(), Some('<'));
        self.input.bump(); // <

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

        Err(ErrorKind::UnexpectedChar(self.input.cur()))
    }

    fn read_minus(&mut self) -> LexResult<Token> {
        assert_eq!(self.input.cur(), Some('-'));

        match self.input.peek() {
            Some('0'..='9') | Some('.') => return self.read_number(),

            _ => {}
        }

        if self.input.peek() == Some('-') && self.input.peek_ahead() == Some('>') {
            self.input.bump();
            self.input.bump();
            self.input.bump();
            return Ok(Token::CDC);
        }

        if self.would_start_ident()? {
            return self.read_name().map(|value| Token::Ident(value));
        }

        self.input.bump();
        Ok(tok!("-"))
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
    fn read_name(&mut self) -> LexResult<JsWord> {
        let start = self.input.cur_pos();
        self.input.uncons_while(is_name_continue);
        let end = self.input.last_pos();

        if !self.is_valid_escape()? {
            let raw = self.input.slice(start, end);
            return Ok(raw.into());
        }

        let raw = self.input.slice(start, end);
        let mut buf = String::new();
        buf.push_str(raw);

        buf.push(self.read_escape()?);

        loop {
            let c = self.input.cur();
            let c = match c {
                Some(v) => v,
                None => break,
            };

            if is_name_continue(c) {
                self.last_pos = None;

                self.input.bump();
                buf.push(c)
            } else if self.is_valid_escape()? {
                buf.push(self.read_escape()?);
            } else {
                break;
            }
        }

        Ok(buf.into())
    }

    fn skip_ws(&mut self) -> LexResult<()> {
        loop {
            if self.input.cur().is_none() {
                break;
            }

            if self.input.eat_byte(b' ') || self.input.eat_byte(b'\n') || self.input.eat_byte(b'\t')
            {
                continue;
            }

            break;
        }

        Ok(())
    }

    /// Expects current char to be '/' and next char to be '*'.
    fn skip_block_comment(&mut self) -> LexResult<()> {
        // let start = self.input.cur_pos();

        debug_assert_eq!(self.input.cur(), Some('/'));
        debug_assert_eq!(self.input.peek(), Some('*'));

        self.input.bump();
        self.input.bump();

        // let slice_start = self.input.cur_pos();
        let mut was_star = if self.input.cur() == Some('*') {
            self.input.bump();
            true
        } else {
            false
        };

        while let Some(c) = self.input.cur() {
            if was_star && c == '/' {
                debug_assert_eq!(self.input.cur(), Some('/'));
                self.input.bump(); // '/'

                // let end = self.input.cur_pos();
                return Ok(());
            }

            was_star = c == '*';
            self.input.bump();
        }

        Err(ErrorKind::UnterminatedBlockComment)
    }

    fn skip_line_comment(&mut self, start_skip: usize) -> LexResult<()> {
        for _ in 0..start_skip {
            self.input.bump();
        }

        // let slice_start = self.input.cur_pos();

        while let Some(c) = self.input.cur() {
            self.input.bump();
            match c {
                '\n' | '\r' | '\u{2028}' | '\u{2029}' => {
                    break;
                }
                _ => {
                    // end = self.cur_pos();
                }
            }
        }

        Ok(())
    }
}

pub(crate) fn is_name_start(c: char) -> bool {
    match c {
        'a'..='z' | 'A'..='Z' | '_' | '\x00' => true,

        _ => c as u32 >= 0x80,
    }
}

pub(crate) fn is_name_continue(c: char) -> bool {
    is_name_start(c)
        || match c {
            '0'..='9' | '-' => true,
            _ => false,
        }
}

fn is_newline(c: char) -> bool {
    match c {
        // TODO: Add `\f` of golang
        '\n' | '\r' => true,

        _ => false,
    }
}
