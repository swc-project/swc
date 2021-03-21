use crate::ident::BindingIdent;
use crate::{expr::Expr, ident::Ident, prop::PropName, typescript::TsTypeAnn, Invalid};
use is_macro::Is;
use swc_common::EqIgnoreSpan;
use swc_common::{ast_node, Span};

impl From<Ident> for Pat {
    fn from(i: Ident) -> Self {
        BindingIdent::from(i).into()
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Pat {
    #[tag("Identifier")]
    Ident(BindingIdent),

    #[tag("ArrayPattern")]
    Array(ArrayPat),

    #[tag("RestElement")]
    Rest(RestPat),

    #[tag("ObjectPattern")]
    Object(ObjectPat),

    #[tag("AssignmentPattern")]
    Assign(AssignPat),

    #[tag("Invalid")]
    Invalid(Invalid),

    /// Only for for-in / for-of loops. This is *syntactically* valid.
    #[tag("*")]
    Expr(Box<Expr>),
}

#[ast_node("ArrayPattern")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ArrayPat {
    pub span: Span,

    #[serde(rename = "elements")]
    pub elems: Vec<Option<Pat>>,

    /// Only in an ambient context
    #[serde(rename = "optional")]
    pub optional: bool,

    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node("ObjectPattern")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ObjectPat {
    pub span: Span,

    #[serde(rename = "properties")]
    pub props: Vec<ObjectPatProp>,

    /// Only in an ambient context
    #[serde(rename = "optional")]
    pub optional: bool,

    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node("AssignmentPattern")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignPat {
    pub span: Span,

    pub left: Box<Pat>,

    pub right: Box<Expr>,

    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
}

/// EsTree `RestElement`
#[ast_node("RestElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct RestPat {
    pub span: Span,

    #[serde(rename = "rest")]
    pub dot3_token: Span,

    #[serde(rename = "argument")]
    pub arg: Box<Pat>,

    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ObjectPatProp {
    #[tag("KeyValuePatternProperty")]
    KeyValue(KeyValuePatProp),

    #[tag("AssignmentPatternProperty")]
    Assign(AssignPatProp),

    #[tag("RestElement")]
    Rest(RestPat),
}

/// `{key: value}`
#[ast_node("KeyValuePatternProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct KeyValuePatProp {
    #[span(lo)]
    pub key: PropName,

    #[span(hi)]
    pub value: Box<Pat>,
}
/// `{key}` or `{key = value}`
#[ast_node("AssignmentPatternProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignPatProp {
    pub span: Span,
    pub key: Ident,

    #[serde(default)]
    pub value: Option<Box<Expr>>,
}
