//! Parser for unary operations and binary operations.
use super::*;
use crate::token::Keyword;
use log::trace;
use swc_common::Spanned;

impl<'a, I: Tokens> Parser<I> {
    /// Name from spec: 'LogicalORExpression'
    pub(super) fn parse_bin_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_bin_expr);

        let ctx = self.ctx();

        let left = match self.parse_unary_expr() {
            Ok(v) => v,
            Err(err) => {
                trace_cur!(self, parse_bin_expr__recovery_unary_err);

                match cur!(self, true)? {
                    &Word(Word::Keyword(Keyword::In)) if ctx.include_in_expr => {
                        self.emit_err(self.input.cur_span(), SyntaxError::TS1109);

                        Box::new(Expr::Invalid(Invalid { span: err.span() }))
                    }
                    &Word(Word::Keyword(Keyword::InstanceOf)) | &Token::BinOp(..) => {
                        self.emit_err(self.input.cur_span(), SyntaxError::TS1109);

                        Box::new(Expr::Invalid(Invalid { span: err.span() }))
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
    pub(in crate::parser) fn parse_bin_op_recursively(
        &mut self,
        mut left: Box<Expr>,
        mut min_prec: u8,
    ) -> PResult<Box<Expr>> {
        loop {
            let (next_left, next_prec) = self.parse_bin_op_recursively_inner(left, min_prec)?;

            match &*next_left {
                Expr::Bin(BinExpr {
                    span,
                    left,
                    op: op!("&&"),
                    ..
                })
                | Expr::Bin(BinExpr {
                    span,
                    left,
                    op: op!("||"),
                    ..
                }) => match &**left {
                    Expr::Bin(BinExpr { op: op!("??"), .. }) => {
                        self.emit_err(*span, SyntaxError::NullishCoalescingWithLogicalOp);
                    }

                    _ => {}
                },
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
        left: Box<Expr>,
        min_prec: u8,
    ) -> PResult<(Box<Expr>, Option<u8>)> {
        const PREC_OF_IN: u8 = 7;

        if self.input.syntax().typescript()
            && PREC_OF_IN > min_prec
            && !self.input.had_line_break_before_cur()
            && is!(self, "as")
        {
            let start = left.span().lo();
            let expr = left;
            let node = if peeked_is!(self, "const") {
                bump!(self); // as
                let _ = cur!(self, false);
                bump!(self); // const
                Box::new(Expr::TsConstAssertion(TsConstAssertion {
                    span: span!(self, start),
                    expr,
                }))
            } else {
                let type_ann = self.next_then_parse_ts_type()?;
                Box::new(Expr::TsAs(TsAsExpr {
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
            Word(Word::Keyword(Keyword::In)) if ctx.include_in_expr => op!("in"),
            Word(Word::Keyword(Keyword::InstanceOf)) => op!("instanceof"),
            Token::BinOp(op) => op.into(),
            _ => {
                return Ok((left, None));
            }
        };

        if !self.syntax().nullish_coalescing() && op == op!("??") {
            self.emit_err(left.span(), SyntaxError::NullishCoalescingNotEnabled);
        }

        if op.precedence() <= min_prec {
            trace!(
                "returning {:?} without parsing {:?} because min_prec={}, prec={}",
                left,
                op,
                min_prec,
                op.precedence()
            );

            return Ok((left, None));
        }
        bump!(self);
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
            match *left {
                Expr::Bin(BinExpr { span, op, .. }) if op == op!("&&") || op == op!("||") => {
                    self.emit_err(span, SyntaxError::NullishCoalescingWithLogicalOp);
                }
                _ => {}
            }

            match *right {
                Expr::Bin(BinExpr { span, op, .. }) if op == op!("&&") || op == op!("||") => {
                    self.emit_err(span, SyntaxError::NullishCoalescingWithLogicalOp);
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

        return Ok((node, Some(min_prec)));
    }

    /// Parse unary expression and update expression.
    ///
    /// spec: 'UnaryExpression'
    pub(in crate::parser) fn parse_unary_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_unary_expr);
        let start = cur_pos!(self);

        if !self.input.syntax().jsx() && self.input.syntax().typescript() && eat!(self, '<') {
            if eat!(self, "const") {
                expect!(self, '>');
                let expr = self.parse_unary_expr()?;
                return Ok(Box::new(Expr::TsConstAssertion(TsConstAssertion {
                    span: span!(self, start),
                    expr,
                })));
            }

            return self
                .parse_ts_type_assertion(start)
                .map(Expr::from)
                .map(Box::new);
        }

        // Parse update expression
        if is!(self, "++") || is!(self, "--") {
            let op = if bump!(self) == tok!("++") {
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
                    Box::new(Expr::Invalid(Invalid {
                        span: Span::new(arg_start, arg_start, Default::default()),
                    }))
                }
            };
            let span = Span::new(start, arg.span().hi(), Default::default());

            if op == op!("delete") {
                match *arg {
                    Expr::Ident(ref i) => self.emit_strict_mode_err(i.span, SyntaxError::TS1102),
                    _ => {}
                }
            }

            if self.input.syntax().typescript() && op == op!("delete") {
                fn unwrap_paren(e: &Expr) -> &Expr {
                    match *e {
                        Expr::Paren(ref p) => unwrap_paren(&p.expr),
                        _ => e,
                    }
                }
                match &*arg {
                    Expr::Member(..) => {}
                    Expr::OptChain(e)
                        if match &*e.expr {
                            Expr::Member(..) => true,
                            _ => false,
                        } => {}
                    _ => self.emit_err(unwrap_paren(&arg).span(), SyntaxError::TS2703),
                }
            }

            return Ok(Box::new(Expr::Unary(UnaryExpr {
                span: Span::new(start, arg.span().hi(), Default::default()),
                op,
                arg,
            })));
        }

        if (self.ctx().in_async || self.syntax().top_level_await()) && is!(self, "await") {
            return self.parse_await_expr();
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

            let start = cur_pos!(self);
            let op = if bump!(self) == tok!("++") {
                op!("++")
            } else {
                op!("--")
            };

            return Ok(Box::new(Expr::Update(UpdateExpr {
                span: span!(self, expr.span().lo()),
                prefix: false,
                op,
                arg: expr,
            })));
        }
        Ok(expr)
    }

    pub(crate) fn parse_await_expr(&mut self) -> PResult<Box<Expr>> {
        let start = cur_pos!(self);

        assert_and_bump!(self, "await");

        if is!(self, '*') {
            syntax_error!(self, SyntaxError::AwaitStar);
        }

        if is_one_of!(self, ')', ']') && !self.ctx().in_async {
            return Ok(Box::new(Expr::Ident(Ident::new(
                js_word!("await"),
                span!(self, start),
            ))));
        }

        let arg = self.parse_unary_expr()?;
        Ok(Box::new(Expr::Await(AwaitExpr {
            span: span!(self, start),
            arg,
        })))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP as span;
    use swc_ecma_visit::assert_eq_ignore_span;

    fn bin(s: &'static str) -> Box<Expr> {
        test_parser(s, Syntax::default(), |p| p.parse_bin_expr())
    }

    #[test]
    fn simple() {
        assert_eq_ignore_span!(
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
        assert_eq_ignore_span!(
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
