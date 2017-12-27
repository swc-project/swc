use super::{BlockStmt, Pat};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
#[fold = "fn"]
pub struct JsFn {
    pub span: Span,

    pub params: Vec<Pat>,

    pub body: BlockStmt,

    #[caniuse = "es6-generators"]
    #[serde = "generator"]
    pub is_generator: bool,

    #[caniuse = "async-functions"]
    #[serde = "async"]
    pub is_async: bool,
}
