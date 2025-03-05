//! Primary expression parser implementation
//!
//! This module handles parsing of the most basic expressions:
//! - Literals (string, number, boolean, null, regex)
//! - Identifiers
//! - This expressions
//! - Parenthesized expressions
//! - Template literals

use swc_atoms::Atom;
use swc_common::Span;
use swc_ecma_ast as ast;

use super::{super::Parser, ExprParser};
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

/// Primary expression parser implementation
pub(crate) trait PrimaryExprParser<'a> {
    /// Parse a primary expression
    fn parse_primary_expression(&mut self) -> Result<ast::Expr>;

    /// Parse a literal expression
    fn parse_literal(&mut self) -> Result<ast::Expr>;

    /// Parse an identifier expression
    fn parse_identifier_expression(&mut self) -> Result<ast::Expr>;

    /// Parse a this expression
    fn parse_this_expression(&mut self) -> Result<ast::Expr>;

    /// Parse a parenthesized expression
    fn parse_parenthesized_expression(&mut self) -> Result<ast::Expr>;

    /// Parse a template literal
    fn parse_template_literal(&mut self, tag: Option<Box<ast::Expr>>) -> Result<ast::Expr>;
}

impl<'a> PrimaryExprParser<'a> for Parser<'a> {
    /// Parse a primary expression (literal, identifier, this, parenthesized,
    /// etc.)
    fn parse_primary_expression(&mut self) -> Result<ast::Expr> {
        match self.cur_token.token_type {
            // Literals
            TokenType::Str
            | TokenType::Num
            | TokenType::BigInt
            | TokenType::True
            | TokenType::False
            | TokenType::Null
            | TokenType::RegExp => self.parse_literal(),

            // Identifiers
            TokenType::Ident => self.parse_identifier_expression(),

            // This expression
            TokenType::This => self.parse_this_expression(),

            // Parenthesized expression
            TokenType::LParen => self.parse_parenthesized_expression(),

            // Array literal
            TokenType::LBracket => Ok(ast::Expr::Array(self.parse_array_expression()?)),

            // Object literal
            TokenType::LBrace => Ok(ast::Expr::Object(self.parse_object_expression()?)),

            // Function expression
            TokenType::Function => Ok(ast::Expr::Fn(self.parse_function_expression(false, false)?)),

            // Template literal
            TokenType::Template => self.parse_template_literal(None),

            // New expression or new.target
            TokenType::New => self.parse_new_expression(),

            // Async function or async arrow function
            TokenType::Async if !self.cur_token.had_line_break && self.is_async_function() => {
                self.next_token(); // Skip 'async'

                // Check if it's an async function expression
                if self.is_token_type(TokenType::Function) {
                    Ok(ast::Expr::Fn(self.parse_function_expression(true, false)?))
                } else {
                    // It's an async arrow function
                    Ok(ast::Expr::Arrow(
                        self.parse_arrow_function_expression(true)?,
                    ))
                }
            }

            // Class expression
            TokenType::Class => self.parse_class_expression(),

            // JSX fragment or element (if JSX is enabled)
            TokenType::JSXFragment if self.syntax.jsx => self.parse_jsx_fragment(),
            TokenType::JSXTagStart if self.syntax.jsx => self.parse_jsx_element(),

            // Super expression
            TokenType::Super => self.parse_super_expression(),

            // Unexpected token
            _ => Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("expression"),
                got: format!("{}", self.cur_token.token_type),
            })),
        }
    }

    /// Parse a literal expression (string, number, boolean, null, regex)
    fn parse_literal(&mut self) -> Result<ast::Expr> {
        let span = self.cur_token.span;

        let expr = match self.cur_token.token_type {
            // String literal
            TokenType::Str => {
                let (value, raw) = match &self.cur_token.value {
                    TokenValue::Str { value, raw } => (value.clone(), raw.clone()),
                    _ => unreachable!(),
                };

                ast::Expr::Lit(ast::Lit::Str(ast::Str {
                    span,
                    value,
                    raw: Some(raw),
                }))
            }

            // Number literal
            TokenType::Num => {
                let (value, raw) = match &self.cur_token.value {
                    TokenValue::Num { value, raw } => (*value, raw.clone()),
                    _ => unreachable!(),
                };

                ast::Expr::Lit(ast::Lit::Num(ast::Number {
                    span,
                    value,
                    raw: Some(raw),
                }))
            }

            // BigInt literal
            TokenType::BigInt => {
                let (value, raw) = match &self.cur_token.value {
                    TokenValue::BigInt { value, raw } => (value.clone(), raw.clone()),
                    _ => unreachable!(),
                };

                ast::Expr::Lit(ast::Lit::BigInt(ast::BigInt {
                    span,
                    value,
                    raw: Some(raw),
                }))
            }

            // Boolean literal
            TokenType::True => ast::Expr::Lit(ast::Lit::Bool(ast::Bool { span, value: true })),

            TokenType::False => ast::Expr::Lit(ast::Lit::Bool(ast::Bool { span, value: false })),

            // Null literal
            TokenType::Null => ast::Expr::Lit(ast::Lit::Null(ast::Null { span })),

            // RegExp literal
            TokenType::RegExp => {
                let (pattern, flags) = match &self.cur_token.value {
                    TokenValue::RegExp { pattern, flags } => (pattern.clone(), flags.clone()),
                    _ => unreachable!(),
                };

                ast::Expr::Lit(ast::Lit::Regex(ast::Regex {
                    span,
                    exp: pattern,
                    flags,
                }))
            }

            // Unexpected token
            _ => unreachable!(),
        };

        self.next_token(); // Skip the literal

        Ok(expr)
    }

    /// Parse an identifier expression
    fn parse_identifier_expression(&mut self) -> Result<ast::Expr> {
        let ident = self.parse_identifier_name()?;
        Ok(ast::Expr::Ident(ident))
    }

    /// Parse a this expression
    fn parse_this_expression(&mut self) -> Result<ast::Expr> {
        let span = self.cur_token.span;
        self.next_token(); // Skip 'this'

        Ok(ast::Expr::This(ast::ThisExpr { span }))
    }

    /// Parse a parenthesized expression
    fn parse_parenthesized_expression(&mut self) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;
        self.next_token(); // Skip '('

        // Check for empty parentheses (should be an error)
        if self.is_token_type(TokenType::RParen) {
            return Err(self.error(ErrorKind::General {
                message: "Empty parentheses are not allowed".into(),
            }));
        }

        // Parse the expression inside the parentheses
        let expr = self.parse_expression()?;

        let end_span = self.cur_token.span;
        self.expect(TokenType::RParen)?; // Expect ')'

        // Wrap the expression in a ParenExpr node
        Ok(ast::Expr::Paren(ast::ParenExpr {
            span: start_span.merge_with(end_span),
            expr: Box::new(expr),
        }))
    }

    /// Parse a template literal
    fn parse_template_literal(&mut self, tag: Option<Box<ast::Expr>>) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;
        let is_tagged = tag.is_some();

        // Process the template parts
        let mut quasis = Vec::new();
        let mut expressions = Vec::new();

        // If it's a no-substitution template (just a single quasi)
        if !self.cur_token.template_has_substitutions() {
            // Extract the raw and cooked values
            let (raw, cooked) = match &self.cur_token.value {
                TokenValue::Template { raw, cooked } => (raw.clone(), cooked.clone()),
                _ => unreachable!(),
            };

            // Create the template element
            quasis.push(ast::TplElement {
                span: self.cur_token.span,
                tail: true,
                cooked: Some(cooked),
                raw,
            });

            self.next_token(); // Skip the template
        } else {
            // Template with substitutions
            while !self.is_token_type(TokenType::EOF) {
                // Extract the raw and cooked values
                let (raw, cooked) = match &self.cur_token.value {
                    TokenValue::Template { raw, cooked } => (raw.clone(), cooked.clone()),
                    _ => unreachable!(),
                };

                // Is this the tail element?
                let is_tail = !self.cur_token.template_has_substitutions();

                // Create the template element
                quasis.push(ast::TplElement {
                    span: self.cur_token.span,
                    tail: is_tail,
                    cooked: Some(cooked),
                    raw,
                });

                self.next_token(); // Skip the template part

                // If it's the tail, we're done
                if is_tail {
                    break;
                }

                // Parse the expression inside the template
                let expr = self.parse_expression()?;
                expressions.push(Box::new(expr));

                // Expect the closing brace
                if !self.is_token_type(TokenType::Template)
                    && !self.is_token_type(TokenType::TemplateMiddle)
                {
                    return Err(self.error(ErrorKind::UnexpectedToken {
                        expected: Some("template continuation"),
                        got: format!("{}", self.cur_token.token_type),
                    }));
                }
            }
        }

        // Create the template literal
        if let Some(tag) = tag {
            // Tagged template literal
            Ok(ast::Expr::TaggedTpl(ast::TaggedTpl {
                span: start_span.merge_with(quasis.last().unwrap().span),
                tag,
                type_params: None,
                tpl: ast::Tpl {
                    span: start_span.merge_with(quasis.last().unwrap().span),
                    exprs: expressions,
                    quasis,
                },
            }))
        } else {
            // Regular template literal
            Ok(ast::Expr::Tpl(ast::Tpl {
                span: start_span.merge_with(quasis.last().unwrap().span),
                exprs: expressions,
                quasis,
            }))
        }
    }
}

// Additional methods that would be implemented elsewhere
impl<'a> Parser<'a> {
    // These methods will be implemented in other files
    fn parse_new_expression(&mut self) -> Result<ast::Expr> {
        // Will be implemented in call.rs
        unimplemented!()
    }

    fn is_async_function(&self) -> bool {
        // Helper method to check if it's an async function expression
        // Will be implemented in the parser module
        unimplemented!()
    }

    fn parse_class_expression(&mut self) -> Result<ast::Expr> {
        // Will be implemented in class.rs
        unimplemented!()
    }

    fn parse_jsx_fragment(&mut self) -> Result<ast::Expr> {
        // Will be implemented in jsx.rs
        unimplemented!()
    }

    fn parse_jsx_element(&mut self) -> Result<ast::Expr> {
        // Will be implemented in jsx.rs
        unimplemented!()
    }

    fn parse_super_expression(&mut self) -> Result<ast::Expr> {
        // Will be implemented in call.rs or member.rs
        unimplemented!()
    }
}
