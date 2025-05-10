use super::*;
use crate::common::parser::expr::parse_member_expr_or_new_expr;

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub fn parse_expr(&mut self) -> PResult<Box<Expr>> {
        ParserTrait::parse_expr(self)
    }

    #[allow(dead_code)]
    fn parse_member_expr(&mut self) -> PResult<Box<Expr>> {
        parse_member_expr_or_new_expr(self, false)
    }
}
