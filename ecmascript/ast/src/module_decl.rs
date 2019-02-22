use crate::{
    decl::Decl,
    expr::{ClassExpr, Expr, FnExpr},
    ident::Ident,
    lit::Str,
    typescript::{TsExportAssignment, TsImportEqualsDecl, TsInterfaceDecl, TsNamespaceExportDecl},
};
use swc_common::{ast_node, Span};

#[ast_node]
pub enum ModuleDecl {
    Import(ImportDecl),
    ExportDecl(Decl),
    ExportNamed(NamedExport),

    ExportDefaultDecl(ExportDefaultDecl),

    ExportDefaultExpr(Box<Expr>),
    ExportAll(ExportAll),
    TsImportEquals(TsImportEqualsDecl),
    TsExportAssignment(TsExportAssignment),
    TsNamespaceExport(TsNamespaceExportDecl),
}

#[ast_node("ImportDeclaration")]
pub struct ImportDecl {
    #[serde(default)]
    pub span: Span,

    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub specifiers: Vec<ImportSpecifier>,

    #[serde(rename = "source")]
    pub src: Str,
}

/// `export * from 'mod'`
#[ast_node("ExportAllDeclaration")]
pub struct ExportAll {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "source")]
    pub src: Str,
}

/// `export { foo } from 'mod'`
/// `export { foo as bar } from 'mod'`
#[ast_node("ExportNamedDeclaration")]
pub struct NamedExport {
    #[serde(default)]
    pub span: Span,

    pub specifiers: Vec<ExportSpecifier>,

    #[serde(rename = "source")]
    pub src: Option<Str>,
}

#[ast_node]
pub enum ExportDefaultDecl {
    Class(ClassExpr),

    Fn(FnExpr),

    TsInterfaceDecl(TsInterfaceDecl),
}

#[ast_node]
pub enum ImportSpecifier {
    Specific(ImportSpecific),
    Default(ImportDefault),
    Namespace(ImportStarAs),
}

/// e.g. `import foo from 'mod.js'`
#[ast_node("ImportDefaultSpecifier")]
pub struct ImportDefault {
    #[serde(default)]
    pub span: Span,

    pub local: Ident,
}
/// e.g. `import * as foo from 'mod.js'`.
#[ast_node("ImportNamespaceSpecifier")]
pub struct ImportStarAs {
    #[serde(default)]
    pub span: Span,

    pub local: Ident,
}
/// e.g. local = foo, imported = None `import { foo } from 'mod.js'`
/// e.g. local = bar, imported = Some(foo) for `import { foo as bar } from
/// 'mod.js'`
#[ast_node("ImportSpecifier")]
pub struct ImportSpecific {
    #[serde(default)]
    pub span: Span,

    pub local: Ident,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub imported: Option<Ident>,
}

#[ast_node]
pub enum ExportSpecifier {
    Namespace(NamespaceExportSpecifier),

    Default(DefaultExportSpecifier),

    Named(NamedExportSpecifier),
}

/// `export * as foo from 'src';`
#[ast_node("ExportNamespaceSpecifer")]
pub struct NamespaceExportSpecifier {
    #[serde(default)]
    pub span: Span,

    pub name: Ident,
}

#[ast_node("ExportDefaultSpecifier")]
pub struct DefaultExportSpecifier {
    #[span]
    pub exported: Ident,
}

#[ast_node("ExportSpecifier")]
pub struct NamedExportSpecifier {
    #[serde(default)]
    pub span: Span,
    /// `foo` in `export { foo as bar }`
    pub orig: Ident,
    /// `Some(bar)` in `export { foo as bar }`
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub exported: Option<Ident>,
}
