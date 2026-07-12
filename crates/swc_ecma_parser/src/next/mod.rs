//! OXC-style parser implementation.
//!
//! The public API is kept separate from the lexer and grammar modules so the
//! reference parser can remain isolated while the new engine is brought up.

mod api;
pub(crate) mod experimental;
#[allow(dead_code)]
pub(crate) mod js;
// The lexer is enabled production by production while the reference parser
// remains the public implementation. Its pieces are intentionally allowed to
// be unused until the cursor is connected to the first JavaScript grammar.
#[allow(dead_code)]
pub(crate) mod lexer;
#[allow(dead_code)]
pub(crate) mod parser;
#[cfg(feature = "typescript")]
pub(crate) mod typescript;

pub use api::*;
