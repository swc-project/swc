//! OXC-derived lexer primitives for the next parser.

mod byte_handlers;
pub(crate) mod config;
pub(crate) mod core;
mod jsx;
mod kind;
mod regex;
pub(crate) mod source;
mod template;
mod token;
mod typescript;

pub use kind::TokenKind;
pub use token::PackedToken;
