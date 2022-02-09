use swc_common::{ast_node, Span};

use crate::{DashedIdent, DeclarationBlockItem, Ident};

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
    pub block: Vec<DeclarationBlockItem>,
}
