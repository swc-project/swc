//! Expression parser implementation
//!
//! This module contains methods for parsing JavaScript expressions.

use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    ArrayLit, AwaitExpr, BinExpr, BinaryOp, Bool, Expr, ExprOrSpread, Lit, Null, ObjectLit,
    ParenExpr, PropOrSpread, SpreadElement, ThisExpr, UnaryExpr, UnaryOp, UpdateExpr, UpdateOp,
    YieldExpr,
};

use crate::{
    error::{Error, ErrorKind, Result},
    parser::{util, Parser},
    token::{TokenType, TokenValue},
};

impl Parser<'_> {
    /// Parse an expression
    pub fn parse_expr(&mut self) -> Result<Box<Expr>> {
        self.parse_expr_with_precedence(0)
    }

    /// Parse an expression with the given precedence
    fn parse_expr_with_precedence(&mut self, precedence: u8) -> Result<Box<Expr>> {
        // Parse the left-hand side of the expression
        let mut left = self.parse_primary_expr()?;

        // Continue parsing binary operators as long as they have higher precedence
        while let Some(op_precedence) = self.get_binary_op_precedence() {
            if op_precedence < precedence {
                break;
            }

            // Parse the operator and right-hand side
            left = self.parse_binary_expr(left, op_precedence)?;
        }

        Ok(left)
    }

    /// Get the precedence of the current token if it's a binary operator
    fn get_binary_op_precedence(&self) -> Option<u8> {
        let token_type = self.current_token_type();

        // Check if the current token is a binary operator
        if !util::is_binary_operator(token_type) {
            return None;
        }

        // Return the precedence of the operator
        Some(match token_type {
            // Precedence 1: Comma
            // (Handled separately in parse_sequence_expr)

            // Precedence 2: Assignment operators
            TokenType::Eq
            | TokenType::PlusEq
            | TokenType::MinusEq
            | TokenType::MulEq
            | TokenType::DivEq
            | TokenType::ModEq
            | TokenType::ExpEq
            | TokenType::BitOrEq
            | TokenType::BitXorEq
            | TokenType::BitAndEq
            | TokenType::LogicalOrEq
            | TokenType::LogicalAndEq
            | TokenType::NullishEq => 2,

            // Precedence 3: Conditional (ternary) operator
            // (Handled separately in parse_conditional_expr)

            // Precedence 4: Logical OR
            TokenType::LogicalOr => 4,

            // Precedence 5: Logical AND
            TokenType::LogicalAnd => 5,

            // Precedence 6: Nullish coalescing
            TokenType::NullishCoalescing => 6,

            // Precedence 7: Bitwise OR
            TokenType::Pipe => 7,

            // Precedence 8: Bitwise XOR
            TokenType::Caret => 8,

            // Precedence 9: Bitwise AND
            TokenType::Ampersand => 9,

            // Precedence 10: Equality
            TokenType::EqEq | TokenType::NotEq | TokenType::EqEqEq | TokenType::NotEqEq => 10,

            // Precedence 11: Relational
            TokenType::Lt
            | TokenType::Gt
            | TokenType::LtEq
            | TokenType::GtEq
            | TokenType::In
            | TokenType::InstanceOf => 11,

            // Precedence 12: Shift
            TokenType::LShift | TokenType::RShift | TokenType::ZeroFillRShift => 12,

            // Precedence 13: Additive
            TokenType::Plus | TokenType::Minus => 13,

            // Precedence 14: Multiplicative
            TokenType::Asterisk | TokenType::Slash | TokenType::Percent => 14,

            // Precedence 15: Exponentiation
            TokenType::Exp => 15,

            // This should never happen if is_binary_operator is correct
            _ => 0,
        })
    }

    /// Parse a binary expression
    fn parse_binary_expr(&mut self, left: Box<Expr>, precedence: u8) -> Result<Box<Expr>> {
        let token_type = self.current_token_type();
        let op_span = self.current_span();

        // Convert token type to binary operator
        let op = match token_type {
            TokenType::EqEq => BinaryOp::EqEq,
            TokenType::NotEq => BinaryOp::NotEq,
            TokenType::EqEqEq => BinaryOp::EqEqEq,
            TokenType::NotEqEq => BinaryOp::NotEqEq,
            TokenType::Lt => BinaryOp::Lt,
            TokenType::LtEq => BinaryOp::LtEq,
            TokenType::Gt => BinaryOp::Gt,
            TokenType::GtEq => BinaryOp::GtEq,
            TokenType::LShift => BinaryOp::LShift,
            TokenType::RShift => BinaryOp::RShift,
            TokenType::ZeroFillRShift => BinaryOp::ZeroFillRShift,
            TokenType::Plus => BinaryOp::Add,
            TokenType::Minus => BinaryOp::Sub,
            TokenType::Asterisk => BinaryOp::Mul,
            TokenType::Slash => BinaryOp::Div,
            TokenType::Percent => BinaryOp::Mod,
            TokenType::Pipe => BinaryOp::BitOr,
            TokenType::Ampersand => BinaryOp::BitAnd,
            TokenType::Caret => BinaryOp::BitXor,
            TokenType::Exp => BinaryOp::Exp,
            TokenType::LogicalOr => BinaryOp::LogicalOr,
            TokenType::LogicalAnd => BinaryOp::LogicalAnd,
            TokenType::NullishCoalescing => BinaryOp::NullishCoalescing,
            TokenType::In => BinaryOp::In,
            TokenType::InstanceOf => BinaryOp::InstanceOf,
            _ => {
                // This should never happen if is_binary_operator is correct
                return Err(Error {
                    kind: ErrorKind::General {
                        message: format!("Unexpected token: {}", token_type),
                    },
                    span: op_span,
                });
            }
        };

        // Consume the operator token
        self.lexer.next_token()?;

        // Parse the right-hand side with higher precedence to ensure
        // right-associativity for exponentiation and correct associativity for
        // other operators
        let right_precedence = if token_type == TokenType::Exp {
            precedence // Right-associative
        } else {
            precedence + 1 // Left-associative
        };

        let right = self.parse_expr_with_precedence(right_precedence)?;

        // Create the binary expression
        let left_span = left.span();
        let right_span = right.span();
        let span = Span::new(left_span.lo, right_span.hi);
        Ok(Box::new(Expr::Bin(BinExpr {
            span,
            op,
            left,
            right,
        })))
    }

    /// Parse a primary expression
    fn parse_primary_expr(&mut self) -> Result<Box<Expr>> {
        let token_type = self.current_token_type();

        // Check if the token can start an expression
        if token_type.starts_expr() {
            match token_type {
                TokenType::This => self.parse_this_expr(),
                TokenType::Ident => self.parse_identifier_expr(),
                TokenType::Str => self.parse_string_literal(),
                TokenType::Num => self.parse_number_literal(),
                TokenType::BigInt => self.parse_bigint_literal(),
                TokenType::True | TokenType::False => self.parse_boolean_literal(),
                TokenType::Null => self.parse_null_literal(),
                TokenType::LParen => self.parse_paren_expr(),
                TokenType::LBracket => self.parse_array_expr(),
                TokenType::LBrace => self.parse_object_expr(),
                TokenType::Function => self.parse_function_expr(),
                TokenType::Class => self.parse_class_expr(),
                TokenType::New => self.parse_new_expr(),
                TokenType::Super => self.parse_super_expr(),
                TokenType::BackQuote => self.parse_template_literal(),
                TokenType::Bang
                | TokenType::Tilde
                | TokenType::Plus
                | TokenType::Minus
                | TokenType::TypeOf
                | TokenType::Void
                | TokenType::Delete => self.parse_unary_expr(),
                TokenType::PlusPlus | TokenType::MinusMinus => self.parse_update_expr(),
                TokenType::Await => {
                    if !self.in_async {
                        return Err(util::invalid_await_error(self.current_span()));
                    }
                    self.parse_await_expr()
                }
                TokenType::Yield => {
                    if !self.in_generator {
                        return Err(util::invalid_yield_error(self.current_span()));
                    }
                    self.parse_yield_expr()
                }
                _ => {
                    // This should never happen if starts_expr is correct
                    let span = self.current_span();
                    Err(Error {
                        kind: ErrorKind::General {
                            message: format!("Unexpected token: {}", token_type),
                        },
                        span,
                    })
                }
            }
        } else {
            // Unexpected token
            let span = self.current_span();
            Err(Error {
                kind: ErrorKind::UnexpectedToken {
                    expected: Some("expression"),
                    got: token_type.as_str().to_string(),
                },
                span,
            })
        }
    }

    /// Parse a this expression
    fn parse_this_expr(&mut self) -> Result<Box<Expr>> {
        let span = self.current_span();
        self.lexer.next_token()?; // Consume 'this'

        Ok(Box::new(Expr::This(ThisExpr { span })))
    }

    /// Parse an identifier expression
    fn parse_identifier_expr(&mut self) -> Result<Box<Expr>> {
        let span = self.current_span();
        let ident = util::token_value_to_ident(self.current(), span);
        self.lexer.next_token()?; // Consume identifier

        Ok(Box::new(Expr::Ident(ident)))
    }

    /// Parse a string literal
    fn parse_string_literal(&mut self) -> Result<Box<Expr>> {
        let span = self.current_span();
        let str_lit = util::token_value_to_str(self.current(), span);
        self.lexer.next_token()?; // Consume string

        Ok(Box::new(Expr::Lit(Lit::Str(str_lit))))
    }

    /// Parse a number literal
    fn parse_number_literal(&mut self) -> Result<Box<Expr>> {
        let span = self.current_span();
        let num_lit = util::token_value_to_number(self.current(), span);
        self.lexer.next_token()?; // Consume number

        Ok(Box::new(Expr::Lit(Lit::Num(num_lit))))
    }

    /// Parse a BigInt literal
    fn parse_bigint_literal(&mut self) -> Result<Box<Expr>> {
        let span = self.current_span();

        if let TokenValue::BigInt { value, raw } = &self.current().value {
            let bigint = swc_ecma_ast::BigInt {
                span,
                value: value.clone(),
                raw: Some(raw.clone()),
            };
            self.lexer.next_token()?; // Consume BigInt

            Ok(Box::new(Expr::Lit(Lit::BigInt(bigint))))
        } else {
            // This should never happen if the lexer is correct
            Err(Error {
                kind: ErrorKind::InvalidBigInt,
                span,
            })
        }
    }

    /// Parse a boolean literal
    fn parse_boolean_literal(&mut self) -> Result<Box<Expr>> {
        let span = self.current_span();
        let value = self.is(TokenType::True);
        self.lexer.next_token()?; // Consume boolean

        Ok(Box::new(Expr::Lit(Lit::Bool(Bool { span, value }))))
    }

    /// Parse a null literal
    fn parse_null_literal(&mut self) -> Result<Box<Expr>> {
        let span = self.current_span();
        self.lexer.next_token()?; // Consume 'null'

        Ok(Box::new(Expr::Lit(Lit::Null(Null { span }))))
    }

    /// Parse a parenthesized expression
    fn parse_paren_expr(&mut self) -> Result<Box<Expr>> {
        let start_span = self.current_span();
        self.lexer.next_token()?; // Consume '('

        let expr = self.parse_expr()?;

        // Check for closing parenthesis
        let end_span = self.current_span();
        self.expect(TokenType::RParen)?;

        let span = Span::new(start_span.lo, end_span.hi);
        Ok(Box::new(Expr::Paren(ParenExpr { span, expr })))
    }

    /// Parse an array expression
    fn parse_array_expr(&mut self) -> Result<Box<Expr>> {
        let start_span = self.current_span();
        self.lexer.next_token()?; // Consume '['

        let mut elements = Vec::new();

        // Parse array elements until we reach ']'
        while !self.is(TokenType::RBracket) {
            if self.is(TokenType::Comma) {
                // Empty element (hole)
                elements.push(None);
                self.lexer.next_token()?; // Consume ','
            } else {
                // Parse element
                let element = if self.is(TokenType::DotDotDot) {
                    // Spread element
                    let dot3_span = self.current_span();
                    self.lexer.next_token()?; // Consume '...'
                    let expr = self.parse_expr()?;
                    Some(ExprOrSpread {
                        spread: Some(dot3_span),
                        expr,
                    })
                } else {
                    // Regular element
                    let expr = self.parse_expr()?;
                    Some(ExprOrSpread { spread: None, expr })
                };

                elements.push(element);

                // Check for comma or end of array
                if !self.is(TokenType::RBracket) {
                    self.expect(TokenType::Comma)?;
                }
            }
        }

        let end_span = self.current_span();
        self.lexer.next_token()?; // Consume ']'

        let span = Span::new(start_span.lo, end_span.hi);
        Ok(Box::new(Expr::Array(ArrayLit {
            span,
            elems: elements,
        })))
    }

    /// Parse an object expression
    fn parse_object_expr(&mut self) -> Result<Box<Expr>> {
        let start_span = self.current_span();
        self.lexer.next_token()?; // Consume '{'

        let mut properties = Vec::new();

        // Parse object properties until we reach '}'
        while !self.is(TokenType::RBrace) {
            // Parse property
            let property = if self.is(TokenType::DotDotDot) {
                // Spread property
                let dot3_span = self.current_span();
                self.lexer.next_token()?; // Consume '...'
                let expr = self.parse_expr()?;
                PropOrSpread::Spread(SpreadElement {
                    dot3_token: dot3_span,
                    expr,
                })
            } else {
                // Regular property
                let prop = self.parse_object_property()?;
                PropOrSpread::Prop(prop)
            };

            properties.push(property);

            // Check for comma or end of object
            if !self.is(TokenType::RBrace) {
                self.expect(TokenType::Comma)?;
            }
        }

        let end_span = self.current_span();
        self.lexer.next_token()?; // Consume '}'

        let span = Span::new(start_span.lo, end_span.hi);
        Ok(Box::new(Expr::Object(ObjectLit {
            span,
            props: properties,
        })))
    }

    /// Parse an object property
    fn parse_object_property(&mut self) -> Result<Box<swc_ecma_ast::Prop>> {
        // TODO: Implement object property parsing
        // This is a placeholder implementation
        let span = self.current_span();
        Err(Error {
            kind: ErrorKind::General {
                message: "Object property parsing not implemented yet".to_string(),
            },
            span,
        })
    }

    /// Parse a function expression
    fn parse_function_expr(&mut self) -> Result<Box<Expr>> {
        // TODO: Implement function expression parsing
        // This is a placeholder implementation
        let span = self.current_span();
        Err(Error {
            kind: ErrorKind::General {
                message: "Function expression parsing not implemented yet".to_string(),
            },
            span,
        })
    }

    /// Parse a class expression
    fn parse_class_expr(&mut self) -> Result<Box<Expr>> {
        // TODO: Implement class expression parsing
        // This is a placeholder implementation
        let span = self.current_span();
        Err(Error {
            kind: ErrorKind::General {
                message: "Class expression parsing not implemented yet".to_string(),
            },
            span,
        })
    }

    /// Parse a new expression
    fn parse_new_expr(&mut self) -> Result<Box<Expr>> {
        // TODO: Implement new expression parsing
        // This is a placeholder implementation
        let span = self.current_span();
        Err(Error {
            kind: ErrorKind::General {
                message: "New expression parsing not implemented yet".to_string(),
            },
            span,
        })
    }

    /// Parse a super expression
    fn parse_super_expr(&mut self) -> Result<Box<Expr>> {
        // TODO: Implement super expression parsing
        // This is a placeholder implementation
        let span = self.current_span();
        Err(Error {
            kind: ErrorKind::General {
                message: "Super expression parsing not implemented yet".to_string(),
            },
            span,
        })
    }

    /// Parse a template literal
    fn parse_template_literal(&mut self) -> Result<Box<Expr>> {
        // TODO: Implement template literal parsing
        // This is a placeholder implementation
        let span = self.current_span();
        Err(Error {
            kind: ErrorKind::General {
                message: "Template literal parsing not implemented yet".to_string(),
            },
            span,
        })
    }

    /// Parse a unary expression
    fn parse_unary_expr(&mut self) -> Result<Box<Expr>> {
        let op_span = self.current_span();
        let token_type = self.current_token_type();

        // Convert token type to unary operator
        let op = match token_type {
            TokenType::Bang => UnaryOp::Bang,
            TokenType::Tilde => UnaryOp::Tilde,
            TokenType::Plus => UnaryOp::Plus,
            TokenType::Minus => UnaryOp::Minus,
            TokenType::TypeOf => UnaryOp::TypeOf,
            TokenType::Void => UnaryOp::Void,
            TokenType::Delete => UnaryOp::Delete,
            _ => {
                // This should never happen if is_unary_operator is correct
                return Err(Error {
                    kind: ErrorKind::General {
                        message: format!("Unexpected token: {}", token_type),
                    },
                    span: op_span,
                });
            }
        };

        self.lexer.next_token()?; // Consume operator

        // Parse the argument
        let arg = self.parse_expr_with_precedence(15)?; // Unary has precedence 15

        let arg_span = arg.span();
        let span = Span::new(op_span.lo, arg_span.hi);
        Ok(Box::new(Expr::Unary(UnaryExpr { span, op, arg })))
    }

    /// Parse an update expression
    fn parse_update_expr(&mut self) -> Result<Box<Expr>> {
        let op_span = self.current_span();
        let token_type = self.current_token_type();

        // Convert token type to update operator
        let op = match token_type {
            TokenType::PlusPlus => UpdateOp::PlusPlus,
            TokenType::MinusMinus => UpdateOp::MinusMinus,
            _ => {
                // This should never happen if is_update_operator is correct
                return Err(Error {
                    kind: ErrorKind::General {
                        message: format!("Unexpected token: {}", token_type),
                    },
                    span: op_span,
                });
            }
        };

        self.lexer.next_token()?; // Consume operator

        // Parse the argument
        let arg = self.parse_expr_with_precedence(15)?; // Update has precedence 15

        let arg_span = arg.span();
        let span = Span::new(op_span.lo, arg_span.hi);
        Ok(Box::new(Expr::Update(UpdateExpr {
            span,
            op,
            prefix: true,
            arg,
        })))
    }

    /// Parse an await expression
    fn parse_await_expr(&mut self) -> Result<Box<Expr>> {
        let start_span = self.current_span();
        self.lexer.next_token()?; // Consume 'await'

        // Parse the argument
        let arg = self.parse_expr_with_precedence(15)?; // Await has precedence 15

        let arg_span = arg.span();
        let span = Span::new(start_span.lo, arg_span.hi);
        Ok(Box::new(Expr::Await(AwaitExpr { span, arg })))
    }

    /// Parse a yield expression
    fn parse_yield_expr(&mut self) -> Result<Box<Expr>> {
        let start_span = self.current_span();
        self.lexer.next_token()?; // Consume 'yield'

        // Check for yield*
        let delegate = self.eat(TokenType::Asterisk)?;

        // Parse the argument if present
        let arg = if self.current_token_type().before_expr() && !self.current().had_line_break {
            Some(self.parse_expr_with_precedence(2)?) // Yield has precedence 2
        } else {
            None
        };

        let end_span = match &arg {
            Some(expr) => expr.span().hi,
            None => start_span.hi,
        };

        let span = Span::new(start_span.lo, end_span);
        Ok(Box::new(Expr::Yield(YieldExpr {
            span,
            arg,
            delegate,
        })))
    }
}
