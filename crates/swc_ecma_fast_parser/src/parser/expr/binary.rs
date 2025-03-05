//! Binary expression parser implementation
//!
//! This module handles parsing of binary expressions like a + b, a * b, etc.
//! It uses the Pratt parsing algorithm for handling operator precedence.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::{super::Parser, ExprParser};
use crate::{
    error::{Error, ErrorKind, Result},
    token::TokenType,
};

/// Binary expression parser implementation
pub(crate) trait BinaryExprParser<'a> {
    /// Parse a binary expression with a given precedence
    fn parse_binary_expression(&mut self, precedence: u8) -> Result<ast::Expr>;

    /// Get the precedence of a binary operator
    fn get_binary_precedence(&self, token_type: TokenType) -> u8;
}

impl<'a> BinaryExprParser<'a> for Parser<'a> {
    /// Parse a binary expression with a given minimum precedence
    fn parse_binary_expression(&mut self, min_precedence: u8) -> Result<ast::Expr> {
        // Parse the left-hand side expression
        let mut left = self.parse_unary_expression()?;

        // Process operators with precedence >= min_precedence
        loop {
            let current_token = self.cur_token.token_type;
            let precedence = self.get_binary_precedence(current_token);

            // If the current token is not a binary operator or its precedence is lower
            // than the minimum precedence, break out of the loop
            if precedence == 0 || precedence < min_precedence {
                break;
            }

            // Save the operator and its span
            let op = self.token_to_binary_op(current_token);
            let op_span = self.cur_token.span;

            // Skip the operator token
            self.next_token();

            // Parse the right-hand side expression with a higher precedence
            // to ensure correct associativity
            let right = self.parse_binary_expression(precedence + 1)?;

            // Create the binary expression
            left = ast::Expr::Bin(ast::BinExpr {
                span: left.span().merge_with(right.span()),
                op,
                left: Box::new(left),
                right: Box::new(right),
            });
        }

        Ok(left)
    }

    /// Get the precedence of a binary operator
    fn get_binary_precedence(&self, token_type: TokenType) -> u8 {
        match token_type {
            // Multiplicative operators (*, /, %)
            TokenType::Mul | TokenType::Div | TokenType::Mod => 13,

            // Additive operators (+, -)
            TokenType::Add | TokenType::Sub => 12,

            // Bitwise shift operators (<<, >>, >>>)
            TokenType::LShift | TokenType::RShift | TokenType::ZeroFillRShift => 11,

            // Relational operators (<, >, <=, >=, instanceof, in)
            TokenType::Lt
            | TokenType::Gt
            | TokenType::LtEq
            | TokenType::GtEq
            | TokenType::InstanceOf
            | TokenType::In => 10,

            // Equality operators (==, !=, ===, !==)
            TokenType::EqEq | TokenType::NotEq | TokenType::EqEqEq | TokenType::NotEqEq => 9,

            // Bitwise AND operator (&)
            TokenType::BitAnd => 8,

            // Bitwise XOR operator (^)
            TokenType::BitXor => 7,

            // Bitwise OR operator (|)
            TokenType::BitOr => 6,

            // Logical AND operator (&&)
            TokenType::And => 5,

            // Logical OR operator (||)
            TokenType::Or => 4,

            // Nullish coalescing operator (??)
            TokenType::NullishCoalescing => 3,

            // Not a binary operator
            _ => 0,
        }
    }
}

impl<'a> Parser<'a> {
    /// Convert a token type to a binary operator
    fn token_to_binary_op(&self, token_type: TokenType) -> ast::BinaryOp {
        match token_type {
            TokenType::EqEq => ast::BinaryOp::EqEq,
            TokenType::NotEq => ast::BinaryOp::NotEq,
            TokenType::EqEqEq => ast::BinaryOp::EqEqEq,
            TokenType::NotEqEq => ast::BinaryOp::NotEqEq,
            TokenType::Lt => ast::BinaryOp::Lt,
            TokenType::LtEq => ast::BinaryOp::LtEq,
            TokenType::Gt => ast::BinaryOp::Gt,
            TokenType::GtEq => ast::BinaryOp::GtEq,
            TokenType::LShift => ast::BinaryOp::LShift,
            TokenType::RShift => ast::BinaryOp::RShift,
            TokenType::ZeroFillRShift => ast::BinaryOp::ZeroFillRShift,
            TokenType::Add => ast::BinaryOp::Add,
            TokenType::Sub => ast::BinaryOp::Sub,
            TokenType::Mul => ast::BinaryOp::Mul,
            TokenType::Div => ast::BinaryOp::Div,
            TokenType::Mod => ast::BinaryOp::Mod,
            TokenType::BitOr => ast::BinaryOp::BitOr,
            TokenType::BitXor => ast::BinaryOp::BitXor,
            TokenType::BitAnd => ast::BinaryOp::BitAnd,
            TokenType::In => ast::BinaryOp::In,
            TokenType::InstanceOf => ast::BinaryOp::InstanceOf,
            TokenType::Exp => ast::BinaryOp::Exp,
            TokenType::And => ast::BinaryOp::LogicalAnd,
            TokenType::Or => ast::BinaryOp::LogicalOr,
            TokenType::NullishCoalescing => ast::BinaryOp::NullishCoalescing,
            _ => unreachable!("Not a binary operator: {:?}", token_type),
        }
    }
}
