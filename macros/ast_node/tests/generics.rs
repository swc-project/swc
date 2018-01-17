//! Ensures that #[derive(AstNode)] works with generic types.

#![feature(specialization, proc_macro)]

extern crate swc_common;
extern crate swc_macros;
use std::fmt::Debug;
use swc_common::AstNode;
use swc_macros::ast_node;

pub trait Ast: Copy + Eq + Debug {
    type CustomExpr: AstNode;
}

#[ast_node]
pub struct Stmt<A: Ast> {
    #[fold(bound)]
    pub expr: Expr<A>,
}

#[ast_node]
pub struct Expr<A: Ast> {
    #[fold(bound)]
    pub node: ExprKind<A>,
}

#[ast_node]
pub enum ExprKind<A: Ast> {
    Custom(#[fold(bound)] A::CustomExpr),
    /// Recursive
    Stmt(Box<Stmt<A>>),
}
