use crate::{FnValue, Rule};
use swc_common::{ast_node, Span};

#[ast_node("DocumentRule")]
pub struct DocumentRule {
    pub span: Span,
    pub selectors: Vec<FnValue>,
    pub block: Vec<Rule>,
}
