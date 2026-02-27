use swc_common::Span;

use crate::{DeclId, ExprId, Ident, StrLit};

/// Import declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ImportDecl {
    /// Original source span.
    pub span: Span,
    /// Source module.
    pub src: StrLit,
}

/// Named export specifier.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExportSpecifier {
    /// Local binding.
    pub local: Ident,
    /// Exported binding name.
    pub exported: Option<Ident>,
}

/// Named export declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExportNamedDecl {
    /// Original source span.
    pub span: Span,
    /// Re-export source.
    pub src: Option<StrLit>,
    /// Named specifiers.
    pub specifiers: Vec<ExportSpecifier>,
    /// Optional inline declaration.
    pub decl: Option<DeclId>,
}

/// Default export expression declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExportDefaultExprDecl {
    /// Original source span.
    pub span: Span,
    /// Exported expression.
    pub expr: ExprId,
}

/// Export declaration wrapping a declaration node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExportDecl {
    /// Original source span.
    pub span: Span,
    /// Exported declaration.
    pub decl: DeclId,
}

/// Module declaration node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ModuleDecl {
    /// `import` declaration.
    Import(ImportDecl),
    /// `export {}` declaration.
    ExportNamed(ExportNamedDecl),
    /// `export default expr` declaration.
    ExportDefaultExpr(ExportDefaultExprDecl),
    /// `export` declaration.
    ExportDecl(ExportDecl),
}
