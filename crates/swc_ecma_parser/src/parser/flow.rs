use swc_common::{Span, DUMMY_SP};
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

    pub(super) fn consume_flow_type(&mut self) -> PResult<()> {
        if is!(self, "typeof") {
            return self.parse_flow_type_query();
        }

        if is_one_of!(self, "number", "string") {
            self.input.bump();
            return Ok(());
        }

        Ok(())
    }

    fn parse_flow_type_query(&mut self) -> PResult<()> {
        expect!(self, "typeof");

        self.parse_subscripts(
            swc_ecma_ast::Callee::Expr(Box::new(Expr::Invalid(Invalid { span: DUMMY_SP }))),
            true,
            true,
        )?;

        self.may_consume_flow_generic_def()?;

        Ok(())
    }

    pub(super) fn may_consume_flow_generic_def(&mut self) -> PResult<()> {
        if !is!(self, '<') {
            return Ok(());
        }

        expect!(self, '<');

        while !eof!(self) && !is!(self, '>') {
            self.consume_flow_type()?;
            if !eof!(self) && !is!(self, '>') {
                expect!(self, ',');
            }
        }

        expect!(self, '>');

        Ok(())
    }
}
