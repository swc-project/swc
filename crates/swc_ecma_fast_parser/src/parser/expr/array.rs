//! Array expression parser implementation
//!
//! This module provides the implementation for parsing array expressions,
//! which are enclosed by square brackets and can contain multiple elements.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::{super::Parser, ExprParser};
use crate::{
    error::{Error, ErrorKind, Result},
    token::TokenType,
};

impl<'a> Parser<'a> {
    /// Parse an array expression: [elem1, elem2, ...spread]
    pub(crate) fn parse_array_expression(&mut self) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::LBracket)?; // Expect '['

        let mut elements = Vec::new();

        // Parse the elements
        while !self.is_token_type(TokenType::RBracket) {
            // Handle elision (hole)
            if self.is_token_type(TokenType::Comma) {
                elements.push(None);
                self.next_token(); // Skip ','
                continue;
            }

            // Check for spread element
            let is_spread = if self.is_token_type(TokenType::Ellipsis) {
                self.next_token(); // Skip '...'
                true
            } else {
                false
            };

            // Parse the element expression
            let expr = self.parse_assignment_expression()?;

            // Create the element
            let element = if is_spread {
                Some(ast::ExprOrSpread {
                    spread: Some(expr.span().lo),
                    expr: Box::new(expr),
                })
            } else {
                Some(ast::ExprOrSpread {
                    spread: None,
                    expr: Box::new(expr),
                })
            };

            elements.push(element);

            // Check for comma or end of elements
            if self.is_token_type(TokenType::Comma) {
                self.next_token(); // Skip ','

                // Handle trailing comma
                if self.is_token_type(TokenType::RBracket) {
                    break;
                }
            } else {
                break;
            }
        }

        let end_span = self.cur_token.span;
        self.expect(TokenType::RBracket)?; // Expect ']'

        // Create the array expression
        Ok(ast::Expr::Array(ast::ArrayLit {
            span: start_span.merge_with(end_span),
            elems: elements,
        }))
    }
}
