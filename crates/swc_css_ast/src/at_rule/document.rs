use swc_common::{ast_node, Span};

use crate::{Function, SimpleBlock, Url};

#[ast_node("DocumentRule")]
pub struct DocumentRule {
    pub span: Span,
    pub matching_functions: Vec<DocumentRuleMatchingFunction>,
    pub block: SimpleBlock,
}

#[ast_node]
pub enum DocumentRuleMatchingFunction {
    #[tag("Url")]
    Url(Url),
    #[tag("Function")]
    Function(Function),
}
