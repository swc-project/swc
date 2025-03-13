//! Pattern parser implementation
//!
//! This module contains methods for parsing JavaScript patterns (destructuring,
//! etc.).

use swc_atoms::Atom;
use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{
    ArrayPat, AssignPat, AssignPatProp, BindingIdent, ComputedPropName, Expr, Ident, IdentName,
    KeyValuePatProp, ObjectPat, ObjectPatProp, Pat, PropName, RestPat,
};

use crate::{
    error::{Error, ErrorKind, Result},
    parser::{util, util::GetSpan, Parser},
    token::{Token, TokenType, TokenValue},
    util::{likely, unlikely},
};

impl<'a> Parser<'a> {
    /// Parse a pattern (destructuring pattern or binding identifier)
    pub fn parse_pat(&mut self) -> Result<Pat> {
        // Check if the pattern starts with a destructuring pattern
        match self.current_token_type() {
            TokenType::LBracket => self.parse_array_pat(),
            TokenType::LBrace => self.parse_object_pat(),
            TokenType::Ident => {
                // Parse a binding identifier
                let span = self.current_span();
                let ident = util::token_value_to_binding_ident(self.current(), span);
                self.next()?; // Consume identifier

                // Check for assignment pattern
                if self.is(TokenType::Eq) {
                    self.next()?; // Consume '='
                    let right = self.parse_expr()?;
                    let ident_span = ident.span();
                    let right_span = right.span();
                    let span = Span::new(ident_span.lo, right_span.hi);
                    Ok(Pat::Assign(AssignPat {
                        span,
                        left: Box::new(Pat::Ident(ident)),
                        right,
                    }))
                } else {
                    Ok(Pat::Ident(ident))
                }
            }
            _ => {
                // Unexpected token
                let span = self.current_span();
                Err(Error {
                    kind: ErrorKind::UnexpectedToken {
                        expected: Some("pattern"),
                        got: self.current_token_type().as_str().to_string(),
                    },
                    span,
                })
            }
        }
    }

    /// Parse an array pattern
    fn parse_array_pat(&mut self) -> Result<Pat> {
        let start_span = self.current_span();
        self.next()?; // Consume '['

        let mut elements = Vec::new();

        // Parse array pattern elements until we reach ']'
        while !self.is(TokenType::RBracket) {
            if self.is(TokenType::Comma) {
                // Empty element
                elements.push(None);
                self.next()?; // Consume ','
            } else if self.is(TokenType::DotDotDot) {
                // Rest element
                let dot3_span = self.current_span();
                self.next()?; // Consume '...'

                // Parse the rest element
                let arg = self.parse_pat()?;
                let arg_span = arg.span();

                // Create the rest pattern
                let span = Span::new(dot3_span.lo, arg_span.hi);
                elements.push(Some(Pat::Rest(RestPat {
                    span,
                    dot3_token: dot3_span,
                    arg: Box::new(arg),
                    type_ann: None,
                })));

                // Rest element must be the last element
                if !self.is(TokenType::RBracket) {
                    let span = self.current_span();
                    return Err(Error {
                        kind: ErrorKind::General {
                            message: "Rest element must be the last element in array pattern"
                                .to_string(),
                        },
                        span,
                    });
                }
            } else {
                // Regular element
                let element = self.parse_pat()?;
                elements.push(Some(element));

                // Check for comma or end of array
                if !self.is(TokenType::RBracket) {
                    self.expect(TokenType::Comma)?;
                }
            }
        }

        let end_span = self.current_span();
        self.next()?; // Consume ']'

        let span = Span::new(start_span.lo, end_span.hi);
        Ok(Pat::Array(ArrayPat {
            span,
            elems: elements,
            optional: false,
            type_ann: None,
        }))
    }

    /// Parse an object pattern
    fn parse_object_pat(&mut self) -> Result<Pat> {
        let start_span = self.current_span();
        self.next()?; // Consume '{'

        let mut properties = Vec::new();

        // Parse object pattern properties until we reach '}'
        while !self.is(TokenType::RBrace) {
            if self.is(TokenType::DotDotDot) {
                // Rest property
                let dot3_span = self.current_span();
                self.next()?; // Consume '...'

                // Parse the rest element
                let arg = self.parse_pat()?;
                let arg_span = arg.span();

                // Create the rest pattern
                let span = Span::new(dot3_span.lo, arg_span.hi);
                properties.push(ObjectPatProp::Rest(RestPat {
                    span,
                    dot3_token: dot3_span,
                    arg: Box::new(arg),
                    type_ann: None,
                }));

                // Rest property must be the last property
                if !self.is(TokenType::RBrace) {
                    let span = self.current_span();
                    return Err(Error {
                        kind: ErrorKind::General {
                            message: "Rest property must be the last property in object pattern"
                                .to_string(),
                        },
                        span,
                    });
                }
            } else {
                // Regular property
                let property = self.parse_object_pat_prop()?;
                properties.push(property);

                // Check for comma or end of object
                if !self.is(TokenType::RBrace) {
                    self.expect(TokenType::Comma)?;
                }
            }
        }

        let end_span = self.current_span();
        self.next()?; // Consume '}'

        let span = Span::new(start_span.lo, end_span.hi);
        Ok(Pat::Object(ObjectPat {
            span,
            props: properties,
            optional: false,
            type_ann: None,
        }))
    }

    /// Parse an object pattern property
    fn parse_object_pat_prop(&mut self) -> Result<ObjectPatProp> {
        let start_span = self.current_span();

        // Check for shorthand property
        if self.is(TokenType::Ident) {
            let key_span = self.current_span();
            let key = util::token_value_to_ident(self.current(), key_span);
            self.next()?; // Consume identifier

            // Check for key-value pattern
            if self.is(TokenType::Colon) {
                self.next()?; // Consume ':'
                let value = self.parse_pat()?;
                let value_span = value.span();
                let span = Span::new(start_span.lo, value_span.hi);

                // Convert Ident to IdentName for PropName::Ident
                let ident_name = IdentName {
                    span: key.span,
                    sym: key.sym,
                };

                Ok(ObjectPatProp::KeyValue(KeyValuePatProp {
                    key: PropName::Ident(ident_name),
                    value: Box::new(value),
                }))
            } else if self.is(TokenType::Eq) {
                // Shorthand with default value
                self.next()?; // Consume '='
                let right = self.parse_expr()?;
                let right_span = right.span();
                let span = Span::new(start_span.lo, right_span.hi);

                // Convert Ident to BindingIdent
                let binding_ident = BindingIdent {
                    id: key,
                    type_ann: None,
                };

                Ok(ObjectPatProp::Assign(AssignPatProp {
                    span,
                    key: binding_ident,
                    value: Some(right),
                }))
            } else {
                // Simple shorthand property
                // Convert Ident to BindingIdent
                let binding_ident = BindingIdent {
                    id: key,
                    type_ann: None,
                };

                Ok(ObjectPatProp::Assign(AssignPatProp {
                    span: key_span,
                    key: binding_ident,
                    value: None,
                }))
            }
        } else if self.is(TokenType::LBracket) {
            // Computed property name
            self.next()?; // Consume '['
            let key_expr = self.parse_expr()?;
            self.expect(TokenType::RBracket)?;
            self.expect(TokenType::Colon)?;
            let value = self.parse_pat()?;
            let value_span = value.span();
            let span = Span::new(start_span.lo, value_span.hi);

            // Create a computed property name
            let computed_key = ComputedPropName {
                span: start_span,
                expr: key_expr,
            };

            Ok(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Computed(computed_key),
                value: Box::new(value),
            }))
        } else if self.is(TokenType::Str) || self.is(TokenType::Num) {
            // String or number literal property name
            let key_span = self.current_span();
            let key = if self.is(TokenType::Str) {
                let str_lit = util::token_value_to_str(self.current(), key_span);
                self.next()?; // Consume string
                PropName::Str(str_lit)
            } else {
                let num_lit = util::token_value_to_number(self.current(), key_span);
                self.next()?; // Consume number
                PropName::Num(num_lit)
            };

            self.expect(TokenType::Colon)?;
            let value = self.parse_pat()?;
            let value_span = value.span();
            let span = Span::new(start_span.lo, value_span.hi);

            Ok(ObjectPatProp::KeyValue(KeyValuePatProp {
                key,
                value: Box::new(value),
            }))
        } else {
            // Unexpected token
            let span = self.current_span();
            Err(Error {
                kind: ErrorKind::UnexpectedToken {
                    expected: Some("object pattern property"),
                    got: self.current_token_type().as_str().to_string(),
                },
                span,
            })
        }
    }
}
