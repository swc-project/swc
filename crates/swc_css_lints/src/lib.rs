#![deny(clippy::all)]
#![feature(box_patterns)]

mod config;
mod dataset;
mod error;
mod pattern;
mod rule;
mod rules;

pub use config::LintConfig;
pub(crate) use error::ConfigError;
pub use rule::LintRule;
pub use rules::{get_rules, LintParams};
