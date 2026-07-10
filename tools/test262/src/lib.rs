//! Repository-internal Test262 conformance runner.

pub mod baseline;
pub mod bootstrap;
pub mod cli;
#[cfg(feature = "suite-codegen")]
pub mod codegen_suite;
pub mod config;
pub mod diagnostic;
#[cfg(feature = "suite-lexer")]
pub mod lexer_suite;
pub mod loader;
pub mod metadata;
#[cfg(feature = "suite-minifier")]
pub mod minifier_suite;
pub mod model;
#[cfg(feature = "suite-parser")]
pub mod parser_suite;
pub mod report;
pub mod setup;
pub mod skips;
#[cfg(any(
    feature = "suite-codegen",
    feature = "suite-lexer",
    feature = "suite-parser",
    feature = "suite-transforms"
))]
pub mod syntax;
#[cfg(feature = "suite-transforms")]
pub mod transform_suite;
pub mod updater;

#[cfg(feature = "suite-runtime")]
mod runtime_features;
#[cfg(feature = "suite-runtime")]
pub mod runtime_pipeline;
#[cfg(feature = "suite-runtime")]
pub mod runtime_suite;
