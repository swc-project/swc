use swc_common::Span;

use crate::{DeclId, ExprId, Ident, StrLit};

/// Import attribute key.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ImportAttributeName {
    /// Identifier key.
    Ident(Ident),
    /// String-literal key.
    Str(StrLit),
}

/// Import attribute / assertion pair.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ImportAttribute {
    /// Original source span.
    pub span: Span,
    /// Attribute key.
    pub key: ImportAttributeName,
    /// Attribute value.
    pub value: StrLit,
}

/// Import declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ImportDecl {
    /// Original source span.
    pub span: Span,
    /// Imported specifiers.
    pub specifiers: Vec<ImportSpecifier>,
    /// `true` for `import type ...`.
    pub type_only: bool,
    /// Source module.
    pub src: StrLit,
    /// Optional import attributes/assertions.
    pub with: Vec<ImportAttribute>,
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
    /// `true` for `import { type A }`.
    pub is_type_only: bool,
}

/// Named export specifier.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExportSpecifier {
    /// Local binding.
    pub local: Ident,
    /// Exported binding name.
    pub exported: Option<Ident>,
    /// `true` for `export { type A }`.
    pub is_type_only: bool,
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
    /// `true` for `export type ...`.
    pub type_only: bool,
    /// Optional inline declaration.
    pub decl: Option<DeclId>,
    /// Optional export attributes/assertions.
    pub with: Vec<ImportAttribute>,
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
    /// `true` for `export type * from "x"`.
    pub type_only: bool,
    /// Optional export namespace name (`export * as ns`).
    pub exported: Option<Ident>,
    /// Optional export attributes/assertions.
    pub with: Vec<ImportAttribute>,
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
