//! Conditional and assignment expressions.

use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignOp, BindingIdent, BlockStmtOrExpr, CondExpr, Expr, Ident, Pat,
    SeqExpr, YieldExpr,
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
        if self.is_async_arrow_head() {
            return self.parse_async_arrow_expression();
        }
        #[cfg(feature = "typescript")]
        if self.context().contains(Context::TYPESCRIPT) && self.is_ts_generic_arrow_head() {
            let start = self.token().start();
            return self.parse_ts_generic_arrow_expression(start, false);
        }
        if self.is_parenthesized_arrow_head() {
            return self.parse_parenthesized_arrow_expression(false);
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
                false,
            );
        }
        let Some(operator) = assignment_operator(self.kind()) else {
            return Ok(left);
        };
        let start = left.span().lo;
        let left = self.reparse_assignment_target(left)?;
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
            || matches!(
                self.kind(),
                Kind::Semi
                    | Kind::RParen
                    | Kind::RBracket
                    | Kind::RBrace
                    | Kind::Comma
                    | Kind::Colon
                    | Kind::Eof
            )
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

    fn is_async_arrow_head(&mut self) -> bool {
        if !self.at(Kind::Async) || self.token().escaped() {
            return false;
        }
        self.lookahead(|parser| {
            parser.advance();
            if parser.token().had_line_break() {
                return false;
            }
            if parser.at_identifier_reference() {
                parser.advance();
                return !parser.token().had_line_break() && parser.at(Kind::Arrow);
            }
            #[cfg(feature = "typescript")]
            if parser.context().contains(Context::TYPESCRIPT) && parser.at(Kind::Lt) {
                return parser.parse_ts_type_parameters().is_ok()
                    && parser.is_parenthesized_arrow_head();
            }
            parser.is_parenthesized_arrow_head()
        })
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
                        if parser.token().had_line_break() {
                            return false;
                        }
                        if parser.at(Kind::Arrow) {
                            return true;
                        }
                        #[cfg(feature = "typescript")]
                        if parser.context().contains(Context::TYPESCRIPT) && parser.at(Kind::Colon)
                        {
                            return parser.parse_ts_type_annotation().is_ok()
                                && parser.at(Kind::Arrow);
                        }
                        return false;
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

    fn parse_async_arrow_expression(&mut self) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        debug_assert!(self.at(Kind::Async));
        self.advance();
        #[cfg(feature = "typescript")]
        if self.context().contains(Context::TYPESCRIPT) && self.at(Kind::Lt) {
            return self.parse_ts_generic_arrow_expression(start, true);
        }
        if self.at(Kind::LParen) {
            return self.parse_parenthesized_arrow_expression_from(start, true);
        }
        let token = self.token();
        if !self.at_identifier_reference() {
            return Err(self.expected_error(Kind::Ident));
        }
        let identifier = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        self.parse_arrow_expression(
            start,
            vec![Pat::Ident(BindingIdent {
                id: identifier,
                type_ann: None,
            })],
            true,
        )
    }

    #[cfg(feature = "typescript")]
    fn is_ts_generic_arrow_head(&mut self) -> bool {
        if !self.at(Kind::Lt) {
            return false;
        }
        self.lookahead(|parser| {
            parser.parse_ts_type_parameters().is_ok() && parser.is_parenthesized_arrow_head()
        })
    }

    #[cfg(feature = "typescript")]
    fn parse_ts_generic_arrow_expression(
        &mut self,
        start: swc_common::BytePos,
        is_async: bool,
    ) -> Result<Box<Expr>, Error> {
        let type_params = self.parse_ts_type_parameters()?;
        if !self.at(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let mut expression = self.parse_parenthesized_arrow_expression_from(start, is_async)?;
        let Expr::Arrow(arrow) = &mut *expression else {
            unreachable!("generic arrow production must produce an arrow")
        };
        arrow.type_params = Some(type_params);
        Ok(expression)
    }

    fn parse_parenthesized_arrow_expression(&mut self, is_async: bool) -> Result<Box<Expr>, Error> {
        let start = self.token().start();
        self.parse_parenthesized_arrow_expression_from(start, is_async)
    }

    fn parse_parenthesized_arrow_expression_from(
        &mut self,
        start: swc_common::BytePos,
        is_async: bool,
    ) -> Result<Box<Expr>, Error> {
        self.advance();
        let add = if is_async {
            Context::AWAIT
        } else {
            Context::empty()
        };
        let parameters = self.with_context(add, Context::YIELD | Context::AWAIT, |parser| {
            parser.parse_arrow_parameters_after_lparen()
        })?;
        self.parse_arrow_expression(start, parameters, is_async)
    }

    fn parse_arrow_parameters_after_lparen(&mut self) -> Result<Vec<Pat>, Error> {
        let mut parameters = Vec::with_capacity(4);
        while !self.at(Kind::RParen) {
            let mut pattern = if self.at(Kind::DotDotDot) {
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
            normalize_arrow_parameter_pattern(&mut pattern);
            parameters.push(pattern);
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(parameters)
    }

    fn parse_arrow_expression(
        &mut self,
        start: swc_common::BytePos,
        parameters: Vec<Pat>,
        is_async: bool,
    ) -> Result<Box<Expr>, Error> {
        #[cfg(feature = "typescript")]
        let return_type = if self.context().contains(Context::TYPESCRIPT) && self.at(Kind::Colon) {
            Some(self.parse_ts_type_annotation()?)
        } else {
            None
        };
        #[cfg(not(feature = "typescript"))]
        let return_type = None;
        if !self.expect(Kind::Arrow) {
            return Err(self.expected_error(Kind::Arrow));
        }
        let body = if self.at(Kind::LBrace) {
            let mut context = Context::RETURN;
            if is_async {
                context.insert(Context::AWAIT);
            }
            BlockStmtOrExpr::BlockStmt(self.with_context(
                context,
                Context::TOP_LEVEL | Context::RETURN | Context::YIELD | Context::AWAIT,
                Self::parse_block_statement,
            )?)
        } else {
            let add = if is_async {
                Context::AWAIT
            } else {
                Context::empty()
            };
            BlockStmtOrExpr::Expr(self.with_context(
                add,
                Context::YIELD | Context::AWAIT,
                Self::parse_assignment_expression,
            )?)
        };
        let end = body.span().hi;
        Ok(Box::new(Expr::Arrow(ArrowExpr {
            span: Span::new_with_checked(start, end),
            ctxt: SyntaxContext::empty(),
            params: parameters,
            body: Box::new(body),
            is_async,
            is_generator: false,
            type_params: None,
            return_type,
        })))
    }
}

fn normalize_arrow_parameter_pattern(pattern: &mut Pat) {
    match pattern {
        Pat::Array(array) => {
            for pattern in array.elems.iter_mut().flatten() {
                normalize_arrow_parameter_pattern(pattern);
            }
            while array.elems.last().is_some_and(Option::is_none) {
                array.elems.pop();
            }
        }
        Pat::Object(object) => {
            for property in &mut object.props {
                match property {
                    swc_ecma_ast::ObjectPatProp::KeyValue(property) => {
                        normalize_arrow_parameter_pattern(&mut property.value);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        normalize_arrow_parameter_pattern(&mut rest.arg);
                    }
                    swc_ecma_ast::ObjectPatProp::Assign(_) => {}
                }
            }
        }
        Pat::Assign(assign) => normalize_arrow_parameter_pattern(&mut assign.left),
        Pat::Rest(rest) => normalize_arrow_parameter_pattern(&mut rest.arg),
        Pat::Ident(_) | Pat::Expr(_) | Pat::Invalid(_) => {}
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

        let asynchronous = parse("async (value) => await value");
        let Expr::Arrow(asynchronous) = &*asynchronous else {
            panic!("expected async arrow")
        };
        assert!(asynchronous.is_async);
        assert!(matches!(
            &*asynchronous.body,
            swc_ecma_ast::BlockStmtOrExpr::Expr(expression)
                if matches!(&**expression, Expr::Await(_))
        ));

        let single_async = parse("async value => { return await value; }");
        let Expr::Arrow(single_async) = &*single_async else {
            panic!("expected single-parameter async arrow")
        };
        assert!(single_async.is_async);
    }
}
