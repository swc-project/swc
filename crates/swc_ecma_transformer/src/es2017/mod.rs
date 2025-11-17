//! ES2017 syntax transformations.
//!
//! This module provides transformations for ES2017 features, adapted from
//! oxc_transformer to work with SWC's AST and visitor pattern.
//!
//! ## Features
//!
//! - **Async functions**: Transform async/await to generator-based promises
//!
//! ## Usage
//!
//! ```ignore
//! use swc_ecma_transformer::es2017::{ES2017, ES2017Options};
//! use swc_ecma_hooks::VisitMutHook;
//!
//! let options = ES2017Options {
//!     async_to_generator: true,
//! };
//! let mut transform = ES2017::new(options);
//! ```

mod async_to_generator;
mod options;

pub use async_to_generator::AsyncToGenerator;
pub use options::ES2017Options;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// ES2017 transformer.
///
/// This struct orchestrates all ES2017-specific transformations including
/// async/await transformation. It implements the `VisitMutHook` pattern
/// to integrate with the main transformer.
pub struct ES2017 {
    options: ES2017Options,
    async_to_generator: AsyncToGenerator,
}

impl ES2017 {
    /// Creates a new ES2017 transformer with the given options.
    pub fn new(options: ES2017Options) -> Self {
        Self {
            async_to_generator: AsyncToGenerator::new(),
            options,
        }
    }
}

impl VisitMutHook<TransformCtx> for ES2017 {
    fn exit_expr(&mut self, expr: &mut Expr, ctx: &mut TransformCtx) {
        if self.options.async_to_generator {
            self.async_to_generator.exit_expr(expr, ctx);
        }
    }

    fn exit_function(&mut self, func: &mut Function, ctx: &mut TransformCtx) {
        if self.options.async_to_generator {
            self.async_to_generator.exit_function(func, ctx);
        }
    }

    fn exit_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TransformCtx) {
        if self.options.async_to_generator {
            self.async_to_generator.exit_stmt(stmt, ctx);
        }
    }
}
