use swc_common::{ast_node, Span};

use crate::{SelectorList, SimpleBlock};

#[ast_node("NestRule")]
pub struct NestRule {
    pub span: Span,
    pub prelude: SelectorList,
    pub block: SimpleBlock,
}
