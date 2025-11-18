//! oxc-inspired composable transformer for ECMAScript.
//!
//! This crate provides a transformer architecture inspired by oxc, but built on
//! SWC's infrastructure. It uses the `VisitMutHook` pattern from
//! `swc_ecma_hooks` to compose multiple transformation passes in an organized,
//! layered manner.
//!
//! # Architecture
//!
//! The transformer is organized into modules that mirror oxc's structure:
//!
//! - **ES20XX modules** (es2015, es2016, ..., es2022, es2026): Transforms for
//!   specific ECMAScript versions
//! - **Feature modules** (jsx, typescript, decorator, regexp): Language feature
//!   transforms
//! - **Infrastructure modules** (common, proposals, utils): Shared utilities
//!   and experimental features
//!
//! # Design
//!
//! Unlike oxc's single-pass `Traverse` trait, this implementation uses SWC's
//! two-trait pattern:
//!
//! - **`VisitMut`**: Implemented by the main `Transformer` struct, handles AST
//!   traversal
//! - **`VisitMutHook<TraverseCtx>`**: Implemented by individual transform
//!   passes, receives `enter_*` and `exit_*` callbacks with context
//!
//! The `TraverseCtx` provides utilities similar to oxc's context:
//! - Syntax context management
//! - Unique identifier generation
//! - AST building helpers
//!
//! # Example
//!
//! ```ignore
//! use swc_ecma_transformer::{Transformer, TransformOptions};
//! use swc_ecma_visit::VisitMutWith;
//!
//! let options = TransformOptions {
//!     target: EsVersion::Es2015,
//!     ..Default::default()
//! };
//!
//! let mut transformer = Transformer::new(options);
//! let mut program = parse_code();
//! program.visit_mut_with(&mut transformer);
//! ```

#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

pub use swc_ecma_ast;
pub use swc_ecma_hooks;
pub use swc_ecma_visit;

mod context;
mod options;

// ES version-specific transforms
pub mod es2015;
pub mod es2016;
pub mod es2017;
pub mod es2018;
pub mod es2019;
pub mod es2020;
pub mod es2021;
pub mod es2022;
pub mod es2026;

// Feature transforms
pub mod decorator;
pub mod jsx;
pub mod regexp;
pub mod typescript;

// Infrastructure
pub mod common;
pub mod proposals;
pub mod utils;

pub use context::TraverseCtx;
pub use options::*;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};

/// Main transformer struct that orchestrates all transformation passes.
///
/// This struct implements `VisitMut` and coordinates multiple `VisitMutHook`
/// implementations that perform the actual transformations. The hooks are
/// called in a specific order to ensure correctness:
///
/// 1. TypeScript transforms (type stripping, enums, etc.)
/// 2. JSX transforms
/// 3. Decorator transforms
/// 4. ES20XX transforms (in reverse chronological order: ES2022 -> ES2015)
/// 5. RegExp transforms
/// 6. Common transforms
///
/// # Example
///
/// ```ignore
/// let options = TransformOptions {
///     typescript: TypeScriptOptions {
///         enabled: true,
///         ..Default::default()
///     },
///     jsx: JsxOptions {
///         enabled: true,
///         runtime: JsxRuntime::Automatic,
///         ..Default::default()
///     },
///     target: EsVersion::Es2015,
///     ..Default::default()
/// };
///
/// let mut transformer = Transformer::new(options);
/// program.visit_mut_with(&mut transformer);
/// ```
pub struct Transformer {
    /// Transformation options
    options: TransformOptions,

    /// Unresolved mark for generating unresolved references
    unresolved_mark: Mark,

    /// Top-level mark for top-level declarations
    top_level_mark: Mark,
}

impl Transformer {
    /// Creates a new transformer with the given options.
    ///
    /// # Arguments
    ///
    /// * `options` - Configuration options for the transformer
    ///
    /// # Example
    ///
    /// ```ignore
    /// use swc_ecma_transformer::{Transformer, TransformOptions};
    ///
    /// let transformer = Transformer::new(TransformOptions::default());
    /// ```
    pub fn new(options: TransformOptions) -> Self {
        Self {
            options,
            unresolved_mark: Mark::new(),
            top_level_mark: Mark::new(),
        }
    }

    /// Creates a new transformer with explicit marks.
    ///
    /// This is useful when you need to coordinate marks with other
    /// transformations or when working with existing marked AST.
    ///
    /// # Arguments
    ///
    /// * `options` - Configuration options for the transformer
    /// * `unresolved_mark` - Mark for unresolved references
    /// * `top_level_mark` - Mark for top-level declarations
    pub fn new_with_marks(
        options: TransformOptions,
        unresolved_mark: Mark,
        top_level_mark: Mark,
    ) -> Self {
        Self {
            options,
            unresolved_mark,
            top_level_mark,
        }
    }

    /// Gets the unresolved mark used by this transformer.
    #[inline]
    pub fn unresolved_mark(&self) -> Mark {
        self.unresolved_mark
    }

    /// Gets the top-level mark used by this transformer.
    #[inline]
    pub fn top_level_mark(&self) -> Mark {
        self.top_level_mark
    }

    /// Gets a reference to the transformation options.
    #[inline]
    pub fn options(&self) -> &TransformOptions {
        &self.options
    }

    /// Creates a traversal context for use with hooks.
    fn create_context(&self) -> TraverseCtx {
        let unresolved_ctxt = SyntaxContext::empty().apply_mark(self.unresolved_mark);
        let top_level_ctxt = SyntaxContext::empty().apply_mark(self.top_level_mark);
        TraverseCtx::new(unresolved_ctxt, top_level_ctxt)
    }
}

impl VisitMut for Transformer {
    /// Visit and transform a Program node.
    ///
    /// This is the entry point for transformation. It creates a context and
    /// orchestrates all enabled transformation hooks in the correct order.
    fn visit_mut_program(&mut self, program: &mut Program) {
        // Create the traversal context
        let _ctx = self.create_context();

        // TODO: Build and compose the actual hook chain based on options
        // For now, we just traverse without any transforms
        // This will be implemented as individual ES20XX and feature transforms are
        // ported

        // Example of how hooks will be composed (commented out until transforms are
        // implemented): let mut hook = CompositeHook {
        //     first: TypeScriptHook::new(&self.options.typescript),
        //     second: CompositeHook {
        //         first: JsxHook::new(&self.options.jsx),
        //         second: Es2015Hook::new(),
        //     },
        // };
        //
        // let mut visitor = VisitMutWithHook {
        //     hook,
        //     context: ctx,
        // };
        //
        // program.visit_mut_with(&mut visitor);

        // For now, just traverse children
        program.visit_mut_children_with(self);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_transformer_creation() {
        ::testing::run_test(false, |_, _| {
            let transformer = Transformer::new(TransformOptions::default());
            assert_eq!(transformer.options().target, EsVersion::Es5);
            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn test_transformer_with_marks() {
        ::testing::run_test(false, |_, _| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            let transformer =
                Transformer::new_with_marks(TransformOptions::default(), unresolved, top_level);
            assert_eq!(transformer.unresolved_mark(), unresolved);
            assert_eq!(transformer.top_level_mark(), top_level);
            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn test_traverse_context_creation() {
        ::testing::run_test(false, |_, _| {
            let transformer = Transformer::new(TransformOptions::default());
            let ctx = transformer.create_context();
            let unresolved_ctxt = ctx.unresolved_ctxt();
            let top_level_ctxt = ctx.top_level_ctxt();

            // Contexts should be different
            assert_ne!(unresolved_ctxt, top_level_ctxt);
            Ok(())
        })
        .unwrap();
    }
}
