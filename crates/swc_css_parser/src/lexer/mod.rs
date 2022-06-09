use std::{cell::RefCell, char::REPLACEMENT_CHARACTER, rc::Rc};

use swc_atoms::{js_word, JsWord};
use swc_common::{input::Input, BytePos, Span};
use swc_css_ast::{NumberType, Token, TokenAndSpan};

use crate::{
    error::{Error, ErrorKind},
    parser::{input::ParserInput, PResult, ParserConfig},
};

pub(crate) type LexResult<T> = Result<T, ErrorKind>;

#[derive(Debug, Clone)]
pub struct Lexer<I>
where
    I: Input,
{
    input: I,
    cur: Option<char>,
    cur_pos: BytePos,
    start_pos: BytePos,
    /// Used to override last_pos
    last_pos: Option<BytePos>,
    config: ParserConfig,
    buf: Rc<RefCell<String>>,
}

impl<I> Lexer<I>
where
    I: Input,
{
    pub fn new(input: I, config: ParserConfig) -> Self {
        let start_pos = input.last_pos();

        Lexer {
            input,
            cur: None,
            cur_pos: start_pos,
            start_pos,
            last_pos: None,
            config,
            buf: Rc::new(RefCell::new(String::with_capacity(256))),
        }
    }

    fn with_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
    where
        F: for<'any> FnOnce(&mut Lexer<I>, &mut String) -> LexResult<Ret>,
    {
        let b = self.buf.clone();
        let mut buf = b.borrow_mut();

        buf.clear();

        op(self, &mut buf)
    }
}

impl<I: Input> Iterator for Lexer<I> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let token = self.read_token();

        match token {
            Ok(token) => {
                let end = self.last_pos.take().unwrap_or_else(|| self.input.cur_pos());
                let span = Span::new(self.start_pos, end, Default::default());

                let token_and_span = TokenAndSpan { span, token };

                return Some(token_and_span);
            }
            Err(..) => {
                return None;
            }
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
        let token = self.read_token();
        let end = self.last_pos.take().unwrap_or_else(|| self.input.cur_pos());
        let span = Span::new(self.start_pos, end, Default::default());

        token
            .map(|token| TokenAndSpan { span, token })
            .map_err(|kind| Error::new(span, kind))
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
    #[inline]
    fn cur(&mut self) -> Option<char> {
        self.cur
    }

    #[inline]
    fn next(&mut self) -> Option<char> {
        self.input.cur()
    }

    #[inline]
    fn next_next(&mut self) -> Option<char> {
        self.input.peek()
    }

    #[inline]
    fn next_next_next(&mut self) -> Option<char> {
        self.input.peek_ahead()
    }

    #[inline]
    fn consume(&mut self) {
        self.cur = self.input.cur();
        self.cur_pos = self.input.cur_pos();

        if self.cur.is_some() {
            self.input.bump();
        }
    }

    #[inline]
    fn reconsume(&mut self) {
        self.input.reset_to(self.cur_pos);
    }

    fn read_token(&mut self) -> LexResult<Token> {
        self.read_comments()?;
        self.start_pos = self.input.cur_pos();
        self.consume();

        // Consume the next input code point.
        match self.cur() {
            // whitespace
            // Consume as much whitespace as possible. Return a <whitespace-token>.
            Some(c) if is_whitespace(c) => self.with_buf(|l, buf| {
                buf.push(c);

                loop {
                    let c = l.next();

                    match c {
                        Some(c) if is_whitespace(c) => {
                            l.consume();

                            buf.push(c);
                        }
                        _ => {
                            break;
                        }
                    }
                }

                return Ok(Token::WhiteSpace {
                    value: (&**buf).into(),
                });
            }),
            // U+0022 QUOTATION MARK (")
            // Consume a string token and return it.
            Some('"') => self.read_str(None),
            // U+0023 NUMBER SIGN (#)
            Some('#') => {
                let first = self.next();
                let second = self.next_next();

                // If the next input code point is a name code point or the next two input code
                // points are a valid escape, then:
                if (first.is_some() && is_name(first.unwrap()))
                    || self.is_valid_escape(first, second)?
                {
                    // Create a <hash-token>.
                    let mut hash_token = Token::Hash {
                        is_id: Default::default(),
                        value: Default::default(),
                        raw: Default::default(),
                    };

                    // If the next 3 input code points would start an identifier, set the
                    // <hash-token>’s type flag to "id".
                    let third = self.next_next_next();
                    let is_would_start_ident = self.would_start_ident(first, second, third)?;

                    match hash_token {
                        Token::Hash { ref mut is_id, .. } => {
                            *is_id = is_would_start_ident;
                        }
                        _ => {
                            unreachable!();
                        }
                    }

                    // Consume a name, and set the <hash-token>’s value to the returned string.
                    let ident_sequence = self.read_ident_sequence()?;

                    match hash_token {
                        Token::Hash {
                            ref mut value,
                            ref mut raw,
                            ..
                        } => {
                            *value = ident_sequence.0;
                            *raw = ident_sequence.1;
                        }
                        _ => {
                            unreachable!();
                        }
                    }

                    // Return the <hash-token>.
                    return Ok(hash_token);
                }

                Ok(Token::Delim { value: '#' })
            }
            // U+0027 APOSTROPHE (')
            // Consume a string token and return it.
            Some('\'') => self.read_str(None),
            // U+0028 LEFT PARENTHESIS (()
            // Return a <(-token>.
            Some('(') => Ok(tok!("(")),
            // U+0029 RIGHT PARENTHESIS ())
            // Return a <)-token>.
            Some(')') => Ok(tok!(")")),
            // U+002B PLUS SIGN (+)
            Some('+') => {
                // If the input stream starts with a number, reconsume the current input code
                // point, consume a numeric token and return it.
                if self.would_start_number(None, None, None)? {
                    self.reconsume();

                    return self.read_numeric();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                Ok(Token::Delim { value: '+' })
            }
            // U+002C COMMA (,)
            // Return a <comma-token>.
            Some(',') => Ok(tok!(",")),
            // U+002D HYPHEN-MINUS (-)
            Some('-') => {
                // If the input stream starts with a number, reconsume the current input code
                // point, consume a numeric token, and return it.
                if self.would_start_number(None, None, None)? {
                    self.reconsume();

                    return self.read_numeric();
                }
                // Otherwise, if the next 2 input code points are U+002D HYPHEN-MINUS U+003E
                // GREATER-THAN SIGN (->), consume them and return a <CDC-token>.
                else if self.next() == Some('-') && self.next_next() == Some('>') {
                    self.consume();
                    self.consume();

                    return Ok(Token::CDC);
                }
                // Otherwise, if the input stream starts with an identifier, reconsume the current
                // input code point, consume an ident-like token, and return it.
                else if self.would_start_ident(None, None, None)? {
                    self.reconsume();

                    return self.read_ident_like();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                Ok(Token::Delim { value: '-' })
            }
            // U+002E FULL STOP (.)
            Some('.') => {
                // If the input stream starts with a number, reconsume the current input code
                // point, consume a numeric token, and return it.
                if self.would_start_number(None, None, None)? {
                    self.reconsume();

                    return self.read_numeric();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                Ok(Token::Delim { value: '.' })
            }
            // U+003A COLON (:)
            // Return a <colon-token>.
            Some(':') => Ok(tok!(":")),
            // U+003B SEMICOLON (;)
            // Return a <semicolon-token>.
            Some(';') => Ok(tok!(";")),
            // U+003C LESS-THAN SIGN (<)
            Some('<') => {
                // If the next 3 input code points are U+0021 EXCLAMATION MARK U+002D
                // HYPHEN-MINUS U+002D HYPHEN-MINUS (!--), consume them and return a
                // <CDO-token>.
                if self.next() == Some('!')
                    && self.next_next() == Some('-')
                    && self.next_next_next() == Some('-')
                {
                    self.consume(); // !
                    self.consume(); // -
                    self.consume(); // -

                    return Ok(tok!("<!--"));
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                Ok(Token::Delim { value: '<' })
            }
            // U+0040 COMMERCIAL AT (@)
            Some('@') => {
                let first = self.next();
                let second = self.next_next();
                let third = self.next_next_next();

                // If the next 3 input code points would start an identifier, consume a name,
                // create an <at-keyword-token> with its value set to the returned value, and
                // return it.
                if self.would_start_ident(first, second, third)? {
                    let ident_sequence = self.read_ident_sequence()?;

                    return Ok(Token::AtKeyword {
                        value: ident_sequence.0,
                        raw: ident_sequence.1,
                    });
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                Ok(Token::Delim { value: '@' })
            }
            // U+005B LEFT SQUARE BRACKET ([)
            // Return a <[-token>.
            Some('[') => Ok(tok!("[")),
            // U+005C REVERSE SOLIDUS (\)
            Some('\\') => {
                // If the input stream starts with a valid escape, reconsume the current input
                // code point, consume an ident-like token, and return it.
                if self.is_valid_escape(None, None)? {
                    self.reconsume();

                    return self.read_ident_like();
                }

                // Otherwise, this is a parse error. Return a <delim-token> with its value set
                // to the current input code point.
                Ok(Token::Delim { value: '\\' })
            }
            // U+005D RIGHT SQUARE BRACKET (])
            // Return a <]-token>.
            Some(']') => Ok(tok!("]")),
            // U+007B LEFT CURLY BRACKET ({)
            // Return a <{-token>.
            Some('{') => Ok(tok!("{")),
            // U+007D RIGHT CURLY BRACKET (})
            // Return a <}-token>.
            Some('}') => Ok(tok!("}")),
            // digit
            // Reconsume the current input code point, consume a numeric token, and return it.
            Some('0'..='9') => {
                self.reconsume();

                self.read_numeric()
            }
            // name-start code point
            // Reconsume the current input code point, consume an ident-like token, and return it.
            Some(c) if is_name_start(c) => {
                self.reconsume();

                self.read_ident_like()
            }
            // EOF
            // Return an <EOF-token>.
            None => {
                // TODO: Return an <EOF-token>.
                Err(ErrorKind::Eof)
            }
            // anything else
            // Return a <delim-token> with its value set to the current input code point.
            Some(c) => Ok(Token::Delim { value: c }),
        }
    }

    // Consume comments.
    // This section describes how to consume comments from a stream of code points.
    // It returns nothing.
    fn read_comments(&mut self) -> LexResult<()> {
        // If the next two input code point are U+002F SOLIDUS (/) followed by a U+002A
        // ASTERISK (*), consume them and all following code points up to and including
        // the first U+002A ASTERISK (*) followed by a U+002F SOLIDUS (/), or up to an
        // EOF code point. Return to the start of this step.
        // NOTE: We allow to parse line comments under the option.
        if self.next() == Some('/') && self.next_next() == Some('*') {
            while self.next() == Some('/') && self.next_next() == Some('*') {
                self.consume(); // '*'
                self.consume(); // '/'

                loop {
                    self.consume();

                    match self.cur() {
                        Some('*') if self.next() == Some('/') => {
                            self.consume(); // '/'

                            break;
                        }
                        Some(_) => {}
                        None => {
                            return Err(ErrorKind::UnterminatedBlockComment);
                        }
                    }
                }
            }
        } else if self.config.allow_wrong_line_comments
            && self.next() == Some('/')
            && self.next_next() == Some('/')
        {
            while self.next() == Some('/') && self.next_next() == Some('/') {
                self.consume(); // '/'
                self.consume(); // '/'

                loop {
                    self.consume();

                    match self.cur() {
                        Some(c) if is_newline(c) => {
                            break;
                        }
                        Some(_) => {}
                        None => {
                            return Err(ErrorKind::UnterminatedBlockComment);
                        }
                    }
                }
            }
        }

        Ok(())
    }

    // This section describes how to consume a numeric token from a stream of code
    // points. It returns either a <number-token>, <percentage-token>, or
    // <dimension-token>.
    fn read_numeric(&mut self) -> LexResult<Token> {
        // Consume a number and let number be the result.
        let number = self.read_number();

        let next_first = self.next();
        let next_second = self.next_next();
        let next_third = self.next_next_next();

        // If the next 3 input code points would start an identifier, then:
        if self.would_start_ident(next_first, next_second, next_third)? {
            // Create a <dimension-token> with the same value and type flag as number, and a
            // unit set initially to the empty string.
            let mut token = Token::Dimension {
                value: number.0,
                raw_value: number.1.into(),
                unit: "".into(),
                raw_unit: "".into(),
                type_flag: number.2,
            };

            // Consume a name. Set the <dimension-token>’s unit to the returned value.
            let ident_sequence = self.read_ident_sequence()?;

            match token {
                Token::Dimension {
                    ref mut unit,
                    ref mut raw_unit,
                    ..
                } => {
                    *unit = ident_sequence.0;
                    *raw_unit = ident_sequence.1;
                }
                _ => {
                    unreachable!();
                }
            }

            // Return the <dimension-token>.
            return Ok(token);
        }
        // Otherwise, if the next input code point is U+0025 PERCENTAGE SIGN (%), consume it. Create
        // a <percentage-token> with the same value as number, and return it.
        else if next_first == Some('%') {
            self.consume();

            return Ok(Token::Percentage {
                value: number.0,
                raw: number.1.into(),
            });
        }

        // Otherwise, create a <number-token> with the same value and type flag as
        // number, and return it.
        Ok(Token::Number {
            value: number.0,
            raw: number.1.into(),
            type_flag: number.2,
        })
    }

    // This section describes how to consume an ident-like token from a stream of
    // code points. It returns an <ident-token>, <function-token>, <url-token>, or
    // <bad-url-token>.
    fn read_ident_like(&mut self) -> LexResult<Token> {
        // Consume a name, and let string be the result.
        let ident_sequence = self.read_ident_sequence()?;

        // If string’s value is an ASCII case-insensitive match for "url", and the next
        // input code point is U+0028 LEFT PARENTHESIS ((), consume it.
        if ident_sequence.0.to_ascii_lowercase() == js_word!("url") && self.next() == Some('(') {
            self.consume();

            let start_whitespace = self.input.cur_pos();
            let mut whitespaces = String::new();

            // While the next two input code points are whitespace, consume the next input
            // code point.
            while let (Some(next), Some(next_next)) = (self.next(), self.next_next()) {
                if is_whitespace(next) && is_whitespace(next_next) {
                    self.consume();

                    whitespaces.push(next);
                } else {
                    break;
                }
            }

            match self.next() {
                // If the next one or two input code points are U+0022 QUOTATION MARK ("), U+0027
                // APOSTROPHE ('), or whitespace followed by U+0022 QUOTATION MARK (") or U+0027
                // APOSTROPHE ('), then create a <function-token> with its value set to string and
                // return it.
                Some(c)
                    if is_whitespace(c)
                        && (self.next_next() == Some('"') || self.next_next() == Some('\'')) =>
                {
                    // Override last position because we consumed whitespaces, but they
                    // should not be part of token
                    self.last_pos = Some(start_whitespace);

                    return Ok(Token::Function {
                        value: ident_sequence.0,
                        raw: ident_sequence.1,
                    });
                }
                Some('"' | '\'') => {
                    return Ok(Token::Function {
                        value: ident_sequence.0,
                        raw: ident_sequence.1,
                    });
                }
                // Otherwise, consume a url token, and return it.
                _ => {
                    return self.read_url(ident_sequence, whitespaces);
                }
            }
        }
        // Otherwise, if the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
        // Create a <function-token> with its value set to string and return it.
        else if self.next() == Some('(') {
            self.consume();

            return Ok(Token::Function {
                value: ident_sequence.0,
                raw: ident_sequence.1,
            });
        }

        // Otherwise, create an <ident-token> with its value set to string and return
        // it.
        Ok(Token::Ident {
            value: ident_sequence.0,
            raw: ident_sequence.1,
        })
    }

    // This section describes how to consume a string token from a stream of code
    // points. It returns either a <string-token> or <bad-string-token>.
    fn read_str(&mut self, maybe_ending_code_point: Option<char>) -> LexResult<Token> {
        // This algorithm may be called with an ending code point, which denotes the
        // code point that ends the string. If an ending code point is not specified,
        // the current input code point is used.
        let ending_code_point = maybe_ending_code_point.or_else(|| self.cur());

        // Initially create a <string-token> with its value set to the empty string.
        let mut value = String::new();
        let mut raw = String::new();

        raw.push(ending_code_point.unwrap());

        // Repeatedly consume the next input code point from the stream:
        loop {
            self.consume();

            match self.cur() {
                // ending code point
                // Return the <string-token>.
                Some(c) if c == ending_code_point.unwrap() => {
                    raw.push(c);

                    break;
                }

                // EOF
                // This is a parse error. Return the <string-token>.
                None => {
                    return Ok(Token::String {
                        value: value.into(),
                        raw: raw.into(),
                    })
                }

                // Newline
                // This is a parse error. Reconsume the current input code point, create a
                // <bad-string-token>, and return it.
                Some(c) if is_newline(c) => {
                    self.reconsume();

                    return Ok(Token::BadString {
                        value: value.into(),
                        raw: raw.into(),
                    });
                }

                // U+005C REVERSE SOLIDUS (\)
                Some(c) if c == '\\' => {
                    let next = self.next();

                    // If the next input code point is EOF, do nothing.
                    if self.next().is_none() {
                        continue;
                    }
                    // Otherwise, if the next input code point is a newline, consume it.
                    else if self.next().is_some() && is_newline(self.next().unwrap()) {
                        self.consume();

                        raw.push(c);
                        raw.push(next.unwrap());
                    }
                    // Otherwise, (the stream starts with a valid escape) consume an escaped
                    // code point and append the returned code point to
                    // the <string-token>’s value.
                    else if self.is_valid_escape(None, None)? {
                        let escape = self.read_escape()?;

                        value.push(escape.0);
                        raw.push(c);
                        raw.push_str(&escape.1);
                    }
                }

                // Anything else
                // Append the current input code point to the <string-token>’s value.
                Some(c) => {
                    value.push(c);
                    raw.push(c);
                }
            }
        }

        Ok(Token::String {
            value: value.into(),
            raw: raw.into(),
        })
    }

    // This section describes how to consume a url token from a stream of code
    // points. It returns either a <url-token> or a <bad-url-token>.
    fn read_url(&mut self, name: (JsWord, JsWord), mut before: String) -> LexResult<Token> {
        // Initially create a <url-token> with its value set to the empty string.
        let mut value = String::new();
        let mut raw = String::new();

        // Consume as much whitespace as possible.
        while let Some(c) = self.next() {
            if is_whitespace(c) {
                self.consume();

                before.push(c);
            } else {
                break;
            }
        }

        // Repeatedly consume the next input code point from the stream:
        loop {
            self.consume();

            match self.cur() {
                // U+0029 RIGHT PARENTHESIS ())
                // Return the <url-token>.
                Some(')') => {
                    return Ok(Token::Url {
                        name: name.0,
                        raw_name: name.1,
                        value: value.into(),
                        raw_value: raw.into(),
                        before: before.into(),
                        after: "".into(),
                    });
                }

                // EOF
                // This is a parse error. Return the <url-token>.
                None => {
                    return Ok(Token::Url {
                        name: name.0,
                        raw_name: name.1,
                        value: value.into(),
                        raw_value: raw.into(),
                        before: before.into(),
                        after: "".into(),
                    });
                }

                // whitespace
                Some(c) if is_whitespace(c) => {
                    let mut whitespaces = String::new();

                    whitespaces.push(c);

                    // Consume as much whitespace as possible.
                    while let Some(c) = self.next() {
                        if is_whitespace(c) {
                            self.consume();

                            whitespaces.push(c);
                        } else {
                            break;
                        }
                    }

                    // if the next input code point is U+0029 RIGHT PARENTHESIS ()) or EOF, consume
                    // it and return the <url-token> (if EOF was encountered, this is a parse
                    // error);
                    match self.next() {
                        Some(')') => {
                            self.consume();

                            return Ok(Token::Url {
                                name: name.0,
                                raw_name: name.1,
                                value: value.into(),
                                raw_value: raw.into(),
                                before: before.into(),
                                after: whitespaces.into(),
                            });
                        }
                        None => {
                            return Ok(Token::Url {
                                name: name.0,
                                raw_name: name.1,
                                value: value.into(),
                                raw_value: raw.into(),
                                before: before.into(),
                                after: whitespaces.into(),
                            });
                        }
                        _ => {}
                    }

                    value.push_str(&whitespaces);
                    raw.push_str(&whitespaces);

                    // otherwise, consume the remnants of a bad url, create a <bad-url-token>, and
                    // return it.
                    let remnants = self.read_bad_url_remnants()?;

                    value.push_str(&remnants.0);
                    raw.push_str(&remnants.1);

                    return Ok(Token::BadUrl {
                        name: name.0,
                        raw_name: name.1,
                        value: (before.to_owned() + &raw.to_owned()).into(),
                        raw_value: (before.to_owned() + &raw.to_owned()).into(),
                    });
                }

                // U+0022 QUOTATION MARK (")
                // U+0027 APOSTROPHE (')
                // U+0028 LEFT PARENTHESIS (()
                // non-printable code point
                // This is a parse error. Consume the remnants of a bad url, create a
                // <bad-url-token>, and return it.
                Some(c) if c == '"' || c == '\'' || c == '(' || is_non_printable(c) => {
                    let remnants = self.read_bad_url_remnants()?;

                    value.push(c);
                    value.push_str(&remnants.0);
                    raw.push(c);
                    raw.push_str(&remnants.1);

                    return Ok(Token::BadUrl {
                        name: name.0,
                        raw_name: name.1,
                        value: (before.to_owned() + &raw.to_owned()).into(),
                        raw_value: (before.to_owned() + &raw.to_owned()).into(),
                    });
                }

                // U+005C REVERSE SOLIDUS (\)
                Some(c) if c == '\\' => {
                    // If the stream starts with a valid escape, consume an escaped code point and
                    // append the returned code point to the <url-token>’s value.
                    if self.is_valid_escape(None, None)? {
                        let escaped = self.read_escape()?;

                        value.push(escaped.0);
                        raw.push(c);
                        raw.push_str(&escaped.1);
                    }
                    // Otherwise, this is a parse error. Consume the remnants of a bad url, create a
                    // <bad-url-token>, and return it.
                    else {
                        let remnants = self.read_bad_url_remnants()?;

                        value.push(c);
                        value.push_str(&remnants.0);
                        raw.push(c);
                        raw.push_str(&remnants.1);

                        return Ok(Token::BadUrl {
                            name: name.0,
                            raw_name: name.1,
                            value: (before.to_owned() + &raw.to_owned()).into(),
                            raw_value: (before.to_owned() + &raw.to_owned()).into(),
                        });
                    }
                }

                // anything else
                // Append the current input code point to the <url-token>’s value.
                Some(c) => {
                    value.push(c);
                    raw.push(c);
                }
            }
        }
    }

    // Consume an escaped code point
    // This section describes how to consume an escaped code point. It assumes that
    // the U+005C REVERSE SOLIDUS (\) has already been consumed and that the next
    // input code point has already been verified to be part of a valid escape. It
    // will return a code point.
    fn read_escape(&mut self) -> LexResult<(char, String)> {
        let mut raw = String::new();

        // Consume the next input code point.
        self.consume();

        match self.cur() {
            // hex digit
            Some(c) if is_hex_digit(c) => {
                let mut hex = c.to_digit(16).unwrap();

                raw.push(c);

                // Consume as many hex digits as possible, but no more than 5.
                // Note that this means 1-6 hex digits have been consumed in total.
                for _ in 0..5 {
                    let next = self.next();
                    let digit = match next.and_then(|c| c.to_digit(16)) {
                        Some(v) => v,
                        None => break,
                    };

                    self.consume();

                    raw.push(next.unwrap());
                    hex = hex * 16 + digit;
                }

                // If the next input code point is whitespace, consume it as well.
                let next = self.next();

                if let Some(next) = next {
                    if is_whitespace(next) {
                        self.consume();

                        raw.push(next);
                    }
                }

                // Interpret the hex digits as a hexadecimal number. If this number is zero, or
                // is for a surrogate, or is greater than the maximum allowed code point, return
                // U+FFFD REPLACEMENT CHARACTER (�).
                let hex = match hex {
                    // If this number is zero
                    0 => REPLACEMENT_CHARACTER,
                    // or is for a surrogate
                    55296..=57343 => REPLACEMENT_CHARACTER,
                    // or is greater than the maximum allowed code point
                    1114112.. => REPLACEMENT_CHARACTER,
                    _ => char::from_u32(hex).unwrap_or(REPLACEMENT_CHARACTER),
                };

                // Otherwise, return the code point with that value.
                Ok((hex, raw))
            }
            // EOF
            // This is a parse error. Return U+FFFD REPLACEMENT CHARACTER (�).
            None => {
                let value = REPLACEMENT_CHARACTER;

                raw.push(value);

                Ok((value, raw))
            }
            // anything else
            // Return the current input code point.
            Some(c) => {
                raw.push(c);

                Ok((c, raw))
            }
        }
    }

    // Check if two code points are a valid escape
    // This section describes how to check if two code points are a valid escape.
    // The algorithm described here can be called explicitly with two code points,
    // or can be called with the input stream itself. In the latter case, the two
    // code points in question are the current input code point and the next input
    // code point, in that order.
    fn is_valid_escape(
        &mut self,
        maybe_first: Option<char>,
        maybe_second: Option<char>,
    ) -> LexResult<bool> {
        // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
        if maybe_first.or_else(|| self.cur()) != Some('\\') {
            return Ok(false);
        }

        match maybe_second.or_else(|| self.next()) {
            // Otherwise, if the second code point is a newline, return false.
            Some(second) => Ok(!is_newline(second)),
            // Otherwise, return true.
            None => Ok(false),
        }
    }

    // Check if three code points would start an identifier
    // This section describes how to check if three code points would start an
    // identifier. The algorithm described here can be called explicitly with three
    // code points, or can be called with the input stream itself. In the latter
    // case, the three code points in question are the current input code point and
    // the next two input code points, in that order.
    fn would_start_ident(
        &mut self,
        maybe_first: Option<char>,
        maybe_second: Option<char>,
        maybe_third: Option<char>,
    ) -> LexResult<bool> {
        // Look at the first code point:
        let first = maybe_first.or_else(|| self.cur());

        match first {
            // U+002D HYPHEN-MINUS
            Some('-') => {
                let second = maybe_second.or_else(|| self.next());

                match second {
                    // If the second code point is a name-start code point
                    // return true.
                    Some(c) if is_name_start(c) => Ok(true),
                    // or a U+002D HYPHEN-MINUS,
                    // return true.
                    Some('-') => Ok(true),
                    // or the second and third code points are a valid escape
                    // return true.
                    Some(_) => {
                        let third = maybe_third.or_else(|| self.next_next());

                        self.is_valid_escape(second, third)
                    }
                    // Otherwise, return false.
                    _ => Ok(false),
                }
            }
            // name-start code point
            // Return true.
            Some(c) if is_name_start(c) => Ok(true),
            // U+005C REVERSE SOLIDUS (\)
            // If the first and second code points are a valid escape, return true. Otherwise,
            // return false.
            Some('\\') => {
                let second = maybe_second.or_else(|| self.next());

                Ok(self.is_valid_escape(first, second)?)
            }
            _ => Ok(false),
        }
    }

    // Check if three code points would start a number
    // This section describes how to check if three code points would start a
    // number. The algorithm described here can be called explicitly with three code
    // points, or can be called with the input stream itself. In the latter case,
    // the three code points in question are the current input code point and the
    // next two input code points, in that order.
    #[allow(clippy::needless_return)]
    fn would_start_number(
        &mut self,
        maybe_first: Option<char>,
        maybe_second: Option<char>,
        maybe_third: Option<char>,
    ) -> LexResult<bool> {
        // Look at the first code point:
        let first = maybe_first.or_else(|| self.cur());

        match first {
            // U+002B PLUS SIGN (+)
            // U+002D HYPHEN-MINUS (-)
            Some('+') | Some('-') => {
                match maybe_second.or_else(|| self.next()) {
                    // If the second code point is a digit, return true.
                    Some(second) if second.is_ascii_digit() => return Ok(true),
                    // Otherwise, if the second code point is a U+002E FULL STOP (.) and the
                    // third code point is a digit, return true.
                    Some('.') => {
                        if let Some(third) = maybe_third.or_else(|| self.next_next()) {
                            if third.is_ascii_digit() {
                                return Ok(true);
                            }
                        }

                        return Ok(false);
                    }
                    // Otherwise, return false.
                    _ => return Ok(false),
                };
            }
            // U+002E FULL STOP (.)
            Some('.') => {
                // If the second code point is a digit, return true.
                if let Some(second) = self.next() {
                    if second.is_ascii_digit() {
                        return Ok(true);
                    }
                }

                // Otherwise, return false.
                Ok(false)
            }
            // digit
            // Return true.
            Some(first) if first.is_ascii_digit() => Ok(true),
            // anything else
            // Return false.
            _ => Ok(false),
        }
    }

    // Consume an ident sequence
    // This section describes how to consume an ident sequence from a stream of code
    // points. It returns a string containing the largest name that can be formed
    // from adjacent code points in the stream, starting from the first.
    fn read_ident_sequence(&mut self) -> LexResult<(JsWord, JsWord)> {
        // Let result initially be an empty string.
        let mut raw = String::new();
        let mut value = String::new();

        // Repeatedly consume the next input code point from the stream:
        loop {
            self.consume();

            match self.cur() {
                // name code point
                // Append the code point to result.
                Some(c) if is_name(c) => {
                    value.push(c);
                    raw.push(c);
                }
                // the stream starts with a valid escape
                // Consume an escaped code point. Append the returned code point to result.
                Some(c) if self.is_valid_escape(None, None)? => {
                    let escaped = self.read_escape()?;

                    value.push(escaped.0);
                    raw.push(c);
                    raw.push_str(&escaped.1);
                }
                // anything else
                // Reconsume the current input code point. Return result.
                _ => {
                    self.reconsume();

                    break;
                }
            }
        }

        Ok((value.into(), raw.into()))
    }

    // This section describes how to consume a number from a stream of code points.
    // It returns a numeric value, and a type which is either "integer" or "number".
    fn read_number(&mut self) -> (f64, String, NumberType) {
        // Initially set type to "integer". Let repr be the empty string.
        let mut repr = String::new();
        let mut type_flag = NumberType::Integer;

        // If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS
        // (-), consume it and append it to repr.
        let next = self.next();

        if next == Some('+') || next == Some('-') {
            self.consume();

            repr.push(next.unwrap());
        }

        // While the next input code point is a digit, consume it and append it to repr.
        while let Some(c) = self.next() {
            if c.is_ascii_digit() {
                self.consume();

                repr.push(c);
            } else {
                break;
            }
        }

        // If the next 2 input code points are U+002E FULL STOP (.) followed by a digit,
        // then:
        let next = self.next();

        if next == Some('.') {
            if let Some(n) = self.next_next() {
                if n.is_ascii_digit() {
                    // Consume them.
                    self.consume();
                    self.consume();

                    // Append them to repr.
                    repr.push(next.unwrap());
                    repr.push(n);

                    // Set type to "number".
                    type_flag = NumberType::Number;

                    // While the next input code point is a digit, consume it and append it to
                    // repr.
                    while let Some(c) = self.next() {
                        if c.is_ascii_digit() {
                            self.consume();

                            repr.push(c);
                        } else {
                            break;
                        }
                    }
                }
            }
        }

        // If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E) or
        // U+0065 LATIN SMALL LETTER E (e), optionally followed by U+002D HYPHEN-MINUS
        // (-) or U+002B PLUS SIGN (+), followed by a digit, then:
        let next = self.next();

        if next == Some('E') || next == Some('e') {
            let next_next = self.next_next();
            let next_next_next = self.next_next_next();

            if (next_next == Some('-')
                || next_next == Some('+')
                    && next_next_next.is_some()
                    && next_next_next.unwrap().is_ascii_digit())
                || next_next.is_some() && next_next.unwrap().is_ascii_digit()
            {
                // Consume them.
                self.consume();
                self.consume();

                // Append them to repr.
                repr.push(next.unwrap());
                repr.push(next_next.unwrap());

                // Set type to "number".
                type_flag = NumberType::Number;

                // While the next input code point is a digit, consume it and append it
                // to repr.
                while let Some(c) = self.next() {
                    if c.is_ascii_digit() {
                        self.consume();

                        repr.push(c);
                    } else {
                        break;
                    }
                }
            }
        }

        // Convert repr to a number, and set the value to the returned value.
        let parsed = lexical::parse(&repr.as_bytes()).unwrap_or_else(|err| {
            unreachable!("failed to parse `{}` using lexical: {:?}", repr, err)
        });

        // Return value and type.
        (parsed, repr, type_flag)
    }

    // Consume the remnants of a bad url
    // This section describes how to consume the remnants of a bad url from a stream
    // of code points, "cleaning up" after the tokenizer realizes that it’s in the
    // middle of a <bad-url-token> rather than a <url-token>. It returns nothing;
    // its sole use is to consume enough of the input stream to reach a recovery
    // point where normal tokenizing can resume. But for recovery purpose we return
    // bad URL remnants.
    fn read_bad_url_remnants(&mut self) -> LexResult<(String, String)> {
        let mut value = String::new();
        let mut raw = String::new();

        // Repeatedly consume the next input code point from the stream:
        loop {
            self.consume();

            match self.cur() {
                // U+0029 RIGHT PARENTHESIS ())
                // EOF
                // Return.
                Some(')') => {
                    break;
                }
                None => {
                    break;
                }
                // the input stream starts with a valid escape
                Some(c) if self.is_valid_escape(None, None) == Ok(true) => {
                    // Consume an escaped code point. This allows an escaped right parenthesis
                    // ("\)") to be encountered without ending the <bad-url-token>.
                    let escaped = self.read_escape()?;

                    value.push(escaped.0);
                    raw.push(c);
                    raw.push_str(&escaped.1);
                }
                // anything else
                // Do nothing.
                Some(c) => {
                    value.push(c);
                    raw.push(c);
                }
            }
        }

        Ok((value, raw))
    }
}

#[inline(always)]
fn is_digit(c: char) -> bool {
    c.is_ascii_digit()
}

#[inline(always)]
fn is_hex_digit(c: char) -> bool {
    match c {
        c if is_digit(c) => true,
        'A'..='F' => true,
        'a'..='f' => true,
        _ => false,
    }
}

#[inline(always)]
fn is_uppercase_letter(c: char) -> bool {
    matches!(c, 'A'..='Z')
}

#[inline(always)]
fn is_lowercase_letter(c: char) -> bool {
    matches!(c, 'a'..='z')
}

#[inline(always)]
fn is_letter(c: char) -> bool {
    is_uppercase_letter(c) || is_lowercase_letter(c)
}

#[inline(always)]
fn is_non_ascii(c: char) -> bool {
    c as u32 >= 0x80
}

#[inline(always)]
fn is_name_start(c: char) -> bool {
    matches!(c, c if is_letter(c) || is_non_ascii(c) || c == '_' || c == '\x00')
}

#[inline(always)]
fn is_name(c: char) -> bool {
    is_name_start(c) || matches!(c, c if c.is_ascii_digit() || c == '-')
}

#[inline(always)]
fn is_non_printable(c: char) -> bool {
    matches!(c, '\x00'..='\x08' | '\x0B' | '\x0E'..='\x1F' | '\x7F')
}

#[inline(always)]
fn is_newline(c: char) -> bool {
    matches!(c, '\n' | '\r' | '\x0C')
}

#[inline(always)]
fn is_whitespace(c: char) -> bool {
    matches!(c, c if c == ' ' || c == '\t' || is_newline(c))
}
