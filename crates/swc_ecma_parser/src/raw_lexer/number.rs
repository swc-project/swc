use super::RawLexer;
use crate::{error::SyntaxError, lexer::LexResult};

impl RawLexer<'_> {
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
                self.decimal_digits_after_dot(start)
            }
            Some(b'e' | b'E') => {
                let s = self.str_from_start_to_current(start).replace("_", "");

                let mut value = s.parse::<f64>().or(self.error(
                    start,
                    self.offset(),
                    SyntaxError::NumLitTerminatedWithExp,
                ))?;

                let (sign, count) = self.exponent_part()?;

                let weight = 10u32.pow(count) as f64;

                if sign {
                    value *= weight;
                } else {
                    value /= weight;
                }
                return Ok(value);
            }
            _ => {
                let s = self.str_from_start_to_current(start).replace("_", "");

                return s.parse::<f64>().or(self.error(
                    start,
                    self.offset(),
                    SyntaxError::NumLitTerminatedWithExp,
                ));
            }
        }
    }

    pub(super) fn decimal_digits_after_dot(&mut self, start: u32) -> LexResult<f64> {
        let s = self.str_from_start_to_current(start).replace("_", "");

        self.optional_decimal_digits()?;

        let mut value = s.parse::<f64>().or(self.error(
            start,
            self.offset(),
            SyntaxError::NumLitTerminatedWithExp,
        ))?;

        if matches!(self.peek_byte(), Some(b'e' | b'E')) {
            let (sign, count) = self.exponent_part()?;
            let weight = 10u32.pow(count) as f64;

            if sign {
                value *= weight;
            } else {
                value /= weight;
            }
            Ok(value)
        } else {
            Ok(value)
        }
    }

    fn optional_decimal_digits(&mut self) -> LexResult<()> {
        if let Some(b'0'..=b'9') = self.peek_byte() {
            self.consume_byte();
        } else {
            return Ok(());
        }

        self.decimal_digits_after_first_digit()
    }

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

    /// Parses the exponent part of a number in JavaScript syntax.
    /// Consumes the exponent indicator ('e' or 'E'), then the sign of the
    /// exponent (+ or -), and finally the decimal digits of the exponent.
    /// Returns a tuple indicating the sign of the exponent and the value
    /// of the exponent.
    ///
    /// ## Example
    /// Returns (bool, u32) indicating `+, -` and DecimalDigits
    ///
    /// (true, 13) -> +13
    ///
    /// (false, 14) -> -14
    pub(super) fn exponent_part(&mut self) -> LexResult<(bool, u32)> {
        // Consume 'e' or 'E'
        let exponent_indicator = self.next_byte();

        assert!(exponent_indicator == Some(b'e') || exponent_indicator == Some(b'E'));

        let start = self.offset();

        let sign = match self.next_byte() {
            Some(b'+') => true,
            Some(b'-') => false,
            _ => {
                return self
                    .error_with_single_byte(self.offset(), SyntaxError::InvalidNameInUsingDecl)
            }
        };

        // First byte must be 0..=9
        let mut value = match self.next_byte() {
            Some(b'0'..=b'9') => (self.next_byte().unwrap() - b'0') as u32,
            _ => {
                return self
                    .error_with_single_byte(self.offset(), SyntaxError::InvalidNameInUsingDecl)
            }
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
                            SyntaxError::InvalidNameInUsingDecl,
                        );
                    }
                }
                Some(b'0'..=b'9') => {
                    let next_decimal = (self.next_byte().unwrap() - b'0') as u32;

                    value = value * 10 + next_decimal;
                }
                Some(b'n') => {
                    return self.error(start, self.offset(), SyntaxError::InvalidNameInUsingDecl)
                }
                _ => break,
            }
        }

        Ok((sign, value))
    }
}
