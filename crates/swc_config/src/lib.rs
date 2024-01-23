//! Configuration for swc

#[macro_use]
mod macros;
pub mod config_types;
pub mod merge;

pub use swc_cached::{regex::CachedRegex, Error};
