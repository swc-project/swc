#![deny(clippy::all)]
#![allow(clippy::large_enum_variant)]

//! AST definitions for HTML.
pub use self::{base::*, token::*};

mod base;
mod token;
