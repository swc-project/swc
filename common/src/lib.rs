#![feature(conservative_impl_trait)]
#![feature(const_fn)]
#![feature(specialization)]
#![feature(generator_trait)]

pub use self::ast_node::AstNode;
pub use self::eq_ignore_span::EqIgnoreSpan;
pub use self::gen_iter::gen_iter;
pub use self::span::{BytePos, Span};

mod ast_node;
mod eq_ignore_span;
mod gen_iter;
mod span;
