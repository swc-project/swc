//! Conditional and assignment expressions.

use swc_common::{Span, Spanned};
use swc_ecma_ast::{AssignExpr, AssignOp, AssignTarget, CondExpr, Expr};

use crate::{
    error::{Error, SyntaxError},
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse a complete expression through assignment precedence.
    pub(crate) fn parse_expression(&mut self) -> Result<Box<Expr>, Error> {
        self.parse_assignment_expression()
    }

    pub(crate) fn parse_assignment_expression(&mut self) -> Result<Box<Expr>, Error> {
        let left = self.parse_conditional_expression()?;
        let Some(operator) = assignment_operator(self.kind()) else {
            return Ok(left);
        };
        let start = left.span().lo;
        let left = AssignTarget::try_from(left).map_err(|expression| {
            Error::new(expression.span(), SyntaxError::InvalidAssignTarget)
        })?;
        self.advance();
        let right = self.parse_assignment_expression()?;
        Ok(Box::new(Expr::Assign(AssignExpr {
            span: Span::new_with_checked(start, right.span().hi),
            op: operator,
            left,
            right,
        })))
    }

    fn parse_conditional_expression(&mut self) -> Result<Box<Expr>, Error> {
        let test = self.parse_binary_expression(1)?;
        if !self.eat(Kind::QuestionMark) {
            return Ok(test);
        }
        let start = test.span().lo;
        let consequent = self.parse_assignment_expression()?;
        if !self.expect(Kind::Colon) {
            return Err(self.expected_error(Kind::Colon));
        }
        let alternate = self.parse_assignment_expression()?;
        Ok(Box::new(Expr::Cond(CondExpr {
            span: Span::new_with_checked(start, alternate.span().hi),
            test,
            cons: consequent,
            alt: alternate,
        })))
    }
}

fn assignment_operator(kind: Kind) -> Option<AssignOp> {
    Some(match kind {
        Kind::Eq => AssignOp::Assign,
        Kind::PlusEq => AssignOp::AddAssign,
        Kind::MinusEq => AssignOp::SubAssign,
        Kind::MulEq => AssignOp::MulAssign,
        Kind::DivEq => AssignOp::DivAssign,
        Kind::ModEq => AssignOp::ModAssign,
        Kind::LShiftEq => AssignOp::LShiftAssign,
        Kind::RShiftEq => AssignOp::RShiftAssign,
        Kind::ZeroFillRShiftEq => AssignOp::ZeroFillRShiftAssign,
        Kind::BitOrEq => AssignOp::BitOrAssign,
        Kind::BitXorEq => AssignOp::BitXorAssign,
        Kind::BitAndEq => AssignOp::BitAndAssign,
        Kind::ExpEq => AssignOp::ExpAssign,
        Kind::LogicalAndEq => AssignOp::AndAssign,
        Kind::LogicalOrEq => AssignOp::OrAssign,
        Kind::NullishEq => AssignOp::NullishAssign,
        _ => return None,
    })
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{AssignOp, Expr};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    fn parse(source: &str) -> Box<Expr> {
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        parser.parse_expression().unwrap()
    }

    #[test]
    fn assignment_is_right_associative() {
        let expression = parse("first = second = 1");
        let Expr::Assign(first) = &*expression else {
            panic!("expected assignment")
        };
        assert_eq!(first.op, AssignOp::Assign);
        assert!(matches!(&*first.right, Expr::Assign(_)));
    }

    #[test]
    fn conditional_wraps_binary_test() {
        let expression = parse("a + b ? c : d");
        let Expr::Cond(conditional) = &*expression else {
            panic!("expected conditional")
        };
        assert!(matches!(&*conditional.test, Expr::Bin(_)));
        assert!(matches!(&*conditional.cons, Expr::Ident(_)));
        assert!(matches!(&*conditional.alt, Expr::Ident(_)));
    }
}
