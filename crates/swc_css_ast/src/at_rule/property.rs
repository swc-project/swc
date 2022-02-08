use crate::{DashedIdent, DeclarationBlockItem};
use swc_common::{ast_node, Span};

#[ast_node("PropertyRule")]
pub struct PropertyRule {
    pub span: Span,
    pub name: DashedIdent,
    pub block: Vec<DeclarationBlockItem>,
}
