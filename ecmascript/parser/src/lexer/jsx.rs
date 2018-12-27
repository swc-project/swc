use super::*;
use either::Either;
use std::borrow::Cow;

impl<'a, I: Input> Lexer<'a, I> {
    pub(super) fn read_jsx_token(&mut self) -> LexResult<Option<Token>> {
        debug_assert!(self.syntax.jsx());

        let mut chunk_start = self.input.cur_pos();
        let mut out = String::new();

        loop {
            let cur = match self.input.cur() {
                Some(c) => c,
                None => {
                    let start = self.state.start;
                    self.error(start, SyntaxError::UnterminatedJSXContents)?
                }
            };
            let cur_pos = self.input.cur_pos();

            match cur {
                '<' | '{' => {
                    //
                    if cur_pos == self.state.start {
                        if cur == '<' && self.state.is_expr_allowed {
                            self.input.bump();
                            return Ok(Token::JSXTagStart).map(Some);
                        }
                        return self.read_token();
                    }
                    out.push_str(self.input.slice(chunk_start, cur_pos));

                    return Ok(Token::JSXText { raw: out.into() }).map(Some);
                }

                '&' => {
                    out.push_str(self.input.slice(chunk_start, cur_pos));
                    out.push_str(&self.read_jsx_entity()?);
                    chunk_start = cur_pos;
                }

                _ => {
                    if cur.is_line_break() {
                        out.push(cur);
                        match self.read_jsx_new_line(true)? {
                            Either::Left(s) => out.push_str(s),
                            Either::Right(c) => out.push(c),
                        }
                        chunk_start = cur_pos;
                    } else {
                        self.input.bump()
                    }
                }
            }
        }
    }

    pub(super) fn read_jsx_entity(&mut self) -> LexResult<Cow<'static, str>> {
        debug_assert!(self.syntax.jsx());

        unimplemented!("read_jsx_entity")
    }

    pub(super) fn read_jsx_new_line(
        &mut self,
        normalize_crlf: bool,
    ) -> LexResult<Either<&'static str, char>> {
        debug_assert!(self.syntax.jsx());

        let ch = self.input.cur().unwrap();
        self.input.bump();

        let out = if ch == '\r' && self.input.cur() == Some('\n') {
            self.input.bump();
            Either::Left(if normalize_crlf { "\n" } else { "\r\n" })
        } else {
            Either::Right(ch)
        };
        let cur_pos = self.input.cur_pos();
        self.state.cur_line += 1;
        self.state.line_start = cur_pos;

        return Ok(out);
    }

    pub(super) fn read_jsx_str(&mut self, quote: char) -> LexResult<Token> {
        debug_assert!(self.syntax.jsx());

        let mut out = String::new();
        let mut chunk_start = self.input.cur_pos() + BytePos(1);
        loop {
            let ch = match self.input.cur() {
                Some(c) => c,
                None => {
                    let start = self.state.start;
                    self.error(start, SyntaxError::UnterminatedStrLit)?
                }
            };

            let cur_pos = self.input.cur_pos();

            if ch == quote {
                break;
            }
            if ch == '&' {
                out.push_str(self.input.slice(chunk_start, cur_pos));
                out.push_str(&self.read_jsx_entity()?);
                chunk_start = cur_pos;
            } else if ch.is_line_break() {
                out.push_str(self.input.slice(chunk_start, cur_pos));
                match self.read_jsx_new_line(false)? {
                    Either::Left(s) => out.push_str(s),
                    Either::Right(c) => out.push(c),
                }
                chunk_start = cur_pos;
            } else {
                self.input.bump();
            }
        }
        let cur_pos = self.input.cur_pos();
        out.push_str(self.input.slice(chunk_start, cur_pos));
        self.input.bump();
        return Ok(Token::Str {
            value: out.into(),
            has_escape: false,
        });
    }

    /// Read a JSX identifier (valid tag or attribute name).
    ///
    /// Optimized version since JSX identifiers can"t contain
    /// escape characters and so can be read as single slice.
    /// Also assumes that first character was already checked
    /// by isIdentifierStart in readToken.
    pub(super) fn read_jsx_word(&mut self) -> LexResult<Token> {
        debug_assert!(self.syntax.jsx());
        debug_assert!(self.input.cur().is_some());
        debug_assert!(self.input.cur().unwrap().is_ident_start());

        let cur_pos = self.input.cur_pos();
        let slice = self.input.uncons_while(|c| c.is_ident_part() || c == '-');

        Ok(Token::JSXName { name: slice.into() })
    }
}
