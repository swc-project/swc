#![feature(conservative_impl_trait)]
#![feature(const_fn)]
#![feature(try_trait)]
#![feature(optin_builtin_traits)]
#![feature(never_type)]
#![feature(specialization)]
#![feature(generator_trait)]
extern crate fnv;
#[macro_use]
extern crate serde;

pub use self::ast_node::AstNode;
pub use self::eq_ignore_span::EqIgnoreSpan;
pub use self::gen_iter::gen_iter;
pub use self::span::{BytePos, Span};

pub mod compat;
mod ast_node;
mod eq_ignore_span;
mod gen_iter;
mod span;
