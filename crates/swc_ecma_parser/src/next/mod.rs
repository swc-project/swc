//! OXC-style parser implementation.
//!
//! The public API is kept separate from the lexer and grammar modules so
//! token collection can be selected statically before entering the hot loop.

mod api;
pub(crate) mod js;
pub(crate) mod lexer;
pub(crate) mod parser;
#[cfg(feature = "typescript")]
pub(crate) mod typescript;

pub use api::*;
