//! Frozen pass-building compatibility layer.
//!
//! Primary compilation uses [`crate::Compiler::compile`].
//! This module preserves the delayed-pass contracts behind
//! `Options::build_as_input`, `BuiltInput`, `ModuleConfig::build`,
//! [`crate::Compiler::parse_js_as_input`], and
//! [`crate::Compiler::process_js_with_custom_pass`].

mod build;
mod minifier;

pub use build::BuiltInput;
