//! Transpiles modern RegExp features to ES5-compatible patterns.
//!
//! This crate provides transformations for:
//! - Unicode property escapes (`\p{Letter}`, `\P{Script=Greek}`)
//! - Named capture groups (`(?<name>...)`, `\k<name>`)

#![deny(clippy::all)]

mod named_capture;
mod unicode_property;

pub use named_capture::{
    transform_named_capture_groups, transform_named_capture_groups_with_info, NamedCaptureGroups,
};
pub use unicode_property::transform_unicode_property_escapes;
