//! Error reporting for the swc project.
//!
//! -----
//!
//! This module is almost copied from [rustc_errors][].
//!
//!
//![rustc_errors]:http://manishearth.github.io/rust-internals-docs/rustc_errors/

pub use self::codemap::{CodeMap, FileLoader, FilePathMapping, RealFileLoader};
pub use self::diagnostic::*;
pub use self::handler::*;
pub use rustc_errors::{ColorConfig, Level};
pub use rustc_errors::Level::*;

mod codemap;
mod diagnostic;
mod handler;
#[cfg(test)]
mod tests;
