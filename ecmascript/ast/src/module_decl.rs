use super::{Class, Decl, Expr, Function, Ident, Lit, VarDecl};
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
        specifiers: Vec<ImportSpecifier>,
        #[serde = "source"]
        src: String,
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
        ExportDefaultDecl,
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
pub enum ExportDefaultDecl {
    Class {
        ident: Option<Ident>,
        class: Class,
    },

    #[serde = "FunctionDeclaration"]
    Fn {
        ident: Option<Ident>,
        function: Function,
    },

    Var(VarDecl),
}

#[ast_node]
pub struct ImportSpecifier {
    pub span: Span,
    pub local: Ident,
    pub node: ImportSpecifierKind,
}

#[ast_node]
pub enum ImportSpecifierKind {
    /// e.g. local = foo, imported = None `import { foo } from 'mod.js'`
    /// e.g. local = bar, imported = Some(foo) for `import { foo as bar } from 'mod.js'`
    #[serde = "ImportSpecifier"]
    Specific { imported: Option<Ident> },
    /// e.g. `import foo from 'mod.js'`
    #[serde = "ImportDefaultSpecifier"]
    Default,
    /// e.g. `import * as foo from 'mod.js'`.
    #[serde = "ImportNamespaceSpecifier"]
    Namespace,
}

#[ast_node]
pub struct ExportSpecifier {
    /// `foo` in `export { foo as bar }`
    pub local: Ident,
    /// `bar` in `export { foo as bar }`
    pub exported: Ident,
}
