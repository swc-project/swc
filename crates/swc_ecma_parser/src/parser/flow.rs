#![warn(unused)]

use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::{Expr, Invalid};

use crate::{error::SyntaxError, token::Token, Context, PResult, Parser, Tokens};

impl<I> Parser<I>
where
    I: Tokens,
{
    pub(super) fn consume_flow_type_param_decls(&mut self) -> PResult<()> {
        expect!(self, '<');

        loop {
            if is!(self, '>') {
                break;
            }

            if !eat!(self, IdentName) {
                syntax_error!(self, self.input.cur_span(), SyntaxError::ExpectedIdent);
            }

            if !eof!(self) && !is!(self, '>') {
                expect!(self, ',');
            }
        }

        expect!(self, '>');

        Ok(())
    }

    pub(super) fn consume_flow_type_ann(&mut self) -> PResult<()> {
        expect!(self, ':');

        self.consume_flow_type()?;

        Ok(())
    }

    pub(super) fn consume_flow_type(&mut self) -> PResult<()> {
        self.in_type().consume_flow_union_type()?;

        Ok(())
    }

    pub(super) fn consume_flow_union_type(&mut self) -> PResult<()> {
        eat!(self, '|');

        self.consume_intersection_type()?;

        while eat!(self, '|') && !eof!(self) {
            self.consume_intersection_type()?;
        }

        Ok(())
    }

    fn consume_intersection_type(&mut self) -> PResult<()> {
        eat!(self, '&');

        self.consume_flow_anon_function_without_parens()?;

        while eat!(self, '&') && !eof!(self) {
            self.consume_flow_anon_function_without_parens()?;
        }

        Ok(())
    }

    fn consume_flow_anon_function_without_parens(&mut self) -> PResult<()> {
        self.consume_flow_prefix_type()?;

        Ok(())
    }

    fn consume_flow_prefix_type(&mut self) -> PResult<()> {
        if eat!(self, '?') {
            self.consume_flow_prefix_type()?;
        } else {
            self.consume_flow_postfix_type()?;
        }

        Ok(())
    }

    fn consume_flow_postfix_type(&mut self) -> PResult<()> {
        let start_pos = self.input.cur_pos();
        self.consume_flow_primary_type()?;

        while is_one_of!(self, '[', '?') && !self.input.had_line_break_before_cur() {
            let optional = eat!(self, '?');

            expect!(self, '[');

            if !optional && eat!(self, ']') {
            } else {
                let _index_type = self.consume_flow_type()?;

                expect!(self, ']');
            }
        }

        Ok(())
    }

    fn consume_flow_primary_type(&mut self) -> PResult<()> {
        if is!(self, '{') {
            return self.consume_flow_object_type()?;
        }

        if is!(self, '[') {
            let ctx = Context {
                flow_no_anon_function_type: false,
                ..self.ctx()
            };
            self.with_ctx(ctx).consume_flow_tuple_type()?;
            return Ok(());
        }

        if is!(self, '<') {
            self.consume_flow_type_param_decls()?;
            expect!(self, '(');

            self.consume_flow_type_params()?;

            expect!(self, ')');
            expect!(self, "=>");

            return self.consume_flow_type();
        }

        todo!("consume_flow_primary_type")
    }

    fn consume_flow_tuple_type(&mut self) -> PResult<()> {
        expect!(self, '[');

        self.consume_flow_type()?;

        while eat!(self, ',') && !eof!(self) {
            self.consume_flow_type()?;
        }

        expect!(self, ']');

        Ok(())
    }
}
