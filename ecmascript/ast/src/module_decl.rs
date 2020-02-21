use crate::{
    decl::Decl,
    expr::{ClassExpr, Expr, FnExpr},
    ident::Ident,
    lit::Str,
    typescript::{TsExportAssignment, TsImportEqualsDecl, TsInterfaceDecl, TsNamespaceExportDecl},
};
use swc_common::{ast_node, Span};

#[ast_node]
#[derive(Eq, Hash)]
pub enum ModuleDecl {
    #[tag("ImportDeclaration")]
    Import(ImportDecl),

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
#[derive(Eq, Hash)]
pub struct ExportDefaultExpr {
    pub span: Span,

    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[ast_node("ExportDeclaration")]
#[derive(Eq, Hash)]
pub struct ExportDecl {
    pub span: Span,

    #[serde(rename = "declaration")]
    pub decl: Decl,
}

#[ast_node("ImportDeclaration")]
#[derive(Eq, Hash)]
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
#[derive(Eq, Hash)]
pub struct ExportAll {
    pub span: Span,

    #[serde(rename = "source")]
    pub src: Str,
}

/// `export { foo } from 'mod'`
/// `export { foo as bar } from 'mod'`
#[ast_node("ExportNamedDeclaration")]
#[derive(Eq, Hash)]
pub struct NamedExport {
    pub span: Span,

    pub specifiers: Vec<ExportSpecifier>,

    #[serde(rename = "source")]
    pub src: Option<Str>,

    #[serde(rename = "typeOnly")]
    pub type_only: bool,
}

#[ast_node("ExportDefaultDeclaration")]
#[derive(Eq, Hash)]
pub struct ExportDefaultDecl {
    pub span: Span,

    pub decl: DefaultDecl,
}

#[ast_node]
#[derive(Eq, Hash)]
pub enum DefaultDecl {
    #[tag("ClassExpression")]
    Class(ClassExpr),

    #[tag("FunctionExpression")]
    Fn(FnExpr),

    #[tag("TsInterfaceDeclaration")]
    TsInterfaceDecl(TsInterfaceDecl),
}

#[ast_node]
#[derive(Eq, Hash)]
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
#[derive(Eq, Hash)]
pub struct ImportDefault {
    pub span: Span,

    pub local: Ident,
}
/// e.g. `import * as foo from 'mod.js'`.
#[ast_node("ImportNamespaceSpecifier")]
#[derive(Eq, Hash)]
pub struct ImportStarAs {
    pub span: Span,

    pub local: Ident,
}
/// e.g. local = foo, imported = None `import { foo } from 'mod.js'`
/// e.g. local = bar, imported = Some(foo) for `import { foo as bar } from
/// 'mod.js'`
#[ast_node("ImportSpecifier")]
#[derive(Eq, Hash)]
pub struct ImportSpecific {
    pub span: Span,

    pub local: Ident,

    #[serde(default)]
    pub imported: Option<Ident>,
}

#[ast_node]
#[derive(Eq, Hash)]
pub enum ExportSpecifier {
    #[tag("ExportNamespaceSpecifier")]
    Namespace(NamespaceExportSpecifier),

    #[tag("ExportDefaultSpecifier")]
    Default(DefaultExportSpecifier),

    #[tag("ExportSpecifier")]
    Named(NamedExportSpecifier),
}

/// `export * as foo from 'src';`
#[ast_node("ExportNamespaceSpecifier")]
#[derive(Eq, Hash)]
pub struct NamespaceExportSpecifier {
    pub span: Span,

    pub name: Ident,
}

#[ast_node("ExportDefaultSpecifier")]
#[derive(Eq, Hash)]
pub struct DefaultExportSpecifier {
    #[span]
    pub exported: Ident,
}

#[ast_node("ExportSpecifier")]
#[derive(Eq, Hash)]
pub struct NamedExportSpecifier {
    pub span: Span,
    /// `foo` in `export { foo as bar }`
    pub orig: Ident,
    /// `Some(bar)` in `export { foo as bar }`
    #[serde(default)]
    pub exported: Option<Ident>,
}
