use super::RawLexer;
use crate::{error::SyntaxError, lexer::LexResult};

impl RawLexer<'_> {
    pub(super) fn parse_number(&self, start: u32) -> LexResult<f64> {
        let s = self.str_from_start_to_current(start).replace("_", "");

        s.parse::<f64>()
            .or(self.error(start, self.offset(), SyntaxError::NumLitTerminatedWithExp))
    }

    /// ```text
    /// NumericLiteralSeparator::
    ///     _
    /// BinaryIntegerLiteral ::
    ///     `0b` BinaryDigits
    ///     `0B` BinaryDigits
    ///
    /// BinaryDigits ::
    ///     BinaryDigit
    ///     BinaryDigits NumericLiteralSeparator? BinaryDigit
    ///
    /// BinaryDigit :: one of
    ///     `0` `1`
    /// ```
    pub(super) fn read_binary(&mut self) -> LexResult<f64> {
        let start = self.offset();

        // first byte must be `1` or `0`
        let mut value = match self.next_byte() {
            first_byte_after_0b @ Some(b'0'..=b'1') => (first_byte_after_0b.unwrap() - b'0') as f64,
            _ => return self.error(start, self.offset(), SyntaxError::InvalidExpr),
        };

        loop {
            match self.peek_byte() {
                Some(b'_') => {
                    self.consume_byte();
                }
                Some(b'0'..=b'1') => {
                    let next_binary = (self.next_byte().unwrap() - b'0') as f64;

                    value = value * 2.0 + next_binary;
                }
                _ => break,
            }
        }

        Ok(value)
    }

    /// ```text
    /// OctalIntegerLiteral[Sep] ::
    ///     0o OctalDigits[?Sep]
    ///     0O OctalDigits[?Sep]
    /// OctalDigits[Sep] ::
    ///     OctalDigit
    ///     OctalDigits[?Sep] OctalDigit
    ///     [+Sep] OctalDigits[+Sep] NumericLiteralSeparator OctalDigit
    ///
    /// OctalDigit :: one of
    ///     0 1 2 3 4 5 6 7
    /// ```
    pub(super) fn read_octal(&mut self) -> LexResult<f64> {
        let start = self.offset();

        // first_byte must be 0..=7
        let mut value = match self.next_byte() {
            first_byte_after_0b @ Some(b'0'..=b'7') => (first_byte_after_0b.unwrap() - b'0') as f64,
            _ => return self.error(start, self.offset(), SyntaxError::InvalidExpr),
        };

        loop {
            match self.peek_byte() {
                Some(b'_') => {
                    self.consume_byte();
                }
                Some(b'0'..=b'7') => {
                    let next_octal = (self.next_byte().unwrap() - b'0') as f64;

                    value = value * 8.0 + next_octal;
                }
                _ => break,
            }
        }

        Ok(value)
    }

    ///```text
    /// HexIntegerLiteral[Sep] ::
    ///     0x HexDigits[?Sep]
    ///     0X HexDigits[?Sep]
    /// HexDigits[Sep] ::
    ///     HexDigit
    ///     HexDigits[?Sep] HexDigit
    ///     [+Sep] HexDigits[+Sep] NumericLiteralSeparator HexDigit
    /// HexDigit :: one of
    ///     0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F
    /// ```
    pub(super) fn read_hex(&mut self) -> LexResult<f64> {
        let start = self.offset();

        // first_byte must be 0..=9, 'a'..='f', 'A'..='F'
        let mut value = match self.next_byte() {
            first_byte_after_0b @ Some(b'0'..=b'9') => (first_byte_after_0b.unwrap() - b'0') as f64,
            first_byte_after_0b @ Some(b'a'..=b'f') => (first_byte_after_0b.unwrap() - b'a') as f64,
            first_byte_after_0b @ Some(b'A'..=b'F') => (first_byte_after_0b.unwrap() - b'A') as f64,
            _ => return self.error(start, self.offset(), SyntaxError::InvalidExpr),
        };

        loop {
            match self.peek_byte() {
                Some(b'_') => {
                    if matches!(self.peek_byte(), Some(b'0'..=b'9')) {
                        self.consume_byte();
                    } else {
                        return self.error(
                            start,
                            self.offset(),
                            SyntaxError::NumLitTerminatedWithExp,
                        );
                    }
                }
                Some(b'0'..=b'9') => {
                    let next_hex = (self.next_byte().unwrap() - b'0') as f64;

                    value = value * 16.0 + next_hex;
                }
                Some(b'a'..=b'f') => {
                    let next_hex = (self.next_byte().unwrap() - b'a') as f64;

                    value = value * 16.0 + next_hex;
                }
                Some(b'A'..=b'F') => {
                    let next_hex = (self.next_byte().unwrap() - b'A') as f64;

                    value = value * 16.0 + next_hex;
                }
                _ => break,
            }
        }

        Ok(value)
    }

    pub(super) fn decimal_literal(&mut self) -> LexResult<f64> {
        let start = self.offset();

        // consume one digit byte.
        self.next_byte();

        self.decimal_digits_after_first_digit()?;

        match self.peek_byte() {
            Some(b'.') => {
                // consume .
                self.consume_byte();
                self.decimal_literal_after_decimal_point()?;
            }
            Some(b'e' | b'E') => {
                self.consume_byte();
                self.signed_interger_after_exponenet_part()?;
            }
            _ => {}
        }
        self.parse_number(start)
    }

    /// ```text
    /// DecimalLiteral ::
    ///     DecimalIntegerLiteral . DecimalDigits? ExponentPart?
    ///     . DecimalDigits[+Sep] ExponentPart?
    ///     DecimalIntegerLiteral ExponentPart?
    /// ```
    pub(super) fn decimal_literal_after_first_digit(&mut self) -> LexResult<()> {
        self.decimal_digits_after_first_digit()?;

        Ok(())
    }

    /// ```text
    /// DecimalDigits ::
    ///     DecimalDigit
    ///     DecimalDigits DecimalDigit
    ///     DecimalDigits NumericLiteralSeparator DecimalDigit
    ///
    /// DecimalDigit :: one of
    ///     0 1 2 3 4 5 6 7 8 9
    /// ```
    fn decimal_digits(&mut self) -> LexResult<()> {
        let start = self.offset();

        if let Some(b'0'..=b'9') = self.peek_byte() {
            self.consume_byte();
        } else {
            return self.error(start, self.offset(), SyntaxError::NumLitTerminatedWithExp);
        }

        self.decimal_digits_after_first_digit()
    }

    /// ```text
    /// DecimalLiteral ::
    ///     DecimalIntegerLiteral . DecimalDigits? ExponentPart?
    /// ```
    pub(super) fn decimal_literal_after_decimal_point(&mut self) -> LexResult<()> {
        // The parts after `.` in
        //
        //     `.` DecimalDigits? ExponentPart?
        self.optional_decimal_digits()?;
        self.optional_exponent()?;
        Ok(())
    }

    fn optional_decimal_digits(&mut self) -> LexResult<()> {
        if matches!(self.peek_byte(), Some(b'0'..=b'9')) {
            self.decimal_digits()
        } else {
            Ok(())
        }
    }

    /// ```text
    /// DecimalIntegerLiteral ::
    ///     NonZeroDigit NumericLiteralSeparator(opt) DecimalDigits
    /// ```
    fn decimal_digits_after_first_digit(&mut self) -> LexResult<()> {
        let start = self.offset();
        while let Some(next) = self.peek_byte() {
            match next {
                b'_' => {
                    self.consume_byte();

                    if matches!(self.peek_byte(), Some(b'0'..=b'0')) {
                        self.consume_byte();
                    } else {
                        return self.error(
                            start,
                            self.offset(),
                            SyntaxError::NumLitTerminatedWithExp,
                        );
                    }
                }
                b'0'..=b'9' => {
                    self.consume_byte();
                }
                _ => break,
            }
        }

        Ok(())
    }

    /// ```text
    /// 
    /// ExponentPart ::
    ///     ExponentIndicator SignedInteger
    /// ExponentIndicator :: one of
    ///     e E
    /// ```
    fn optional_exponent(&mut self) -> LexResult<bool> {
        if matches!(self.peek_byte(), Some(b'e' | b'E')) {
            self.consume_byte();
            self.signed_interger_after_exponenet_part()?;
            Ok(true)
        } else {
            Ok(false)
        }
    }

    /// ```text
    /// 
    /// SignedInteger ::
    ///     DecimalDigits
    ///     + DecimalDigits
    ///     - DecimalDigits
    /// ```
    fn signed_interger_after_exponenet_part(&mut self) -> LexResult<()> {
        if matches!(self.peek_byte(), Some(b'+' | b'-')) {
            self.consume_byte();
        }

        self.decimal_digits()
    }
}
