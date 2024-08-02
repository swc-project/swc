use super::{Kind, Lexer, Token};

impl<'a> Lexer<'a> {
    /// Section 12.8 Punctuators
    pub(super) fn read_dot(&mut self) -> Kind {
        if self.peek() == Some('.') && self.peek2() == Some('.') {
            self.consume_char();
            self.consume_char();
            return Kind::Dot3;
        }
        if self.peek().is_some_and(|c| c.is_ascii_digit()) {
            self.decimal_literal_after_decimal_point()
        } else {
            Kind::Dot
        }
    }

    /// returns None for `SingleLineHTMLOpenComment` `<!--` in script mode
    pub(super) fn read_left_angle(&mut self) -> Option<Kind> {
        if self.next_eq('<') {
            if self.next_eq('=') {
                Some(Kind::ShiftLeftEq)
            } else {
                Some(Kind::ShiftLeft)
            }
        } else if self.next_eq('=') {
            Some(Kind::LtEq)
        } else if self.peek() == Some('!')
            // SingleLineHTMLOpenComment `<!--` in script mode
            && self.source_type.is_script()
            && self.remaining().starts_with("!--")
        {
            None
        } else {
            Some(Kind::LAngle)
        }
    }

    /// returns None for `SingleLineHTMLCloseComment` `-->` in script mode
    pub(super) fn read_minus(&mut self) -> Option<Kind> {
        if self.next_eq('-') {
            // SingleLineHTMLCloseComment `-->` in script mode
            if self.token.is_on_new_line && self.source_type.is_script() && self.next_eq('>') {
                None
            } else {
                Some(Kind::Minus2)
            }
        } else if self.next_eq('=') {
            Some(Kind::MinusEq)
        } else {
            Some(Kind::Minus)
        }
    }

    pub(crate) fn next_right_angle(&mut self) -> Token {
        let kind = self.read_right_angle();
        self.lookahead.clear();
        self.finish_next(kind)
    }

    fn read_right_angle(&mut self) -> Kind {
        if self.next_eq('>') {
            if self.next_eq('>') {
                if self.next_eq('=') {
                    Kind::ShiftRight3Eq
                } else {
                    Kind::ShiftRight3
                }
            } else if self.next_eq('=') {
                Kind::ShiftRightEq
            } else {
                Kind::ShiftRight
            }
        } else if self.next_eq('=') {
            Kind::GtEq
        } else {
            Kind::RAngle
        }
    }
}
