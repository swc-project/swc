use swc_common::{ast_node, Span};

use crate::{CustomIdent, SimpleBlock};

#[ast_node("CounterStyleRule")]
pub struct CounterStyleRule {
    pub span: Span,
    pub name: CustomIdent,
    pub block: SimpleBlock,
}
