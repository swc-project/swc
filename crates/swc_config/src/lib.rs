//! Configuration for swc

#[macro_use]
mod macros;
pub mod config_types;
pub mod merge;
#[cfg(feature = "sourcemap")]
mod source_map;

pub use swc_cached::{regex::CachedRegex, Error};

#[cfg(feature = "sourcemap")]
pub use crate::source_map::*;
