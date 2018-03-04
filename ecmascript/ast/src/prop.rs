use super::{BlockStmt, Expr, Function, Ident, Number, Pat, Str};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub enum Prop {
    /// `a` in `{ a, }`
    Shorthand(Ident),

    /// `key: value` in `{ key: value, }`
    KeyValue(KeyValueProp),
    /// This is **invalid** for object literal.
    Assign(AssignProp),
    Getter(GetterProp),
    Setter(SetterProp),
    Method(MethodProp),
}

#[ast_node]
pub struct KeyValueProp {
    #[span(lo)]
    pub key: PropName,

    #[span(hi)]
    pub value: Box<Expr>,
}

#[ast_node]
pub struct AssignProp {
    #[span(lo)]
    key: Ident,
    #[span(hi)]
    value: Box<Expr>,
}
#[ast_node]
pub struct GetterProp {
    span: Span,
    key: PropName,
    body: BlockStmt,
}
#[ast_node]
pub struct SetterProp {
    span: Span,
    key: PropName,
    param: Pat,
    body: BlockStmt,
}
#[ast_node]
pub struct MethodProp {
    #[span(lo)]
    key: PropName,
    #[span(hi)]
    function: Function,
}

#[ast_node]
pub enum PropName {
    Ident(Ident),
    /// String literal.
    Str(Str),
    /// Numeric literal.
    Num(Number),
    Computed(Box<Expr>),
}
