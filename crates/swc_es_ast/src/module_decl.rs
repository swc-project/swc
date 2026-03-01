use swc_common::Span;

use crate::{DeclId, ExprId, Ident, StrLit};

/// Import declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ImportDecl {
    /// Original source span.
    pub span: Span,
    /// Imported specifiers.
    pub specifiers: Vec<ImportSpecifier>,
    /// Source module.
    pub src: StrLit,
}

/// Import specifier.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ImportSpecifier {
    /// Default import (`import a from "x"`).
    Default(ImportDefaultSpecifier),
    /// Namespace import (`import * as a from "x"`).
    Namespace(ImportNamespaceSpecifier),
    /// Named import (`import { a as b } from "x"`).
    Named(ImportNamedSpecifier),
}

/// Default import specifier.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ImportDefaultSpecifier {
    /// Local binding.
    pub local: Ident,
}

/// Namespace import specifier.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ImportNamespaceSpecifier {
    /// Local binding.
    pub local: Ident,
}

/// Named import specifier.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ImportNamedSpecifier {
    /// Local binding.
    pub local: Ident,
    /// Optional imported name.
    pub imported: Option<Ident>,
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

/// Default export declaration (`export default function/class`).
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExportDefaultDecl {
    /// Original source span.
    pub span: Span,
    /// Exported declaration.
    pub decl: DeclId,
}

/// Export-all declaration (`export * from "x"`).
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExportAllDecl {
    /// Original source span.
    pub span: Span,
    /// Re-export source module.
    pub src: StrLit,
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
    /// `export default` declaration.
    ExportDefaultDecl(ExportDefaultDecl),
    /// `export * from` declaration.
    ExportAll(ExportAllDecl),
    /// `export` declaration.
    ExportDecl(ExportDecl),
}
