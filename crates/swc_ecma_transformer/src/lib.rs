//! Hook-based ECMAScript transformer for SWC.
//!
//! This crate provides a composable transformer architecture using the
//! [`swc_ecma_hooks`] API. It allows building complex transformations by
//! combining simple hook-based passes.
//!
//! # Architecture
//!
//! The transformer is built on top of SWC's visitor pattern ([`VisitMut`])
//! and the hook system provided by [`swc_ecma_hooks`]. The main components are:
//!
//! - [`Transformer`]: The main struct that implements [`VisitMut`] and
//!   orchestrates all transform passes.
//! - [`TransformCtx`]: Context passed through all hooks, providing access to
//!   source information and error reporting.
//! - [`TransformOptions`]: Configuration for enabling/disabling specific
//!   transform passes.
//!
//! # Example
//!
//! ```ignore
//! use swc_ecma_transformer::{Transformer, TransformOptions, TransformCtx};
//! use swc_ecma_visit::VisitMutWith;
//! use std::sync::Arc;
//! use std::path::PathBuf;
//! use swc_common::{SourceMap, errors::Handler, sync::Lrc};
//!
//! // Create options
//! let options = TransformOptions::ES2015 | TransformOptions::ES2016;
//!
//! // Create context
//! let source_map = Lrc::new(SourceMap::default());
//! let handler = Lrc::new(Handler::with_tty_emitter(/* ... */));
//! let ctx = TransformCtx::new(
//!     PathBuf::from("input.js"),
//!     Arc::new("const x = 1;".to_string()),
//!     source_map,
//!     handler,
//! );
//!
//! // Create transformer
//! let mut transformer = Transformer::new(options, ctx);
//!
//! // Transform AST
//! program.visit_mut_with(&mut transformer);
//! ```
//!
//! # Performance
//!
//! This transformer is designed for performance, following the guidelines in
//! CLAUDE.md. It uses:
//!
//! - Efficient visitor patterns
//! - Minimal allocations (preferring `&str` and `Cow<str>` for [`Atom`])
//! - Optimized data structures from [`rustc-hash`]
//!
//! [`Atom`]: swc_atoms::Atom

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

pub use swc_ecma_ast;
pub use swc_ecma_hooks;
pub use swc_ecma_visit;

pub mod common;
mod context;
mod options;
pub mod typescript;

pub use context::TransformCtx;
pub use options::TransformOptions;
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};

/// The main transformer struct.
///
/// This struct implements [`VisitMut`] and serves as the entry point for all
/// transformations. It holds the configuration options and context, and
/// delegates to individual transform passes that implement [`VisitMutHook`].
///
/// # Architecture Pattern
///
/// The transformer follows this pattern:
///
/// 1. Accepts [`TransformOptions`] and [`TransformCtx`] in the constructor
/// 2. Implements [`VisitMut`] trait for AST traversal
/// 3. In visitor methods, creates and executes hooks in sequence
/// 4. Each hook implements [`VisitMutHook<TransformCtx>`] for composability
///
/// # Example
///
/// ```ignore
/// let transformer = Transformer::new(options, ctx);
/// program.visit_mut_with(&mut transformer);
/// ```
pub struct Transformer {
    /// Configuration options controlling which transforms are enabled.
    options: TransformOptions,

    /// Context shared across all transform passes.
    ctx: TransformCtx,
}

impl Transformer {
    /// Creates a new transformer with the given options and context.
    ///
    /// # Arguments
    ///
    /// * `options` - Transform options controlling which passes are enabled
    /// * `ctx` - Transform context for error reporting and state
    ///
    /// # Example
    ///
    /// ```ignore
    /// use swc_ecma_transformer::{Transformer, TransformOptions, TransformCtx};
    /// use std::sync::Arc;
    /// use std::path::PathBuf;
    ///
    /// let options = TransformOptions::ES2015;
    /// let ctx = TransformCtx::new(/* ... */);
    /// let transformer = Transformer::new(options, ctx);
    /// ```
    pub fn new(options: TransformOptions, ctx: TransformCtx) -> Self {
        Self { options, ctx }
    }

    /// Returns a reference to the transform options.
    pub fn options(&self) -> &TransformOptions {
        &self.options
    }

    /// Returns a reference to the transform context.
    pub fn ctx(&self) -> &TransformCtx {
        &self.ctx
    }

    /// Returns a mutable reference to the transform context.
    pub fn ctx_mut(&mut self) -> &mut TransformCtx {
        &mut self.ctx
    }
}

impl VisitMut for Transformer {
    /// Entry point for transforming a program.
    ///
    /// This method is called when visiting a [`Program`] node. It will
    /// execute all enabled transform hooks in sequence based on the
    /// configured options.
    fn visit_mut_program(&mut self, n: &mut Program) {
        // Visit children first using the default visitor
        n.visit_mut_children_with(self);

        // TODO: Add transform hooks here as they are implemented
        // Example pattern:
        // if self.options.es2015() {
        //     let mut hook = Es2015Transform::new();
        //     hook.enter_program(n, &mut self.ctx);
        //     n.visit_mut_children_with(&mut HookVisitor {
        //         hook: &mut hook,
        //         ctx: &mut self.ctx,
        //     });
        //     hook.exit_program(n, &mut self.ctx);
        // }
    }

    /// Entry point for transforming a module.
    ///
    /// This is called for ES modules specifically.
    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_mut_children_with(self);

        // TODO: Add module-specific transform hooks
    }

    /// Entry point for transforming a script.
    ///
    /// This is called for non-module scripts.
    fn visit_mut_script(&mut self, n: &mut Script) {
        n.visit_mut_children_with(self);

        // TODO: Add script-specific transform hooks
    }
}

#[cfg(test)]
mod tests {
    use std::{io, path::PathBuf, sync::Arc};

    use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};

    use super::*;

    /// Creates a test context for unit tests.
    fn create_test_ctx() -> TransformCtx {
        let source_map_lrc = Lrc::new(SourceMap::default());
        let source_file =
            source_map_lrc.new_source_file(Lrc::new(FileName::Anon), "const x = 1;".to_string());

        // Use Lrc (Rc) instead of Arc for Handler in tests since it's not Send/Sync
        let handler = Lrc::new(Handler::with_emitter_writer(
            Box::new(io::sink()),
            Some(source_map_lrc.clone()),
        ));

        TransformCtx::new(
            PathBuf::from("test.js"),
            Arc::new(source_file.src.to_string()),
            source_map_lrc.clone(),
            handler,
        )
    }

    #[test]
    fn test_transformer_creation() {
        let options = TransformOptions::ES2015;
        let ctx = create_test_ctx();
        let transformer = Transformer::new(options, ctx);

        assert_eq!(transformer.options(), &TransformOptions::ES2015);
    }

    #[test]
    fn test_transform_options_default() {
        let options = TransformOptions::default();
        assert!(options.is_empty());
    }

    #[test]
    fn test_transform_options_combinations() {
        let options = TransformOptions::ES2015 | TransformOptions::ES2016;
        assert!(options.es2015());
        assert!(options.es2016());
        assert!(!options.es2017());
    }

    #[test]
    fn test_transform_options_all() {
        let options = TransformOptions::ALL;
        assert!(options.es2015());
        assert!(options.typescript());
        assert!(options.react());
        assert!(options.optimization());
    }

    #[test]
    fn test_transformer_visit_mut() {
        let options = TransformOptions::new();
        let ctx = create_test_ctx();
        let mut transformer = Transformer::new(options, ctx);

        // Create a simple module to transform
        let mut module = Module {
            span: Default::default(),
            body: vec![],
            shebang: None,
        };

        // This should not panic
        module.visit_mut_with(&mut transformer);
    }
}
