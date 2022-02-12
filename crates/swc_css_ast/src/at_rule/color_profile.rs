use swc_common::{ast_node, Span};

use crate::{DashedIdent, Ident, SimpleBlock};

#[ast_node]
pub enum ColorProfileName {
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("ColorProfileRule")]
pub struct ColorProfileRule {
    pub span: Span,
    pub name: ColorProfileName,
    pub block: SimpleBlock,
}
