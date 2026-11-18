//! Transpiles modern RegExp features to ES5-compatible patterns.
//!
//! This crate provides transformations for:
//! - Unicode property escapes (`\p{Letter}`, `\P{Script=Greek}`)
//! - The `v` flag (`unicodeSets`), lowered to the `u` flag
//! - Pattern modifiers (`(?i:...)`, `(?-s:...)`)

#![deny(clippy::all)]

mod case_fold;
mod char_set;
mod class_set;
mod emit;
mod error;
mod modifiers;
mod unicode_property;
mod unicode_sets;

pub use error::LowerError;
pub use modifiers::transform_modifiers;
pub use unicode_property::transform_unicode_property_escapes;
pub use unicode_sets::transform_unicode_sets;
