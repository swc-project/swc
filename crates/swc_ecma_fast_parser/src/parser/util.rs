//! Utility functions for the parser

use swc_atoms::Atom;
use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::{BindingIdent, Ident, Number, Str};

use crate::{
    error::{Error, ErrorKind},
    token::{Token, TokenType, TokenValue},
};

/// Convert a token value to an identifier
pub fn token_value_to_ident(token: &Token, span: Span) -> Ident {
    if let TokenValue::Str { value, .. } = &token.value {
        Ident {
            span,
            sym: value.clone(),
            optional: false,
            ctxt: SyntaxContext::empty(),
        }
    } else {
        // Default to empty identifier if token is not a string
        Ident {
            span,
            sym: Atom::from(""),
            optional: false,
            ctxt: SyntaxContext::empty(),
        }
    }
}

/// Convert a token value to a binding identifier
pub fn token_value_to_binding_ident(token: &Token, span: Span) -> BindingIdent {
    BindingIdent {
        id: token_value_to_ident(token, span),
        type_ann: None,
    }
}

/// Convert a token value to a string literal
pub fn token_value_to_str(token: &Token, span: Span) -> Str {
    if let TokenValue::Str { value, raw } = &token.value {
        Str {
            span,
            value: value.clone(),
            raw: Some(raw.clone()),
        }
    } else {
        // Default to empty string if token is not a string
        Str {
            span,
            value: Atom::from(""),
            raw: None,
        }
    }
}

/// Convert a token value to a number literal
pub fn token_value_to_number(token: &Token, span: Span) -> Number {
    if let TokenValue::Num { value, raw } = &token.value {
        Number {
            span,
            value: *value,
            raw: Some(raw.clone()),
        }
    } else {
        // Default to 0 if token is not a number
        Number {
            span,
            value: 0.0,
            raw: None,
        }
    }
}

/// Check if a token type is a binary operator
pub fn is_binary_operator(token_type: TokenType) -> bool {
    matches!(
        token_type,
        TokenType::EqEq
            | TokenType::NotEq
            | TokenType::EqEqEq
            | TokenType::NotEqEq
            | TokenType::Lt
            | TokenType::LtEq
            | TokenType::Gt
            | TokenType::GtEq
            | TokenType::LShift
            | TokenType::RShift
            | TokenType::ZeroFillRShift
            | TokenType::Plus
            | TokenType::Minus
            | TokenType::Asterisk
            | TokenType::Slash
            | TokenType::Percent
            | TokenType::Pipe
            | TokenType::Ampersand
            | TokenType::Caret
            | TokenType::Exp
            | TokenType::LogicalOr
            | TokenType::LogicalAnd
            | TokenType::NullishCoalescing
            | TokenType::In
            | TokenType::InstanceOf
    )
}

/// Create an error for invalid await usage
pub fn invalid_await_error(span: Span) -> Error {
    Error {
        kind: ErrorKind::General {
            message: "await is only valid in async functions".to_string(),
        },
        span,
    }
}

/// Create an error for invalid yield usage
pub fn invalid_yield_error(span: Span) -> Error {
    Error {
        kind: ErrorKind::General {
            message: "yield is only valid in generator functions".to_string(),
        },
        span,
    }
}
