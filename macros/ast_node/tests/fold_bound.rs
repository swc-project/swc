//! Ensures that #[derive(Fold)] works with generic types.

#![feature(specialization)]

extern crate serde;
extern crate swc_common;
use std::fmt::Debug;
use swc_common::{AstNode, Fold};

pub trait Ast: Copy + Eq + Debug {
    type CustomExpr: AstNode;
}

#[derive(Fold)]
pub struct Stmt<A: Ast> {
    #[fold(bound)]
    pub expr: Expr<A>,
}

#[derive(Fold)]
pub struct Expr<A: Ast> {
    #[fold(bound)]
    pub node: ExprKind<A>,
}

#[derive(Fold)]
pub enum ExprKind<A: Ast> {
    Custom(#[fold(bound)] A::CustomExpr),
    /// Recursive
    Stmt(Box<Stmt<A>>),
}
