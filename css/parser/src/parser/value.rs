use crate::{token::Token, PResult, Parser, SyntaxError};
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_value(&mut self) -> PResult<Value> {
        trace_cur!(self, parse_value);

        let word = self.parse_opt_word()?;

        match word {
            Some(v) => return Ok(Value::Text(v)),
            None => {}
        }

        match cur!(self) {
            Token::Str => self.parse_str().map(Value::Str),

            Token::Error
            | Token::Semi
            | Token::Colon
            | Token::Comma
            | Token::At
            | Token::Dot
            | Token::RParen
            | Token::RBrace
            | Token::LBrace
            | Token::Mul
            | Token::LBracket
            | Token::RBracket
            | Token::Lt
            | Token::Eq
            | Token::DollarEq
            | Token::MulEq
            | Token::XorEq
            | Token::OrEq
            | Token::TildeEq
            | Token::Gt
            | Token::Tilde
            | Token::BangImportant => {
                let got = format!("{:?}", self.i.cur().unwrap());
                self.err(SyntaxError::ExpectedOneOf {
                    expected: "value".into(),
                    got,
                })
            }

            Token::LParen => self.parse_paren_value().map(Value::Paren),
            Token::Minus | Token::Plus => self.parse_numeric_valie(),
            Token::Hash => self.parse_hash_value(),

            Token::Ident | Token::Px => unreachable!(),
        }
    }

    fn parse_paren_value(&mut self) -> PResult<ParenValue> {
        trace_cur!(self, parse_paren_value);

        debug_assert_eq!(self.i.cur(), Some(Token::LParen));
        let start = self.i.cur_pos();

        self.i.bump(); // '('

        let value = self.parse_value().map(Box::new)?;

        expect!(self, ")");

        Ok(ParenValue {
            span: self.i.make_span(start),
            value,
        })
    }

    fn parse_numeric_valie(&mut self) -> PResult<Value> {
        trace_cur!(self, parse_numeric_valie);

        let _is_plus = match self.i.cur() {
            Some(Token::Plus) => {
                self.i.bump(); // '+'

                true
            }
            Some(Token::Minus) => {
                self.i.bump(); // '-'

                false
            }
            _ => unreachable!(),
        };

        unimplemented!("parse_numeric_valie")
    }

    fn parse_hash_value(&mut self) -> PResult<Value> {
        trace_cur!(self, parse_hash_value);

        unimplemented!("parse_hash_value")
    }
}
