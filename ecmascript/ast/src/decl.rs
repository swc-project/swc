use super::{Class, Expr, Function, Ident, Pat};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub enum Decl {
    Class(ClassDecl),

    Fn { ident: Ident, function: Function },

    Var(VarDecl),
}

impl Decl {
    pub fn span(&self) -> Span {
        match *self {
            Decl::Class(ClassDecl {
                class: Class { span, .. },
                ..
            })
            | Decl::Fn {
                function: Function { span, .. },
                ..
            }
            | Decl::Var(VarDecl { span, .. }) => span,
        }
    }
}

#[ast_node]
pub struct ClassDecl {
    pub ident: Ident,

    pub class: Class,
}

#[ast_node]
pub struct VarDecl {
    pub span: Span,
    pub kind: VarDeclKind,

    pub decls: Vec<VarDeclarator>,
}

#[ast_node]
pub enum VarDeclKind {
    Var,
    Let,
    Const,
}

#[ast_node]
pub struct VarDeclarator {
    pub span: Span,

    pub name: Pat,
    /// Initialization expresion.
    pub init: Option<Box<Expr>>,
}
