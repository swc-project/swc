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
    pub params: Vec<PatOrTsParamProp>,

    pub decorators: Vec<Decorator>,
    pub span: Span,

    pub body: Option<BlockStmt>,

    /// if it's a generator.
    pub is_generator: bool,

    /// if it's an async function.
    pub is_async: bool,
    pub type_params: Option<TsTypeParamDecl>,
    pub return_type: Option<TsTypeAnn>,
}

#[ast_node]
pub enum PatOrTsParamProp {
    Pat(Pat),
    TsParamProp(TsParamProp),
}
