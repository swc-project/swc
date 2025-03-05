//! Call expression parser implementation
//!
//! This module provides the implementation for parsing call expressions,
//! including function calls, constructor calls (new operator),
//! and optional chaining calls.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::super::Parser;
use crate::{
    error::{Error, ErrorKind, Result},
    token::TokenType,
};

/// Call expression parser implementation
pub(crate) trait CallExprParser<'a> {
    /// Parse a call expression: callee(arg1, arg2)
    fn parse_call_expression(&mut self, callee: ast::Expr) -> Result<ast::Expr>;

    /// Parse a new expression: new Constructor(arg1, arg2)
    fn parse_new_expression(&mut self) -> Result<ast::Expr>;

    /// Parse arguments for a call expression: (arg1, arg2)
    fn parse_arguments(&mut self) -> Result<Vec<ast::ExprOrSpread>>;
}

impl<'a> CallExprParser<'a> for Parser<'a> {
    /// Parse a call expression: callee(arg1, arg2)
    fn parse_call_expression(&mut self, callee: ast::Expr) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::LParen)?; // Expect '('

        // Check if this is an optional call
        let optional = match &callee {
            ast::Expr::Member(member) => member.optional,
            _ => false,
        };

        // Parse the arguments
        let args = self.parse_arguments()?;

        let end_span = self.cur_token.span;
        self.expect(TokenType::RParen)?; // Expect ')'

        // Create the call expression
        Ok(ast::Expr::Call(ast::CallExpr {
            span: callee.span().merge_with(end_span),
            callee: ast::Callee::Expr(Box::new(callee)),
            args,
            type_args: None,
            optional,
        }))
    }

    /// Parse a new expression: new Constructor(arg1, arg2)
    fn parse_new_expression(&mut self) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::New)?; // Expect 'new'

        // Check for new.target
        if self.is_token_type(TokenType::Dot) {
            self.next_token(); // Skip '.'

            if self.is_token_identifier_eq("target") {
                self.next_token(); // Skip 'target'

                // Create the new.target meta property
                return Ok(ast::Expr::MetaProp(ast::MetaPropExpr {
                    span: start_span.merge_with(self.prev_token.span),
                    kind: ast::MetaPropKind::NewTarget,
                }));
            } else {
                return Err(self.error(ErrorKind::UnexpectedToken {
                    expected: Some("'target'"),
                    got: format!("{}", self.cur_token.token_type),
                }));
            }
        }

        // Parse the constructor expression
        let constructor = self.parse_left_hand_side_expression()?;

        // Parse the arguments if present
        let args = if self.is_token_type(TokenType::LParen) {
            self.next_token(); // Skip '('

            let args = self.parse_arguments()?;

            self.expect(TokenType::RParen)?; // Expect ')'
            args
        } else {
            Vec::new()
        };

        // Create the new expression
        Ok(ast::Expr::New(ast::NewExpr {
            span: start_span.merge_with(match args.last() {
                Some(arg) => match &arg.expr {
                    box ast::Expr::Lit(lit) => lit.span(),
                    expr => expr.span(),
                },
                None => constructor.span(),
            }),
            callee: Box::new(constructor),
            args: Some(args),
            type_args: None,
        }))
    }

    /// Parse arguments for a call expression: (arg1, arg2)
    fn parse_arguments(&mut self) -> Result<Vec<ast::ExprOrSpread>> {
        let mut args = Vec::new();

        // Parse the arguments
        while !self.is_token_type(TokenType::RParen) {
            // Check for spread argument
            let is_spread = if self.is_token_type(TokenType::Ellipsis) {
                self.next_token(); // Skip '...'
                true
            } else {
                false
            };

            // Parse the argument expression
            let expr = self.parse_assignment_expression()?;

            // Create the argument
            let arg = ast::ExprOrSpread {
                spread: if is_spread {
                    Some(expr.span().lo)
                } else {
                    None
                },
                expr: Box::new(expr),
            };

            args.push(arg);

            // Check for comma or end of arguments
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

        Ok(args)
    }
}

impl<'a> Parser<'a> {
    /// Parse a chain of call expressions and member expressions
    pub(crate) fn parse_call_chain(&mut self, callee: ast::Expr) -> Result<ast::Expr> {
        let mut expr = callee;

        loop {
            match self.cur_token.token_type {
                // Function call: expr(args)
                TokenType::LParen => {
                    expr = self.parse_call_expression(expr)?;
                }

                // Member access: expr.prop
                TokenType::Dot => {
                    self.next_token(); // Skip '.'
                    expr = self.parse_property_access(expr, false)?;
                }

                // Optional chaining: expr?.prop or expr?.(args)
                TokenType::QuestionDot => {
                    self.next_token(); // Skip '?.'

                    // Check for property access, computed member, or call
                    match self.cur_token.token_type {
                        // Property access: expr?.prop
                        TokenType::Ident => {
                            expr = self.parse_property_access(expr, true)?;
                        }

                        // Computed member: expr?.[expr]
                        TokenType::LBracket => {
                            expr = self.parse_computed_member(expr, true)?;
                        }

                        // Call expression: expr?.(args)
                        TokenType::LParen => {
                            // Make the callee an optional member expression
                            if !matches!(expr, ast::Expr::Member(_)) {
                                // Convert to an optional member expression
                                expr = ast::Expr::Member(ast::MemberExpr {
                                    span: expr.span(),
                                    obj: Box::new(expr.clone()),
                                    prop: ast::MemberProp::Ident(ast::Ident {
                                        span: expr.span(),
                                        sym: "".into(),
                                        optional: false,
                                    }),
                                    computed: false,
                                    optional: true,
                                });
                            }

                            expr = self.parse_call_expression(expr)?;
                        }

                        // Invalid expression
                        _ => {
                            return Err(self.error(ErrorKind::UnexpectedToken {
                                expected: Some("identifier, '[', or '('"),
                                got: format!("{}", self.cur_token.token_type),
                            }));
                        }
                    }
                }

                // Computed member: expr[prop]
                TokenType::LBracket => {
                    expr = self.parse_computed_member(expr, false)?;
                }

                // End of call chain
                _ => {
                    break;
                }
            }
        }

        Ok(expr)
    }
}
