use swc_common::{ast_node, Span};

use crate::{DashedIdent, DeclarationBlockItem};

#[ast_node("PropertyRule")]
pub struct PropertyRule {
    pub span: Span,
    pub name: DashedIdent,
    pub block: Vec<DeclarationBlockItem>,
}
