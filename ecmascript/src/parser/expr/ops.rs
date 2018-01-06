//! Parser for unary operations and binary operations.

use super::*;

#[parser]
impl<I: Input> Parser<I> {
    /// Name from spec: 'LogicalORExpression'
    pub(super) fn parse_bin_expr(&mut self) -> PResult<Box<Expr>> {
        let left = self.parse_unary_expr()?;

        return_if_arrow!(left);
        self.parse_bin_op_recursively(left, 0)
    }

    /// Parse binary operators with the operator precedence parsing
    /// algorithm. `left` is the left-hand side of the operator.
    /// `minPrec` provides context that allows the function to stop and
    /// defer further parser to one of its callers when it encounters an
    /// operator that has a lower precedence than the set it is parsing.
    fn parse_bin_op_recursively(&mut self, left: Box<Expr>, min_prec: u8) -> PResult<Box<Expr>> {
        let op = match {
            // Return left on eof
            match cur!() {
                Some(cur) => cur,
                None => return Ok(left),
            }
        } {
            &Word(Keyword(In)) if self.ctx.include_in_expr => BinaryOp::In,
            &Word(Keyword(InstanceOf)) => BinaryOp::InstanceOf,
            &BinOp(op) => op.into(),
            _ => {
                return Ok(left);
            }
        };

        if op.precedence() <= min_prec {
            trace!(
                self.logger,
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
            self.logger,
            "parsing binary op {:?} min_prec={}, prec={}",
            op,
            min_prec,
            op.precedence()
        );

        match left.node {
            // This is invalid syntax.
            ExprKind::Unary { .. } if op == BinaryOp::Exp => {
                // Correct implementation would be returning Ok(left) and
                // returning "unexpected token '**'" on next.
                // But it's not useful error message.

                syntax_error!(SyntaxError::UnaryInExp)
            }
            _ => {}
        }

        let right = {
            let left_of_right = self.parse_unary_expr()?;
            self.parse_bin_op_recursively(
                left_of_right,
                if op == BinaryOp::Exp {
                    // exponential operator is right associative
                    op.precedence() - 1
                } else {
                    op.precedence()
                },
            )?
        };

        let node = box Expr {
            span: left.span + right.span,
            node: ExprKind::Binary { op, left, right },
        };

        let expr = self.parse_bin_op_recursively(node, min_prec)?;
        Ok(expr)
    }

    /// Parse unary expression and update expression.
    ///
    /// spec: 'UnaryExpression'
    fn parse_unary_expr(&mut self) -> PResult<Box<Expr>> {
        // Parse update expression
        if is!("++") || is!("--") {
            let start = cur_span!();
            let op = if bump!() == PlusPlus {
                UpdateOp::PlusPlus
            } else {
                UpdateOp::MinusMinus
            };

            let arg = self.parse_unary_expr()?;
            let span = start + arg.span;
            return Ok(box Expr {
                span,
                node: ExprKind::Update {
                    prefix: true,
                    op,
                    arg,
                },
            });
        }

        // Parse unary expression
        if is_one_of!("delete", "void", "typeof", '+', '-', '~', '!') {
            let op = match bump!() {
                Word(Keyword(Delete)) => UnaryOp::Delete,
                Word(Keyword(Void)) => UnaryOp::Void,
                Word(Keyword(TypeOf)) => UnaryOp::TypeOf,
                BinOp(Add) => UnaryOp::Plus,
                BinOp(Sub) => UnaryOp::Minus,
                Tilde => UnaryOp::Tilde,
                Bang => UnaryOp::Bang,
                _ => unreachable!(),
            };
            let arg = self.parse_unary_expr()?;
            return Ok(box Expr {
                span: prev_span!() + arg.span,
                node: ExprKind::Unary {
                    prefix: true,
                    op,
                    arg,
                },
            });
        }

        if self.ctx.in_async && is!("await") {
            return self.parse_await_expr();
        }

        // UpdateExpression
        let expr = self.parse_lhs_expr()?;
        return_if_arrow!(expr);

        //TODO: Handle ASI
        if is_one_of!("++", "--") {
            let start = cur_span!();
            let op = if bump!() == PlusPlus {
                UpdateOp::PlusPlus
            } else {
                UpdateOp::MinusMinus
            };

            let span = start + expr.span;
            return Ok(box Expr {
                span,
                node: ExprKind::Update {
                    prefix: false,
                    op,
                    arg: expr,
                },
            });
        }
        Ok(expr)
    }

    fn parse_await_expr(&mut self) -> PResult<Box<Expr>> {
        spanned!({
            assert_and_bump!("await");
            assert!(self.ctx.in_async);

            if is!('*') {
                syntax_error!(SyntaxError::AwaitStar)
            }

            let arg = self.parse_unary_expr()?;
            Ok(ExprKind::Await { arg })
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lexer::Lexer;

    fn mk<'a>(s: &'static str) -> Parser<impl 'a + Input> {
        let logger = ::testing::logger().new(o!("src" => s));
        Parser::new_for_module(logger.clone(), Lexer::new_from_str(logger, s))
    }

    fn bin(s: &'static str) -> Box<Expr> {
        let expr = mk(s).parse_bin_expr();
        expr.unwrap_or_else(|err| {
            panic!("failed to parse '{}' as a binary expression: {:?}", s, err)
        })
    }

    #[test]
    fn simple() {
        assert_eq_ignore_span!(
            bin("5 + 4 * 7"),
            box Expr {
                span: Default::default(),
                node: ExprKind::Binary {
                    op: BinaryOp::Add,
                    left: bin("5"),
                    right: bin("4 * 7"),
                },
            }
        );
    }

    #[test]
    fn same_prec() {
        assert_eq_ignore_span!(
            bin("5 + 4 + 7"),
            box Expr {
                span: Default::default(),
                node: ExprKind::Binary {
                    op: BinaryOp::Add,
                    left: bin("5 + 4"),
                    right: bin("7"),
                },
            }
        );
    }

}
