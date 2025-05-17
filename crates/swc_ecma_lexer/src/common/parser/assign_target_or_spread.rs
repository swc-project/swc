use swc_common::ast_node;
use swc_ecma_ast::{ExprOrSpread, Pat};

#[ast_node]
pub enum AssignTargetOrSpread {
    #[tag("ExprOrSpread")]
    ExprOrSpread(ExprOrSpread),
    #[tag("*")]
    Pat(Pat),
}
