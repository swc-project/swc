use crate::{error::Error, lexer::Lexer, token::Token};
use swc_common::Span;
use swc_css_ast::*;

mod at_rule;
mod style_rule;
mod util;
mod value;

pub type PResult<T> = Result<T, Error>;

pub struct Parser<'i> {
    i: Lexer<'i>,
}

impl Parser<'_> {
    pub fn parse(&mut self) -> PResult<Stylesheet> {
        let start = self.i.cur_pos();
        let mut rules = vec![];

        while let Some(..) = self.i.cur() {
            let rule = self.parse_rule()?;

            rules.push(rule);
        }

        Ok(Stylesheet {
            span: Span::new(start, self.i.prev_hi(), Default::default()),
            rules,
        })
    }

    fn parse_rule(&mut self) -> PResult<Rule> {
        assert_ne!(self.i.cur(), None);

        match self.i.cur().unwrap() {
            Token::At => self.parse_at_rule().map(Rule::from),
            _ => self.parse_style_rule().map(From::from),
        }
    }
}
