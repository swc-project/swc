//! 2-pass transform pipeline for [`swc_es_ast`].
//!
//! This crate guarantees a single analysis pass and a single rewrite pass.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_es_ast::{AstStore, ProgramId};

mod analysis;
mod engine;
mod rewrite;

pub use crate::analysis::{AnalysisFacts, ConstValue, SymbolUsage};

/// Output target for syntax lowering.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum TransformTarget {
    /// Keep syntax compatible with ES2022.
    Es2022,
    /// Keep syntax compatible with ES2021.
    Es2021,
    /// Keep syntax compatible with ES2020.
    Es2020,
    /// Keep syntax compatible with ES2019.
    Es2019,
    /// Keep syntax compatible with ES2018.
    Es2018,
}

impl Default for TransformTarget {
    #[inline]
    fn default() -> Self {
        Self::Es2022
    }
}

impl TransformTarget {
    #[inline]
    fn lower_optional_chaining(self) -> bool {
        matches!(self, Self::Es2019 | Self::Es2018)
    }

    #[inline]
    fn lower_nullish_coalescing(self) -> bool {
        matches!(self, Self::Es2019 | Self::Es2018)
    }

    #[inline]
    fn lower_logical_assignment(self) -> bool {
        matches!(self, Self::Es2020 | Self::Es2019 | Self::Es2018)
    }
}

/// Transform options.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TransformOptions {
    /// Output target.
    pub target: TransformTarget,
    /// Enable optional-chaining lowering.
    pub enable_optional_chaining: bool,
    /// Enable nullish-coalescing lowering.
    pub enable_nullish_coalescing: bool,
    /// Enable logical-assignment lowering.
    pub enable_logical_assignment: bool,
    /// Enable normalization cleanup.
    pub enable_normalize: bool,
}

impl Default for TransformOptions {
    #[inline]
    fn default() -> Self {
        Self {
            target: TransformTarget::Es2022,
            enable_optional_chaining: true,
            enable_nullish_coalescing: true,
            enable_logical_assignment: true,
            enable_normalize: true,
        }
    }
}

/// Pass statistics.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct PassStats {
    /// Number of nodes seen by analysis.
    pub analysis_nodes: u32,
    /// Number of nodes seen by rewrite.
    pub rewrite_nodes: u32,
}

/// Transform result.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct TransformResult {
    /// Program id.
    pub program: ProgramId,
    /// `true` if AST changed.
    pub changed: bool,
    /// Pass statistics.
    pub stats: PassStats,
}

/// Apply all built-in transforms using exactly one analysis pass and one
/// rewrite pass.
#[inline]
pub fn transform_program(
    store: &mut AstStore,
    program: ProgramId,
    options: &TransformOptions,
) -> TransformResult {
    engine::run_transform(store, program, options)
}
