use super::{Class, Expr, Function, Ident, Pat};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub enum Decl {
    Class(ClassDecl),

    #[serde = "FunctionDeclaration"]
    Fn {
        ident: Ident,
        function: Function,
    },

    #[serde = "VariableDeclaration"]
    Var(VarDecl),
}

#[ast_node]
pub struct ClassDecl {
    pub ident: Ident,
    pub class: Class,
}

#[ast_node]
pub struct VarDecl {
    pub kind: VarDeclKind,
    #[serde = "declarations"]
    pub decls: Vec<VarDeclarator>,
}

#[ast_node]
pub enum VarDeclKind {
    Var,
    #[caniuse = "let"]
    Let,
    #[caniuse = "const"]
    Const,
}

#[ast_node]
pub struct VarDeclarator {
    pub span: Span,
    #[serde = "id"]
    pub name: Pat,
    /// Initialization expresion.
    pub init: Option<Box<Expr>>,
}
