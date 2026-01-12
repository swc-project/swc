//! Import/export handling utilities.

use swc_ecma_ast::*;

/// Information about an imported identifier.
#[derive(Debug, Clone)]
pub struct ImportInfo {
    /// The kind of import (value or type-only).
    pub kind: ImportKind,
    /// The source module.
    pub src: Str,
}

/// The kind of import.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ImportKind {
    /// A value import (can be used as a value).
    Value,
    /// A type-only import (cannot be used as a value).
    TypeOnly,
}
