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
    #[tag("Identifier")]
    Shorthand(Ident),

    /// `key: value` in `{ key: value, }`
    #[tag("KeyValueProperty")]
    KeyValue(KeyValueProp),

    /// This is **invalid** for object literal.
    #[tag("AssignmentProperty")]
    Assign(AssignProp),

    #[tag("GetterProperty")]
    Getter(GetterProp),

    #[tag("SetterProperty")]
    Setter(SetterProp),

    #[tag("MethodProperty")]
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
    pub span: Span,
    pub key: PropName,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub body: Option<BlockStmt>,
}
#[ast_node("SetterProperty")]
pub struct SetterProp {
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
    #[tag("Identifier")]
    Ident(Ident),
    /// String literal.
    #[tag("StringLiteral")]
    Str(Str),
    /// Numeric literal.
    #[tag("NumericLiteral")]
    Num(Number),
    #[tag("Computed")]
    Computed(ComputedPropName),
}

#[ast_node("Computed")]
pub struct ComputedPropName {
    /// Span including `[` and `]`.
    pub span: Span,
    pub expr: Box<Expr>,
}
