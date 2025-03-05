//! Expression statement parser implementation
//!
//! This module provides the implementation for parsing expression statements,
//! which are statements consisting of a single expression followed by a
//! semicolon.

use swc_ecma_ast as ast;

use super::{super::Parser, StmtParser};
use crate::{error::Result, token::TokenType};

impl<'a> Parser<'a> {
    /// Parse an expression statement: expr;
    fn parse_expression_statement(&mut self) -> Result<ast::ExprStmt> {
        // Check for directive prologue (string literal at the beginning of a program or
        // function)
        let is_directive = if self.is_token_type(TokenType::Str)
            && (self.peek_token().token_type == TokenType::Semicolon
                || self.peek_token().had_line_break)
        {
            true
        } else {
            false
        };

        // Parse the expression
        let expr = self.parse_expression()?;

        // Check for strict mode directive
        if is_directive {
            if let ast::Expr::Lit(ast::Lit::Str(ref str_lit)) = expr {
                if str_lit.value.to_string() == "use strict" {
                    // Enable strict mode
                    self.strict_mode = true;
                }
            }
        }

        self.consume_semicolon(); // Consume semicolon

        // Create the expression statement
        Ok(ast::ExprStmt {
            span: expr.span().merge_with(self.prev_token.span),
            expr: Box::new(expr),
        })
    }
}
