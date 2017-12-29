use super::{Decl, Expr, Ident, Lit};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub struct ModuleDecl {
    pub span: Span,
    pub node: ModuleDeclKind,
}

#[ast_node]
pub enum ModuleDeclKind {
    #[serde = "ImportDeclaration"]
    Import {
        specifiers: Vec<ImportDeclSpecifier>,
        #[serde = "source"]
        src: Lit,
    },
    ExportDecl(Decl),
    /// `export { foo } from 'mod'`
    /// `export { foo as bar } from 'mod'`
    #[serde = "ExportNamedDeclaration"]
    ExportNamed {
        specifiers: Vec<ExportSpecifier>,
        #[serde = "source"]
        src: Option<Lit>,
    },
    #[serde = "ExportDefaultDeclaration"]
    ExportDefaultDecl(
        #[serde = "declaration"]
        Decl,
    ),
    #[serde = "ExportDefaultDeclaration"]
    ExportDefaultExpr(
        #[serde = "declaration"]
        Expr,
    ),
    /// `export * from 'mod'`
    #[serde = "ExportAllDeclaration"]
    ExportAll {
        #[serde = "source"]
        src: Lit,
    },
}

#[ast_node]
pub struct ImportDeclSpecifier {
    pub span: Span,
    pub local: Ident,
    pub node: ImportDeclSpecifierKind,
}

#[ast_node]
pub enum ImportDeclSpecifierKind {
    /// e.g. `import { foo } from 'mod.js'`
    /// e.g. `import { foo as bar } from 'mod.js'`
    /// -> local = bar, imported = foo
    #[serde = "ImportSpecifier"]
    Specific { imported: Ident },
    /// e.g. `import foo from 'mod.js'`
    #[serde = "ImportDefaultSpecifier"]
    Default,
    /// e.g. `* as foo` in `import * as foo from 'mod.js'`.
    #[serde = "ImportNamespaceSpecifier"]
    Namespace { from: Lit },
}

#[ast_node]
pub struct ExportSpecifier {
    /// `foo` in `export { foo as bar }`
    pub local: Ident,
    /// `bar` in `export { foo as bar }`
    pub exported: Ident,
}
