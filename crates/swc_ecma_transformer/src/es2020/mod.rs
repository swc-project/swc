//! ES2020 syntax transformations.
//!
//! This module implements transformations for ES2020 features to
//! ES2019-compatible code. The transformations follow the VisitMutHook pattern
//! established in the swc_ecma_transformer architecture.
//!
//! # Supported Features
//!
//! - **Optional chaining** (`?.`): Transforms optional property access and
//!   calls into null/undefined checks
//! - **Nullish coalescing** (`??`): Transforms the nullish coalescing operator
//!   into conditional expressions
//!
//! # Example
//!
//! ```ignore
//! use swc_ecma_transformer::es2020::ES2020;
//! use swc_ecma_hooks::VisitMutHook;
//!
//! let mut transformer = ES2020::new();
//! transformer.enter_program(&mut program, &mut ctx);
//! // ... visit children ...
//! transformer.exit_program(&mut program, &mut ctx);
//! ```

mod nullish_coalescing;
mod optional_chaining;
mod options;

pub use nullish_coalescing::NullishCoalescing;
pub use optional_chaining::OptionalChaining;
pub use options::ES2020Options;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// Main ES2020 transformer.
///
/// This struct coordinates all ES2020 feature transformations. It implements
/// the [`VisitMutHook`] trait to integrate with the transformer architecture.
pub struct ES2020 {
    options: ES2020Options,
}

impl ES2020 {
    /// Creates a new ES2020 transformer with the given options.
    pub fn new(options: ES2020Options) -> Self {
        Self { options }
    }

    /// Creates a new ES2020 transformer with default options (all features
    /// enabled).
    pub fn new_default() -> Self {
        Self {
            options: ES2020Options::default(),
        }
    }
}

impl VisitMutHook<TransformCtx> for ES2020 {
    fn enter_program(&mut self, _program: &mut Program, _ctx: &mut TransformCtx) {
        // Initialize any state needed for the transformation
    }

    fn exit_program(&mut self, program: &mut Program, ctx: &mut TransformCtx) {
        // Apply transformations after traversal is complete
        if self.options.optional_chaining {
            let mut optional_chaining = OptionalChaining::new();
            optional_chaining.transform_program(program, ctx);
        }

        if self.options.nullish_coalescing {
            let mut nullish_coalescing = NullishCoalescing::new();
            nullish_coalescing.transform_program(program, ctx);
        }
    }
}
