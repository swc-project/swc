use crate::{
    expr::Expr,
    function::Function,
    ident::Ident,
    lit::{Number, Str},
    pat::Pat,
    stmt::BlockStmt,
};
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

#[ast_node("KeyValueProperty")]
pub struct KeyValueProp {
    #[span(lo)]
    pub key: PropName,

    #[span(hi)]
    pub value: Box<Expr>,
}

#[ast_node("AssignmentProperty")]
pub struct AssignProp {
    #[span(lo)]
    pub key: Ident,
    #[span(hi)]
    pub value: Box<Expr>,
}
#[ast_node("GetterProperty")]
pub struct GetterProp {
    #[serde(default)]
    pub span: Span,
    pub key: PropName,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub body: Option<BlockStmt>,
}
#[ast_node("SetterProperty")]
pub struct SetterProp {
    #[serde(default)]
    pub span: Span,
    pub key: PropName,
    pub param: Pat,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub body: Option<BlockStmt>,
}
#[ast_node("MethodProperty")]
pub struct MethodProp {
    #[span(lo)]
    pub key: PropName,

    #[serde(flatten)]
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
