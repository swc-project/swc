use swc_common::{ast_node, Span};

use crate::{Ident, SimpleBlock};

#[ast_node("LayerName")]
pub struct LayerName {
    pub span: Span,
    pub name: Vec<Ident>,
}

#[ast_node("LayerNameList")]
pub struct LayerNameList {
    pub span: Span,
    pub name_list: Vec<LayerName>,
}

#[ast_node]
pub enum LayerPrelude {
    #[tag("LayerName")]
    Name(LayerName),
    #[tag("LayerNameList")]
    NameList(LayerNameList),
}

#[ast_node("LayerRule")]
pub struct LayerRule {
    pub span: Span,
    pub prelude: Option<LayerPrelude>,
    pub block: Option<SimpleBlock>,
}
