use crate::parser::{input::ParserInput, PResult, Parser};
use swc_css_ast::*;

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(crate) fn parse_color(&mut self) -> PResult<AtRule> {
        todo!()
    }
}
