#![deny(clippy::all)]
#![allow(unexpected_cfgs)]
#![allow(clippy::large_enum_variant)]

//! AST definitions for XML.
pub use self::{base::*, token::*};

mod base;
mod token;
