use crate::{expr::Expr, ident::Ident, prop::PropName, typescript::TsTypeAnn};
use swc_common::{ast_node, Span};

#[ast_node]
pub enum Pat {
    Ident(Ident),

    Array(ArrayPat),

    Rest(RestPat),

    Object(ObjectPat),

    Assign(AssignPat),

    /// Only for for-in / for-of loops. This is *syntatically* valid.
    Expr(Box<Expr>),
}

#[ast_node]
pub struct ArrayPat {
    pub span: Span,
    pub elems: Vec<(Option<Pat>)>,
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node]
pub struct ObjectPat {
    pub span: Span,
    pub props: Vec<ObjectPatProp>,
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node]
pub struct AssignPat {
    pub span: Span,
    pub left: Box<Pat>,
    pub right: Box<Expr>,
    pub type_ann: Option<TsTypeAnn>,
}

/// EsTree `RestElement`
#[ast_node]
pub struct RestPat {
    #[span(lo)]
    pub dot3_token: Span,
    #[span(hi)]
    pub arg: Box<Pat>,
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node]
pub enum ObjectPatProp {
    KeyValue(KeyValuePatProp),
    Assign(AssignPatProp),
    Rest(RestPat),
}

/// `{key: value}`
#[ast_node]
pub struct KeyValuePatProp {
    #[span(lo)]
    pub key: PropName,
    #[span(hi)]
    pub value: Box<Pat>,
}
/// `{key}` or `{key = value}`
#[ast_node]
pub struct AssignPatProp {
    pub span: Span,
    pub key: Ident,

    pub value: Option<(Box<Expr>)>,
}
