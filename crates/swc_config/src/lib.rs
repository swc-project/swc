//! Configuration for swc

pub mod config_types;
pub mod merge;
mod module;
#[cfg(feature = "sourcemap")]
mod source_map;

pub use swc_cached::{regex::CachedRegex, Error};

pub use crate::module::IsModule;
#[cfg(feature = "sourcemap")]
pub use crate::source_map::*;
