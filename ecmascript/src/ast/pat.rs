use super::{Expr, Ident};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub struct Pat {
    pub span: Span,
    pub node: PatKind,
}

#[ast_node]
#[fold(skip_bounds(Pat, Expr))]
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
    Object {
        props: Vec<AssignProp>,
    },

    #[serde = "AssignmentPattern"]
    Assign {
        left: Box<Pat>,
        right: Box<Expr>,
    },
}

#[ast_node]
pub struct AssignProp {
    pub value: Box<Pat>,
    pub method: bool,
}

impl From<Ident> for Pat {
    fn from(id: Ident) -> Self {
        Pat {
            span: id.span,
            node: PatKind::Ident(id),
        }
    }
}
