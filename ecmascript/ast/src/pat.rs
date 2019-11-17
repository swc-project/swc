use crate::{expr::Expr, ident::Ident, prop::PropName, typescript::TsTypeAnn};
use swc_common::{ast_node, Span};

#[ast_node]
pub enum Pat {
    #[tag("Identifier")]
    Ident(Ident),

    #[tag("ArrayPattern")]
    Array(ArrayPat),

    #[tag("RestElement")]
    Rest(RestPat),

    #[tag("ObjectPattern")]
    Object(ObjectPat),

    #[tag("AssignmentPattern")]
    Assign(AssignPat),

    /// Only for for-in / for-of loops. This is *syntatically* valid.
    #[tag("*")]
    Expr(Box<Expr>),
}

#[ast_node("ArrayPattern")]
pub struct ArrayPat {
    pub span: Span,

    #[serde(rename = "elements")]
    pub elems: Vec<Option<Pat>>,

    #[serde(
        default,
        rename = "typeAnnotation",
        skip_serializing_if = "Option::is_none"
    )]
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node("ObjectPattern")]
pub struct ObjectPat {
    pub span: Span,

    #[serde(rename = "properties")]
    pub props: Vec<ObjectPatProp>,

    #[serde(
        default,
        rename = "typeAnnotation",
        skip_serializing_if = "Option::is_none"
    )]
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node("AssignmentPattern")]
pub struct AssignPat {
    pub span: Span,

    pub left: Box<Pat>,

    pub right: Box<Expr>,

    #[serde(
        default,
        rename = "typeAnnotation",
        skip_serializing_if = "Option::is_none"
    )]
    pub type_ann: Option<TsTypeAnn>,
}

/// EsTree `RestElement`
#[ast_node("RestElement")]
pub struct RestPat {
    #[serde(rename = "rest")]
    #[span(lo)]
    pub dot3_token: Span,

    #[serde(rename = "argument")]
    #[span(hi)]
    pub arg: Box<Pat>,

    #[serde(
        default,
        rename = "typeAnnotation",
        skip_serializing_if = "Option::is_none"
    )]
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node]
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
pub struct KeyValuePatProp {
    #[span(lo)]
    pub key: PropName,

    #[span(hi)]
    pub value: Box<Pat>,
}
/// `{key}` or `{key = value}`
#[ast_node("AssignmentPatternProperty")]
pub struct AssignPatProp {
    pub span: Span,
    pub key: Ident,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub value: Option<Box<Expr>>,
}
