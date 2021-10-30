use crate::{
    error::{Error, ErrorKind},
    parser::{input::ParserInput, PResult, ParserConfig},
};
use swc_atoms::{js_word, JsWord};
use swc_common::{input::Input, BytePos, Span};
use swc_css_ast::{Token, TokenAndSpan};

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
    config: ParserConfig,
}

impl<I> Lexer<I>
where
    I: Input,
{
    pub fn new(input: I, config: ParserConfig) -> Self {
        let start_pos = input.last_pos();
        Lexer {
            input,
            start_pos,
            last_pos: None,
            config,
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
    // #[inline]
    // fn current_input_code_point(&mut self) -> Option<char> {
    //     self.input.clone().nth(-1).map(|i| i.1)
    // }
    
    fn read_token(&mut self) -> LexResult<Token> {
        // Consume comments.
        // If the next two input code point are U+002F SOLIDUS (/) followed by a U+002A
        // ASTERISK (*), consume them and all following code points up to and including
        // the first U+002A ASTERISK (*) followed by a U+002F SOLIDUS (/), or up to an
        // EOF code point. Return to the start of this step.
        if self.input.cur() == Some('/') {
            if self.input.peek() == Some('*') {
                self.skip_block_comment()?;
                self.skip_ws()?;
                self.start_pos = self.input.cur_pos();

                return self.read_token();
            } else if self.config.allow_wrong_line_comments && self.input.peek() == Some('/') {
                self.skip_line_comment()?;
                self.start_pos = self.input.cur_pos();

                return self.read_token();
            }
        }

        let start = self.input.cur_pos();
        let next = self.input.cur();

        // Consume the next input code point.
        match next {
            // whitespace
            // Consume as much whitespace as possible. Return a <whitespace-token>.
            Some(c) if is_whitespace(c) => {
                let mut value = String::new();

                loop {
                    let c = self.input.cur();

                    match c {
                        Some(c) if is_whitespace(c) => {
                            self.input.bump();

                            value.push(c);
                        }
                        _ => {
                            break;
                        }
                    }
                }

                if self.config.allow_wrong_line_comments {
                    if self.input.is_byte(b'/') && self.input.peek() == Some('/') {
                        self.skip_line_comment()?;
                        self.start_pos = self.input.cur_pos();
                    }
                }

                return Ok(Token::WhiteSpace {
                    value: value.into(),
                });
            }
            // U+0022 QUOTATION MARK (")
            // Consume a string token and return it.
            Some(c) if c == '"' => {
                return self.read_str(None);
            }
            // U+0023 NUMBER SIGN (#)
            // If the next input code point is a name code point or the next two input code points
            // are a valid escape, then:
            Some(c) if c == '#' => {
                // TODO: If the next input code point is a name code point or the next two input
                // code points are a valid escape, then:
                self.input.bump();

                let first = self.input.cur();
                let second = self.input.peek();

                if is_name_continue(first.unwrap()) || self.is_valid_escape(first, second)? {
                    let third = self.input.peek_ahead();
                    let is_id = self.would_start_ident(first, second, third)?;
                    let name = self.read_name()?;

                    return Ok(Token::Hash {
                        is_id,
                        value: name.0,
                        raw: name.1,
                    });
                }

                return Ok(Token::Delim { value: c });
            }
            // U+0027 APOSTROPHE (')
            // Consume a string token and return it.
            Some(c) if c == '\'' => {
                return self.read_str(None);
            }
            // U+0028 LEFT PARENTHESIS (()
            // Return a <(-token>.
            Some(c) if c == '(' => {
                self.input.bump();

                return Ok(tok!("("));
            }
            // U+0029 RIGHT PARENTHESIS ())
            // Return a <)-token>.
            Some(c) if c == ')' => {
                self.input.bump();

                return Ok(tok!(")"));
            }
            // U+002B PLUS SIGN (+)
            Some(c) if c == '+' => {
                self.input.bump();

                // If the input stream starts with a number, reconsume the current input code
                // point, consume a numeric token and return it.
                if self.would_start_number(None, None, None)? {
                    self.input.reset_to(start);

                    return self.read_numeric();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                return Ok(Token::Delim { value: c });
            }
            // U+002C COMMA (,)
            // Return a <comma-token>.
            Some(c) if c == ',' => {
                self.input.bump();

                return Ok(tok!(","));
            }
            // U+002D HYPHEN-MINUS (-)
            Some(c) if c == '-' => {
                self.input.bump();

                // If the input stream starts with a number, reconsume the current input code
                // point, consume a numeric token, and return it.
                if self.would_start_number(None, None, None)? {
                    self.input.reset_to(start);

                    return self.read_numeric();
                }
                // Otherwise, if the next 2 input code points are U+002D HYPHEN-MINUS U+003E
                // GREATER-THAN SIGN (->), consume them and return a <CDC-token>.
                else if self.input.cur() == Some('-') && self.input.peek() == Some('>') {
                    self.input.bump();
                    self.input.bump();

                    return Ok(Token::CDC);
                }
                // Otherwise, if the input stream starts with an identifier, reconsume the current
                // input code point, consume an ident-like token, and return it.
                else if self.would_start_ident(None, None, None)? {
                    self.input.reset_to(start);

                    return self
                        .read_name()
                        .map(|(value, raw)| Token::Ident { value, raw });
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                return Ok(Token::Delim { value: c });
            }
            // U+002E FULL STOP (.)
            Some(c) if c == '.' => {
                self.input.bump();

                // If the input stream starts with a number, reconsume the current input code
                // point, consume a numeric token, and return it.
                if self.would_start_number(None, None, None)? {
                    self.input.reset_to(start);

                    return self.read_numeric();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                return Ok(Token::Delim { value: c });
            }
            // U+003A COLON (:)
            // Return a <colon-token>.
            Some(c) if c == ':' => {
                self.input.bump();

                return Ok(tok!(":"));
            }
            // U+003B SEMICOLON (;)
            // Return a <semicolon-token>.
            Some(c) if c == ';' => {
                self.input.bump();

                return Ok(tok!(";"));
            }
            // U+003C LESS-THAN SIGN (<)
            Some(c) if c == '<' => {
                self.input.bump();

                // If the next 3 input code points are U+0021 EXCLAMATION MARK U+002D
                // HYPHEN-MINUS U+002D HYPHEN-MINUS (!--), consume them and return a
                // <CDO-token>.
                if self.input.is_byte(b'!')
                    && self.input.peek() == Some('-')
                    && self.input.peek_ahead() == Some('-')
                {
                    self.input.bump(); // !
                    self.input.bump(); // -
                    self.input.bump(); // -

                    return Ok(tok!("<!--"));
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                return Ok(Token::Delim { value: c });
            }
            // U+0040 COMMERCIAL AT (@)
            Some(c) if c == '@' => {
                self.input.bump();

                let first = self.input.cur();
                let second = self.input.peek();
                let third = self.input.peek_ahead();

                // If the next 3 input code points would start an identifier, consume a name,
                // create an <at-keyword-token> with its value set to the returned value, and
                // return it.
                if self.would_start_ident(first, second, third)? {
                    return self.read_at_keyword();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                return Ok(Token::Delim { value: c });
            }
            // U+005B LEFT SQUARE BRACKET ([)
            // Return a <[-token>.
            Some(c) if c == '[' => {
                self.input.bump();

                return Ok(tok!("["));
            }
            // U+005C REVERSE SOLIDUS (\)
            Some(c) if c == '\\' => {
                // If the input stream starts with a valid escape, reconsume the current input
                // code point, consume an ident-like token, and return it.
                if self.is_valid_escape(None, None)? {
                    return self.read_ident_like();
                }

                // Otherwise, this is a parse error. Return a <delim-token> with its value set
                // to the current input code point.
                self.input.bump();

                return Ok(Token::Delim { value: c });
            }
            // U+005D RIGHT SQUARE BRACKET (])
            // Return a <]-token>.
            Some(c) if c == ']' => {
                self.input.bump();

                return Ok(tok!("]"));
            }
            // U+007B LEFT CURLY BRACKET ({)
            // Return a <{-token>.
            Some(c) if c == '{' => {
                self.input.bump();

                return Ok(tok!("{"));
            }
            // U+007D RIGHT CURLY BRACKET (})
            // Return a <}-token>.
            Some(c) if c == '}' => {
                self.input.bump();

                return Ok(tok!("}"));
            }
            // digit
            // Reconsume the current input code point, consume a numeric token, and return it.
            Some('0'..='9') => {
                self.input.bump();
                self.input.reset_to(start);

                return self.read_numeric();
            }
            // name-start code point
            // Reconsume the current input code point, consume an ident-like token, and return it.
            Some(c) if is_name_start(c) => {
                self.input.bump();
                self.input.reset_to(start);

                return self.read_ident_like();
            }
            // EOF
            // Return an <EOF-token>.
            None => {
                // TODO: Return an <EOF-token>.
                return Err(ErrorKind::Eof);
            }
            // anything else
            // Return a <delim-token> with its value set to the current input code point.
            Some(c) => {
                self.input.bump();

                return Ok(Token::Delim { value: c });
            }
        }
    }

    fn would_start_number(
        &mut self,
        maybe_first: Option<char>,
        maybe_second: Option<char>,
        maybe_third: Option<char>,
    ) -> LexResult<bool> {
        let first = maybe_first.or(self.input.cur());

        if first.is_none() {
            return Ok(false);
        }

        match first {
            Some('+') | Some('-') => {
                if let Some(second) = maybe_second.or(self.input.peek()) {
                    return match second {
                        second if second.is_digit(10) => Ok(true),
                        '.' => {
                            if let Some(third) = maybe_third.or(self.input.peek_ahead()) {
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

    fn read_digits(&mut self) -> JsWord {
        let mut digits = String::new();

        loop {
            let code = self.input.cur().unwrap();

            if code.is_digit(10) {
                self.input.bump();
                digits.push(code);
            } else {
                break;
            }
        }

        digits.into()
    }

    fn read_number(&mut self) -> (f64, String) {
        let mut repr = String::new();

        if let Some(c) = self.input.cur() {
            if c == '+' || c == '-' {
                self.input.bump();
                repr.push(c);
            }
        }

        repr.push_str(&self.read_digits());

        if let Some(c) = self.input.cur() {
            if c == '.' {
                if let Some(n) = self.input.peek() {
                    if n.is_digit(10) {
                        self.input.bump();
                        self.input.bump();
                        repr.push(c);
                        repr.push(n);
                        repr.push_str(&self.read_digits());
                    }
                }
            }
        }

        if let Some(c) = self.input.cur() {
            if c == 'E' || c == 'e' {
                if let Some(n) = self.input.peek() {
                    if n == '-' || n == '+' {
                        if let Some(nn) = self.input.peek_ahead() {
                            if nn.is_digit(10) {
                                self.input.bump();
                                self.input.bump();
                                repr.push(c);
                                repr.push(n);
                                repr.push_str(&self.read_digits());
                            }
                        }
                    } else if n.is_digit(10) {
                        self.input.bump();
                        self.input.bump();
                        repr.push(c);
                        repr.push(n);
                        repr.push_str(&self.read_digits());
                    }
                }
            }
        }

        let parsed = lexical::parse(&repr.as_bytes()).unwrap_or_else(|err| {
            unreachable!("failed to parse `{}` using lexical: {:?}", repr, err)
        });

        (parsed, repr)
    }

    fn read_numeric(&mut self) -> LexResult<Token> {
        let number = self.read_number();

        let next_first = self.input.cur();
        let next_second = self.input.peek();
        let next_third = self.input.peek_ahead();

        if self.would_start_ident(next_first, next_second, next_third)? {
            let name = self.read_name()?;

            return Ok(Token::Dimension {
                value: number.0,
                raw_value: number.1.into(),
                unit: name.0,
                raw_unit: name.1,
            });
        } else if let Some(c) = next_first {
            if c == '%' {
                self.input.bump();

                return Ok(Token::Percent {
                    value: number.0,
                    raw: number.1.into(),
                });
            }
        }

        Ok(Token::Num {
            value: number.0,
            raw: number.1.into(),
        })
    }

    fn is_valid_escape(
        &mut self,
        maybe_first: Option<char>,
        maybe_second: Option<char>,
    ) -> LexResult<bool> {
        let first = maybe_first.or(self.input.cur());

        if first != Some('\\') {
            return Ok(false);
        }

        let second = maybe_second.or(self.input.peek());

        match second {
            Some(second) => Ok(!is_newline(second)),
            None => Ok(false),
        }
    }

    fn read_ident_like(&mut self) -> LexResult<Token> {
        let name = self.read_name()?;

        if name.0.to_ascii_lowercase() == js_word!("url") && self.input.is_byte(b'(') {
            self.input.bump();

            let start_whitespace = self.input.cur_pos();

            self.skip_ws()?;

            // TODO: avoid reset
            match self.input.cur() {
                Some('"' | '\'') => {
                    self.input.reset_to(start_whitespace);

                    return Ok(Token::Function {
                        value: name.0,
                        raw: name.1,
                    });
                }
                _ => {
                    self.input.reset_to(start_whitespace);

                    return self.read_url();
                }
            }
        }

        if self.input.is_byte(b'(') {
            self.input.bump();
            self.last_pos = Some(self.input.cur_pos());

            return Ok(Token::Function {
                value: name.0,
                raw: name.1,
            });
        }

        Ok(Token::Ident {
            value: name.0,
            raw: name.1,
        })
    }

    fn read_str(&mut self, maybe_ending_code_point: Option<char>) -> LexResult<Token> {
        // TODO: This algorithm may be called with an ending code point, which denotes the code point that ends the string. If an ending code point is not specified, the current input code point is used.
        let ending_code_point = maybe_ending_code_point.or(self.input.cur());
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
                        else if self.is_valid_escape(None, None)? {
                            raw.push(c);

                            self.input.bump();

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
                    return Ok(Token::Str {
                        value: value.into(),
                        raw: raw.into(),
                    })
                }
            }
        }

        Ok(Token::Str {
            value: value.into(),
            raw: raw.into(),
        })
    }

    fn read_bad_url_remnants(&mut self) -> LexResult<(String, String)> {
        let mut value = String::new();
        let mut raw = String::new();

        loop {
            match self.input.cur() {
                Some(c) if c == ')' => {
                    self.input.bump();

                    break;
                }
                Some(c) => {
                    if self.is_valid_escape(None, None).unwrap() {
                        raw.push(c);

                        self.input.bump();

                        let escaped = self.read_escape()?;

                        value.push(escaped.0);
                        raw.push_str(&escaped.1);
                    } else {
                        value.push(c);
                        raw.push(c);

                        self.input.bump();
                    }
                }
                None => {
                    break;
                }
            }
        }

        return Ok((value, raw));
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
                    return Ok(Token::Url {
                        value: value.into(),
                        raw: raw.into(),
                    });
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
                            return Ok(Token::Url {
                                value: value.into(),
                                raw: raw.into(),
                            });
                        }
                        _ => {}
                    }

                    let remnants = self.read_bad_url_remnants()?;

                    value.push_str(&remnants.0);
                    raw.push_str(&remnants.1);

                    return Ok(Token::BadUrl {
                        value: value.into(),
                        raw: raw.into(),
                    });
                }

                Some(c) if c == '"' || c == '\'' || c == '(' || is_non_printable(c) => {
                    let remnants = self.read_bad_url_remnants()?;

                    value.push_str(&remnants.0);
                    raw.push_str(&remnants.1);

                    return Ok(Token::BadUrl {
                        value: value.into(),
                        raw: raw.into(),
                    });
                }

                Some(c) if c == '\\' => {
                    if self.is_valid_escape(None, None)? {
                        raw.push(c);

                        self.input.bump();

                        let escaped = self.read_escape()?;

                        value.push(escaped.0);
                        raw.push_str(&escaped.1);
                    } else {
                        let remnants = self.read_bad_url_remnants()?;

                        value.push_str(&remnants.0);
                        raw.push_str(&remnants.1);

                        return Ok(Token::BadUrl {
                            value: value.into(),
                            raw: raw.into(),
                        });
                    }
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
        let c = self.input.cur();
        let c = match c {
            Some(v) => v,
            None => return Err(ErrorKind::InvalidEscape),
        };

        let mut raw = String::new();

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

    fn would_start_ident(
        &mut self,
        maybe_first: Option<char>,
        maybe_second: Option<char>,
        maybe_third: Option<char>,
    ) -> LexResult<bool> {
        if let Some(first) = maybe_first.or(self.input.cur()) {
            if first == '-' {
                if let Some(second) = maybe_second.or(self.input.peek()) {
                    if is_name_start(second) || second == '-' {
                        return Ok(true);
                    }

                    match second {
                        '\\' => match maybe_third.or(self.input.peek_ahead()) {
                            Some(c2) => return Ok(!is_newline(c2)),
                            None => return Ok(false),
                        },

                        _ => {}
                    }
                }
            } else if is_name_start(first) {
                return Ok(true);
            } else if first == '\\' {
                let second = self.input.peek();

                return Ok(self.is_valid_escape(Some(first), second)?);
            } else {
                return Ok(false);
            }
        }

        Ok(false)
    }

    fn read_name(&mut self) -> LexResult<(JsWord, JsWord)> {
        let mut raw = String::new();
        let mut value = String::new();

        loop {
            let c = self.input.cur();

            match c {
                Some(c) => {
                    if is_name_continue(c) {
                        self.last_pos = None;
                        self.input.bump();

                        value.push(c);
                        raw.push(c);
                    } else if self.is_valid_escape(None, None)? {
                        raw.push(c);

                        self.input.bump();

                        let escaped = self.read_escape()?;

                        value.push(escaped.0);
                        raw.push_str(&escaped.1);
                    } else {
                        break;
                    }
                }
                None => {
                    break;
                }
            }
        }

        Ok((value.into(), raw.into()))
    }

    fn skip_ws(&mut self) -> LexResult<()> {
        loop {
            let c = self.input.cur();

            match c {
                Some(c) if is_whitespace(c) => {
                    self.input.bump();
                }
                _ => {
                    break;
                }
            }
        }

        if self.config.allow_wrong_line_comments {
            if self.input.is_byte(b'/') && self.input.peek() == Some('/') {
                self.skip_line_comment()?;
                self.start_pos = self.input.cur_pos();

                return Ok(());
            }
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

    fn skip_line_comment(&mut self) -> LexResult<()> {
        debug_assert_eq!(self.input.cur(), Some('/'));
        debug_assert_eq!(self.input.peek(), Some('/'));

        self.input.bump();
        self.input.bump();

        debug_assert!(
            self.config.allow_wrong_line_comments,
            "Line comments are wrong and should be lexed only if it's explicitly requested"
        );

        while let Some(c) = self.input.cur() {
            if is_newline(c) {
                break;
            }

            self.input.bump();
        }

        Ok(())
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
