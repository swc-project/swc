use either::Either;
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_lexer::{
    common::parser::{
        class_and_fn::parse_fn_expr,
        expr::{
            parse_array_lit, parse_await_expr, parse_lit, parse_member_expr_or_new_expr,
            parse_paren_expr_or_arrow_fn, parse_primary_expr_rest, parse_this_expr,
            try_parse_async_start, try_parse_regexp,
        },
        object::parse_object_expr,
        typescript::parse_ts_type_assertion,
    },
    error::SyntaxError,
};

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

    pub(super) fn parse_unary_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_unary_expr);
        let start = self.cur_pos();

        if self.input_mut().cur().is_some_and(|cur| cur == &Token::Lt) {
            if self.input().syntax().typescript() && !self.input().syntax().jsx() {
                self.bump(); // consume `<`
                return if self.input_mut().eat(&Token::Const) {
                    self.expect(&Token::Gt)?;
                    let expr = self.parse_unary_expr()?;
                    Ok(TsConstAssertion {
                        span: self.span(start),
                        expr,
                    }
                    .into())
                } else {
                    parse_ts_type_assertion(self, start)
                        .map(Expr::from)
                        .map(Box::new)
                };
            } else if self.input().syntax().jsx()
                && self.input_mut().peek().is_some_and(|peek| {
                    (*peek).is_word() || peek == &Token::Gt || peek.should_rescan_into_gt_in_jsx()
                })
            {
                fn into_expr(e: Either<JSXFragment, JSXElement>) -> Box<Expr> {
                    match e {
                        Either::Left(l) => l.into(),
                        Either::Right(r) => r.into(),
                    }
                }
                return self.parse_jsx_element(true).map(into_expr);
            }
        }

        // Parse update expression
        if self.input_mut().is(&Token::PlusPlus) || self.input_mut().is(&Token::MinusMinus) {
            let op = if self.bump() == Token::PlusPlus {
                op!("++")
            } else {
                op!("--")
            };

            let arg = self.parse_unary_expr()?;
            let span = Span::new(start, arg.span_hi());
            self.check_assign_target(&arg, false);

            return Ok(UpdateExpr {
                span,
                prefix: true,
                op,
                arg,
            }
            .into());
        }

        // Parse unary expression

        if self.input_mut().cur().is_some_and(|cur| {
            cur == &Token::Delete
                || cur == &Token::Void
                || cur == &Token::TypeOf
                || cur == &Token::Plus
                || cur == &Token::Minus
                || cur == &Token::Tilde
                || cur == &Token::Bang
        }) {
            let cur = self.bump();
            let op = if cur == Token::Delete {
                op!("delete")
            } else if cur == Token::Void {
                op!("void")
            } else if cur == Token::TypeOf {
                op!("typeof")
            } else if cur == Token::Plus {
                op!(unary, "+")
            } else if cur == Token::Minus {
                op!(unary, "-")
            } else if cur == Token::Tilde {
                op!("~")
            } else {
                debug_assert!(cur == Token::Bang);
                op!("!")
            };
            let arg_start = self.cur_pos() - BytePos(1);
            let arg = match self.parse_unary_expr() {
                Ok(expr) => expr,
                Err(err) => {
                    self.emit_error(err);
                    Invalid {
                        span: Span::new(arg_start, arg_start),
                    }
                    .into()
                }
            };

            if op == op!("delete") {
                if let Expr::Ident(ref i) = *arg {
                    self.emit_strict_mode_err(i.span, SyntaxError::TS1102)
                }
            }

            return Ok(UnaryExpr {
                span: Span::new(start, arg.span_hi()),
                op,
                arg,
            }
            .into());
        }

        if self.input_mut().is(&Token::Await) {
            return parse_await_expr(self, None);
        }

        // UpdateExpression
        let expr = self.parse_lhs_expr()?;
        if let Expr::Arrow { .. } = *expr {
            return Ok(expr);
        }

        // Line terminator isn't allowed here.
        if self.input_mut().had_line_break_before_cur() {
            return Ok(expr);
        }

        if self
            .input_mut()
            .cur()
            .is_some_and(|cur| cur == &Token::PlusPlus || cur == &Token::MinusMinus)
        {
            self.check_assign_target(&expr, false);

            let op = if self.bump() == Token::PlusPlus {
                op!("++")
            } else {
                op!("--")
            };

            return Ok(UpdateExpr {
                span: self.span(expr.span_lo()),
                prefix: false,
                op,
                arg: expr,
            }
            .into());
        }
        Ok(expr)
    }

    pub(super) fn parse_primary_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_primary_expr);
        let start = self.input_mut().cur_pos();
        let can_be_arrow = self
            .state
            .potential_arrow_start
            .map(|s| s == start)
            .unwrap_or(false);
        if let Some(tok) = self.input.cur() {
            match *tok {
                Token::This => return parse_this_expr(self, start),
                Token::Async => {
                    if let Some(res) = try_parse_async_start(self, can_be_arrow) {
                        return res;
                    }
                }
                Token::LBracket => {
                    return self
                        .do_outside_of_context(Context::WillExpectColonForCond)
                        .parse_with(parse_array_lit);
                }
                Token::LBrace => {
                    return parse_object_expr(self).map(Box::new);
                }
                // Handle FunctionExpression and GeneratorExpression
                Token::Function => {
                    return parse_fn_expr(self);
                }
                // Literals
                Token::Null
                | Token::True
                | Token::False
                | Token::Num
                | Token::BigInt
                | Token::Str => {
                    return parse_lit(self).map(|lit| lit.into());
                }
                // Regexp
                Token::Slash | Token::DivEq => {
                    if let Some(res) = try_parse_regexp(self, start) {
                        return Ok(res);
                    }
                }
                Token::LParen => return parse_paren_expr_or_arrow_fn(self, can_be_arrow, None),
                Token::NoSubstitutionTemplateLiteral => {
                    return Ok(self.parse_no_substitution_template_literal(false)?.into())
                }
                Token::TemplateHead => {
                    // parse template literal
                    return Ok(self
                        .do_outside_of_context(Context::WillExpectColonForCond)
                        .parse_tpl(false)?
                        .into());
                }
                _ => {}
            }
        }

        parse_primary_expr_rest(self, start, can_be_arrow)
    }
}
