//! High-performance ECMAScript/TypeScript parser
//!
//! This parser is designed for maximum performance and memory efficiency,
//! operating at the byte level for optimal throughput.

#![cfg_attr(feature = "nightly", allow(internal_features))]
#![cfg_attr(feature = "nightly", feature(core_intrinsics))]

mod error;
mod lexer;
mod parser;
pub mod token;
mod util;

pub use error::{Error, ErrorKind, Result};
pub use lexer::Lexer;
// pub use parser::Parser;

/// Target ECMAScript version
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum JscTarget {
    Es3,
    Es5,
    Es2015,
    Es2016,
    Es2017,
    Es2018,
    Es2019,
    Es2020,
    Es2021,
    Es2022,
    EsNext,
}

/// Syntax configuration for the parser
#[derive(Debug, Clone, Copy)]
pub struct Syntax {
    /// Enable parsing of JSX syntax
    pub jsx: bool,

    /// Enable parsing of TypeScript syntax
    pub typescript: bool,

    /// Enable parsing of decorators
    pub decorators: bool,

    /// Enable parsing of dynamic imports
    pub dynamic_import: bool,

    /// Enable parsing of private methods
    pub private_methods: bool,

    /// Enable parsing of private fields
    pub private_fields: bool,
}

impl Default for Syntax {
    fn default() -> Self {
        Self {
            jsx: false,
            typescript: false,
            decorators: false,
            dynamic_import: true,
            private_methods: true,
            private_fields: true,
        }
    }
}

/// Single-threaded source comments storage
#[derive(Debug, Default, Clone)]
pub struct SingleThreadedComments {
    // Comments implementation omitted for brevity
}
