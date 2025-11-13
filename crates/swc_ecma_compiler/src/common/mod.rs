//! Utility transforms which are in common between other transforms.

use swc_ecma_hooks::VisitMutHook;

use crate::{context::TraverseCtx, EnvOptions};

pub mod arrow_function_converter;
mod computed_key;
mod duplicate;
pub mod helper_loader;
pub mod module_imports;
pub mod statement_injector;
pub mod top_level_statements;
pub mod var_declarations;

/// Common utility transforms
///
/// This module provides infrastructure transforms that manage:
/// - Module imports and requires
/// - Variable declarations
/// - Statement injection
/// - Top-level statements
/// - Arrow function conversion
///
/// Note: These are utility transforms that provide helper functionality
/// to other transforms. They implement VisitMutHook but do not directly
/// transform the AST themselves.
pub struct Common {}

impl Common {
    #[allow(unused)]
    pub fn new(_options: &EnvOptions) -> Self {
        Self {}
    }
}

impl VisitMutHook<TraverseCtx<'_>> for Common {}
