use super::{BlockStmt, Pat};
use swc_macros::ast_node;

/// Common parts of function and method.
#[ast_node]
pub struct Function {
    pub params: Vec<Pat>,

    pub body: BlockStmt,

    #[caniuse = "es6-generators"]
    #[serde = "generator"]
    pub is_generator: bool,

    #[caniuse = "async-functions"]
    #[serde = "async"]
    pub is_async: bool,
}
