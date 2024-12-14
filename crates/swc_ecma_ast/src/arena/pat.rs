use is_macro::Is;
use swc_allocator::arena::{Box, Vec};
use swc_common::{
    arena::{ast_node, CloneIn},
    arena::Take,
    EqIgnoreSpan, Span, DUMMY_SP,
};

use super::{
    expr::Expr,
    ident::{BindingIdent, Ident},
    prop::PropName,
    typescript::TsTypeAnn,
    Id, IdentName, Invalid,
};

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Pat<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, BindingIdent<'a>>),

    // #[tag("ArrayPattern")]
    Array(Box<'a, ArrayPat<'a>>),

    // #[tag("RestElement")]
    Rest(Box<'a, RestPat<'a>>),

    // #[tag("ObjectPattern")]
    Object(Box<'a, ObjectPat<'a>>),

    // #[tag("AssignmentPattern")]
    Assign(Box<'a, AssignPat<'a>>),

    // #[tag("Invalid")]
    Invalid(Box<'a, Invalid>),

    /// Only for for-in / for-of loops. This is *syntactically* valid.
    // #[tag("*")]
    Expr(Expr<'a>),
}

// Implement Clone without inline to avoid multiple copies of the
// implementation.
// impl Clone for Pat {
//     fn clone(&self) -> Self {
//         use Pat::*;
//         match self {
//             Ident(p) => Ident(p.clone()),
//             Array(p) => Array(p.clone()),
//             Rest(p) => Rest(p.clone()),
//             Object(p) => Object(p.clone()),
//             Assign(p) => Assign(p.clone()),
//             Invalid(p) => Invalid(p.clone()),
//             Expr(p) => Expr(p.clone()),
//         }
//     }
// }

// impl Default for Pat {
//     fn default() -> Self {
//         Invalid { span: DUMMY_SP }.into()
//     }
// }
// impl Take for Pat {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

// macro_rules! bridge_pat_from {
//     ($bridge:ty, $src:ty) => {
//         bridge_from!(Box<'a, $bridge>, $bridge, $src);
//         bridge_from!(Pat<'a>, Box<'a, $bridge>, $src);
//         bridge_from!(crate::Param<'a>, crate::Pat<'a>, $src);
//         bridge_from!(Box<'a, Pat<'a>>, crate::Pat<'a>, $src);
//     };
// }

// bridge_pat_from!(BindingIdent<'a>, Ident);
// bridge_pat_from!(BindingIdent<'a>, IdentName);
// bridge_pat_from!(BindingIdent<'a>, Id);

// macro_rules! pat_to_other {
//     ($T:ty) => {
//         bridge_from!(Pat<'a>, Box<'a, $T>, $T);
//         bridge_from!(crate::Param<'a>, Pat<'a>, $T);
//         bridge_from!(Box<'a, Pat<'a>>, Pat<'a>, $T);
//     };
// }

// pat_to_other!(BindingIdent<'a>);
// pat_to_other!(ArrayPat<'a>);
// pat_to_other!(ObjectPat<'a>);
// pat_to_other!(AssignPat<'a>);
// pat_to_other!(RestPat<'a>);
// pat_to_other!(Box<'a, Expr<'a>>);

#[ast_node("ArrayPattern")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ArrayPat<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "elements"))]
    pub elems: Vec<'a, Option<Pat<'a>>>,

    /// Only in an ambient context
    #[cfg_attr(feature = "serde-impl", serde(rename = "optional"))]
    pub optional: bool,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
}

#[ast_node("ObjectPattern")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ObjectPat<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "properties"))]
    pub props: Vec<'a, ObjectPatProp<'a>>,

    /// Only in an ambient context
    #[cfg_attr(feature = "serde-impl", serde(rename = "optional"))]
    pub optional: bool,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
}

#[ast_node("AssignmentPattern")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignPat<'a> {
    pub span: Span,

    pub left: Pat<'a>,

    pub right: Expr<'a>,
}

/// EsTree `RestElement`
#[ast_node("RestElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct RestPat<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "rest"))]
    pub dot3_token: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "argument"))]
    pub arg: Pat<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ObjectPatProp<'a> {
    // #[tag("KeyValuePatternProperty")]
    KeyValue(Box<'a, KeyValuePatProp<'a>>),

    // #[tag("AssignmentPatternProperty")]
    Assign(Box<'a, AssignPatProp<'a>>),

    // #[tag("RestElement")]
    Rest(Box<'a, RestPat<'a>>),
}

/// `{key: value}`
#[ast_node("KeyValuePatternProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct KeyValuePatProp<'a> {
    #[span(lo)]
    pub key: PropName<'a>,

    #[span(hi)]
    pub value: Pat<'a>,
}
/// `{key}` or `{key = value}`
#[ast_node("AssignmentPatternProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignPatProp<'a> {
    pub span: Span,
    /// Note: This type is to help implementing visitor and the field `type_ann`
    /// is always [None].
    pub key: BindingIdent<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub value: Option<Expr<'a>>,
}
