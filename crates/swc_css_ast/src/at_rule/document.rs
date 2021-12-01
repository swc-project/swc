use crate::{Function, Rule};
use swc_common::{ast_node, Span};

#[ast_node("DocumentRule")]
pub struct DocumentRule {
    pub span: Span,
    pub selectors: Vec<Function>,
    pub block: Vec<Rule>,
}
