use super::*;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    pub(super) fn parse_jsx_element(&mut self) -> PResult<'a, (Box<Expr>)> {
        unimplemented!("parse_jsx_element")
    }

    pub(super) fn parse_jsx_text(&mut self) -> PResult<'a, (Box<Expr>)> {
        unimplemented!("parse_jsx_text")
    }
}
