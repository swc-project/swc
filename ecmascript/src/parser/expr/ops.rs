//! Parser for unary operations and binary operations.

use super::*;

impl<I: Input> Parser<I> {
    /// Name from spec: 'LogicalORExpression'
    pub(super) fn parse_bin_expr(&mut self, include_in: bool) -> PResult<Box<Expr>> {
        let left = self.parse_unary_expr()?;
        self.parse_bin_op_recursively(left, 0, include_in)
    }

    /// Parse binary operators with the operator precedence parsing
    /// algorithm. `left` is the left-hand side of the operator.
    /// `minPrec` provides context that allows the function to stop and
    /// defer further parser to one of its callers when it encounters an
    /// operator that has a lower precedence than the set it is parsing.
    fn parse_bin_op_recursively(
        &mut self,
        left: Box<Expr>,
        min_prec: u8,
        include_in: bool,
    ) -> PResult<Box<Expr>> {
        let op = match self.i.cur()? {
            &Word(Keyword(In)) if include_in => BinaryOp::In,
            &Word(Keyword(InstanceOf)) => BinaryOp::InstanceOf,
            &BinOp(ref op) => op.clone().into(),
            _ => return Ok(left),
        };
        self.i.bump();

        if op.precedence() <= min_prec {
            return Ok(left);
        }

        match left.node {
            // This is invalid syntax.
            ExprKind::Unary { .. } if op == BinaryOp::Exp => {
                // Correct implementation would be returning Ok(left) and
                // returning "unexpected token '**'" on next.
                // But it's not useful error message.

                syntax_error!("Illegal expression. Wrap left hand side in parentheses.")
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
                include_in,
            )?
        };

        let node = box Expr {
            span: left.span + right.span,
            node: ExprKind::Binary { op, left, right },
        };

        self.parse_bin_op_recursively(node, min_prec, include_in)
    }

    /// Parse unary expression and update expression.
    ///
    /// Name from spec: 'UnaryExpression'
    fn parse_unary_expr(&mut self) -> PResult<Box<Expr>> {
        // Parse update expression
        if self.i.is(&PlusPlus) || self.i.is(&MinusMinus) {
            let start = self.i.cur_span();
            let op = if self.i.bump() == PlusPlus {
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
        if self.i.is(&Word(Keyword(Delete))) || self.i.is(&Word(Keyword(Void)))
            || self.i.is(&Word(Keyword(TypeOf))) || self.i.is(&BinOp(Add))
            || self.i.is(&BinOp(Sub)) || self.i.is(&Tilde) || self.i.is(&Bang)
        {
            let op = match self.i.bump() {
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
                span: self.i.last_span() + arg.span,
                node: ExprKind::Unary {
                    prefix: true,
                    op,
                    arg,
                },
            });
        }

        if self.ctx.is_in_async_fn && self.i.is(&Word(Keyword(Await))) {
            return self.parse_await_expr();
        }

        // UpdateExpression
        let expr = self.parse_lhs_expr()?;

        //TODO: Handle ASI
        if self.i.is(&PlusPlus) || self.i.is(&MinusMinus) {
            let start = self.i.cur_span();
            let op = if self.i.bump() == PlusPlus {
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
        debug_assert!(self.i.is(&Word(Keyword(Await))));
        debug_assert!(self.ctx.is_in_async_fn);

        unimplemented!("parse_await_expr")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lexer::Lexer;

    fn mk<'a>(s: &'a str) -> Parser<impl 'a + Input> {
        Parser::new_for_module(Lexer::from(s))
    }

    fn parse_bin(s: &str) -> Expr {
        *mk(s).parse_bin_expr(true).unwrap()
    }

    #[test]
    fn simple() {
        assert_eq!(
            parse_bin("5 + 4 * 7").node,
            ExprKind::Binary {
                op: BinaryOp::Add,
                left: box parse_bin("5"),
                right: box parse_bin("4 * 7"),
            }
        );
    }

}
