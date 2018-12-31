use crate::{class::Decorator, pat::Pat, stmt::BlockStmt, typescript::TsParamProp};
use swc_common::{ast_node, Span};

/// Common parts of function and method.
#[ast_node]
pub struct Function<Body = BlockStmt> {
    pub params: Vec<PatOrTsParamProp>,

    pub decorators: Vec<Decorator>,
    pub span: Span,

    #[fold(bound)]
    pub body: Body,

    /// if it's a generator.
    pub is_generator: bool,

    /// if it's an async function.
    pub is_async: bool,
}

#[ast_node]
pub enum PatOrTsParamProp {
    Pat(Pat),
    TsParamProp(TsParamProp),
}
