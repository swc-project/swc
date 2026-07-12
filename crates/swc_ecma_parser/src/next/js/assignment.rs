//! Conditional and assignment expressions.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignOp, AssignTarget, BindingIdent, BlockStmtOrExpr, CondExpr, Expr,
    Pat, SeqExpr, YieldExpr,
};

use crate::{
    error::{Error, SyntaxError},
    lexer::Token as Kind,
    next::{
        lexer::config::Config,
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
    /// Parse a complete expression through assignment precedence.
    pub(crate) fn parse_expression(&mut self) -> Result<Box<Expr>, Error> {
        let first = self.parse_assignment_expression()?;
        if !self.eat(Kind::Comma) {
            return Ok(first);
        }
        let start = first.span().lo;
        let mut expressions = Vec::with_capacity(2);
        expressions.push(first);
        loop {
            expressions.push(self.parse_assignment_expression()?);
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        Ok(Box::new(Expr::Seq(SeqExpr {
            span: Span::new_with_checked(start, expressions.last().unwrap().span().hi),
            exprs: expressions,
        })))
    }

    pub(crate) fn parse_assignment_expression(&mut self) -> Result<Box<Expr>, Error> {
        if self.at(Kind::Yield) && self.context().contains(Context::YIELD) {
            return self.parse_yield_expression();
        }
        if self.is_parenthesized_arrow_head() {
            return self.parse_parenthesized_arrow_expression();
        }
        let left = self.parse_conditional_expression()?;
        if self.at(Kind::Arrow) {
            let left_span = left.span();
            let Expr::Ident(identifier) = *left else {
                return Err(Error::new(left_span, SyntaxError::InvalidAssignTarget));
            };
            return self.parse_arrow_expression(
                identifier.span.lo,
                vec![Pat::Ident(BindingIdent {
                    id: identifier,
                    type_ann: None,
                })],
            );
        }
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

    fn parse_yield_expression(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        self.advance();
        if self.token().had_line_break()
            || matches!(self.kind(), Kind::Semi | Kind::RBrace | Kind::Eof)
        {
            return Ok(Box::new(Expr::Yield(YieldExpr {
                span: Span::new_with_checked(start, self.previous_end()),
                arg: None,
                delegate: false,
            })));
        }
        let delegate = self.eat(Kind::Asterisk);
        let argument = self.parse_assignment_expression()?;
        Ok(Box::new(Expr::Yield(YieldExpr {
            span: Span::new_with_checked(start, argument.span().hi),
            arg: Some(argument),
            delegate,
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

    fn is_parenthesized_arrow_head(&mut self) -> bool {
        if !self.at(Kind::LParen) {
            return false;
        }
        self.lookahead(|parser| {
            parser.advance();
            let mut depth = 0u32;
            loop {
                match parser.kind() {
                    Kind::LParen | Kind::LBracket | Kind::LBrace => {
                        depth += 1;
                        parser.advance();
                    }
                    Kind::RBracket | Kind::RBrace if depth != 0 => {
                        depth -= 1;
                        parser.advance();
                    }
                    Kind::RParen if depth == 0 => {
                        parser.advance();
                        return !parser.token().had_line_break() && parser.at(Kind::Arrow);
                    }
                    Kind::RParen => {
                        depth -= 1;
                        parser.advance();
                    }
                    Kind::Eof => return false,
                    _ => parser.advance(),
                }
            }
        })
    }

    fn parse_parenthesized_arrow_expression(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        self.advance();
        let mut parameters = Vec::with_capacity(4);
        while !self.at(Kind::RParen) {
            let pattern = if self.at(Kind::DotDotDot) {
                let dot3_token = self.token().span();
                self.advance();
                let argument = self.parse_binding_pattern(false)?;
                let span = Span::new_with_checked(dot3_token.lo, argument.span().hi);
                Pat::Rest(swc_ecma_ast::RestPat {
                    span,
                    dot3_token,
                    arg: Box::new(argument),
                    type_ann: None,
                })
            } else {
                self.parse_binding_pattern(true)?
            };
            parameters.push(pattern);
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        self.parse_arrow_expression(start, parameters)
    }

    fn parse_arrow_expression(
        &mut self,
        start: swc_common::BytePos,
        parameters: Vec<Pat>,
    ) -> Result<Box<Expr>, Error> {
        if !self.expect(Kind::Arrow) {
            return Err(self.expected_error(Kind::Arrow));
        }
        let body = if self.at(Kind::LBrace) {
            BlockStmtOrExpr::BlockStmt(self.with_context(
                Context::RETURN,
                Context::TOP_LEVEL,
                Self::parse_block_statement,
            )?)
        } else {
            BlockStmtOrExpr::Expr(self.parse_assignment_expression()?)
        };
        let end = body.span().hi;
        Ok(Box::new(Expr::Arrow(ArrowExpr {
            span: Span::new_with_checked(start, end),
            ctxt: SyntaxContext::empty(),
            params: parameters,
            body: Box::new(body),
            is_async: false,
            is_generator: false,
            type_params: None,
            return_type: None,
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
    fn parses_comma_sequence_at_expression_level() {
        let lexer = Lexer::new("first = 1, second = 2", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();
        assert!(matches!(&*expression, Expr::Seq(sequence) if sequence.exprs.len() == 2));
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

    #[test]
    fn parses_single_and_parenthesized_arrows() {
        let single = parse("value => value + 1");
        let Expr::Arrow(single) = &*single else {
            panic!("expected arrow")
        };
        assert_eq!(single.params.len(), 1);
        assert!(matches!(
            &*single.body,
            swc_ecma_ast::BlockStmtOrExpr::Expr(_)
        ));

        let parenthesized = parse("(left, right) => left + right");
        let Expr::Arrow(parenthesized) = &*parenthesized else {
            panic!("expected arrow")
        };
        assert_eq!(parenthesized.params.len(), 2);

        let block = parse("value => { return value; }");
        let Expr::Arrow(block) = &*block else {
            panic!("expected block arrow")
        };
        assert!(matches!(
            &*block.body,
            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(_)
        ));
    }
}
