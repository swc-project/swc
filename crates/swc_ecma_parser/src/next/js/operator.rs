//! Unary and precedence-climbing binary expressions.

use swc_common::{Span, Spanned};
use swc_ecma_ast::{BinExpr, BinaryOp, Expr, UnaryExpr, UnaryOp};

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

        while let Some(operator) = binary_operator(self.kind(), self.context()) {
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
        let Some(operator) = unary_operator(self.kind()) else {
            return self.parse_left_hand_side_expression();
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
}
