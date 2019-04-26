use crate::{
    class::Decorator,
    pat::Pat,
    stmt::BlockStmt,
    typescript::{TsParamProp, TsTypeAnn, TsTypeParamDecl},
};
use swc_common::{ast_node, Span};

/// Common parts of function and method.
#[ast_node]
pub struct Function {
    pub params: Vec<Pat>,

    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub decorators: Vec<Decorator>,

    pub span: Span,

    #[serde(default)]
    pub body: Option<BlockStmt>,

    /// if it's a generator.
    #[serde(default, rename = "generator")]
    pub is_generator: bool,

    /// if it's an async function.
    #[serde(default, rename = "async")]
    pub is_async: bool,

    #[serde(
        default,
        rename = "typeParameters",
        skip_serializing_if = "Option::is_none"
    )]
    pub type_params: Option<TsTypeParamDecl>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub return_type: Option<TsTypeAnn>,
}

#[ast_node]
pub enum PatOrTsParamProp {
    #[tag("TsParameterProperty")]
    TsParamProp(TsParamProp),
    #[tag("*")]
    Pat(Pat),
}
