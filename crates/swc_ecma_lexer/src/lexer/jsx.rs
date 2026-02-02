use either::Either;

use super::*;

impl Lexer<'_> {
    pub(super) fn read_jsx_token(&mut self) -> LexResult<Token> {
        debug_assert!(self.syntax.jsx());

        let start = self.input.cur_pos();
        let mut chunk_start = self.input.cur_pos();
        let mut value = String::new();

        loop {
            let cur = match self.input.cur() {
                Some(c) => c as char,
                None => {
                    let start = self.state.start;
                    self.error(start, SyntaxError::UnterminatedJSXContents)?
                }
            };
            let cur_pos = self.input.cur_pos();

            match cur {
                '<' if self.had_line_break_before_last() && self.is_str("<<<<<< ") => {
                    let span = Span::new_with_checked(cur_pos, cur_pos + BytePos(7));

                    self.emit_error_span(span, SyntaxError::TS1185);
                    self.skip_line_comment(6);
                    self.skip_space::<true>();
                    return self.read_token();
                }
                '<' | '{' => {
                    //
                    if cur_pos == self.state.start {
                        if cur == '<' && self.state.is_expr_allowed {
                            unsafe {
                                // Safety: cur() was Some('<')
                                self.input.bump_bytes(1);
                            }
                            return Ok(Token::JSXTagStart);
                        }
                        return self.read_token();
                    }

                    let s = unsafe {
                        // Safety: We already checked for the range
                        self.input.slice(chunk_start, cur_pos)
                    };
                    let value = if value.is_empty() {
                        // Fast path: We don't need to allocate extra buffer for value
                        self.atoms.atom(s)
                    } else {
                        value.push_str(s);
                        self.atoms.atom(value)
                    };

                    let raw = {
                        let s = unsafe {
                            // Safety: We already checked for the range
                            self.input.slice(start, cur_pos)
                        };
                        self.atoms.atom(s)
                    };

                    return Ok(Token::JSXText { raw, value });
                }
                '>' => {
                    self.emit_error(
                        cur_pos,
                        SyntaxError::UnexpectedTokenWithSuggestions {
                            candidate_list: vec!["`{'>'}`", "`&gt;`"],
                        },
                    );
                    unsafe {
                        // Safety: cur() was Some('>')
                        self.input.bump_bytes(1)
                    }
                }
                '}' => {
                    self.emit_error(
                        cur_pos,
                        SyntaxError::UnexpectedTokenWithSuggestions {
                            candidate_list: vec!["`{'}'}`", "`&rbrace;`"],
                        },
                    );
                    unsafe {
                        // Safety: cur() was Some('}')
                        self.input.bump_bytes(1)
                    }
                }
                '&' => {
                    value.push_str(unsafe {
                        // Safety: We already checked for the range
                        self.input.slice(chunk_start, cur_pos)
                    });

                    let jsx_entity = self.read_jsx_entity()?;

                    value.push(jsx_entity.0);
                    chunk_start = self.input.cur_pos();
                }

                _ => {
                    if cur.is_line_terminator() {
                        value.push_str(unsafe {
                            // Safety: We already checked for the range
                            self.input.slice(chunk_start, cur_pos)
                        });
                        match self.read_jsx_new_line(true)? {
                            Either::Left(s) => value.push_str(s),
                            Either::Right(c) => value.push(c),
                        }
                        chunk_start = self.input.cur_pos();
                    } else {
                        unsafe {
                            // Safety: cur() was Some(c)
                            self.input.bump_bytes(1)
                        }
                    }
                }
            }
        }
    }
}
