//! Configuration for swc

#[macro_use]
mod macros;
pub mod config_types;
pub mod merge;
#[cfg(feature = "sourcemap")]
mod source_map;

#[cfg(feature = "sourcemap")]
pub use crate::source_map::*;
