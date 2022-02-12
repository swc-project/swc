use swc_common::{ast_node, Span};

use crate::{Ident, SimpleBlock};

#[ast_node("PageRule")]
pub struct PageRule {
    pub span: Span,
    pub prelude: Option<PageSelectorList>,
    pub block: SimpleBlock,
}

#[ast_node("PageSelectorList")]
pub struct PageSelectorList {
    pub span: Span,
    pub selectors: Vec<PageSelector>,
}

#[ast_node("PageSelector")]
pub struct PageSelector {
    pub span: Span,
    pub page_type: Option<PageSelectorType>,
    pub pseudos: Option<Vec<PageSelectorPseudo>>,
}

#[ast_node("PageSelectorType")]
pub struct PageSelectorType {
    pub span: Span,
    pub value: Ident,
}

#[ast_node("PageSelectorPseudo")]
pub struct PageSelectorPseudo {
    pub span: Span,
    pub value: Ident,
}

#[ast_node("PageMarginRule")]
pub struct PageMarginRule {
    pub span: Span,
    pub name: Ident,
    pub block: SimpleBlock,
}
