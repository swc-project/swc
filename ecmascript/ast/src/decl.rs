use super::{
    Class, Expr, Function, Ident, Pat, TsEnumDecl, TsInterfaceDecl, TsModuleDecl, TsTypeAliasDecl,
};
use swc_common::{ast_node, Fold, Span};

#[ast_node]
pub enum Decl {
    Class(ClassDecl),
    Fn(FnDecl),
    Var(VarDecl),
    TsInterfaceDecl(TsInterfaceDecl),
    TsTypeAliasDecl(TsTypeAliasDecl),
    TsEnumDecl(TsEnumDecl),
    TsModuleDecl(TsModuleDecl),
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

    /// Typescript onpy
    pub definite: bool,
}
