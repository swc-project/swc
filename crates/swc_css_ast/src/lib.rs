#![deny(clippy::all)]
#![allow(clippy::large_enum_variant)]

//! AST definitions for CSS.
pub use self::{at_rule::*, base::*, selector::*, token::*, value::*};

mod at_rule;
mod base;
mod selector;
mod token;
mod value;
