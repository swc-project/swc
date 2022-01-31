#![deny(clippy::all)]
#![allow(clippy::large_enum_variant)]

//! AST definitions for CSS.
pub use self::{at_rule::*, base::*, selector::*, style_rule::*, token::*, value::*};

mod at_rule;
mod base;
mod selector;
mod style_rule;
mod token;
mod value;
