use is_macro::Is;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, DUMMY_SP};

use crate::{
    expr::Expr,
    ident::{BindingIdent, Ident},
    prop::PropName,
    typescript::TsTypeAnn,
    Id, Invalid,
};

#[ast_node(no_clone)]
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

// Implement Clone without inline to avoid multiple copies of the
// implementation.
impl Clone for Pat {
    fn clone(&self) -> Self {
        use Pat::*;
        match self {
            Ident(p) => Ident(p.clone()),
            Array(p) => Array(p.clone()),
            Rest(p) => Rest(p.clone()),
            Object(p) => Object(p.clone()),
            Assign(p) => Assign(p.clone()),
            Invalid(p) => Invalid(p.clone()),
            Expr(p) => Expr(p.clone()),
        }
    }
}

impl Take for Pat {
    fn dummy() -> Self {
        Pat::Invalid(Invalid { span: DUMMY_SP })
    }
}

bridge_pat_from!(BindingIdent, Ident);
bridge_pat_from!(BindingIdent, Id);

macro_rules! pat_to_other {
    ($T:ty) => {
        bridge_from!(crate::Param, crate::Pat, $T);
        bridge_from!(Box<crate::Pat>, crate::Pat, $T);
        bridge_from!(crate::PatOrExpr, crate::Pat, $T);
    };
}

pat_to_other!(BindingIdent);
pat_to_other!(ArrayPat);
pat_to_other!(ObjectPat);
pat_to_other!(AssignPat);
pat_to_other!(RestPat);

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
    pub type_ann: Option<Box<TsTypeAnn>>,
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
    pub type_ann: Option<Box<TsTypeAnn>>,
}

#[ast_node("AssignmentPattern")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignPat {
    pub span: Span,

    pub left: Box<Pat>,

    pub right: Box<Expr>,

    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<Box<TsTypeAnn>>,
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
    pub type_ann: Option<Box<TsTypeAnn>>,
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
