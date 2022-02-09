use swc_common::{ast_node, Span};

use crate::{Function, Rule, Url};

#[ast_node("DocumentRule")]
pub struct DocumentRule {
    pub span: Span,
    pub matching_functions: Vec<DocumentRuleMatchingFunction>,
    pub block: Vec<Rule>,
}

#[ast_node]
pub enum DocumentRuleMatchingFunction {
    #[tag("Url")]
    Url(Url),
    #[tag("Function")]
    Function(Function),
}
