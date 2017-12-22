#![feature(specialization)]

pub use self::ast_node::AstNode;
pub use self::eq_ignore_span::EqIgnoreSpan;
pub use self::span::{BytePos, Span};

mod ast_node;
mod eq_ignore_span;
mod span;
