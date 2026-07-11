//! OXC-derived lexer primitives for the next parser.

mod byte_handlers;
pub(crate) mod config;
pub(crate) mod core;
pub(crate) mod source;
mod token;

pub use token::PackedToken;
