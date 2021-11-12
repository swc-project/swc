use crate::{Declaration, Ident, SelectorList};
use swc_common::{ast_node, Span};

#[ast_node("PageRule")]
pub struct PageRule {
    pub span: Span,

    pub prelude: Vec<PageSelector>,

    pub block: PageRuleBlock,
}

#[ast_node]
pub struct PageSelector {
    pub span: Span,

    pub ident: Option<Ident>,

    pub pseudo: Option<Ident>,
}

#[ast_node]
pub struct PageRuleBlock {
    pub span: Span,
    pub items: Vec<PageRuleBlockItem>,
}

#[ast_node]
pub enum PageRuleBlockItem {
    #[tag("DeclBlock")]
    Declaration(Box<Declaration>),

    #[tag("NestedPageRule")]
    Nested(Box<NestedPageRule>),
}

#[ast_node("NestedPageRule")]
pub struct NestedPageRule {
    pub span: Span,
    pub prelude: SelectorList,
    pub block: PageRuleBlock,
}
