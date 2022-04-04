use swc_common::Span;
use swc_html_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::Parse;

impl<I> Parse<Document> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Document> {
        let start = self.input.cur_span()?;

        let mut children = vec![];

        while !is_one_of!(self, EOF) {
            children.extend(self.input.bump()?);
        }

        let last = self.input.last_pos()?;

        Ok(Document {
            span: Span::new(start.lo, last, Default::default()),
            children,
        })
    }
}
