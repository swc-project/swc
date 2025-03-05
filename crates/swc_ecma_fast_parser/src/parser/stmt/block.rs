//! Block statement parser implementation
//!
//! This module provides the implementation for parsing block statements,
//! which are enclosed by curly braces and can contain multiple statements.

use swc_ecma_ast as ast;

use super::super::Parser;
use crate::{error::Result, token::TokenType};

impl<'a> Parser<'a> {
    /// Parse a block statement: { stmt1; stmt2; ... }
    pub(crate) fn parse_block_stmt(&mut self) -> Result<ast::BlockStmt> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::LBrace)?; // Expect '{'

        let mut stmts = Vec::new();

        while !self.is_token_type(TokenType::RBrace) && !self.is_token_type(TokenType::EOF) {
            // Parse a statement
            match self.parse_statement() {
                Ok(stmt) => stmts.push(stmt),
                Err(err) => {
                    // Report the error but continue parsing
                    self.report_error(err);
                    self.error_recovery();
                }
            }
        }

        let end_span = self.cur_token.span;
        self.expect(TokenType::RBrace)?; // Expect '}'

        // Create the block statement
        Ok(ast::BlockStmt {
            span: start_span.merge_with(end_span),
            stmts,
            ..Default::default()
        })
    }

    /// Parse a block statement with a new lexical scope
    pub(crate) fn parse_block_stmt_with_scope(&mut self) -> Result<ast::BlockStmt> {
        // Create a new scope for the block statement
        self.enter_scope(super::super::ScopeKind::Block);

        // Parse the block statement
        let result = self.parse_block_stmt();

        // Exit the block scope
        self.exit_scope();

        result
    }
}
