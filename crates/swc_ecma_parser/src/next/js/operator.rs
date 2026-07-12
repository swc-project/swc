//! Unary and precedence-climbing binary expressions.

use swc_common::{Span, Spanned};
use swc_ecma_ast::{AwaitExpr, BinExpr, BinaryOp, Expr, UnaryExpr, UnaryOp, UpdateExpr, UpdateOp};
#[cfg(feature = "typescript")]
use swc_ecma_ast::{TsAsExpr, TsConstAssertion, TsSatisfiesExpr};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{
        lexer::config::Config,
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
    pub(crate) fn parse_binary_expression(
        &mut self,
        minimum_precedence: u8,
    ) -> Result<Box<Expr>, Error> {
        let mut left = self.parse_unary_expression()?;

        loop {
            let Some(operator) = binary_operator(self.kind(), self.context()) else {
                #[cfg(feature = "typescript")]
                if self.context().contains(Context::TYPESCRIPT)
                    && matches!(self.kind(), Kind::As | Kind::Satisfies)
                    && !self.token().had_line_break()
                {
                    const TS_TYPE_OPERATOR_PRECEDENCE: u8 = 7;
                    if TS_TYPE_OPERATOR_PRECEDENCE < minimum_precedence {
                        break;
                    }
                    let start = left.span().lo;
                    let operator = self.kind();
                    self.advance();
                    if operator == Kind::As && self.eat(Kind::Const) {
                        left = Box::new(Expr::TsConstAssertion(TsConstAssertion {
                            span: Span::new_with_checked(start, self.previous_end()),
                            expr: left,
                        }));
                    } else {
                        let type_ann = self.parse_ts_type()?;
                        let span = Span::new_with_checked(start, type_ann.span().hi);
                        left = if operator == Kind::As {
                            Box::new(Expr::TsAs(TsAsExpr {
                                span,
                                expr: left,
                                type_ann,
                            }))
                        } else {
                            Box::new(Expr::TsSatisfies(TsSatisfiesExpr {
                                span,
                                expr: left,
                                type_ann,
                            }))
                        };
                    }
                    continue;
                }
                break;
            };
            let precedence = operator.precedence();
            if precedence < minimum_precedence {
                break;
            }

            self.advance();
            let right_minimum = if operator == BinaryOp::Exp {
                precedence
            } else {
                precedence + 1
            };
            let right = self.parse_binary_expression(right_minimum)?;
            let span = Span::new_with_checked(left.span().lo, right.span().hi);
            left = Box::new(Expr::Bin(BinExpr {
                span,
                op: operator,
                left,
                right,
            }));
        }

        Ok(left)
    }

    fn parse_unary_expression(&mut self) -> Result<Box<Expr>, Error> {
        if matches!(self.kind(), Kind::PlusPlus | Kind::MinusMinus) {
            let start = self.token().start();
            let operator = update_operator(self.kind());
            self.advance();
            let argument = self.parse_unary_expression()?;
            ensure_update_target(&argument)?;
            return Ok(Box::new(Expr::Update(UpdateExpr {
                span: Span::new_with_checked(start, argument.span().hi),
                op: operator,
                prefix: true,
                arg: argument,
            })));
        }
        if self.at(Kind::Await) && self.context().contains(Context::AWAIT) {
            let start = self.token().start();
            self.advance();
            let argument = self.parse_unary_expression()?;
            return Ok(Box::new(Expr::Await(AwaitExpr {
                span: Span::new_with_checked(start, argument.span().hi),
                arg: argument,
            })));
        }
        let Some(operator) = unary_operator(self.kind()) else {
            let argument = self.parse_left_hand_side_expression()?;
            if !matches!(self.kind(), Kind::PlusPlus | Kind::MinusMinus)
                || self.token().had_line_break()
            {
                return Ok(argument);
            }
            ensure_update_target(&argument)?;
            let operator = update_operator(self.kind());
            self.advance();
            return Ok(Box::new(Expr::Update(UpdateExpr {
                span: Span::new_with_checked(argument.span().lo, self.previous_end()),
                op: operator,
                prefix: false,
                arg: argument,
            })));
        };
        let start = self.token().start();
        self.advance();
        let argument = self.parse_unary_expression()?;
        Ok(Box::new(Expr::Unary(UnaryExpr {
            span: Span::new_with_checked(start, argument.span().hi),
            op: operator,
            arg: argument,
        })))
    }
}

fn update_operator(kind: Kind) -> UpdateOp {
    if kind == Kind::PlusPlus {
        UpdateOp::PlusPlus
    } else {
        debug_assert_eq!(kind, Kind::MinusMinus);
        UpdateOp::MinusMinus
    }
}

fn ensure_update_target(expression: &Expr) -> Result<(), Error> {
    if matches!(expression, Expr::Ident(_) | Expr::Member(_))
        || matches!(expression, Expr::Paren(parenthesis) if ensure_update_target(&parenthesis.expr).is_ok())
    {
        Ok(())
    } else {
        Err(Error::new(
            expression.span(),
            crate::error::SyntaxError::InvalidAssignTarget,
        ))
    }
}

fn unary_operator(kind: Kind) -> Option<UnaryOp> {
    Some(match kind {
        Kind::Minus => UnaryOp::Minus,
        Kind::Plus => UnaryOp::Plus,
        Kind::Bang => UnaryOp::Bang,
        Kind::Tilde => UnaryOp::Tilde,
        Kind::TypeOf => UnaryOp::TypeOf,
        Kind::Void => UnaryOp::Void,
        Kind::Delete => UnaryOp::Delete,
        _ => return None,
    })
}

fn binary_operator(kind: Kind, context: Context) -> Option<BinaryOp> {
    Some(match kind {
        Kind::EqEq => BinaryOp::EqEq,
        Kind::NotEq => BinaryOp::NotEq,
        Kind::EqEqEq => BinaryOp::EqEqEq,
        Kind::NotEqEq => BinaryOp::NotEqEq,
        Kind::Lt => BinaryOp::Lt,
        Kind::LtEq => BinaryOp::LtEq,
        Kind::Gt => BinaryOp::Gt,
        Kind::GtEq => BinaryOp::GtEq,
        Kind::LShift => BinaryOp::LShift,
        Kind::RShift => BinaryOp::RShift,
        Kind::ZeroFillRShift => BinaryOp::ZeroFillRShift,
        Kind::Plus => BinaryOp::Add,
        Kind::Minus => BinaryOp::Sub,
        Kind::Asterisk => BinaryOp::Mul,
        Kind::Slash => BinaryOp::Div,
        Kind::Percent => BinaryOp::Mod,
        Kind::Pipe => BinaryOp::BitOr,
        Kind::Caret => BinaryOp::BitXor,
        Kind::Ampersand => BinaryOp::BitAnd,
        Kind::LogicalOr => BinaryOp::LogicalOr,
        Kind::LogicalAnd => BinaryOp::LogicalAnd,
        Kind::In if context.contains(Context::IN) => BinaryOp::In,
        Kind::InstanceOf => BinaryOp::InstanceOf,
        Kind::Exp => BinaryOp::Exp,
        Kind::NullishCoalescing => BinaryOp::NullishCoalescing,
        _ => return None,
    })
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{BinaryOp, Expr, UnaryOp};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    fn parse(source: &str) -> Box<Expr> {
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        parser.parse_binary_expression(1).unwrap()
    }

    #[test]
    fn multiplication_binds_more_tightly_than_addition() {
        let expression = parse("1 + 2 * 3");
        let Expr::Bin(addition) = &*expression else {
            panic!("expected addition")
        };
        assert_eq!(addition.op, BinaryOp::Add);
        let Expr::Bin(multiplication) = &*addition.right else {
            panic!("expected multiplication")
        };
        assert_eq!(multiplication.op, BinaryOp::Mul);
    }

    #[test]
    fn exponentiation_is_right_associative() {
        let expression = parse("2 ** 3 ** 4");
        let Expr::Bin(first) = &*expression else {
            panic!("expected exponentiation")
        };
        assert_eq!(first.op, BinaryOp::Exp);
        let Expr::Bin(second) = &*first.right else {
            panic!("expected right-associated exponentiation")
        };
        assert_eq!(second.op, BinaryOp::Exp);
    }

    #[test]
    fn builds_nested_unary_nodes() {
        let expression = parse("!-value");
        let Expr::Unary(bang) = &*expression else {
            panic!("expected bang")
        };
        assert_eq!(bang.op, UnaryOp::Bang);
        let Expr::Unary(minus) = &*bang.arg else {
            panic!("expected minus")
        };
        assert_eq!(minus.op, UnaryOp::Minus);
    }

    #[test]
    fn builds_prefix_postfix_and_await_nodes() {
        let lexer = Lexer::new("++value + item--", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();
        let Expr::Bin(binary) = &*expression else {
            panic!("expected binary expression")
        };
        assert!(matches!(&*binary.left, Expr::Update(update) if update.prefix));
        assert!(matches!(&*binary.right, Expr::Update(update) if !update.prefix));

        let lexer = Lexer::new("await task", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default() | Context::AWAIT);
        assert!(matches!(
            &*parser.parse_expression().unwrap(),
            Expr::Await(_)
        ));
    }
}
