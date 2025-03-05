//! Object expression parser implementation
//!
//! This module provides the implementation for parsing object expressions,
//! which are enclosed by curly braces and can contain multiple properties.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::super::Parser;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

impl<'a> Parser<'a> {
    /// Parse an object expression: { key: value, method() {}, ...spread }
    pub(crate) fn parse_object_expression(&mut self) -> Result<ast::Expr> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::LBrace)?; // Expect '{'

        let mut properties = Vec::new();

        // Parse the properties
        while !self.is_token_type(TokenType::RBrace) {
            // Parse the property
            let prop = self.parse_object_property()?;
            properties.push(prop);

            // Check for comma or end of properties
            if self.is_token_type(TokenType::Comma) {
                self.next_token(); // Skip ','

                // Handle trailing comma
                if self.is_token_type(TokenType::RBrace) {
                    break;
                }
            } else {
                break;
            }
        }

        let end_span = self.cur_token.span;
        self.expect(TokenType::RBrace)?; // Expect '}'

        // Create the object expression
        Ok(ast::Expr::Object(ast::ObjectLit {
            span: start_span.merge_with(end_span),
            props: properties,
        }))
    }

    /// Parse an object property
    fn parse_object_property(&mut self) -> Result<ast::PropOrSpread> {
        // Check for spread element
        if self.is_token_type(TokenType::Ellipsis) {
            let start_span = self.cur_token.span;
            self.next_token(); // Skip '...'

            // Parse the spread argument
            let arg = self.parse_assignment_expression()?;

            // Create the spread element
            return Ok(ast::PropOrSpread::Spread(ast::SpreadElement {
                dot3_token: start_span.lo,
                expr: Box::new(arg),
            }));
        }

        // Check for async method
        let is_async = if self.is_token_type(TokenType::Async) && !self.peek_token().had_line_break
        {
            // Look ahead to determine if this is an async method
            match self.peek_token().token_type {
                TokenType::LBracket | TokenType::Ident | TokenType::Str | TokenType::Num => {
                    self.next_token(); // Skip 'async'
                    true
                }
                _ => false,
            }
        } else {
            false
        };

        // Check for generator method
        let is_generator = if self.is_token_type(TokenType::Mul) {
            self.next_token(); // Skip '*'
            true
        } else {
            false
        };

        // Check for getter or setter
        let method_kind = if self.is_token_identifier_eq("get") && !self.peek_token().had_line_break
        {
            // Look ahead to determine if this is a getter
            match self.peek_token().token_type {
                TokenType::LBracket | TokenType::Ident | TokenType::Str | TokenType::Num => {
                    self.next_token(); // Skip 'get'
                    ast::MethodKind::Getter
                }
                _ => ast::MethodKind::Method,
            }
        } else if self.is_token_identifier_eq("set") && !self.peek_token().had_line_break {
            // Look ahead to determine if this is a setter
            match self.peek_token().token_type {
                TokenType::LBracket | TokenType::Ident | TokenType::Str | TokenType::Num => {
                    self.next_token(); // Skip 'set'
                    ast::MethodKind::Setter
                }
                _ => ast::MethodKind::Method,
            }
        } else {
            ast::MethodKind::Method
        };

        // Parse the property key
        let key_span = self.cur_token.span;
        let mut is_computed = false;
        let key = match self.cur_token.token_type {
            // Identifier property
            TokenType::Ident => {
                let id = self.parse_identifier_name()?;

                // Check for shorthand property: { key } instead of { key: key }
                if !is_async
                    && !is_generator
                    && method_kind == ast::MethodKind::Method
                    && !self.is_token_type(TokenType::Colon)
                    && !self.is_token_type(TokenType::LParen)
                {
                    // Create the shorthand property
                    return Ok(ast::PropOrSpread::Prop(Box::new(ast::Prop::Shorthand(
                        ast::Ident {
                            span: id.span,
                            sym: id.sym,
                            optional: false,
                            ctxt: Default::default(),
                        },
                    ))));
                }

                ast::PropName::Ident(id)
            }

            // String property
            TokenType::Str => {
                let str_lit = match &self.cur_token.value {
                    TokenValue::String(s) => ast::Str {
                        span: self.cur_token.span,
                        value: s.clone().into(),
                        raw: None,
                    },
                    _ => unreachable!("Expected string literal"),
                };

                self.next_token(); // Skip string

                ast::PropName::Str(str_lit)
            }

            // Numeric property
            TokenType::Num => {
                let num_lit = match &self.cur_token.value {
                    TokenValue::Number(n) => ast::Number {
                        span: self.cur_token.span,
                        value: *n,
                        raw: None,
                    },
                    _ => unreachable!("Expected number literal"),
                };

                self.next_token(); // Skip number

                ast::PropName::Num(num_lit)
            }

            // Computed property: [expr]
            TokenType::LBracket => {
                let start_span = self.cur_token.span;
                self.next_token(); // Skip '['

                // Parse the computed key expression
                let expr = self.parse_assignment_expression()?;

                let end_span = self.cur_token.span;
                self.expect(TokenType::RBracket)?; // Expect ']'

                is_computed = true;
                ast::PropName::Computed(ast::ComputedPropName {
                    span: start_span.merge_with(end_span),
                    expr: Box::new(expr),
                })
            }

            // Invalid property key
            _ => {
                return Err(self.error(ErrorKind::UnexpectedToken {
                    expected: Some("property name"),
                    got: format!("{}", self.cur_token.token_type),
                }));
            }
        };

        // Check for method definition: { method() {} }
        if self.is_token_type(TokenType::LParen) {
            // Remember we're in a function
            let prev_in_function = self.in_function;
            let prev_in_generator = self.in_generator;
            let prev_in_async = self.in_async;
            self.in_function = true;
            self.in_generator = is_generator;
            self.in_async = is_async;

            // Create a new scope for the method
            self.enter_scope(super::super::ScopeKind::Function);

            self.next_token(); // Skip '('

            // Parse the parameters
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

            // Parse the method body
            self.expect(TokenType::LBrace)?; // Expect '{'
            let body = self.parse_block_stmt()?;

            // Exit the method scope
            self.exit_scope();

            // Restore previous function state
            self.in_function = prev_in_function;
            self.in_generator = prev_in_generator;
            self.in_async = prev_in_async;

            // Create the method definition
            let function = ast::Function {
                params,
                decorators: Vec::new(),
                span: key_span.merge_with(body.span),
                body: Some(body),
                is_generator,
                is_async,
                type_params: None,
                return_type: None,
                ctxt: Default::default(),
            };

            return Ok(ast::PropOrSpread::Prop(Box::new(ast::Prop::Method(
                ast::MethodProp {
                    key,
                    function,
                    kind: method_kind,
                },
            ))));
        }

        // Regular property: { key: value }
        self.expect(TokenType::Colon)?; // Expect ':'

        // Parse the property value
        let value = self.parse_assignment_expression()?;

        // Create the property
        Ok(ast::PropOrSpread::Prop(Box::new(ast::Prop::KeyValue(
            ast::KeyValueProp {
                key,
                value: Box::new(value),
            },
        ))))
    }
}
