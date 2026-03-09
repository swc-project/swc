//! 2-pass transform pipeline for [`swc_es_ast`].
//!
//! This crate guarantees a single analysis pass and a single rewrite pass.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_atoms::Atom;
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

/// React runtime mode.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
pub enum ReactRuntime {
    /// Automatic runtime (`jsx`/`jsxs` helpers).
    #[default]
    Automatic,
    /// Classic runtime (`React.createElement`).
    Classic,
}

/// TypeScript transform options.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TypeScriptTransformOptions {
    /// Enable TypeScript transform.
    pub enabled: bool,
    /// Lower enums to runtime JavaScript.
    pub transform_enum: bool,
    /// Lower namespaces/modules to runtime JavaScript.
    pub transform_namespace: bool,
    /// Drop `declare` declarations.
    pub drop_declare: bool,
}

impl Default for TypeScriptTransformOptions {
    #[inline]
    fn default() -> Self {
        Self {
            enabled: true,
            transform_enum: true,
            transform_namespace: true,
            drop_declare: true,
        }
    }
}

/// React transform options.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ReactTransformOptions {
    /// Enable React transform.
    pub enabled: bool,
    /// Runtime mode.
    pub runtime: ReactRuntime,
    /// Runtime import source for automatic mode.
    pub import_source: Atom,
    /// Factory function name for classic mode.
    pub classic_pragma: Atom,
    /// Fragment name for classic mode.
    pub classic_fragment_pragma: Atom,
}

impl Default for ReactTransformOptions {
    #[inline]
    fn default() -> Self {
        Self {
            enabled: true,
            runtime: ReactRuntime::Automatic,
            import_source: Atom::new("react/jsx-runtime"),
            classic_pragma: Atom::new("React.createElement"),
            classic_fragment_pragma: Atom::new("React.Fragment"),
        }
    }
}

/// Transform options.
#[derive(Debug, Clone, PartialEq, Eq)]
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
    /// TypeScript transform options.
    pub typescript: TypeScriptTransformOptions,
    /// React transform options.
    pub react: ReactTransformOptions,
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
            typescript: TypeScriptTransformOptions::default(),
            react: ReactTransformOptions::default(),
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
