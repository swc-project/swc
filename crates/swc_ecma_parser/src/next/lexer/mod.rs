//! OXC-derived lexer primitives for the next parser.

mod byte_handlers;
pub(crate) mod config;
pub(crate) mod core;
mod jsx;
mod regex;
pub(crate) mod source;
mod template;
mod token;
mod typescript;

pub use token::PackedToken;
