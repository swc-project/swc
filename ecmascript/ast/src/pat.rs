use super::{Expr, Ident, PropName};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub enum Pat {
    Ident(Ident),

    Array(ArrayPat),

    Rest(Box<Pat>),

    Object(Vec<ObjectPatProp>),

    Assign(AssignPat),

    /// Only for for-in / for-of loops. This is *syntatically* valid.
    Expr(Box<Expr>),
}

#[ast_node]
pub struct ArrayPat {
    pub span: Span,
    pub elems: Vec<(Option<Pat>)>,
}

#[ast_node]
pub struct AssignPat {
    pub span: Span,
    pub left: Box<Pat>,
    pub right: Box<Expr>,
}

#[ast_node]
pub enum ObjectPatProp {
    KeyValue(KeyValuePatProp),
    Assign(AssignPatProp),
}

/// `{key: value}`
#[ast_node]
pub struct KeyValuePatProp {
    pub key: PropName,
    pub value: Box<Pat>,
}
/// `{key}` or `{key = value}`
#[ast_node]
pub struct AssignPatProp {
    pub key: Ident,

    pub value: Option<(Box<Expr>)>,
}
