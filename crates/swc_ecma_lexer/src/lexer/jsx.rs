use either::Either;
use smartstring::{LazyCompact, SmartString};

use super::*;
use crate::common::lexer::jsx::xhtml;

impl Lexer<'_> {
    pub(super) fn read_jsx_token(&mut self) -> LexResult<Option<Token>> {
        debug_assert!(self.syntax.jsx());

        let start = self.input.cur_pos();
        let mut chunk_start = self.input.cur_pos();
        let mut value = String::new();

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
                '<' if self.had_line_break_before_last() && self.is_str("<<<<<< ") => {
                    let span = Span::new(cur_pos, cur_pos + BytePos(7));

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
                                self.input.bump();
                            }
                            return Ok(Some(Token::JSXTagStart));
                        }
                        return self.read_token();
                    }

                    let value = if value.is_empty() {
                        // Fast path: We don't need to allocate extra buffer for value
                        let s = unsafe {
                            // Safety: We already checked for the range
                            self.input.slice(chunk_start, cur_pos)
                        };
                        self.atoms.atom(s)
                    } else {
                        value.push_str(unsafe {
                            // Safety: We already checked for the range
                            self.input.slice(chunk_start, cur_pos)
                        });
                        self.atoms.atom(value)
                    };

                    let raw = {
                        let s = unsafe {
                            // Safety: We already checked for the range
                            self.input.slice(start, cur_pos)
                        };
                        self.atoms.atom(s)
                    };

                    return Ok(Some(Token::JSXText { raw, value }));
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
                        self.input.bump()
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
                        self.input.bump()
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
                            self.input.bump()
                        }
                    }
                }
            }
        }
    }

    pub(super) fn read_jsx_entity(&mut self) -> LexResult<(char, String)> {
        debug_assert!(self.syntax.jsx());

        fn from_code(s: &str, radix: u32) -> LexResult<char> {
            // TODO(kdy1): unwrap -> Err
            let c = char::from_u32(
                u32::from_str_radix(s, radix).expect("failed to parse string as number"),
            )
            .expect("failed to parse number as char");

            Ok(c)
        }

        fn is_hex(s: &str) -> bool {
            s.chars().all(|c| c.is_ascii_hexdigit())
        }

        fn is_dec(s: &str) -> bool {
            s.chars().all(|c| c.is_ascii_digit())
        }

        let mut s = SmartString::<LazyCompact>::default();

        let c = self.input.cur();
        debug_assert_eq!(c, Some('&'));
        unsafe {
            // Safety: cur() was Some('&')
            self.input.bump();
        }

        let start_pos = self.input.cur_pos();

        for _ in 0..10 {
            let c = match self.input.cur() {
                Some(c) => c,
                None => break,
            };
            unsafe {
                // Safety: cur() was Some(c)
                self.input.bump();
            }

            if c == ';' {
                if let Some(stripped) = s.strip_prefix('#') {
                    if stripped.starts_with('x') {
                        if is_hex(&s[2..]) {
                            let value = from_code(&s[2..], 16)?;

                            return Ok((value, format!("&{s};")));
                        }
                    } else if is_dec(stripped) {
                        let value = from_code(stripped, 10)?;

                        return Ok((value, format!("&{s};")));
                    }
                } else if let Some(entity) = xhtml(&s) {
                    return Ok((entity, format!("&{s};")));
                }

                break;
            }

            s.push(c)
        }

        unsafe {
            // Safety: start_pos is a valid position because we got it from self.input
            self.input.reset_to(start_pos);
        }

        Ok(('&', "&".to_string()))
    }

    pub(super) fn read_jsx_new_line(
        &mut self,
        normalize_crlf: bool,
    ) -> LexResult<Either<&'static str, char>> {
        debug_assert!(self.syntax.jsx());

        let ch = self.input.cur().unwrap();
        unsafe {
            // Safety: cur() was Some(ch)
            self.input.bump();
        }

        let out = if ch == '\r' && self.input.cur() == Some('\n') {
            unsafe {
                // Safety: cur() was Some('\n')
                self.input.bump();
            }
            Either::Left(if normalize_crlf { "\n" } else { "\r\n" })
        } else {
            Either::Right(ch)
        };
        let cur_pos = self.input.cur_pos();
        self.state.cur_line += 1;
        self.state.line_start = cur_pos;

        Ok(out)
    }

    pub(super) fn read_jsx_str(&mut self, quote: char) -> LexResult<Token> {
        debug_assert!(self.syntax.jsx());

        let start = self.input.cur_pos();

        unsafe {
            // Safety: cur() was Some(quote)
            self.input.bump(); // `quote`
        }

        let mut out = String::new();
        let mut chunk_start = self.input.cur_pos();

        loop {
            let ch = match self.input.cur() {
                Some(c) => c,
                None => {
                    let start = self.state.start;
                    self.emit_error(start, SyntaxError::UnterminatedStrLit);
                    break;
                }
            };

            let cur_pos = self.input.cur_pos();

            if ch == '\\' {
                let value = unsafe {
                    // Safety: We already checked for the range
                    self.input.slice(chunk_start, cur_pos)
                };

                out.push_str(value);
                out.push('\\');

                self.bump();

                chunk_start = self.input.cur_pos();

                continue;
            }

            if ch == quote {
                break;
            }

            if ch == '&' {
                let value = unsafe {
                    // Safety: We already checked for the range
                    self.input.slice(chunk_start, cur_pos)
                };

                out.push_str(value);

                let jsx_entity = self.read_jsx_entity()?;

                out.push(jsx_entity.0);

                chunk_start = self.input.cur_pos();
            } else if ch.is_line_terminator() {
                let value = unsafe {
                    // Safety: We already checked for the range
                    self.input.slice(chunk_start, cur_pos)
                };

                out.push_str(value);

                match self.read_jsx_new_line(false)? {
                    Either::Left(s) => {
                        out.push_str(s);
                    }
                    Either::Right(c) => {
                        out.push(c);
                    }
                }

                chunk_start = cur_pos + BytePos(ch.len_utf8() as _);
            } else {
                unsafe {
                    // Safety: cur() was Some(ch)
                    self.input.bump();
                }
            }
        }

        let value = if out.is_empty() {
            // Fast path: We don't need to allocate

            let cur_pos = self.input.cur_pos();
            let value = unsafe {
                // Safety: We already checked for the range
                self.input.slice(chunk_start, cur_pos)
            };

            self.atoms.atom(value)
        } else {
            let cur_pos = self.input.cur_pos();
            let value = unsafe {
                // Safety: We already checked for the range
                self.input.slice(chunk_start, cur_pos)
            };

            out.push_str(value);

            self.atoms.atom(out)
        };

        // it might be at the end of the file when
        // the string literal is unterminated
        if self.input.peek_ahead().is_some() {
            unsafe {
                // Safety: We called peek_ahead() which means cur() was Some
                self.input.bump();
            }
        }

        let end = self.input.cur_pos();
        let raw = unsafe {
            // Safety: Both of `start` and `end` are generated from `cur_pos()`
            self.input.slice(start, end)
        };

        Ok(Token::Str {
            value,
            raw: self.atoms.atom(raw),
        })
    }
}
