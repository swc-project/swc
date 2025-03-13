//! Utility functions for the parser

use swc_atoms::Atom;
use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::{BindingIdent, Expr, Ident, Number, Pat, Str};

use crate::{
    error::{Error, ErrorKind},
    token::{Token, TokenType, TokenValue},
};

/// Trait for getting spans from AST nodes
pub trait GetSpan {
    fn span(&self) -> Span;
}

// Implement GetSpan for Box<Expr>
impl GetSpan for Box<Expr> {
    fn span(&self) -> Span {
        match &**self {
            Expr::Array(e) => e.span,
            Expr::Arrow(e) => e.span,
            Expr::Assign(e) => e.span,
            Expr::Await(e) => e.span,
            Expr::Bin(e) => e.span,
            Expr::Call(e) => e.span,
            Expr::Class(e) => {
                if let Some(ident) = &e.ident {
                    ident.span
                } else {
                    e.class.span
                }
            }
            Expr::Cond(e) => e.span,
            Expr::Fn(e) => {
                if let Some(ident) = &e.ident {
                    ident.span
                } else {
                    e.function.span
                }
            }
            Expr::Ident(e) => e.span,
            Expr::Lit(e) => match e {
                swc_ecma_ast::Lit::Str(s) => s.span,
                swc_ecma_ast::Lit::Bool(b) => b.span,
                swc_ecma_ast::Lit::Null(n) => n.span,
                swc_ecma_ast::Lit::Num(n) => n.span,
                swc_ecma_ast::Lit::BigInt(b) => b.span,
                swc_ecma_ast::Lit::Regex(r) => r.span,
                swc_ecma_ast::Lit::JSXText(j) => j.span,
            },
            Expr::Member(e) => e.span,
            Expr::MetaProp(e) => e.span,
            Expr::New(e) => e.span,
            Expr::Object(e) => e.span,
            Expr::OptChain(e) => e.span,
            Expr::Paren(e) => e.span,
            Expr::PrivateName(e) => e.span,
            Expr::Seq(e) => e.span,
            Expr::SuperProp(e) => e.span,
            Expr::TaggedTpl(e) => e.span,
            Expr::This(e) => e.span,
            Expr::Tpl(e) => e.span,
            Expr::Unary(e) => e.span,
            Expr::Update(e) => e.span,
            Expr::Yield(e) => e.span,
            Expr::JSXMember(e) => e.span,
            Expr::JSXNamespacedName(e) => e.span,
            Expr::JSXEmpty(e) => e.span,
            Expr::JSXElement(e) => e.span,
            Expr::JSXFragment(e) => e.span,
            Expr::TsTypeAssertion(e) => e.span,
            Expr::TsConstAssertion(e) => e.span,
            Expr::TsNonNull(e) => e.span,
            Expr::TsAs(e) => e.span,
            Expr::TsInstantiation(e) => e.span,
            Expr::TsSatisfies(e) => e.span,
            Expr::Invalid(e) => e.span,
        }
    }
}

// Implement GetSpan for Pat
impl GetSpan for Pat {
    fn span(&self) -> Span {
        match self {
            Pat::Ident(i) => i.id.span,
            Pat::Array(a) => a.span,
            Pat::Rest(r) => r.span,
            Pat::Object(o) => o.span,
            Pat::Assign(a) => a.span,
            Pat::Invalid(i) => i.span,
            Pat::Expr(e) => e.span(),
        }
    }
}

// Implement GetSpan for BindingIdent
impl GetSpan for BindingIdent {
    fn span(&self) -> Span {
        self.id.span
    }
}

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
