//! Expression parser module
//!
//! This module contains implementations for parsing JavaScript expressions.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::{BlockStmtParser, Parser};
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

// Sub-modules
mod array;
mod binary;
mod call;
mod function;
mod member;
mod object;
mod primary;
mod unary;

impl<'a> Parser<'a> {
    /// Parse an expression (sequence expression)
    pub(crate) fn parse_expression(&mut self) -> Result<ast::Expr> {
        // Start with an assignment expression
        let mut exprs = vec![self.parse_assignment_expression()?];

        // Check for comma operator (sequence expression)
        while self.is_token_type(TokenType::Comma) {
            self.next_token(); // Skip ','

            // Parse the next expression
            let expr = self.parse_assignment_expression()?;
            exprs.push(expr);
        }

        // If there's only one expression, return it directly
        // Otherwise, create a sequence expression
        if exprs.len() == 1 {
            Ok(exprs.remove(0))
        } else {
            let span = exprs
                .first()
                .unwrap()
                .span()
                .merge_with(exprs.last().unwrap().span());

            Ok(ast::Expr::Seq(ast::SeqExpr {
                span,
                exprs: exprs.into_iter().map(Box::new).collect(),
            }))
        }
    }

    /// Parse an assignment expression
    pub(crate) fn parse_assignment_expression(&mut self) -> Result<ast::Expr> {
        // First check for arrow function with parenthesized parameters
        if self.is_token_type(TokenType::LParen) {
            let start = self.lexer.get_pos();
            let lparen_token = self.cur_token;

            // Try to parse as arrow function parameters
            let mut error_occurred = false;
            let mut params = Vec::new();

            self.next_token(); // Skip '('

            // Parse parameters
            if !self.is_token_type(TokenType::RParen) {
                loop {
                    // Check for rest parameter
                    let is_rest = if self.is_token_type(TokenType::Ellipsis) {
                        self.next_token(); // Skip '...'
                        true
                    } else {
                        false
                    };

                    // Try to parse as a pattern
                    match self.parse_binding_pattern() {
                        Ok(pattern) => {
                            if is_rest {
                                params.push(ast::Pat::Rest(ast::RestPat {
                                    span: pattern.span(),
                                    arg: Box::new(pattern),
                                    type_ann: None,
                                }));

                                // Rest parameter must be the last parameter
                                if !self.is_token_type(TokenType::RParen) {
                                    error_occurred = true;
                                    break;
                                }
                            } else {
                                params.push(pattern);
                            }
                        }
                        Err(_) => {
                            error_occurred = true;
                            break;
                        }
                    }

                    // Check for comma or end of parameters
                    if self.is_token_type(TokenType::Comma) {
                        self.next_token(); // Skip ','

                        // Handle trailing comma
                        if self.is_token_type(TokenType::RParen) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }

            // If no error occurred and the next token is '=>', parse as arrow function
            if !error_occurred && self.is_token_type(TokenType::RParen) {
                self.next_token(); // Skip ')'

                if self.is_token_type(TokenType::Arrow) {
                    return self.parse_arrow_function_expression(false, params);
                }
            }

            // Not an arrow function, reset and continue as normal assignment
            self.lexer.reset_pos(start);
            self.cur_token = lparen_token;
            self.next_token(); // Re-consume the token
        }

        // Check for async arrow function
        if self.is_token_type(TokenType::Async) && !self.cur_token.had_line_break {
            let start = self.lexer.get_pos();
            let async_token = self.cur_token;

            self.next_token(); // Skip 'async'

            // If the next token is '(', try to parse as arrow function parameters
            if self.is_token_type(TokenType::LParen) {
                let mut error_occurred = false;
                let mut params = Vec::new();

                self.next_token(); // Skip '('

                // Parse parameters
                if !self.is_token_type(TokenType::RParen) {
                    loop {
                        // Check for rest parameter
                        let is_rest = if self.is_token_type(TokenType::Ellipsis) {
                            self.next_token(); // Skip '...'
                            true
                        } else {
                            false
                        };

                        // Try to parse as a pattern
                        match self.parse_binding_pattern() {
                            Ok(pattern) => {
                                if is_rest {
                                    params.push(ast::Pat::Rest(ast::RestPat {
                                        span: pattern.span(),
                                        arg: Box::new(pattern),
                                        type_ann: None,
                                    }));

                                    // Rest parameter must be the last parameter
                                    if !self.is_token_type(TokenType::RParen) {
                                        error_occurred = true;
                                        break;
                                    }
                                } else {
                                    params.push(pattern);
                                }
                            }
                            Err(_) => {
                                error_occurred = true;
                                break;
                            }
                        }

                        // Check for comma or end of parameters
                        if self.is_token_type(TokenType::Comma) {
                            self.next_token(); // Skip ','

                            // Handle trailing comma
                            if self.is_token_type(TokenType::RParen) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }

                // If no error occurred and the next token is '=>', parse as async arrow
                // function
                if !error_occurred && self.is_token_type(TokenType::RParen) {
                    self.next_token(); // Skip ')'

                    if self.is_token_type(TokenType::Arrow) {
                        return self.parse_arrow_function_expression(true, params);
                    }
                }
            }
            // Check for async arrow function with single parameter
            else if self.is_token_identifier() {
                let ident = self.parse_identifier_name()?;

                if self.is_token_type(TokenType::Arrow) {
                    // Single parameter async arrow function
                    let params = vec![ast::Pat::Ident(ast::BindingIdent {
                        id: ident,
                        type_ann: None,
                    })];

                    return self.parse_arrow_function_expression(true, params);
                }
            }

            // Not an async arrow function, reset and continue as normal assignment
            self.lexer.reset_pos(start);
            self.cur_token = async_token;
            self.next_token(); // Re-consume the token
        }

        // Check for single-parameter arrow function
        if self.is_token_identifier() && self.peek_token().token_type == TokenType::Arrow {
            let ident = self.parse_identifier_name()?;

            // Single parameter arrow function
            let params = vec![ast::Pat::Ident(ast::BindingIdent {
                id: ident,
                type_ann: None,
            })];

            return self.parse_arrow_function_expression(false, params);
        }

        // Parse conditional expression
        let expr = self.parse_conditional_expression()?;

        // Check for assignment operators
        if self.is_token_type(TokenType::Assign)
            || self.is_token_type(TokenType::AddAssign)
            || self.is_token_type(TokenType::SubAssign)
            || self.is_token_type(TokenType::MulAssign)
            || self.is_token_type(TokenType::DivAssign)
            || self.is_token_type(TokenType::ModAssign)
            || self.is_token_type(TokenType::ExpAssign)
            || self.is_token_type(TokenType::BitAndAssign)
            || self.is_token_type(TokenType::BitOrAssign)
            || self.is_token_type(TokenType::BitXorAssign)
            || self.is_token_type(TokenType::LShiftAssign)
            || self.is_token_type(TokenType::RShiftAssign)
            || self.is_token_type(TokenType::ZeroFillRShiftAssign)
            || self.is_token_type(TokenType::NullishAssign)
            || self.is_token_type(TokenType::AndAssign)
            || self.is_token_type(TokenType::OrAssign)
        {
            // Assignment expression
            let op = match self.cur_token.token_type {
                TokenType::Assign => ast::AssignOp::Assign,
                TokenType::AddAssign => ast::AssignOp::AddAssign,
                TokenType::SubAssign => ast::AssignOp::SubAssign,
                TokenType::MulAssign => ast::AssignOp::MulAssign,
                TokenType::DivAssign => ast::AssignOp::DivAssign,
                TokenType::ModAssign => ast::AssignOp::ModAssign,
                TokenType::ExpAssign => ast::AssignOp::ExpAssign,
                TokenType::BitAndAssign => ast::AssignOp::BitAndAssign,
                TokenType::BitOrAssign => ast::AssignOp::BitOrAssign,
                TokenType::BitXorAssign => ast::AssignOp::BitXorAssign,
                TokenType::LShiftAssign => ast::AssignOp::LShiftAssign,
                TokenType::RShiftAssign => ast::AssignOp::RShiftAssign,
                TokenType::ZeroFillRShiftAssign => ast::AssignOp::ZeroFillRShiftAssign,
                TokenType::NullishAssign => ast::AssignOp::NullishAssign,
                TokenType::AndAssign => ast::AssignOp::AndAssign,
                TokenType::OrAssign => ast::AssignOp::OrAssign,
                _ => unreachable!("Not an assignment operator"),
            };

            self.next_token(); // Skip operator

            // Convert expression to pattern if possible
            let left = match expr.as_pat() {
                Ok(pat) => pat,
                Err(_) => {
                    return Err(self.error(ErrorKind::General {
                        message: "Invalid left-hand side in assignment".into(),
                    }));
                }
            };

            // Parse the right-hand side
            let right = self.parse_assignment_expression()?;

            // Create the assignment expression
            let span = left.span().merge_with(right.span());

            return Ok(ast::Expr::Assign(ast::AssignExpr {
                span,
                op,
                left,
                right: Box::new(right),
            }));
        }

        // Not an assignment, return the conditional expression
        Ok(expr)
    }

    /// Parse a conditional expression: test ? consequent : alternate
    pub(crate) fn parse_conditional_expression(&mut self) -> Result<ast::Expr> {
        // Parse binary expression first
        let expr = self.parse_binary_expression()?;

        // Check for conditional operator
        if self.is_token_type(TokenType::Question) {
            let test_span = expr.span();
            self.next_token(); // Skip '?'

            // Parse consequent expression
            let consequent = self.parse_assignment_expression()?;

            self.expect(TokenType::Colon)?; // Expect ':'

            // Parse alternate expression
            let alternate = self.parse_assignment_expression()?;

            // Create the conditional expression
            let span = test_span.merge_with(alternate.span());

            Ok(ast::Expr::Cond(ast::CondExpr {
                span,
                test: Box::new(expr),
                cons: Box::new(consequent),
                alt: Box::new(alternate),
            }))
        } else {
            // Not a conditional expression, return the binary expression
            Ok(expr)
        }
    }

    /// Parse a sequence expression: expr1, expr2, expr3
    pub(crate) fn parse_sequence_expression(&mut self) -> Result<ast::Expr> {
        // Start with an assignment expression
        let mut expr = self.parse_assignment_expression()?;

        // Check for comma operator (sequence expression)
        if self.is_token_type(TokenType::Comma) {
            let start_span = expr.span();

            let mut exprs = vec![expr];

            while self.is_token_type(TokenType::Comma) {
                self.next_token(); // Skip ','

                // Parse the next expression
                let expr = self.parse_assignment_expression()?;
                exprs.push(expr);
            }

            // Create the sequence expression
            let end_span = exprs.last().unwrap().span();

            expr = ast::Expr::Seq(ast::SeqExpr {
                span: start_span.merge_with(end_span),
                exprs: exprs.into_iter().map(Box::new).collect(),
            });
        }

        Ok(expr)
    }

    /// Parse a yield expression: yield [expr]
    pub(crate) fn parse_yield_expression(&mut self) -> Result<ast::Expr> {
        // Only allowed in generator functions
        if !self.in_generator {
            return Err(self.error(ErrorKind::General {
                message: "'yield' is only allowed in generator functions".into(),
            }));
        }

        let start_span = self.cur_token.span;
        self.expect(TokenType::Yield)?; // Expect 'yield'

        // Check for yield delegate (yield*)
        let delegate = if self.is_token_type(TokenType::Mul) {
            self.next_token(); // Skip '*'
            true
        } else {
            false
        };

        // Parse argument if needed
        let arg = if !self.can_insert_semicolon()
            && !self.is_token_type(TokenType::RBrace)
            && !self.is_token_type(TokenType::RParen)
            && !self.is_token_type(TokenType::RBracket)
            && !self.is_token_type(TokenType::Colon)
            && !self.is_token_type(TokenType::Comma)
        {
            Some(Box::new(self.parse_assignment_expression()?))
        } else {
            None
        };

        // Create the yield expression
        let span = start_span.merge_with(if let Some(ref arg) = arg {
            arg.span()
        } else {
            start_span
        });

        Ok(ast::Expr::Yield(ast::YieldExpr {
            span,
            arg,
            delegate,
        }))
    }

    /// Parse an arrow function expression: (params) => body
    pub(crate) fn parse_arrow_function_expression(
        &mut self,
        is_async: bool,
        params: Vec<ast::Pat>,
    ) -> Result<ast::Expr> {
        self.expect(TokenType::Arrow)?; // Expect '=>'

        // Remember we're in a function
        let prev_in_function = self.in_function;
        self.in_function = true;

        // Remember async state
        let prev_in_async = self.in_async;
        self.in_async = is_async;

        // Create a new scope for the arrow function
        self.enter_scope(super::ScopeKind::Function);

        // Parse the function body
        let (body, is_expression) = if self.is_token_type(TokenType::LBrace) {
            // Block body: () => { statements }
            let body_block = self.parse_block_stmt()?;

            (ast::BlockStmtOrExpr::BlockStmt(body_block), false)
        } else {
            // Expression body: () => expression
            let expr = self.parse_assignment_expression()?;

            (ast::BlockStmtOrExpr::Expr(Box::new(expr)), true)
        };

        // Exit the function scope
        self.exit_scope();

        // Restore previous function state
        self.in_function = prev_in_function;
        self.in_async = prev_in_async;

        // Create the arrow function expression
        let start_span = params
            .first()
            .map(|p| p.span())
            .unwrap_or_else(|| self.prev_token.span);
        let end_span = match &body {
            ast::BlockStmtOrExpr::BlockStmt(block) => block.span,
            ast::BlockStmtOrExpr::Expr(expr) => expr.span(),
        };

        Ok(ast::Expr::Arrow(ast::ArrowExpr {
            span: start_span.merge_with(end_span),
            params,
            body,
            is_async,
            is_generator: false,
            type_params: None,
            return_type: None,
        }))
    }

    /// Parse a JSX expression (stub implementation)
    fn parse_jsx_expression(&mut self) -> Result<ast::Expr> {
        // This is a stub implementation, actual JSX parsing would be more complex
        if !self.syntax.jsx {
            return Err(self.error(ErrorKind::General {
                message: "JSX syntax is not enabled".into(),
            }));
        }

        Err(self.error(ErrorKind::General {
            message: "JSX parsing is not fully implemented".into(),
        }))
    }

    /// Parse a TypeScript as expression: expr as Type
    fn parse_ts_as_expression(&mut self, expr: ast::Expr) -> Result<ast::Expr> {
        if !self.syntax.typescript {
            return Err(self.error(ErrorKind::General {
                message: "TypeScript syntax is not enabled".into(),
            }));
        }

        // Expect 'as' keyword
        if !self.is_token_identifier_eq("as") {
            return Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("'as'"),
                got: format!("{}", self.cur_token.token_type),
            }));
        }

        self.next_token(); // Skip 'as'

        // Parse the type
        let type_ann = self.parse_ts_type()?;

        // Create the as expression
        let span = expr.span().merge_with(type_ann.span());

        Ok(ast::Expr::TsAs(ast::TsAsExpr {
            span,
            expr: Box::new(expr),
            type_ann: Box::new(type_ann),
        }))
    }

    /// Parse a TypeScript non-null expression: expr!
    fn parse_ts_non_null_expression(&mut self, expr: ast::Expr) -> Result<ast::Expr> {
        if !self.syntax.typescript {
            return Err(self.error(ErrorKind::General {
                message: "TypeScript syntax is not enabled".into(),
            }));
        }

        self.expect(TokenType::Bang)?; // Expect '!'

        // Create the non-null expression
        let span = expr.span().merge_with(self.prev_token.span);

        Ok(ast::Expr::TsNonNull(ast::TsNonNullExpr {
            span,
            expr: Box::new(expr),
        }))
    }

    /// Parse a TypeScript type assertion: <Type>expr
    fn parse_ts_type_assertion(&mut self) -> Result<ast::Expr> {
        if !self.syntax.typescript {
            return Err(self.error(ErrorKind::General {
                message: "TypeScript syntax is not enabled".into(),
            }));
        }

        let start_span = self.cur_token.span;
        self.expect(TokenType::Lt)?; // Expect '<'

        // Parse the type
        let type_ann = self.parse_ts_type()?;

        self.expect(TokenType::Gt)?; // Expect '>'

        // Parse the expression
        let expr = self.parse_unary_expression()?;

        // Create the type assertion
        let span = start_span.merge_with(expr.span());

        Ok(ast::Expr::TsTypeAssertion(ast::TsTypeAssertion {
            span,
            expr: Box::new(expr),
            type_ann: Box::new(type_ann),
        }))
    }
}
