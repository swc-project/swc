use std::{borrow::Cow, cell::RefCell, char::REPLACEMENT_CHARACTER, rc::Rc};

use swc_atoms::{Atom, AtomStoreCell, JsWord};
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    input::Input,
    util::take::Take,
    BytePos, Span,
};
use swc_css_ast::{
    matches_eq_ignore_ascii_case, DimensionToken, NumberType, Token, TokenAndSpan, UrlKeyValue,
};

use crate::{
    error::{Error, ErrorKind},
    parser::{input::ParserInput, ParserConfig},
};

pub(crate) type LexResult<T> = Result<T, ErrorKind>;

#[derive(Clone)]
pub struct Lexer<'a, I>
where
    I: Input,
{
    comments: Option<&'a dyn Comments>,
    pending_leading_comments: Vec<Comment>,
    input: I,
    cur: Option<char>,
    cur_pos: BytePos,
    start_pos: BytePos,
    /// Used to override last_pos
    override_pos: Option<BytePos>,
    config: ParserConfig,
    buf: Rc<RefCell<String>>,
    raw_buf: Rc<RefCell<String>>,
    sub_buf: Rc<RefCell<String>>,
    errors: Rc<RefCell<Vec<Error>>>,
    atoms: Rc<AtomStoreCell>,
}

impl<'a, I> Lexer<'a, I>
where
    I: Input,
{
    pub fn new(input: I, comments: Option<&'a dyn Comments>, config: ParserConfig) -> Self {
        let start_pos = input.last_pos();

        Lexer {
            comments,
            input,
            cur: None,
            cur_pos: start_pos,
            start_pos,
            override_pos: None,
            config,
            buf: Rc::new(RefCell::new(String::with_capacity(256))),
            raw_buf: Rc::new(RefCell::new(String::with_capacity(256))),
            sub_buf: Rc::new(RefCell::new(String::with_capacity(32))),
            errors: Default::default(),
            pending_leading_comments: Default::default(),
            atoms: Default::default(),
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

    fn with_sub_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
    where
        F: for<'any> FnOnce(&mut Lexer<I>, &mut String) -> LexResult<Ret>,
    {
        let b = self.sub_buf.clone();
        let mut sub_buf = b.borrow_mut();

        sub_buf.clear();

        op(self, &mut sub_buf)
    }

    fn with_buf_and_raw_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
    where
        F: for<'any> FnOnce(&mut Lexer<I>, &mut String, &mut String) -> LexResult<Ret>,
    {
        let b = self.buf.clone();
        let r = self.raw_buf.clone();
        let mut buf = b.borrow_mut();
        let mut raw = r.borrow_mut();

        buf.clear();
        raw.clear();

        op(self, &mut buf, &mut raw)
    }
}

impl<I: Input> Iterator for Lexer<'_, I> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let token = self.consume_token();

        match token {
            Ok(token) => {
                let end = self
                    .override_pos
                    .take()
                    .unwrap_or_else(|| self.input.last_pos());
                let span = Span::new(self.start_pos, end);

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

impl<I> ParserInput for Lexer<'_, I>
where
    I: Input,
{
    type State = LexerState;

    fn start_pos(&mut self) -> BytePos {
        self.input.last_pos()
    }

    fn state(&mut self) -> Self::State {
        LexerState {
            pos: self.input.last_pos(),
        }
    }

    fn reset(&mut self, state: &Self::State) {
        unsafe {
            // Safety: state.pos is created from a valid position.
            self.input.reset_to(state.pos);
        }
    }

    fn take_errors(&mut self) -> Vec<Error> {
        self.errors.take()
    }

    fn skip_ws(&mut self) -> Option<BytePos> {
        self.read_comments();

        if let Some(c) = self.input.cur() {
            if !is_whitespace(c) {
                return None;
            }
        }

        loop {
            self.read_comments();

            if self.input.uncons_while(is_whitespace).is_empty() {
                break;
            }
        }

        Some(self.input.last_pos())
    }

    fn atom(&self, s: Cow<str>) -> JsWord {
        self.atoms.atom(s)
    }
}

impl<I> Lexer<'_, I>
where
    I: Input,
{
    #[inline(always)]
    fn cur(&mut self) -> Option<char> {
        self.cur
    }

    #[inline(always)]
    fn next(&mut self) -> Option<char> {
        self.input.cur()
    }

    #[inline(always)]
    fn next_next(&mut self) -> Option<char> {
        self.input.peek()
    }

    #[inline(always)]
    fn next_next_next(&mut self) -> Option<char> {
        self.input.peek_ahead()
    }

    #[inline(always)]
    fn consume(&mut self) -> Option<char> {
        let cur = self.input.cur();

        self.cur = cur;
        self.cur_pos = self.input.last_pos();

        if cur.is_some() {
            unsafe {
                // Safety: cur is Some
                self.input.bump();
            }
        }

        cur
    }

    #[inline(always)]
    fn reconsume(&mut self) {
        unsafe {
            // Safety: self.cur_pos is a position generated by self.input, meaning it is
            // valid.
            self.input.reset_to(self.cur_pos);
        }
    }

    #[cold]
    fn emit_error(&mut self, kind: ErrorKind) {
        self.errors.borrow_mut().push(Error::new(
            Span::new(self.cur_pos, self.input.last_pos()),
            kind,
        ));
    }

    fn consume_token(&mut self) -> LexResult<Token> {
        self.read_comments();
        self.start_pos = self.input.last_pos();

        if let Some(comments) = self.comments {
            if !self.pending_leading_comments.is_empty() {
                comments.add_leading_comments(self.start_pos, self.pending_leading_comments.take());
            }
        }

        // Consume the next input code point.
        match self.consume() {
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
                    value: l.atoms.atom(&**buf),
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
                    || self.is_valid_escape(first, second)
                {
                    // Create a <hash-token>.

                    // If the next 3 input code points would start an identifier, set the
                    // <hash-token>’s type flag to "id".
                    let third = self.next_next_next();
                    let is_would_start_ident = self.would_start_ident(first, second, third);

                    // Consume an ident sequence, and set the <hash-token>’s value to the returned
                    // string.
                    let ident_sequence = self.read_ident_sequence()?;

                    // Return the <hash-token>.
                    return Ok(Token::Hash {
                        is_id: is_would_start_ident,
                        value: ident_sequence.0,
                        raw: ident_sequence.1,
                    });
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
                if self.would_start_number(None, None, None) {
                    self.reconsume();

                    return self.read_numeric();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                Ok(tok!("+"))
            }
            // U+002C COMMA (,)
            // Return a <comma-token>.
            Some(',') => Ok(tok!(",")),
            // U+002D HYPHEN-MINUS (-)
            Some('-') => {
                // If the input stream starts with a number, reconsume the current input code
                // point, consume a numeric token, and return it.
                if self.would_start_number(None, None, None) {
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
                else if self.would_start_ident(None, None, None) {
                    self.reconsume();

                    return self.read_ident_like();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                Ok(tok!("-"))
            }
            // U+002E FULL STOP (.)
            Some('.') => {
                // If the input stream starts with a number, reconsume the current input code
                // point, consume a numeric token, and return it.
                if self.would_start_number(None, None, None) {
                    self.reconsume();

                    return self.read_numeric();
                }

                // Otherwise, return a <delim-token> with its value set to the current input
                // code point.
                Ok(tok!("."))
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
                Ok(tok!("<"))
            }
            // U+0040 COMMERCIAL AT (@)
            Some('@') => {
                let first = self.next();
                let second = self.next_next();
                let third = self.next_next_next();

                // If the next 3 input code points would start an identifier, consume a name,
                // create an <at-keyword-token> with its value set to the returned value, and
                // return it.
                if self.would_start_ident(first, second, third) {
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
                if self.is_valid_escape(None, None) {
                    self.reconsume();

                    return self.read_ident_like();
                }

                // Otherwise, this is a parse error. Return a <delim-token> with its value set
                // to the current input code point.
                self.emit_error(ErrorKind::InvalidEscape);

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
            None => Err(ErrorKind::Eof),
            // anything else
            // Return a <delim-token> with its value set to the current input code point.
            Some(c) => Ok(Token::Delim { value: c }),
        }
    }

    // Consume comments.
    // This section describes how to consume comments from a stream of code points.
    // It returns nothing.
    fn read_comments(&mut self) {
        // If the next two input code point are U+002F SOLIDUS (/) followed by a U+002A
        // ASTERISK (*), consume them and all following code points up to and including
        // the first U+002A ASTERISK (*) followed by a U+002F SOLIDUS (/), or up to an
        // EOF code point. Return to the start of this step.
        // NOTE: We allow to parse line comments under the option.
        if self.next() == Some('/') && self.next_next() == Some('*') {
            let cmt_start = self.input.last_pos();

            while self.next() == Some('/') && self.next_next() == Some('*') {
                self.consume(); // '*'
                self.consume(); // '/'

                loop {
                    match self.consume() {
                        Some('*') if self.next() == Some('/') => {
                            self.consume(); // '/'

                            if self.comments.is_some() {
                                let last_pos = self.input.last_pos();
                                let text = unsafe {
                                    // Safety: last_pos is a valid position
                                    self.input.slice(cmt_start, last_pos)
                                };

                                self.pending_leading_comments.push(Comment {
                                    kind: CommentKind::Block,
                                    span: (self.start_pos, last_pos).into(),
                                    text: self.atoms.atom(text),
                                });
                            }

                            break;
                        }
                        None => {
                            let span = Span::new(self.start_pos, self.input.last_pos());

                            self.errors
                                .borrow_mut()
                                .push(Error::new(span, ErrorKind::UnterminatedBlockComment));

                            return;
                        }
                        _ => {}
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

                let start_of_content = self.input.last_pos();

                loop {
                    match self.consume() {
                        Some(c) if is_newline(c) => {
                            if self.comments.is_some() {
                                let last_pos = self.input.last_pos();
                                let text = unsafe {
                                    // Safety: last_pos is a valid position
                                    self.input.slice(start_of_content, last_pos)
                                };

                                self.pending_leading_comments.push(Comment {
                                    kind: CommentKind::Line,
                                    span: (self.start_pos, last_pos).into(),
                                    text: self.atoms.atom(text),
                                });
                            }
                            break;
                        }
                        None => return,
                        _ => {}
                    }
                }
            }
        }
    }

    // This section describes how to consume a numeric token from a stream of code
    // points. It returns either a <number-token>, <percentage-token>, or
    // <dimension-token>.
    fn read_numeric(&mut self) -> LexResult<Token> {
        // Consume a number and let number be the result.
        let number = self.read_number()?;

        let next_first = self.next();
        let next_second = self.next_next();
        let next_third = self.next_next_next();

        // If the next 3 input code points would start an identifier, then:
        if self.would_start_ident(next_first, next_second, next_third) {
            // Swap logic to avoid create empty strings, because it doesn't make sense
            //
            // Consume a name. Set the <dimension-token>’s unit to the returned value.
            let ident_sequence = self.read_ident_sequence()?;
            // Create a <dimension-token> with the same value and type flag as number, and a
            // unit set initially to the empty string.
            let token = Token::Dimension(Box::new(DimensionToken {
                value: number.0,
                raw_value: number.1,
                unit: ident_sequence.0,
                raw_unit: ident_sequence.1,
                type_flag: number.2,
            }));

            // Return the <dimension-token>.
            return Ok(token);
        }
        // Otherwise, if the next input code point is U+0025 PERCENTAGE SIGN (%), consume it. Create
        // a <percentage-token> with the same value as number, and return it.
        else if next_first == Some('%') {
            self.consume();

            return Ok(Token::Percentage {
                value: number.0,
                raw: number.1,
            });
        }

        // Otherwise, create a <number-token> with the same value and type flag as
        // number, and return it.
        Ok(Token::Number {
            value: number.0,
            raw: number.1,
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
        if matches_eq_ignore_ascii_case!(ident_sequence.0, "url") && self.next() == Some('(') {
            self.consume();

            let start_whitespace = self.input.last_pos();

            // While the next two input code points are whitespace, consume the next input
            // code point.
            let whitespaces = self.with_buf(|l, buf| {
                while let (Some(next), Some(next_next)) = (l.next(), l.next_next()) {
                    if is_whitespace(next) && is_whitespace(next_next) {
                        l.consume();

                        buf.push(next);
                    } else {
                        break;
                    }
                }

                Ok(buf.to_string())
            })?;

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
                    self.override_pos = Some(start_whitespace);

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
        self.with_buf_and_raw_buf(|l, buf, raw| {
            // This algorithm may be called with an ending code point, which denotes the
            // code point that ends the string. If an ending code point is not specified,
            // the current input code point is used.
            let ending_code_point = maybe_ending_code_point.or_else(|| l.cur());

            // Initially create a <string-token> with its value set to the empty string.
            // Done above

            raw.push(ending_code_point.unwrap());

            // Repeatedly consume the next input code point from the stream:
            loop {
                match l.consume() {
                    // ending code point
                    // Return the <string-token>.
                    Some(c) if c == ending_code_point.unwrap() => {
                        raw.push(c);

                        break;
                    }

                    // EOF
                    // This is a parse error. Return the <string-token>.
                    None => {
                        l.emit_error(ErrorKind::UnterminatedString);

                        return Ok(Token::String {
                            value: l.atoms.atom(&**buf),
                            raw: l.atoms.atom(&**raw),
                        });
                    }

                    // Newline
                    // This is a parse error. Reconsume the current input code point, create a
                    // <bad-string-token>, and return it.
                    Some(c) if is_newline(c) => {
                        l.emit_error(ErrorKind::NewlineInString);
                        l.reconsume();

                        return Ok(Token::BadString {
                            raw: l.atoms.atom(&**raw),
                        });
                    }

                    // U+005C REVERSE SOLIDUS (\)
                    Some(c) if c == '\\' => {
                        let next = l.next();

                        // If the next input code point is EOF, do nothing.
                        if l.next().is_none() {
                            continue;
                        }
                        // Otherwise, if the next input code point is a newline, consume it.
                        else if l.next().is_some() && is_newline(l.next().unwrap()) {
                            l.consume();

                            raw.push(c);
                            raw.push(next.unwrap());
                        }
                        // Otherwise, (the stream starts with a valid escape) consume an escaped
                        // code point and append the returned code point to
                        // the <string-token>’s value.
                        else if l.is_valid_escape(None, None) {
                            let escape = l.read_escape()?;

                            buf.push(escape.0);
                            raw.push(c);
                            raw.push_str(&escape.1);
                        }
                    }

                    // Anything else
                    // Append the current input code point to the <string-token>’s value.
                    Some(c) => {
                        buf.push(c);
                        raw.push(c);
                    }
                }
            }

            Ok(Token::String {
                value: l.atoms.atom(&**buf),
                raw: l.atoms.atom(&**raw),
            })
        })
    }

    // This section describes how to consume a url token from a stream of code
    // points. It returns either a <url-token> or a <bad-url-token>.
    fn read_url(&mut self, name: (JsWord, Atom), before: String) -> LexResult<Token> {
        // Initially create a <url-token> with its value set to the empty string.
        self.with_buf_and_raw_buf(|l, out, raw| {
            raw.push_str(&before);

            // Consume as much whitespace as possible.
            while let Some(c) = l.next() {
                if is_whitespace(c) {
                    l.consume();

                    raw.push(c);
                } else {
                    break;
                }
            }

            // Repeatedly consume the next input code point from the stream:
            loop {
                match l.consume() {
                    // U+0029 RIGHT PARENTHESIS ())
                    // Return the <url-token>.
                    Some(')') => {
                        return Ok(Token::Url {
                            value: l.atoms.atom(&**out),
                            raw: Box::new(UrlKeyValue(name.1, l.atoms.atom(&**raw))),
                        });
                    }

                    // EOF
                    // This is a parse error. Return the <url-token>.
                    None => {
                        l.emit_error(ErrorKind::UnterminatedUrl);

                        return Ok(Token::Url {
                            value: l.atoms.atom(&**out),
                            raw: Box::new(UrlKeyValue(name.1, l.atoms.atom(&**raw))),
                        });
                    }

                    // whitespace
                    Some(c) if is_whitespace(c) => {
                        // Consume as much whitespace as possible.
                        let whitespaces: String = l.with_sub_buf(|l, buf| {
                            buf.push(c);

                            while let Some(c) = l.next() {
                                if is_whitespace(c) {
                                    l.consume();

                                    buf.push(c);
                                } else {
                                    break;
                                }
                            }

                            Ok(buf.to_string())
                        })?;

                        // if the next input code point is U+0029 RIGHT PARENTHESIS ()) or EOF,
                        // consume it and return the <url-token> (if EOF was
                        // encountered, this is a parse error);
                        match l.next() {
                            Some(')') => {
                                l.consume();

                                raw.push_str(&whitespaces);

                                return Ok(Token::Url {
                                    value: l.atoms.atom(&**out),
                                    raw: Box::new(UrlKeyValue(name.1, l.atoms.atom(&**raw))),
                                });
                            }
                            None => {
                                l.emit_error(ErrorKind::UnterminatedUrl);

                                raw.push_str(&whitespaces);

                                return Ok(Token::Url {
                                    value: l.atoms.atom(&**out),
                                    raw: Box::new(UrlKeyValue(name.1, l.atoms.atom(&**raw))),
                                });
                            }
                            _ => {}
                        }

                        // otherwise, consume the remnants of a bad url, create a <bad-url-token>,
                        // and return it.
                        raw.push_str(&whitespaces);

                        let remnants = l.read_bad_url_remnants()?;

                        raw.push_str(&remnants);

                        return Ok(Token::BadUrl {
                            raw: Atom::new(format!("{}{}{}", name.1, "(", raw)),
                        });
                    }

                    // U+0022 QUOTATION MARK (")
                    // U+0027 APOSTROPHE (')
                    // U+0028 LEFT PARENTHESIS (()
                    // non-printable code point
                    // This is a parse error. Consume the remnants of a bad url, create a
                    // <bad-url-token>, and return it.
                    Some(c) if c == '"' || c == '\'' || c == '(' || is_non_printable(c) => {
                        l.emit_error(ErrorKind::UnexpectedCharInUrl);

                        let remnants = l.read_bad_url_remnants()?;

                        raw.push(c);
                        raw.push_str(&remnants);

                        return Ok(Token::BadUrl {
                            raw: Atom::new(format!("{}{}{}", name.1, "(", raw)),
                        });
                    }

                    // U+005C REVERSE SOLIDUS (\)
                    Some(c) if c == '\\' => {
                        // If the stream starts with a valid escape, consume an escaped code point
                        // and append the returned code point to the
                        // <url-token>’s value.
                        if l.is_valid_escape(None, None) {
                            let escaped = l.read_escape()?;

                            out.push(escaped.0);
                            raw.push(c);
                            raw.push_str(&escaped.1);
                        }
                        // Otherwise, this is a parse error. Consume the remnants of a bad url,
                        // create a <bad-url-token>, and return it.
                        else {
                            l.emit_error(ErrorKind::InvalidEscape);

                            let remnants = l.read_bad_url_remnants()?;

                            raw.push(c);
                            raw.push_str(&remnants);

                            return Ok(Token::BadUrl {
                                raw: Atom::new(format!("{}{}{}", name.1, "(", raw)),
                            });
                        }
                    }

                    // anything else
                    // Append the current input code point to the <url-token>’s value.
                    Some(c) => {
                        out.push(c);
                        raw.push(c);
                    }
                }
            }
        })
    }

    // Consume an escaped code point
    // This section describes how to consume an escaped code point. It assumes that
    // the U+005C REVERSE SOLIDUS (\) has already been consumed and that the next
    // input code point has already been verified to be part of a valid escape. It
    // will return a code point.
    fn read_escape(&mut self) -> LexResult<(char, String)> {
        self.with_sub_buf(|l, buf| {
            // Consume the next input code point.
            match l.consume() {
                // hex digit
                Some(c) if is_hex_digit(c) => {
                    let mut hex = c.to_digit(16).unwrap();

                    buf.push(c);

                    // Consume as many hex digits as possible, but no more than 5.
                    // Note that this means 1-6 hex digits have been consumed in total.
                    for _ in 0..5 {
                        let next = l.next();
                        let digit = match next.and_then(|c| c.to_digit(16)) {
                            Some(v) => v,
                            None => break,
                        };

                        l.consume();

                        buf.push(next.unwrap());
                        hex = hex * 16 + digit;
                    }

                    // If the next input code point is whitespace, consume it as well.
                    let next = l.next();

                    if let Some(next) = next {
                        if is_whitespace(next) {
                            l.consume();

                            buf.push(next);
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
                    Ok((hex, (&**buf).into()))
                }
                // EOF
                // This is a parse error. Return U+FFFD REPLACEMENT CHARACTER (�).
                None => {
                    l.emit_error(ErrorKind::InvalidEscape);

                    let value = REPLACEMENT_CHARACTER;

                    buf.push(value);

                    Ok((value, (&**buf).into()))
                }
                // anything else
                // Return the current input code point.
                Some(c) => {
                    buf.push(c);

                    Ok((c, (&**buf).into()))
                }
            }
        })
    }

    // Check if two code points are a valid escape
    // This section describes how to check if two code points are a valid escape.
    // The algorithm described here can be called explicitly with two code points,
    // or can be called with the input stream itself. In the latter case, the two
    // code points in question are the current input code point and the next input
    // code point, in that order.
    fn is_valid_escape(&mut self, maybe_first: Option<char>, maybe_second: Option<char>) -> bool {
        // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
        if maybe_first.or_else(|| self.cur()) != Some('\\') {
            return false;
        }

        match maybe_second.or_else(|| self.next()) {
            // Otherwise, if the second code point is a newline, return false.
            Some(second) => !is_newline(second),
            // Otherwise, return true.
            None => false,
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
    ) -> bool {
        // Look at the first code point:
        let first = maybe_first.or_else(|| self.cur());

        match first {
            // U+002D HYPHEN-MINUS
            Some('-') => {
                let second = maybe_second.or_else(|| self.next());

                match second {
                    // If the second code point is a name-start code point
                    // return true.
                    Some(c) if is_name_start(c) => true,
                    // or a U+002D HYPHEN-MINUS,
                    // return true.
                    Some('-') => true,
                    // or the second and third code points are a valid escape
                    // return true.
                    Some(_) => {
                        let third = maybe_third.or_else(|| self.next_next());

                        self.is_valid_escape(second, third)
                    }
                    // Otherwise, return false.
                    _ => false,
                }
            }
            // name-start code point
            // Return true.
            Some(c) if is_name_start(c) => true,
            // U+005C REVERSE SOLIDUS (\)
            // If the first and second code points are a valid escape, return true. Otherwise,
            // return false.
            Some('\\') => {
                let second = maybe_second.or_else(|| self.next());

                self.is_valid_escape(first, second)
            }
            _ => false,
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
    ) -> bool {
        // Look at the first code point:
        let first = maybe_first.or_else(|| self.cur());

        match first {
            // U+002B PLUS SIGN (+)
            // U+002D HYPHEN-MINUS (-)
            Some('+') | Some('-') => {
                match maybe_second.or_else(|| self.next()) {
                    // If the second code point is a digit, return true.
                    Some(second) if second.is_ascii_digit() => return true,
                    // Otherwise, if the second code point is a U+002E FULL STOP (.) and the
                    // third code point is a digit, return true.
                    Some('.') => {
                        if let Some(third) = maybe_third.or_else(|| self.next_next()) {
                            if third.is_ascii_digit() {
                                return true;
                            }
                        }

                        return false;
                    }
                    // Otherwise, return false.
                    _ => return false,
                };
            }
            // U+002E FULL STOP (.)
            Some('.') => {
                // If the second code point is a digit, return true.
                if let Some(second) = self.next() {
                    if second.is_ascii_digit() {
                        return true;
                    }
                }

                // Otherwise, return false.
                false
            }
            // digit
            // Return true.
            Some(first) if first.is_ascii_digit() => true,
            // anything else
            // Return false.
            _ => false,
        }
    }

    // Consume an ident sequence
    // This section describes how to consume an ident sequence from a stream of code
    // points. It returns a string containing the largest name that can be formed
    // from adjacent code points in the stream, starting from the first.
    fn read_ident_sequence(&mut self) -> LexResult<(JsWord, Atom)> {
        self.with_buf_and_raw_buf(|l, buf, raw| {
            // Let result initially be an empty string.
            // Done above

            // Repeatedly consume the next input code point from the stream:
            loop {
                match l.consume() {
                    // name code point
                    // Append the code point to result.
                    Some(c) if is_name(c) => {
                        buf.push(c);
                        raw.push(c);
                    }
                    // the stream starts with a valid escape
                    // Consume an escaped code point. Append the returned code point to result.
                    Some(c) if l.is_valid_escape(None, None) => {
                        let escaped = l.read_escape()?;

                        buf.push(escaped.0);
                        raw.push(c);
                        raw.push_str(&escaped.1);
                    }
                    // anything else
                    // Reconsume the current input code point. Return result.
                    _ => {
                        l.reconsume();

                        break;
                    }
                }
            }

            Ok((l.atoms.atom(&**buf), l.atoms.atom(&**raw)))
        })
    }

    // This section describes how to consume a number from a stream of code points.
    // It returns a numeric value, and a type which is either "integer" or "number".
    fn read_number(&mut self) -> LexResult<(f64, Atom, NumberType)> {
        let parsed: (Atom, NumberType) = self.with_buf(|l, out| {
            // Initially set type to "integer". Let repr be the empty string.
            let mut type_flag = NumberType::Integer;

            // If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS
            // (-), consume it and append it to repr.
            let next = l.next();

            if next == Some('+') || next == Some('-') {
                l.consume();

                out.push(next.unwrap());
            }

            // While the next input code point is a digit, consume it and append it to repr.
            while let Some(c) = l.next() {
                if c.is_ascii_digit() {
                    l.consume();

                    out.push(c);
                } else {
                    break;
                }
            }

            // If the next 2 input code points are U+002E FULL STOP (.) followed by a digit,
            // then:
            let next = l.next();

            if next == Some('.') {
                if let Some(n) = l.next_next() {
                    if n.is_ascii_digit() {
                        // Consume them.
                        l.consume();
                        l.consume();

                        // Append them to repr.
                        out.push(next.unwrap());
                        out.push(n);

                        // Set type to "number".
                        type_flag = NumberType::Number;

                        // While the next input code point is a digit, consume it and append it to
                        // repr.
                        while let Some(c) = l.next() {
                            if c.is_ascii_digit() {
                                l.consume();

                                out.push(c);
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
            let next = l.next();

            if next == Some('E') || next == Some('e') {
                let next_next = l.next_next();
                let next_next_next = l.next_next_next();

                if (next_next == Some('-')
                    || next_next == Some('+')
                        && next_next_next.is_some()
                        && next_next_next.unwrap().is_ascii_digit())
                    || next_next.is_some() && next_next.unwrap().is_ascii_digit()
                {
                    // Consume them.
                    l.consume();
                    l.consume();

                    // Append them to repr.
                    out.push(next.unwrap());
                    out.push(next_next.unwrap());

                    // Set type to "number".
                    type_flag = NumberType::Number;

                    // While the next input code point is a digit, consume it and append it
                    // to repr.
                    while let Some(c) = l.next() {
                        if c.is_ascii_digit() {
                            l.consume();

                            out.push(c);
                        } else {
                            break;
                        }
                    }
                }
            }

            // Return value and type.
            Ok((l.atoms.atom(&**out), type_flag))
        })?;

        // Convert repr to a number, and set the value to the returned value.
        let value = lexical::parse(&*parsed.0).unwrap_or_else(|err| {
            unreachable!("failed to parse `{}` using lexical: {:?}", parsed.0, err)
        });

        Ok((value, parsed.0, parsed.1))
    }

    // Consume the remnants of a bad url
    // This section describes how to consume the remnants of a bad url from a stream
    // of code points, "cleaning up" after the tokenizer realizes that it’s in the
    // middle of a <bad-url-token> rather than a <url-token>. It returns nothing;
    // its sole use is to consume enough of the input stream to reach a recovery
    // point where normal tokenizing can resume. But for recovery purpose we return
    // bad URL remnants.
    fn read_bad_url_remnants(&mut self) -> LexResult<String> {
        self.with_sub_buf(|l, raw| {
            // Repeatedly consume the next input code point from the stream:
            loop {
                match l.consume() {
                    // U+0029 RIGHT PARENTHESIS ())
                    // EOF
                    // Return.
                    Some(c @ ')') => {
                        raw.push(c);

                        break;
                    }
                    None => {
                        break;
                    }
                    // the input stream starts with a valid escape
                    Some(c) if l.is_valid_escape(None, None) => {
                        // Consume an escaped code point. This allows an escaped right parenthesis
                        // ("\)") to be encountered without ending the <bad-url-token>.
                        let escaped = l.read_escape()?;

                        raw.push(c);
                        raw.push_str(&escaped.1);
                    }
                    // anything else
                    // Do nothing.
                    Some(c) => {
                        raw.push(c);
                    }
                }
            }

            Ok((&**raw).into())
        })
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
    c.is_ascii_uppercase()
}

#[inline(always)]
fn is_lowercase_letter(c: char) -> bool {
    c.is_ascii_lowercase()
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
