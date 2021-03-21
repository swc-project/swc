use crate::{
    expr::Expr,
    function::Function,
    ident::Ident,
    lit::{BigInt, Number, Str},
    pat::Pat,
    stmt::BlockStmt,
    typescript::TsTypeAnn,
};
use is_macro::Is;
use swc_common::EqIgnoreSpan;
use swc_common::{ast_node, Span};

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
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
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct KeyValueProp {
    #[span(lo)]
    pub key: PropName,

    #[span(hi)]
    pub value: Box<Expr>,
}

#[ast_node("AssignmentProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignProp {
    #[span(lo)]
    pub key: Ident,
    #[span(hi)]
    pub value: Box<Expr>,
}

#[ast_node("GetterProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct GetterProp {
    pub span: Span,
    pub key: PropName,
    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
    #[serde(default)]
    pub body: Option<BlockStmt>,
}
#[ast_node("SetterProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SetterProp {
    pub span: Span,
    pub key: PropName,
    pub param: Pat,
    #[serde(default)]
    pub body: Option<BlockStmt>,
}
#[ast_node("MethodProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct MethodProp {
    pub key: PropName,

    #[serde(flatten)]
    #[span]
    pub function: Function,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
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
    #[tag("BigInt")]
    BigInt(BigInt),
}

#[ast_node("Computed")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ComputedPropName {
    /// Span including `[` and `]`.
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}
