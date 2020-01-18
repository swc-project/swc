//! Parser for unary operations and binary operations.
use super::*;
use crate::token::Keyword;
use log::trace;
use swc_common::Spanned;

#[parser]
impl<'a, I: Tokens> Parser<'a, I> {
    /// Name from spec: 'LogicalORExpression'
    pub(super) fn parse_bin_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let ctx = self.ctx();

        let left = match self.parse_unary_expr() {
            Ok(v) => v,
            Err(mut err) => {
                match {
                    let is_err_token = match self.input.cur() {
                        Some(&Token::Error(..)) => true,
                        _ => false,
                    };
                    if is_err_token {
                        return Err(err);
                    }

                    match cur!(false) {
                        Ok(cur) => cur,
                        Err(..) => return Err(err),
                    }
                } {
                    &Word(Word::Keyword(Keyword::In)) if ctx.include_in_expr => {
                        err.cancel();

                        self.emit_err(self.input.cur_span(), SyntaxError::TS1109);

                        Box::new(Expr::Invalid(Invalid {
                            span: err.span.primary_span().unwrap(),
                        }))
                    }
                    &Word(Word::Keyword(Keyword::InstanceOf)) | &Token::BinOp(..) => {
                        err.cancel();

                        self.emit_err(self.input.cur_span(), SyntaxError::TS1109);

                        Box::new(Expr::Invalid(Invalid {
                            span: err.span.primary_span().unwrap(),
                        }))
                    }
                    _ => return Err(err),
                }
            }
        };

        return_if_arrow!(left);
        self.parse_bin_op_recursively(left, 0)
    }

    /// Parse binary operators with the operator precedence parsing
    /// algorithm. `left` is the left-hand side of the operator.
    /// `minPrec` provides context that allows the function to stop and
    /// defer further parser to one of its callers when it encounters an
    /// operator that has a lower precedence than the set it is parsing.
    ///
    /// `parseExprOp`
    pub(in crate::parser) fn parse_bin_op_recursively(
        &mut self,
        left: Box<Expr>,
        min_prec: u8,
    ) -> PResult<'a, Box<Expr>> {
        const PREC_OF_IN: u8 = 7;

        if self.input.syntax().typescript()
            && PREC_OF_IN > min_prec
            && !self.input.had_line_break_before_cur()
            && is!("as")
        {
            let start = left.span().lo();
            let expr = left;
            let node = if peeked_is!("const") {
                bump!(); // as
                let _ = cur!(false);
                bump!(); // const
                Box::new(Expr::TsConstAssertion(TsConstAssertion {
                    span: span!(start),
                    expr,
                }))
            } else {
                let type_ann = self.next_then_parse_ts_type()?;
                Box::new(Expr::TsAs(TsAsExpr {
                    span: span!(start),
                    expr,
                    type_ann,
                }))
            };

            return self.parse_bin_op_recursively(node, min_prec);
        }

        let ctx = self.ctx();
        // Return left on eof
        let word = match cur!(false) {
            Ok(cur) => cur,
            Err(..) => return Ok(left),
        };
        let op = match *word {
            Word(Word::Keyword(Keyword::In)) if ctx.include_in_expr => op!("in"),
            Word(Word::Keyword(Keyword::InstanceOf)) => op!("instanceof"),
            Token::BinOp(op) => op.into(),
            _ => {
                return Ok(left);
            }
        };

        if !self.syntax().nullish_coalescing() && op == op!("??") {
            syntax_error!(left.span(), SyntaxError::NullishCoalescingNotEnabled)
        }

        if op.precedence() <= min_prec {
            trace!(
                "returning {:?} without parsing {:?} because min_prec={}, prec={}",
                left,
                op,
                min_prec,
                op.precedence()
            );

            return Ok(left);
        }
        bump!();
        trace!(
            "parsing binary op {:?} min_prec={}, prec={}",
            op,
            min_prec,
            op.precedence()
        );

        match *left {
            // This is invalid syntax.
            Expr::Unary { .. } if op == op!("**") => {
                // Correct implementation would be returning Ok(left) and
                // returning "unexpected token '**'" on next.
                // But it's not useful error message.

                syntax_error!(SyntaxError::UnaryInExp {
                    // FIXME: Use display
                    left: format!("{:?}", left),
                    left_span: left.span(),
                })
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
            match *left {
                Expr::Bin(BinExpr { span, op, .. }) if op == op!("&&") || op == op!("||") => {
                    syntax_error!(span, SyntaxError::NullishCoalescingWithLogicalOp);
                }
                _ => {}
            }

            match *right {
                Expr::Bin(BinExpr { span, op, .. }) if op == op!("&&") || op == op!("||") => {
                    syntax_error!(span, SyntaxError::NullishCoalescingWithLogicalOp);
                }
                _ => {}
            }
        }

        let node = Box::new(Expr::Bin(BinExpr {
            span: Span::new(left.span().lo(), right.span().hi(), Default::default()),
            op,
            left,
            right,
        }));

        let expr = self.parse_bin_op_recursively(node, min_prec)?;

        if op == op!("??") {
            match *expr {
                Expr::Bin(BinExpr { span, op, .. }) if op == op!("&&") || op == op!("||") => {
                    syntax_error!(span, SyntaxError::NullishCoalescingWithLogicalOp);
                }

                _ => {}
            }
        }
        Ok(expr)
    }

    /// Parse unary expression and update expression.
    ///
    /// spec: 'UnaryExpression'
    pub(in crate::parser) fn parse_unary_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();

        if !self.input.syntax().jsx() && self.input.syntax().typescript() && eat!('<') {
            if eat!("const") {
                expect!('>');
                let expr = self.parse_unary_expr()?;
                return Ok(Box::new(Expr::TsConstAssertion(TsConstAssertion {
                    span: span!(start),
                    expr,
                })));
            }

            return self
                .parse_ts_type_assertion(start)
                .map(Expr::from)
                .map(Box::new);
        }

        // Parse update expression
        if is!("++") || is!("--") {
            let op = if bump!() == tok!("++") {
                op!("++")
            } else {
                op!("--")
            };

            let arg = self.parse_unary_expr()?;
            let span = Span::new(start, arg.span().hi(), Default::default());
            self.check_assign_target(&arg, false);

            return Ok(Box::new(Expr::Update(UpdateExpr {
                span,
                prefix: true,
                op,
                arg,
            })));
        }

        // Parse unary expression
        if is_one_of!("delete", "void", "typeof", '+', '-', '~', '!') {
            let op = match bump!() {
                tok!("delete") => op!("delete"),
                tok!("void") => op!("void"),
                tok!("typeof") => op!("typeof"),
                tok!('+') => op!(unary, "+"),
                tok!('-') => op!(unary, "-"),
                tok!('~') => op!("~"),
                tok!('!') => op!("!"),
                _ => unreachable!(),
            };
            let arg_start = cur_pos!() - BytePos(1);
            let arg = match self.parse_unary_expr() {
                Ok(expr) => expr,
                Err(mut err) => {
                    err.emit();
                    Box::new(Expr::Invalid(Invalid {
                        span: Span::new(arg_start, arg_start, Default::default()),
                    }))
                }
            };
            let span = Span::new(start, arg.span().hi(), Default::default());

            if self.ctx().strict {
                if op == op!("delete") {
                    match *arg {
                        Expr::Ident(ref i) => self.emit_err(i.span, SyntaxError::TS1102),
                        _ => {}
                    }
                }
            }

            if self.input.syntax().typescript() && op == op!("delete") {
                fn unwrap_paren(e: &Expr) -> &Expr {
                    match *e {
                        Expr::Paren(ref p) => unwrap_paren(&p.expr),
                        _ => e,
                    }
                }
                match *arg {
                    Expr::Member(..) => {}
                    _ => self.emit_err(unwrap_paren(&arg).span(), SyntaxError::TS2703),
                }
            }

            return Ok(Box::new(Expr::Unary(UnaryExpr {
                span: Span::new(start, arg.span().hi(), Default::default()),
                op,
                arg,
            })));
        }

        if self.ctx().in_async && is!("await") {
            return self.parse_await_expr();
        }

        // UpdateExpression
        let expr = self.parse_lhs_expr()?;
        return_if_arrow!(expr);

        // Line terminator isn't allowed here.
        if self.input.had_line_break_before_cur() {
            return Ok(expr);
        }

        if is_one_of!("++", "--") {
            self.check_assign_target(&expr, false);

            let start = cur_pos!();
            let op = if bump!() == tok!("++") {
                op!("++")
            } else {
                op!("--")
            };

            return Ok(Box::new(Expr::Update(UpdateExpr {
                span: span!(expr.span().lo()),
                prefix: false,
                op,
                arg: expr,
            })));
        }
        Ok(expr)
    }

    fn parse_await_expr(&mut self) -> PResult<'a, Box<Expr>> {
        let start = cur_pos!();

        assert_and_bump!("await");
        debug_assert!(self.ctx().in_async);

        if is!('*') {
            syntax_error!(SyntaxError::AwaitStar);
        }

        let arg = self.parse_unary_expr()?;
        Ok(Box::new(Expr::Await(AwaitExpr {
            span: span!(start),
            arg,
        })))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP as span;

    fn bin(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| {
            p.parse_bin_expr().map_err(|mut e| {
                e.emit();
            })
        })
    }

    #[test]
    fn simple() {
        testing::assert_eq_ignore_span!(
            bin("5 + 4 * 7"),
            Box::new(Expr::Bin(BinExpr {
                span,
                op: op!(bin, "+"),
                left: bin("5"),
                right: bin("4 * 7"),
            }))
        );
    }

    #[test]
    fn same_prec() {
        testing::assert_eq_ignore_span!(
            bin("5 + 4 + 7"),
            Box::new(Expr::Bin(BinExpr {
                span,
                op: op!(bin, "+"),
                left: bin("5 + 4"),
                right: bin("7"),
            }))
        );
    }
}
