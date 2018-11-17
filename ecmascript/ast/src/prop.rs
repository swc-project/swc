use super::{BlockStmt, Expr, Function, Ident, Number, Pat, Str};
use swc_common::{ast_node, Span};

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
    pub key: Ident,
    #[span(hi)]
    pub value: Box<Expr>,
}
#[ast_node]
pub struct GetterProp {
    pub span: Span,
    pub key: PropName,
    pub body: BlockStmt,
}
#[ast_node]
pub struct SetterProp {
    pub span: Span,
    pub key: PropName,
    pub param: Pat,
    pub body: BlockStmt,
}
#[ast_node]
pub struct MethodProp {
    #[span(lo)]
    pub key: PropName,
    #[span(hi)]
    pub function: Function,
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
