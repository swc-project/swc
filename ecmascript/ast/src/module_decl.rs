use super::{Class, Decl, Expr, Function, Ident, VarDecl};
use swc_common::{Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
pub struct ModuleDecl {
    pub span: Span,

    pub node: ModuleDeclKind,
}

#[ast_node]
pub enum ModuleDeclKind {
    Import {
        specifiers: Vec<ImportSpecifier>,

        src: String,
    },
    ExportDecl(Decl),
    /// `export { foo } from 'mod'`
    /// `export { foo as bar } from 'mod'`
    ExportNamed {
        specifiers: Vec<ExportSpecifier>,

        src: Option<String>,
    },

    ExportDefaultDecl(ExportDefaultDecl),

    ExportDefaultExpr(Box<Expr>),
    /// `export * from 'mod'`
    ExportAll {
        src: String,
    },
}

#[ast_node]
pub enum ExportDefaultDecl {
    Class {
        ident: Option<Ident>,

        class: Class,
    },

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
    Specific { imported: Option<Ident> },
    /// e.g. `import foo from 'mod.js'`
    Default,
    /// e.g. `import * as foo from 'mod.js'`.
    Namespace,
}

#[ast_node]
pub struct ExportSpecifier {
    /// `foo` in `export { foo as bar }`
    pub orig: Ident,
    /// `Some(bar)` in `export { foo as bar }`
    pub exported: Option<Ident>,
}

impl Spanned<ModuleDeclKind> for ModuleDecl {
    fn from_unspanned(node: ModuleDeclKind, span: Span) -> Self {
        ModuleDecl { span, node }
    }
}
