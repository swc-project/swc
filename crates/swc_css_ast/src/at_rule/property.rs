use swc_common::{ast_node, Span};

use crate::{DashedIdent, SimpleBlock};

#[ast_node("PropertyRule")]
pub struct PropertyRule {
    pub span: Span,
    pub name: DashedIdent,
    pub block: SimpleBlock,
}
