//! Parser for unary operations and binary operations.
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::{arena::*, op};
use tracing::trace;

use super::Parser;
use crate::{error::SyntaxError, token::Token, PResult, Tokens};

impl<'a, I: Tokens> Parser<'a, I> {
    /// Name from spec: 'LogicalORExpression'
    pub(crate) fn parse_bin_expr(&mut self) -> PResult<Expr<'a>> {
        trace_cur!(self, parse_bin_expr);

        let ctx = self.ctx();

        let left = match self.parse_unary_expr() {
            Ok(v) => v,
            Err(err) => {
                trace_cur!(self, parse_bin_expr__recovery_unary_err);

                match cur!(self, true) {
                    &tok!("in") if ctx.include_in_expr => {
                        self.emit_err(self.input.cur_span(), SyntaxError::TS1109);

                        Expr::Invalid(self.ast(Invalid { span: err.span() }))
                    }
                    &tok!("instanceof") | &Token::BinOp(..) => {
                        self.emit_err(self.input.cur_span(), SyntaxError::TS1109);

                        Expr::Invalid(self.ast(Invalid { span: err.span() }))
                    }
                    _ => return Err(err),
                }
            }
        };

        return_if_arrow!(self, left);
        self.parse_bin_op_recursively(left, 0)
    }

    /// Parse binary operators with the operator precedence parsing
    /// algorithm. `left` is the left-hand side of the operator.
    /// `minPrec` provides context that allows the function to stop and
    /// defer further parser to one of its callers when it encounters an
    /// operator that has a lower precedence than the set it is parsing.
    ///
    /// `parseExprOp`
    pub(crate) fn parse_bin_op_recursively(
        &mut self,
        mut left: Expr<'a>,
        mut min_prec: u8,
    ) -> PResult<Expr<'a>> {
        loop {
            let (next_left, next_prec) = self.parse_bin_op_recursively_inner(left, min_prec)?;

            match &next_left {
                Expr::Bin(bin_expr) if bin_expr.op == op!("&&") || bin_expr.op == op!("||") => {
                    if bin_expr
                        .left
                        .as_bin()
                        .map_or(false, |bin| bin.op == op!("??"))
                    {
                        self.emit_err(bin_expr.span(), SyntaxError::NullishCoalescingWithLogicalOp);
                    }
                }
                _ => {}
            }

            min_prec = match next_prec {
                Some(v) => v,
                None => return Ok(next_left),
            };

            left = next_left;
        }
    }

    /// Returns `(left, Some(next_prec))` or `(expr, None)`.
    fn parse_bin_op_recursively_inner(
        &mut self,
        left: Expr<'a>,
        min_prec: u8,
    ) -> PResult<(Expr<'a>, Option<u8>)> {
        const PREC_OF_IN: u8 = 7;

        if self.input.syntax().typescript()
            && PREC_OF_IN > min_prec
            && !self.input.had_line_break_before_cur()
            && is!(self, "as")
        {
            let start = left.span_lo();
            let expr = left;
            let node = if peeked_is!(self, "const") {
                bump!(self); // as
                let _ = cur!(self, false);
                bump!(self); // const
                Expr::TsConstAssertion(self.ast(TsConstAssertion {
                    span: span!(self, start),
                    expr,
                }))
            } else {
                let type_ann = self.next_then_parse_ts_type()?;
                Expr::TsAs(self.ast(TsAsExpr {
                    span: span!(self, start),
                    expr,
                    type_ann,
                }))
            };

            return self.parse_bin_op_recursively_inner(node, min_prec);
        }
        if self.input.syntax().typescript()
            && !self.input.had_line_break_before_cur()
            && is!(self, "satisfies")
        {
            let start = left.span_lo();
            let expr = left;
            let node = {
                let type_ann = self.next_then_parse_ts_type()?;
                Expr::TsSatisfies(self.ast(TsSatisfiesExpr {
                    span: span!(self, start),
                    expr,
                    type_ann,
                }))
            };

            return self.parse_bin_op_recursively_inner(node, min_prec);
        }

        let ctx = self.ctx();
        // Return left on eof
        let word = match cur!(self, false) {
            Ok(cur) => cur,
            Err(..) => return Ok((left, None)),
        };
        let op = match *word {
            tok!("in") if ctx.include_in_expr => op!("in"),
            tok!("instanceof") => op!("instanceof"),
            Token::BinOp(op) => op.into(),
            _ => {
                return Ok((left, None));
            }
        };

        if op.precedence() <= min_prec {
            if cfg!(feature = "debug") {
                trace!(
                    "returning {:?} without parsing {:?} because min_prec={}, prec={}",
                    left,
                    op,
                    min_prec,
                    op.precedence()
                );
            }

            return Ok((left, None));
        }
        bump!(self);
        if cfg!(feature = "debug") {
            trace!(
                "parsing binary op {:?} min_prec={}, prec={}",
                op,
                min_prec,
                op.precedence()
            );
        }
        match left {
            // This is invalid syntax.
            Expr::Unary { .. } | Expr::Await(..) if op == op!("**") => {
                // Correct implementation would be returning Ok(left) and
                // returning "unexpected token '**'" on next.
                // But it's not useful error message.

                syntax_error!(
                    self,
                    SyntaxError::UnaryInExp {
                        // FIXME: Use display
                        left: format!("{:?}", left),
                        left_span: left.span(),
                    }
                )
            }
            _ => {}
        }

        let right = {
            let left_of_right = self.parse_unary_expr()?;
            self.parse_bin_op_recursively(
                left_of_right,
                if op == op!("**") {
                    // exponential operator is right associative
                    op.precedence() - 1
                } else {
                    op.precedence()
                },
            )?
        };
        /* this check is for all ?? operators
         * a ?? b && c for this example
         * b && c => This is considered as a logical expression in the ast tree
         * a => Identifier
         * so for ?? operator we need to check in this case the right expression to
         * have parenthesis second case a && b ?? c
         * here a && b => This is considered as a logical expression in the ast tree
         * c => identifier
         * so now here for ?? operator we need to check the left expression to have
         * parenthesis if the parenthesis is missing we raise an error and
         * throw it
         */
        if op == op!("??") {
            match &left {
                Expr::Bin(bin_expr) if bin_expr.op == op!("&&") || bin_expr.op == op!("||") => {
                    self.emit_err(bin_expr.span, SyntaxError::NullishCoalescingWithLogicalOp);
                }
                _ => {}
            }

            match &right {
                Expr::Bin(bin_expr) if bin_expr.op == op!("&&") || bin_expr.op == op!("||") => {
                    self.emit_err(bin_expr.span, SyntaxError::NullishCoalescingWithLogicalOp);
                }
                _ => {}
            }
        }

        let node = Expr::Bin(self.ast(BinExpr {
            span: Span::new(left.span_lo(), right.span_hi()),
            op,
            left,
            right,
        }));

        Ok((node, Some(min_prec)))
    }

    /// Parse unary expression and update expression.
    ///
    /// spec: 'UnaryExpression'
    pub(crate) fn parse_unary_expr(&mut self) -> PResult<Expr<'a>> {
        trace_cur!(self, parse_unary_expr);
        let start = cur_pos!(self);

        if !self.input.syntax().jsx() && self.input.syntax().typescript() && eat!(self, '<') {
            if eat!(self, "const") {
                expect!(self, '>');
                let expr = self.parse_unary_expr()?;
                return Ok(Expr::TsConstAssertion(self.ast(TsConstAssertion {
                    span: span!(self, start),
                    expr,
                })));
            }

            return self
                .parse_ts_type_assertion(start)
                .map(|expr| self.ast(expr))
                .map(Expr::from);
        }

        // Parse update expression
        if is!(self, "++") || is!(self, "--") {
            let op = if bump!(self) == tok!("++") {
                op!("++")
            } else {
                op!("--")
            };

            let arg = self.parse_unary_expr()?;
            let span = Span::new(start, arg.span_hi());
            self.check_assign_target(&arg, false);

            return Ok(Expr::Update(self.ast(UpdateExpr {
                span,
                prefix: true,
                op,
                arg,
            })));
        }

        // Parse unary expression
        if is_one_of!(self, "delete", "void", "typeof", '+', '-', '~', '!') {
            let op = match bump!(self) {
                tok!("delete") => op!("delete"),
                tok!("void") => op!("void"),
                tok!("typeof") => op!("typeof"),
                tok!('+') => op!(unary, "+"),
                tok!('-') => op!(unary, "-"),
                tok!('~') => op!("~"),
                tok!('!') => op!("!"),
                _ => unreachable!(),
            };
            let arg_start = cur_pos!(self) - BytePos(1);
            let arg = match self.parse_unary_expr() {
                Ok(expr) => expr,
                Err(err) => {
                    self.emit_error(err);
                    Expr::Invalid(self.ast(Invalid {
                        span: Span::new(arg_start, arg_start),
                    }))
                }
            };

            if op == op!("delete") {
                if let Expr::Ident(ref i) = arg {
                    self.emit_strict_mode_err(i.span, SyntaxError::TS1102)
                }
            }

            if self.input.syntax().typescript() && op == op!("delete") {
                match arg.unwrap_parens() {
                    Expr::Member(..) => {}
                    Expr::OptChain(opt_chain_expr) if opt_chain_expr.base.is_member() => {}
                    expr => {
                        self.emit_err(expr.span(), SyntaxError::TS2703);
                    }
                }
            }

            return Ok(Expr::Unary(self.ast(UnaryExpr {
                span: Span::new(start, arg.span_hi()),
                op,
                arg,
            })));
        }

        if is!(self, "await") {
            return self.parse_await_expr(None);
        }

        // UpdateExpression
        let expr = self.parse_lhs_expr()?;
        return_if_arrow!(self, expr);

        // Line terminator isn't allowed here.
        if self.input.had_line_break_before_cur() {
            return Ok(expr);
        }

        if is_one_of!(self, "++", "--") {
            self.check_assign_target(&expr, false);

            let op = if bump!(self) == tok!("++") {
                op!("++")
            } else {
                op!("--")
            };

            return Ok(Expr::Update(self.ast(UpdateExpr {
                span: span!(self, expr.span_lo()),
                prefix: false,
                op,
                arg: expr,
            })));
        }
        Ok(expr)
    }

    pub(crate) fn parse_await_expr(
        &mut self,
        start_of_await_token: Option<BytePos>,
    ) -> PResult<Expr<'a>> {
        let start = start_of_await_token.unwrap_or_else(|| cur_pos!(self));

        if start_of_await_token.is_none() {
            assert_and_bump!(self, "await");
        }

        if is!(self, '*') {
            syntax_error!(self, SyntaxError::AwaitStar);
        }

        let ctx = self.ctx();

        let span = span!(self, start);

        if is_one_of!(self, ')', ']', ';', ',') && !ctx.in_async {
            if ctx.module {
                self.emit_err(span, SyntaxError::InvalidIdentInAsync);
            }

            return Ok(Expr::Ident(
                self.ast(Ident::new_no_ctxt("await".into(), span)),
            ));
        }

        if ctx.in_function && !ctx.in_async {
            self.emit_err(self.input.cur_span(), SyntaxError::AwaitInFunction);
        }

        if ctx.in_parameters && !ctx.in_function {
            self.emit_err(span, SyntaxError::AwaitParamInAsync);
        }

        let arg = self.parse_unary_expr()?;
        Ok(Expr::Await(self.ast(AwaitExpr {
            span: span!(self, start),
            arg,
        })))
    }
}

#[cfg(test)]
mod tests {
    use swc_allocator::arena::{Allocator, Box};
    use swc_common::DUMMY_SP as span;
    use swc_ecma_ast::{arena::*, op};
    use swc_ecma_visit::assert_eq_ignore_span_arena;

    use crate::{arena::parser::test_parser, Syntax};

    fn bin<'a>(alloc: &'a Allocator, s: &'static str) -> Expr<'a> {
        test_parser(alloc, s, Syntax::default(), |p| p.parse_bin_expr())
    }

    #[test]
    fn simple() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            bin(&alloc, "5 + 4 * 7"),
            Expr::Bin(Box::new_in(
                BinExpr {
                    span,
                    op: op!(bin, "+"),
                    left: bin(&alloc, "5"),
                    right: bin(&alloc, "4 * 7"),
                },
                &alloc
            ))
        );
    }

    #[test]
    fn same_prec() {
        let alloc = Allocator::default();
        assert_eq_ignore_span_arena!(
            bin(&alloc, "5 + 4 + 7"),
            Expr::Bin(Box::new_in(
                BinExpr {
                    span,
                    op: op!(bin, "+"),
                    left: bin(&alloc, "5 + 4"),
                    right: bin(&alloc, "7"),
                },
                &alloc
            ))
        );
    }
}
