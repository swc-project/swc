use super::{Class, Expr, Function, Ident, Pat};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub enum Decl {
    Class(ClassDecl),
    Fn(FnDecl),
    Var(VarDecl),
}

#[ast_node]
pub struct FnDecl {
    pub ident: Ident,
    #[span]
    pub function: Function,
}

#[ast_node]
pub struct ClassDecl {
    pub ident: Ident,
    #[span]
    pub class: Class,
}

#[ast_node]
pub struct VarDecl {
    pub span: Span,
    pub kind: VarDeclKind,

    pub decls: Vec<VarDeclarator>,
}

#[derive(Fold, StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
pub enum VarDeclKind {
    /// `var`
    Var,
    /// `let`
    Let,
    /// `const`
    Const,
}

#[ast_node]
pub struct VarDeclarator {
    pub span: Span,

    pub name: Pat,
    /// Initialization expresion.
    pub init: Option<(Box<Expr>)>,
}
