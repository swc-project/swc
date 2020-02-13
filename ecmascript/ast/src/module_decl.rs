use crate::{
    decl::Decl,
    expr::{ClassExpr, Expr, FnExpr},
    ident::Ident,
    lit::Str,
    typescript::{
        TsExportAssignment, TsImportEqualsDecl, TsInterfaceDecl, TsNamespaceExportDecl,
        TsTypeExport,
    },
};
use swc_common::{ast_node, Span};

#[ast_node]
pub enum ModuleDecl {
    #[tag("ImportDeclaration")]
    Import(ImportDecl),

    #[tag("TsTypeExport")]
    TsTypeExport(TsTypeExport),

    #[tag("ExportDeclaration")]
    ExportDecl(ExportDecl),

    #[tag("ExportNamedDeclaration")]
    ExportNamed(NamedExport),

    #[tag("ExportDefaultDeclaration")]
    ExportDefaultDecl(ExportDefaultDecl),

    #[tag("ExportDefaultExpression")]
    ExportDefaultExpr(ExportDefaultExpr),

    #[tag("ExportAllDeclaration")]
    ExportAll(ExportAll),

    #[tag("TsImportEqualsDeclaration")]
    TsImportEquals(TsImportEqualsDecl),

    #[tag("TsExportAssignment")]
    TsExportAssignment(TsExportAssignment),

    #[tag("TsNamespaceExportDeclaration")]
    TsNamespaceExport(TsNamespaceExportDecl),
}

#[ast_node("ExportDefaultExpression")]
pub struct ExportDefaultExpr {
    pub span: Span,

    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[ast_node("ExportDeclaration")]
pub struct ExportDecl {
    pub span: Span,

    #[serde(rename = "declaration")]
    pub decl: Decl,
}

#[ast_node("ImportDeclaration")]
pub struct ImportDecl {
    pub span: Span,

    #[serde(default)]
    pub specifiers: Vec<ImportSpecifier>,

    #[serde(rename = "source")]
    pub src: Str,

    #[serde(rename = "typeOnly")]
    pub type_only: bool,
}

/// `export * from 'mod'`
#[ast_node("ExportAllDeclaration")]
pub struct ExportAll {
    pub span: Span,

    #[serde(rename = "source")]
    pub src: Str,
}

/// `export { foo } from 'mod'`
/// `export { foo as bar } from 'mod'`
#[ast_node("ExportNamedDeclaration")]
pub struct NamedExport {
    pub span: Span,

    pub specifiers: Vec<ExportSpecifier>,

    #[serde(rename = "source")]
    pub src: Option<Str>,
}

#[ast_node("ExportDefaultDeclaration")]
pub struct ExportDefaultDecl {
    pub span: Span,

    pub decl: DefaultDecl,
}

#[ast_node]
pub enum DefaultDecl {
    #[tag("ClassExpression")]
    Class(ClassExpr),

    #[tag("FunctionExpression")]
    Fn(FnExpr),

    #[tag("TsInterfaceDeclaration")]
    TsInterfaceDecl(TsInterfaceDecl),
}

#[ast_node]
pub enum ImportSpecifier {
    #[tag("ImportSpecifier")]
    Specific(ImportSpecific),
    #[tag("ImportDefaultSpecifier")]
    Default(ImportDefault),
    #[tag("ImportNamespaceSpecifier")]
    Namespace(ImportStarAs),
}

/// e.g. `import foo from 'mod.js'`
#[ast_node("ImportDefaultSpecifier")]
pub struct ImportDefault {
    pub span: Span,

    pub local: Ident,
}
/// e.g. `import * as foo from 'mod.js'`.
#[ast_node("ImportNamespaceSpecifier")]
pub struct ImportStarAs {
    pub span: Span,

    pub local: Ident,
}
/// e.g. local = foo, imported = None `import { foo } from 'mod.js'`
/// e.g. local = bar, imported = Some(foo) for `import { foo as bar } from
/// 'mod.js'`
#[ast_node("ImportSpecifier")]
pub struct ImportSpecific {
    pub span: Span,

    pub local: Ident,

    #[serde(default)]
    pub imported: Option<Ident>,
}

#[ast_node]
pub enum ExportSpecifier {
    #[tag("ExportNamespaceSpecifer")]
    Namespace(NamespaceExportSpecifier),

    #[tag("ExportDefaultSpecifier")]
    Default(DefaultExportSpecifier),

    #[tag("ExportSpecifier")]
    Named(NamedExportSpecifier),
}

/// `export * as foo from 'src';`
#[ast_node("ExportNamespaceSpecifer")]
pub struct NamespaceExportSpecifier {
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
    pub span: Span,
    /// `foo` in `export { foo as bar }`
    pub orig: Ident,
    /// `Some(bar)` in `export { foo as bar }`
    #[serde(default)]
    pub exported: Option<Ident>,
}
