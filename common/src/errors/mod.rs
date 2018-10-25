//! Error reporting for the swc project.
//!
//! -----
//!
//! This module use [`::rustc_errors`][] internally.
//!

pub use self::{diagnostic::*, diagnostic_builder::DiagnosticBuilder, handler::*};
pub use rustc_errors::{
    ColorConfig,
    Level::{self, *},
    SourceMapper, SourceMapperDyn,
};

mod diagnostic;
mod diagnostic_builder;
mod handler;
#[cfg(test)]
mod tests;
