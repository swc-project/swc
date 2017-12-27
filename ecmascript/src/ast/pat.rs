use super::{Expr, Ident};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub struct Pat {
    pub span: Span,
    pub node: PatKind,
}

#[ast_node]
pub enum PatKind {
    Ident(Ident),

    #[serde = "ArrayPattern"]
    Array(
        #[serde = "elements"]
        Vec<Option<Pat>>,
    ),

    #[serde = "RestElement"]
    Rest(
        #[serde = "argument"]
        Box<Pat>,
    ),

    #[serde = "AssignmentPattern"]
    Assign {
        left: Box<Pat>,
        right: Box<Expr>,
    },
}
