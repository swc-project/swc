//! Transpiles modern RegExp features to ES5-compatible patterns.
//!
//! This crate provides transformations for:
//! - Unicode property escapes (`\p{Letter}`, `\P{Script=Greek}`)

#![deny(clippy::all)]

mod unicode_property;

pub use unicode_property::transform_unicode_property_escapes;
