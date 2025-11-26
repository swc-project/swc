//! # SWC Test262 Infrastructure
//!
//! This crate provides infrastructure for running Test262 conformance tests
//! against SWC's parser, codegen, and transform pipeline.
//!
//! ## Quick Start
//!
//! ```rust,no_run
//! use swc_test262::{Suite, Test262Case};
//!
//! // Implement your test case
//! struct MyTest262Case {
//!     // ...
//! }
//!
//! impl Test262Case for MyTest262Case {
//!     fn run(&self) {
//!         // Your test logic here
//!     }
//! }
//!
//! // Run the test suite
//! let suite = Suite::<MyTest262Case>::new();
//! suite.run();
//! ```

#![deny(clippy::all)]
#![warn(missing_docs)]

pub mod case;
pub mod discovery;
pub mod metadata;
pub mod parser;
pub mod suite;

// Re-export commonly used types
pub use std::path::{Path, PathBuf};

pub use case::Test262Case;
pub use metadata::{ErrorPhase, Negative, Test262Flag, Test262Metadata};
pub use parser::ParserTest262Case;
pub use suite::Suite;
