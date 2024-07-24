use super::{Kind, Lexer, Span};
use crate::{diagnostics, syntax::identifier::is_identifier_start};

impl<'a> Lexer<'a> {
    /// 12.9.3 Numeric Literals with `0` prefix
    pub(super) fn read_zero(&mut self) -> Kind {
        match self.peek() {
            Some('b' | 'B') => self.read_non_decimal(Kind::Binary),
            Some('o' | 'O') => self.read_non_decimal(Kind::Octal),
            Some('x' | 'X') => self.read_non_decimal(Kind::Hex),
            Some('e' | 'E') => {
                self.consume_char();
                self.read_decimal_exponent()
            }
            Some('.') => {
                self.consume_char();
                self.decimal_literal_after_decimal_point_after_digits()
            }
            Some('n') => {
                self.consume_char();
                self.check_after_numeric_literal(Kind::Decimal)
            }
            Some(n) if n.is_ascii_digit() => self.read_legacy_octal(),
            _ => self.check_after_numeric_literal(Kind::Decimal),
        }
    }

    pub(super) fn decimal_literal_after_first_digit(&mut self) -> Kind {
        self.read_decimal_digits_after_first_digit();
        if self.next_eq('.') {
            return self.decimal_literal_after_decimal_point_after_digits();
        } else if self.next_eq('n') {
            return self.check_after_numeric_literal(Kind::Decimal);
        }

        let kind = self.optional_exponent().map_or(Kind::Decimal, |kind| kind);
        self.check_after_numeric_literal(kind)
    }

    fn read_non_decimal(&mut self, kind: Kind) -> Kind {
        self.consume_char();

        if self.peek().is_some_and(|c| kind.matches_number_char(c)) {
            self.consume_char();
        } else {
            self.unexpected_err();
            return Kind::Undetermined;
        }

        while let Some(c) = self.peek() {
            match c {
                '_' => {
                    self.consume_char();
                    // NOTE: it looks invalid numeric tokens are still parsed.
                    // This seems to be a waste. It also requires us to put this
                    // call here instead of after we ensure the next character
                    // is a number character
                    self.token.set_has_separator();
                    if self.peek().is_some_and(|c| kind.matches_number_char(c)) {
                        self.consume_char();
                    } else {
                        self.unexpected_err();
                        return Kind::Undetermined;
                    }
                }
                c if kind.matches_number_char(c) => {
                    self.consume_char();
                }
                _ => break,
            }
        }
        if self.peek() == Some('n') {
            self.consume_char();
        }
        self.check_after_numeric_literal(kind)
    }

    fn read_legacy_octal(&mut self) -> Kind {
        let mut kind = Kind::Octal;
        loop {
            match self.peek() {
                Some('0'..='7') => {
                    self.consume_char();
                }
                Some('8'..='9') => {
                    self.consume_char();
                    kind = Kind::Decimal;
                }
                _ => break,
            }
        }

        match self.peek() {
            // allow 08.5 and 09.5
            Some('.') if kind == Kind::Decimal => {
                self.consume_char();
                self.decimal_literal_after_decimal_point_after_digits()
            }
            // allow 08e1 and 09e1
            Some('e') if kind == Kind::Decimal => {
                self.consume_char();
                self.read_decimal_exponent()
            }
            _ => self.check_after_numeric_literal(kind),
        }
    }

    fn read_decimal_exponent(&mut self) -> Kind {
        let kind = match self.peek() {
            Some('-') => {
                self.consume_char();
                Kind::NegativeExponential
            }
            Some('+') => {
                self.consume_char();
                Kind::PositiveExponential
            }
            _ => Kind::PositiveExponential,
        };
        self.read_decimal_digits();
        kind
    }

    fn read_decimal_digits(&mut self) {
        if self.peek().is_some_and(|c| c.is_ascii_digit()) {
            self.consume_char();
        } else {
            self.unexpected_err();
            return;
        }

        self.read_decimal_digits_after_first_digit();
    }

    fn read_decimal_digits_after_first_digit(&mut self) {
        while let Some(c) = self.peek() {
            match c {
                '_' => {
                    self.consume_char();
                    // NOTE: it looks invalid numeric tokens are still parsed.
                    // This seems to be a waste. It also requires us to put this
                    // call here instead of after we ensure the next character
                    // is an ASCII digit
                    self.token.set_has_separator();
                    if self.peek().is_some_and(|c| c.is_ascii_digit()) {
                        self.consume_char();
                    } else {
                        self.unexpected_err();
                        return;
                    }
                }
                '0'..='9' => {
                    self.consume_char();
                }
                _ => break,
            }
        }
    }

    pub(super) fn decimal_literal_after_decimal_point(&mut self) -> Kind {
        self.read_decimal_digits();
        self.optional_exponent();
        self.check_after_numeric_literal(Kind::Float)
    }

    fn decimal_literal_after_decimal_point_after_digits(&mut self) -> Kind {
        self.optional_decimal_digits();
        self.optional_exponent();
        self.check_after_numeric_literal(Kind::Float)
    }

    fn optional_decimal_digits(&mut self) {
        if self.peek().is_some_and(|c| c.is_ascii_digit()) {
            self.consume_char();
        } else {
            return;
        }
        self.read_decimal_digits_after_first_digit();
    }

    fn optional_exponent(&mut self) -> Option<Kind> {
        if matches!(self.peek(), Some('e' | 'E')) {
            self.consume_char();
            return Some(self.read_decimal_exponent());
        }
        None
    }

    fn check_after_numeric_literal(&mut self, kind: Kind) -> Kind {
        let offset = self.offset();
        // The SourceCharacter immediately following a NumericLiteral must not be an
        // IdentStart or DecimalDigit.
        let c = self.peek();
        if c.is_none() || c.is_some_and(|ch| !ch.is_ascii_digit() && !is_identifier_start(ch)) {
            return kind;
        }
        self.consume_char();
        while let Some(c) = self.peek() {
            if is_identifier_start(c) {
                self.consume_char();
            } else {
                break;
            }
        }
        self.error(diagnostics::invalid_number_end(Span::new(
            offset,
            self.offset(),
        )));
        Kind::Undetermined
    }
}
