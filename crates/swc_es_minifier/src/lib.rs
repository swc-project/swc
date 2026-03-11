//! 2-pass minifier for [`swc_es_ast`].
//!
//! This crate guarantees one analysis pass and one rewrite pass.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_atoms::Atom;
use swc_es_ast::{AstStore, ProgramId};

mod analysis;
mod engine;
mod rewrite;

pub use crate::analysis::{AnalysisFacts, ConstValue, SymbolUsage};

/// Compression options.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CompressOptions {
    /// Fold constant expressions.
    pub fold_constants: bool,
    /// Remove unreachable code when safe.
    pub dead_code: bool,
    /// Simplify branches with statically known conditions.
    pub simplify_branches: bool,
    /// Drop unused bindings when side-effect free.
    pub drop_unused_bindings: bool,
}

impl Default for CompressOptions {
    #[inline]
    fn default() -> Self {
        Self {
            fold_constants: true,
            dead_code: true,
            simplify_branches: true,
            drop_unused_bindings: true,
        }
    }
}

/// Name mangling options.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MangleOptions {
    /// Enable mangling.
    pub enabled: bool,
    /// Allow top-level symbol mangling.
    pub top_level: bool,
    /// Preserve function names.
    pub keep_fn_names: bool,
    /// Preserve class names.
    pub keep_class_names: bool,
    /// Names never to mangle.
    pub reserved: Vec<Atom>,
}

impl Default for MangleOptions {
    #[inline]
    fn default() -> Self {
        Self {
            enabled: false,
            top_level: false,
            keep_fn_names: true,
            keep_class_names: true,
            reserved: Vec::new(),
        }
    }
}

/// Minifier options.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct MinifyOptions {
    /// Compression options.
    pub compress: CompressOptions,
    /// Mangling options.
    pub mangle: MangleOptions,
}

/// Pass statistics.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct PassStats {
    /// Number of nodes seen by analysis.
    pub analysis_nodes: u32,
    /// Number of nodes seen by rewrite.
    pub rewrite_nodes: u32,
}

/// Minification result.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct MinifyResult {
    /// Program id.
    pub program: ProgramId,
    /// Whether AST changed.
    pub changed: bool,
    /// Pass statistics.
    pub stats: PassStats,
}

/// Minify a program using exactly one analysis pass and one rewrite pass.
#[inline]
pub fn minify_program(
    store: &mut AstStore,
    program: ProgramId,
    options: &MinifyOptions,
) -> MinifyResult {
    engine::run_minify(store, program, options)
}
