use crate::{token::Token, PResult, Parser, SyntaxError};
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_value(&mut self) -> PResult<Value> {
        let word = self.parse_opt_word()?;

        match word {
            Some(v) => return Ok(Value::Text(v)),
            None => {}
        }

        match self.i.cur().unwrap() {
            Token::Str => {
                let s = self.parse_str()?;

                return Ok(Value::Str(s));
            }

            Token::Error
            | Token::Semi
            | Token::Colon
            | Token::Comma
            | Token::At
            | Token::Dot
            | Token::RParen
            | Token::RBrace
            | Token::LBrace
            | Token::BangImportant => self.err(SyntaxError::ExpectedOneOf {
                expected: "value".into(),
                got: format!("{:?}", self.i.cur().unwrap()),
            }),

            Token::LParen => return self.parse_paren_value().map(Value::Paren),
            Token::Plus => {}
            Token::Minus => {}
            Token::Hash => {}

            Token::Ident | Token::Px => unreachable!(),
        }
    }

    fn parse_paren_value(&mut self) -> PResult<ParenValue> {
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
}
