use swc_ecma_lexer::common::parser::expr::parse_member_expr_or_new_expr;

use super::*;

mod ops;
#[cfg(test)]
mod tests;

use crate::parser::Parser;

impl<I: Tokens> Parser<I> {
    pub fn parse_expr(&mut self) -> PResult<Box<Expr>> {
        ParserTrait::parse_expr(self)
    }

    #[allow(dead_code)]
    fn parse_member_expr(&mut self) -> PResult<Box<Expr>> {
        parse_member_expr_or_new_expr(self, false)
    }
}
