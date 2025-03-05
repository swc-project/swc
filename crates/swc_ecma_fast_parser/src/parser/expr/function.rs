//! Function expression parser implementation
//!
//! This module provides the implementation for parsing function expressions,
//! including normal functions, arrow functions, generator functions,
//! and async functions.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::super::Parser;
use crate::{
    error::{Error, ErrorKind, Result},
    token::TokenType,
};

impl<'a> Parser<'a> {
    /// Parse a function expression: function [name](params) { body }
    pub(crate) fn parse_function_expression(
        &mut self,
        is_async: bool,
        is_generator: bool,
    ) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Function)?; // Expect 'function'

        // Check for generator function
        let is_generator = if self.is_token_type(TokenType::Mul) {
            self.next_token(); // Skip '*'
            true
        } else {
            is_generator
        };

        // Parse the function name if present (optional)
        let ident = if self.is_token_identifier() {
            Some(self.parse_binding_identifier()?.id)
        } else {
            None
        };

        // Create a new scope for the function
        self.enter_scope(super::super::ScopeKind::Function);

        // Remember we're in a function
        let prev_in_function = self.in_function;
        let prev_in_generator = self.in_generator;
        let prev_in_async = self.in_async;
        self.in_function = true;
        self.in_generator = is_generator;
        self.in_async = is_async;

        // Parse function parameters and body
        let (params, body) = self.parse_function_params_and_body()?;

        // Restore previous function state
        self.in_function = prev_in_function;
        self.in_generator = prev_in_generator;
        self.in_async = prev_in_async;

        // Exit the function scope
        self.exit_scope();

        // Create the function expression
        Ok(ast::Expr::Fn(ast::FnExpr {
            ident,
            function: ast::Function {
                params,
                decorators: Vec::new(),
                span: start_span.merge_with(body.span),
                body: Some(body),
                is_generator,
                is_async,
                type_params: None,
                return_type: None,
            },
        }))
    }

    /// Parse an arrow function: (param1, param2) => body
    fn parse_arrow_function_expression(&mut self, is_async: bool) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;

        // Create a new scope for the arrow function
        self.enter_scope(super::super::ScopeKind::Function);

        // Remember we're in a function
        let prev_in_function = self.in_function;
        let prev_in_async = self.in_async;
        self.in_function = true;
        self.in_async = is_async;

        // Parse the parameters
        let params = match self.cur_token.token_type {
            // Single parameter without parentheses: param => body
            TokenType::Ident => {
                let binding_ident = self.parse_binding_identifier()?;
                vec![ast::Param {
                    span: binding_ident.id.span,
                    decorators: Vec::new(),
                    pat: ast::Pat::Ident(binding_ident),
                }]
            }

            // Parameters with parentheses: (param1, param2) => body
            TokenType::LParen => {
                self.next_token(); // Skip '('

                let mut params = Vec::new();

                if !self.is_token_type(TokenType::RParen) {
                    loop {
                        // Check for rest parameter
                        let is_rest = if self.is_token_type(TokenType::Ellipsis) {
                            self.next_token(); // Skip '...'
                            true
                        } else {
                            false
                        };

                        // Parse the parameter pattern
                        let pat = self.parse_binding_pattern()?;

                        // Create the parameter
                        let param = if is_rest {
                            ast::Param {
                                span: pat.span(),
                                decorators: Vec::new(),
                                pat: ast::Pat::Rest(ast::RestPat {
                                    span: pat.span(),
                                    arg: Box::new(pat),
                                    type_ann: None,
                                }),
                            }
                        } else {
                            ast::Param {
                                span: pat.span(),
                                decorators: Vec::new(),
                                pat,
                            }
                        };

                        params.push(param);

                        // Rest parameter must be the last parameter
                        if is_rest {
                            if !self.is_token_type(TokenType::RParen) {
                                return Err(self.error(ErrorKind::General {
                                    message: "Rest parameter must be the last parameter".into(),
                                }));
                            }
                            break;
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

                self.expect(TokenType::RParen)?; // Expect ')'
                params
            }

            // Invalid parameter
            _ => {
                return Err(self.error(ErrorKind::UnexpectedToken {
                    expected: Some("identifier or parameter list"),
                    got: format!("{}", self.cur_token.token_type),
                }));
            }
        };

        // Parse the arrow token
        self.expect(TokenType::Arrow)?; // Expect '=>'

        // Parse the arrow function body
        let (body, span) = match self.cur_token.token_type {
            // Block body: => { statements }
            TokenType::LBrace => {
                let block = self.parse_block_stmt()?;
                let body = ast::BlockStmtOrExpr::BlockStmt(block.clone());
                (body, block.span)
            }

            // Expression body: => expression
            _ => {
                let expr = self.parse_assignment_expression()?;
                let span = expr.span();
                let body = ast::BlockStmtOrExpr::Expr(Box::new(expr));
                (body, span)
            }
        };

        // Restore previous function state
        self.in_function = prev_in_function;
        self.in_async = prev_in_async;

        // Exit the arrow function scope
        self.exit_scope();

        // Create the arrow function expression
        Ok(ast::Expr::Arrow(ast::ArrowExpr {
            span: start_span.merge_with(span),
            params,
            body,
            is_async,
            is_generator: false, // Arrow functions cannot be generators
            return_type: None,
            type_params: None,
        }))
    }

    /// Try to parse an arrow function starting from an identifier
    fn try_parse_arrow_function_from_ident(
        &mut self,
        ident: ast::Ident,
        is_async: bool,
    ) -> Result<Option<ast::Expr>> {
        // Check if the next token is an arrow
        if !self.is_token_type(TokenType::Arrow) {
            return Ok(None);
        }

        // We have an arrow, save state to restore if we fail
        let state = self.save_state();

        // Create a new scope for the arrow function
        self.enter_scope(super::super::ScopeKind::Function);

        // Remember we're in a function
        let prev_in_function = self.in_function;
        let prev_in_async = self.in_async;
        self.in_function = true;
        self.in_async = is_async;

        // Create the parameter from the identifier
        let binding_ident = ast::BindingIdent {
            id: ident.clone(),
            type_ann: None,
        };

        let params = vec![ast::Param {
            span: ident.span,
            decorators: Vec::new(),
            pat: ast::Pat::Ident(binding_ident),
        }];

        self.next_token(); // Skip '=>'

        // Parse the arrow function body
        let (body, span) = match self.cur_token.token_type {
            // Block body: => { statements }
            TokenType::LBrace => {
                match self.parse_block_stmt() {
                    Ok(block) => {
                        let body = ast::BlockStmtOrExpr::BlockStmt(block.clone());
                        (body, block.span)
                    }
                    Err(_) => {
                        // Restore state and exit early
                        self.restore_state(state);
                        self.in_function = prev_in_function;
                        self.in_async = prev_in_async;
                        self.exit_scope();
                        return Ok(None);
                    }
                }
            }

            // Expression body: => expression
            _ => {
                match self.parse_assignment_expression() {
                    Ok(expr) => {
                        let span = expr.span();
                        let body = ast::BlockStmtOrExpr::Expr(Box::new(expr));
                        (body, span)
                    }
                    Err(_) => {
                        // Restore state and exit early
                        self.restore_state(state);
                        self.in_function = prev_in_function;
                        self.in_async = prev_in_async;
                        self.exit_scope();
                        return Ok(None);
                    }
                }
            }
        };

        // Restore previous function state
        self.in_function = prev_in_function;
        self.in_async = prev_in_async;

        // Exit the arrow function scope
        self.exit_scope();

        // Create the arrow function expression
        Ok(Some(ast::Expr::Arrow(ast::ArrowExpr {
            span: ident.span.merge_with(span),
            params,
            body,
            is_async,
            is_generator: false, // Arrow functions cannot be generators
            return_type: None,
            type_params: None,
        })))
    }
}
