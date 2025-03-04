use std::ops::Sub;

use swc_common::Spanned;

// implement string literal parse
use super::{
    error::Error,
    unicode::{CR, FF, LF, LS, PS, TAB, VT},
    RawLexer,
};
use crate::{error::SyntaxError, lexer::LexResult};

impl RawLexer<'_> {
    /// Scan a string literal, having already consumed the starting quote
    /// character `terminal`.
    ///
    /// ```text
    /// StringLiteral ::
    ///     `"` DoubleStringCharacters? `"`
    ///     `'` SingleStringCharacters? `'`
    ///
    /// DoubleStringCharacters ::
    ///     DoubleStringCharacter DoubleStringCharacters?
    ///
    /// SingleStringCharacters ::
    ///     SingleStringCharacter SingleStringCharacters?
    ///
    /// DoubleStringCharacter ::
    ///     SourceCharacter but not one of `"` or `\` or LineTerminator
    ///     <LS>
    ///     <PS>
    ///     `\` EscapeSequence
    ///     LineContinuation
    ///
    /// SingleStringCharacter ::
    ///     SourceCharacter but not one of `'` or `\` or LineTerminator
    ///     <LS>
    ///     <PS>
    ///     `\` EscapeSequence
    ///     LineContinuation
    /// LineContinuation ::
    ///     \ LineTerminatorSequence
    /// ```
    pub(super) fn read_string_literal(&mut self, terminal: char) -> LexResult<String> {
        let start_offset = self.offset();
        // consume " or '
        self.consume_byte();

        let mut builder = String::new();

        loop {
            match self.next_char() {
                None | Some('\r') | Some('\n') => {
                    return self.error(
                        start_offset,
                        self.offset(),
                        SyntaxError::UnterminatedStrLit,
                    );
                }
                Some(ch) if ch == terminal => {
                    break;
                }
                // \ EscapeSequence or LineContinuation
                // LineContinuation ::
                //      \ LineTerminatorSequence
                Some('\\') => {
                    self.escape_sequence(&mut builder)?;
                }
                Some(other) => builder.push(other),
            }
        }

        Ok(builder)
    }

    // fork from jsparagus
    /// ``` text
    /// LineContinuation ::
    ///     \ LineTerminatorSequence
    /// ```
    pub(super) fn escape_sequence(&mut self, text: &mut String) -> LexResult<()> {
        // escape_sequence start with '\'
        let start = self.offset().sub(1);
        match self.next_char() {
            None => {
                return self.error(start, self.offset(), SyntaxError::UnterminatedStrLit);
            }
            Some(ch) => match ch {
                // TODO: build a `byte_handlers table` to perf it.
                LF | LS | PS => {
                    // LineContinuation. Ignore it.
                }
                CR => {
                    // LineContinuation. Check for the sequence \r\n; otherwise
                    // ignore it.
                    if self.peek_char() == Some(LF) {
                        self.consume_char();
                    }
                }
                '\'' | '"' | '\\' => text.push(ch),
                'b' => text.push('\u{8}'),
                'f' => text.push(FF),
                'n' => text.push(LF),
                'r' => text.push(CR),
                't' => text.push(TAB),
                'v' => text.push(VT),
                'x' => {
                    // HexEscapeSequence ::
                    //     `x` HexDigit HexDigit
                    let mut value = self.hex_digit().map_err(|_| {
                        self.create_error(
                            start,
                            self.offset(),
                            SyntaxError::BadCharacterEscapeSequence {
                                expected: "2 hex characters",
                            },
                        )
                    })?;
                    value = (value << 4)
                        | self.hex_digit().map_err(|_| {
                            self.create_error(
                                start,
                                self.offset(),
                                SyntaxError::BadCharacterEscapeSequence {
                                    expected: "2 hex characters",
                                },
                            )
                        })?;

                    match char::try_from(value) {
                        Err(_) => {
                            return self.error(
                                start,
                                self.offset(),
                                SyntaxError::BadCharacterEscapeSequence {
                                    expected: "2 hex characters",
                                },
                            );
                        }
                        Ok(c) => {
                            text.push(c);
                        }
                    }
                }

                'u' => {
                    let ch = self
                        .unicode_escape_sequence_without_u()
                        .map_err(|e| self.create_error(start, self.offset(), e.kind().clone()))?;

                    text.push(ch);
                }
                '0' => match self.peek_byte() {
                    Some(b'0'..=b'7') => {
                        // SAFETY: xx
                        let mut value: u32 = (self.next_byte().unwrap() - b'0').into();

                        if matches!(self.peek_byte(), Some(b'0'..=b'7')) {
                            value = value << 3 | (self.next_byte().unwrap() - b'0') as u32;
                        }

                        let ch = char::try_from(value).or(self.error(
                            start,
                            self.offset(),
                            SyntaxError::InvalidUnicodeEscape,
                        ))?;

                        text.push(ch);
                    }
                    _ => {
                        text.push('\u{0000}');
                    }
                },
                ch @ '1'..='7' => {
                    let mut value = ch as u32 - '0' as u32;
                    if matches!(self.peek_byte(), Some(b'0'..=b'7')) {
                        value = value << 3 | (self.next_byte().unwrap() - b'0') as u32;
                    }
                    let ch = char::try_from(value).or(self.error(
                        start,
                        self.offset(),
                        SyntaxError::InvalidUnicodeEscape,
                    ))?;

                    text.push(ch);
                }
                other => text.push(other),
            },
        };

        Ok(())
    }

    // fork from jsparagus
    pub(super) fn unicode_escape_sequence_without_u(&mut self) -> LexResult<char> {
        let start = self.offset();
        let value = match self.peek_char() {
            Some('{') => {
                self.consume_char();

                let value = self.code_point().map_err(|mut e| {
                    e.set_kind(SyntaxError::BadCharacterEscapeSequence {
                        expected: "1-6 hex characters",
                    });
                    e
                })?;

                if self.next_char() != Some('}') {
                    return self.error(start, self.offset(), SyntaxError::InvalidUnicodeEscape);
                }
                value
            }
            _ => self.hex_4_digits()?,
        };

        Ok(value)
    }

    fn hex_4_digits(&mut self) -> LexResult<char> {
        let mut value = 0;
        for _ in 0..4 {
            value = (value << 4)
                | self.hex_digit().map_err(|mut e| {
                    e.set_kind(SyntaxError::BadCharacterEscapeSequence {
                        expected: "4 hex characters",
                    });

                    e
                })?;
        }

        self.code_point_to_char(value)
    }

    fn code_point(&mut self) -> LexResult<char> {
        let start = self.offset();
        let mut value = self.hex_digit()?;

        loop {
            let next = match self.peek_char() {
                None => {
                    return self.error(start, self.offset(), SyntaxError::InvalidUnicodeEscape);
                }
                Some(c @ '0'..='9') => c as u32 - '0' as u32,
                Some(c @ 'a'..='f') => 10 + (c as u32 - 'a' as u32),
                Some(c @ 'A'..='F') => 10 + (c as u32 - 'A' as u32),
                Some(_) => break,
            };

            self.consume_char();

            value = (value << 4) | next;

            if value > 0x10ffff {
                return self.error(start, self.offset(), SyntaxError::InvalidUnicodeEscape);
            }
        }

        self.code_point_to_char(value)
    }

    fn code_point_to_char(&self, value: u32) -> LexResult<char> {
        if (0xd800..=0xdfff).contains(&value) {
            self.error_with_single_byte(self.offset(), SyntaxError::InvalidUnicodeEscape)
        } else {
            char::try_from(value)
                .or(self.error_with_single_byte(self.offset(), SyntaxError::InvalidUnicodeEscape))
        }
    }

    fn hex_digit(&mut self) -> LexResult<u32> {
        let start = self.offset();

        match self.peek_char() {
            Some(c @ '0'..='9') => {
                self.consume_char();
                Ok(c as u32 - '0' as u32)
            }
            Some(c @ 'a'..='f') => {
                self.consume_char();
                Ok(10 + (c as u32 - 'a' as u32))
            }
            Some(c @ 'A'..='F') => {
                self.consume_char();
                Ok(10 + (c as u32 - 'A' as u32))
            }
            None | Some(_) => self.error(start, self.offset(), SyntaxError::InvalidStrEscape),
        }
    }
}
