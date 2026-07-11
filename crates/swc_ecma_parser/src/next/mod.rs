//! OXC-style parser implementation.
//!
//! The public API is kept separate from the lexer and grammar modules so the
//! reference parser can remain isolated while the new engine is brought up.

mod api;

pub use api::*;
