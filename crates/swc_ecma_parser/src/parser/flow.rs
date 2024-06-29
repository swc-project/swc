#![warn(unused)]

use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::{Expr, Invalid};

use crate::{error::SyntaxError, token::Token, PResult, Parser, Tokens};

impl<I> Parser<I>
where
    I: Tokens,
{
    pub(super) fn consume_flow_type_params(&mut self) -> PResult<()> {
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
        if is!(self, "typeof") {
            return self.parse_flow_type_query();
        }

        if is_one_of!(self, "number", "string") {
            self.input.bump();
            return Ok(());
        }

        if is!(self, IdentName) {
            return self.parse_flow_ident_or_member_expr();
        }

        if is!(self, '(') {
            return self.consume_flow_fn_type();
        }

        if is!(self, '[') {
            return self.consume_flow_tuple_type();
        }

        if is!(self, '{') {
            return self.consume_flow_object_type();
        }

        unexpected!(self, "flow type")
    }

    fn parse_flow_ident_or_member_expr(&mut self) -> PResult<()> {
        loop {
            if !eat!(self, IdentName) {
                break;
            }

            if is!(self, '.') {
                self.input.bump();
            } else {
                break;
            }
        }

        Ok(())
    }

    fn parse_flow_type_query(&mut self) -> PResult<()> {
        assert_and_bump!(self, "typeof");

        self.parse_flow_ident_or_member_expr()?;

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

    pub(super) fn consume_flow_tuple_type(&mut self) -> PResult<()> {
        expect!(self, '[');

        while !eof!(self) && !is!(self, ']') {
            self.consume_flow_type()?;
            if !eof!(self) && !is!(self, ']') {
                expect!(self, ',');
            }
        }

        expect!(self, ']');

        Ok(())
    }

    pub(super) fn consume_flow_object_type(&mut self) -> PResult<()> {
        expect!(self, '{');

        while !eof!(self) && !is!(self, '}') {
            self.consume_flow_object_property()?;
        }

        expect!(self, '}');

        Ok(())
    }

    pub(super) fn consume_flow_object_property(&mut self) -> PResult<()> {
        if is!(self, "get") || is!(self, "set") {
            self.input.bump();
        }

        if is!(self, IdentName) {
            self.input.bump();
        } else {
            syntax_error!(self, self.input.cur_span(), SyntaxError::ExpectedIdent);
        }

        if is!(self, '(') {
            self.consume_flow_fn_type()?;
        } else {
            self.consume_flow_type()?;
        }

        Ok(())
    }

    pub(super) fn consume_flow_fn_type(&mut self) -> PResult<()> {
        expect!(self, '(');

        while !eof!(self) && !is!(self, ')') {
            self.consume_flow_type()?;
            if !eof!(self) && !is!(self, ')') {
                expect!(self, ',');
            }
        }

        expect!(self, ')');

        if is!(self, "=>") {
            self.input.bump();
            self.consume_flow_type()?;
        }

        Ok(())
    }
}
