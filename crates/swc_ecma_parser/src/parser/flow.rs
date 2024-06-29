use swc_common::DUMMY_SP;
use swc_ecma_ast::{Expr, Invalid};

use crate::{token::Token, PResult, Parser, Tokens};

impl<I> Parser<I>
where
    I: Tokens,
{
    pub(super) fn consume_flow_type_ann(&mut self) -> PResult<()> {
        expect!(self, ':');

        self.consume_flow_type()?;

        Ok(())
    }

    fn consume_flow_type(&mut self) -> PResult<()> {
        if is!(self, "typeof") {
            return self.parse_flow_type_query();
        }
        todo!("consume_flow_type")
    }

    fn parse_flow_type_query(&mut self) -> PResult<()> {
        expect!(self, "typeof");

        self.parse_subscripts(
            swc_ecma_ast::Callee::Expr(Box::new(Expr::Invalid(Invalid { span: DUMMY_SP }))),
            true,
            true,
        )?;

        Ok(())
    }
}
