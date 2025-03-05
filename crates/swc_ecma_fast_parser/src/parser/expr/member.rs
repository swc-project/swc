//! Member expression parser implementation
//!
//! This module provides the implementation for parsing member expressions,
//! including property access, computed member access, and optional chaining.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::super::Parser;
use crate::{
    error::{Error, ErrorKind, Result},
    token::TokenType,
};

impl<'a> Parser<'a> {
    /// Parse a member expression: obj.prop, obj[expr], obj?.prop
    pub(crate) fn parse_member_expression(&mut self, object: ast::Expr) -> Result<ast::Expr> {
        let mut expr = object;

        loop {
            match self.cur_token.token_type {
                // Property access: obj.prop
                TokenType::Dot => {
                    self.next_token(); // Skip '.'
                    expr = self.parse_property_access(expr, false)?;
                }

                // Optional chaining: obj?.prop
                TokenType::QuestionDot => {
                    self.next_token(); // Skip '?.'

                    // Check for property access or computed member
                    match self.cur_token.token_type {
                        // Property access: obj?.prop
                        TokenType::Ident => {
                            expr = self.parse_property_access(expr, true)?;
                        }

                        // Computed member: obj?.[expr]
                        TokenType::LBracket => {
                            expr = self.parse_computed_member(expr, true)?;
                        }

                        // Invalid member expression
                        _ => {
                            return Err(self.error(ErrorKind::UnexpectedToken {
                                expected: Some("identifier or '['"),
                                got: format!("{}", self.cur_token.token_type),
                            }));
                        }
                    }
                }

                // Computed member: obj[expr]
                TokenType::LBracket => {
                    expr = self.parse_computed_member(expr, false)?;
                }

                // End of member expression
                _ => {
                    break;
                }
            }
        }

        Ok(expr)
    }

    /// Parse property access: obj.prop
    fn parse_property_access(&mut self, object: ast::Expr, optional: bool) -> Result<ast::Expr> {
        // Property name must be an identifier
        if !self.is_token_identifier() {
            return Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("property name"),
                got: format!("{}", self.cur_token.token_type),
            }));
        }

        // Parse the property name
        let prop = self.parse_identifier_name()?;

        // Create the member expression
        Ok(ast::Expr::Member(ast::MemberExpr {
            span: object.span().merge_with(prop.span),
            obj: Box::new(object),
            prop: ast::MemberProp::Ident(prop),
            computed: false,
            optional,
        }))
    }

    /// Parse computed member access: obj[expr]
    fn parse_computed_member(&mut self, object: ast::Expr, optional: bool) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::LBracket)?; // Expect '['

        // Parse the property expression
        let prop = self.parse_expression()?;

        let end_span = self.cur_token.span;
        self.expect(TokenType::RBracket)?; // Expect ']'

        // Create the member expression
        Ok(ast::Expr::Member(ast::MemberExpr {
            span: object.span().merge_with(end_span),
            obj: Box::new(object),
            prop: ast::MemberProp::Computed(ast::ComputedPropName {
                span: start_span.merge_with(end_span),
                expr: Box::new(prop),
            }),
            computed: true,
            optional,
        }))
    }
}
