//! Error reporting for the swc project.
//!
//! -----
//!
//! This module use [`::rustc_errors`][] internally.
//!

pub use self::codemap::{CodeMap, FileLoader, FilePathMapping, RealFileLoader};
pub use self::diagnostic::*;
pub use self::diagnostic_builder::DiagnosticBuilder;
pub use self::handler::*;
pub use rustc_errors::{ColorConfig, Level};
pub use rustc_errors::Level::*;

mod codemap;
mod diagnostic;
mod diagnostic_builder;
mod handler;
#[cfg(test)]
mod tests;
