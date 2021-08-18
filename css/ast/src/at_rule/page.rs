use swc_common::{ast_node, Span};

use crate::{DeclBlock, Text};

#[ast_node("PageRule")]
pub struct PageRule {
    pub span: Span,

    pub prelude: Vec<PageSelector>,

    pub block: DeclBlock,
}

#[ast_node]
pub struct PageSelector {
    pub span: Span,

    pub ident: Option<Text>,

    pub pseudo: Option<Text>,
}
