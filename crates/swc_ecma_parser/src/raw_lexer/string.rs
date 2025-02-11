use std::ops::Sub;

// implement string literal parse
use super::{
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
    fn escape_sequence(&mut self, text: &mut String) -> LexResult<()> {
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
                    let mut value = self.hex_digit()?;
                    value = (value << 4) | self.hex_digit()?;

                    match char::try_from(value) {
                        Err(_) => {
                            return self.error(start, self.offset(), SyntaxError::InvalidStrEscape);
                        }
                        Ok(c) => {
                            text.push(c);
                        }
                    }
                }

                'u' => {
                    let ch = self.unicode_escape_sequence_without_u()?;

                    text.push(ch);
                }
                '0' => {
                    todo!("parse legacy octal escape sequence")
                }
                '1'..='7' => {
                    todo!("parse octal escape sequence")
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

                let value = self.code_point()?;

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
            value = (value << 4) | self.hex_digit()?;
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

        match self.next_char() {
            Some(c @ '0'..='9') => Ok(c as u32 - '0' as u32),
            Some(c @ 'a'..='f') => Ok(10 + (c as u32 - 'a' as u32)),
            Some(c @ 'A'..='F') => Ok(10 + (c as u32 - 'A' as u32)),
            None | Some(_) => self.error(start, self.offset(), SyntaxError::InvalidStrEscape),
        }
    }
}
