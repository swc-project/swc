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
    TsImportEqualsDecl(TsImportEqualsDecl),
    TsExportAssignment(TsExportAssignment),
    TsNamespaceExportDecl(TsNamespaceExportDecl),
}

#[ast_node]
pub struct ImportDecl {
    pub span: Span,
    pub specifiers: Vec<ImportSpecifier>,

    pub src: Str,
}

/// `export * from 'mod'`
#[ast_node]
pub struct ExportAll {
    pub span: Span,
    pub src: Str,
}

/// `export { foo } from 'mod'`
/// `export { foo as bar } from 'mod'`
#[ast_node]
pub struct NamedExport {
    pub span: Span,
    pub specifiers: Vec<ExportSpecifier>,

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
#[ast_node]
pub struct ImportDefault {
    pub span: Span,
    pub local: Ident,
}
/// e.g. `import * as foo from 'mod.js'`.
#[ast_node]
pub struct ImportStarAs {
    pub span: Span,
    pub local: Ident,
}
/// e.g. local = foo, imported = None `import { foo } from 'mod.js'`
/// e.g. local = bar, imported = Some(foo) for `import { foo as bar } from
/// 'mod.js'`
#[ast_node]
pub struct ImportSpecific {
    pub span: Span,
    pub local: Ident,
    pub imported: Option<Ident>,
}

#[ast_node]
pub enum ExportSpecifier {
    Default(Ident),
    Named(NamedExportSpecifier),
}

#[ast_node]
pub struct NamedExportSpecifier {
    pub span: Span,
    /// `foo` in `export { foo as bar }`
    pub orig: Ident,
    /// `Some(bar)` in `export { foo as bar }`
    pub exported: Option<Ident>,
}
