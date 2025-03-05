//! Unary expression parser implementation
//!
//! This module provides the implementation for parsing unary expressions,
//! including prefix operators like !, -, +, typeof, void, delete,
//! and prefix/postfix increment and decrement operators (++, --).

use swc_ecma_ast as ast;

use super::super::Parser;
use crate::{
    error::{ErrorKind, Result},
    token::TokenType,
};

impl<'a> Parser<'a> {
    /// Parse a unary expression: !expr, -expr, +expr, typeof expr, etc.
    pub(crate) fn parse_unary_expression(&mut self) -> Result<ast::Expr> {
        // Check for unary operators
        match self.cur_token.token_type {
            // Logical not: !expr
            TokenType::Bang => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '!'

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the unary expression
                Ok(ast::Expr::Unary(ast::UnaryExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UnaryOp::Bang,
                    arg: Box::new(expr),
                }))
            }

            // Unary minus: -expr
            TokenType::Minus => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '-'

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the unary expression
                Ok(ast::Expr::Unary(ast::UnaryExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UnaryOp::Minus,
                    arg: Box::new(expr),
                }))
            }

            // Unary plus: +expr
            TokenType::Plus => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '+'

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the unary expression
                Ok(ast::Expr::Unary(ast::UnaryExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UnaryOp::Plus,
                    arg: Box::new(expr),
                }))
            }

            // Bitwise not: ~expr
            TokenType::Tilde => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '~'

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the unary expression
                Ok(ast::Expr::Unary(ast::UnaryExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UnaryOp::Tilde,
                    arg: Box::new(expr),
                }))
            }

            // Typeof operator: typeof expr
            TokenType::Typeof => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip 'typeof'

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the unary expression
                Ok(ast::Expr::Unary(ast::UnaryExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UnaryOp::TypeOf,
                    arg: Box::new(expr),
                }))
            }

            // Void operator: void expr
            TokenType::Void => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip 'void'

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the unary expression
                Ok(ast::Expr::Unary(ast::UnaryExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UnaryOp::Void,
                    arg: Box::new(expr),
                }))
            }

            // Delete operator: delete expr
            TokenType::Delete => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip 'delete'

                // Delete operator is not allowed in strict mode for identifiers
                if self.strict_mode && self.is_token_identifier() {
                    return Err(self.error(ErrorKind::General {
                        message: "Delete of an unqualified identifier in strict mode.".into(),
                    }));
                }

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the unary expression
                Ok(ast::Expr::Unary(ast::UnaryExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UnaryOp::Delete,
                    arg: Box::new(expr),
                }))
            }

            // Update expressions: ++expr, --expr
            TokenType::PlusPlus | TokenType::MinusMinus => self.parse_update_expression(),

            // Await expression: await expr
            TokenType::Await => self.parse_await_expression(),

            // Not a unary expression
            _ => {
                // Try to parse as an update expression or a primary expression
                self.parse_left_hand_side_expression()
            }
        }
    }

    /// Parse an update expression: ++expr, --expr, expr++, expr--
    fn parse_update_expression(&mut self) -> Result<ast::Expr> {
        // Check for prefix increment/decrement
        match self.cur_token.token_type {
            // Prefix increment: ++expr
            TokenType::PlusPlus => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '++'

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the update expression
                Ok(ast::Expr::Update(ast::UpdateExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UpdateOp::PlusPlus,
                    prefix: true,
                    arg: Box::new(expr),
                }))
            }

            // Prefix decrement: --expr
            TokenType::MinusMinus => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '--'

                // Parse the expression
                let expr = self.parse_unary_expression()?;

                // Create the update expression
                Ok(ast::Expr::Update(ast::UpdateExpr {
                    span: start_span.merge_with(expr.span()),
                    op: ast::UpdateOp::MinusMinus,
                    prefix: true,
                    arg: Box::new(expr),
                }))
            }

            // Not a prefix update expression
            _ => {
                // Parse as a left-hand side expression
                let expr = self.parse_left_hand_side_expression()?;

                // Check for postfix increment/decrement
                // No automatic semicolon insertion before ++ or --
                if !self.had_line_break_before_current() {
                    match self.cur_token.token_type {
                        // Postfix increment: expr++
                        TokenType::PlusPlus => {
                            let end_span = self.cur_token.span;
                            self.next_token(); // Skip '++'

                            // Create the update expression
                            return Ok(ast::Expr::Update(ast::UpdateExpr {
                                span: expr.span().merge_with(end_span),
                                op: ast::UpdateOp::PlusPlus,
                                prefix: false,
                                arg: Box::new(expr),
                            }));
                        }

                        // Postfix decrement: expr--
                        TokenType::MinusMinus => {
                            let end_span = self.cur_token.span;
                            self.next_token(); // Skip '--'

                            // Create the update expression
                            return Ok(ast::Expr::Update(ast::UpdateExpr {
                                span: expr.span().merge_with(end_span),
                                op: ast::UpdateOp::MinusMinus,
                                prefix: false,
                                arg: Box::new(expr),
                            }));
                        }

                        // Not a postfix update expression
                        _ => {}
                    }
                }

                // Return the expression as is
                Ok(expr)
            }
        }
    }

    /// Parse an await expression: await expr
    fn parse_await_expression(&mut self) -> Result<ast::Expr> {
        // Await is only allowed in async functions
        if !self.in_async {
            return Err(self.error(ErrorKind::General {
                message: "'await' is only allowed within async functions and top level modules"
                    .into(),
            }));
        }

        let start_span = self.cur_token.span;
        self.expect(TokenType::Await)?; // Expect 'await'

        // Parse the expression
        let expr = self.parse_unary_expression()?;

        // Create the await expression
        Ok(ast::Expr::Await(ast::AwaitExpr {
            span: start_span.merge_with(expr.span()),
            arg: Box::new(expr),
        }))
    }
}
