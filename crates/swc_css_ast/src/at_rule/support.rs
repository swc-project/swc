use swc_common::{ast_node, Span};

use crate::{Declaration, SimpleBlock};

#[ast_node("SupportsRule")]
pub struct SupportsRule {
    pub span: Span,
    pub condition: SupportsCondition,
    pub block: SimpleBlock,
}

#[ast_node("SupportsCondition")]
pub struct SupportsCondition {
    pub span: Span,
    pub conditions: Vec<SupportsConditionType>,
}

#[ast_node]
pub enum SupportsConditionType {
    #[tag("SupportsNot")]
    Not(SupportsNot),

    #[tag("SupportsAnd")]
    And(SupportsAnd),

    #[tag("SupportsOr")]
    Or(SupportsOr),

    #[tag("SupportsInParens")]
    SupportsInParens(SupportsInParens),
}

#[ast_node("SupportsNot")]
pub struct SupportsNot {
    pub span: Span,
    pub condition: SupportsInParens,
}

#[ast_node("SupportsAnd")]
pub struct SupportsAnd {
    pub span: Span,
    pub condition: SupportsInParens,
}

#[ast_node("SupportsOr")]
pub struct SupportsOr {
    pub span: Span,
    pub condition: SupportsInParens,
}

#[ast_node]
pub enum SupportsInParens {
    #[tag("SupportsCondition")]
    SupportsCondition(SupportsCondition),

    #[tag("SupportsFeature")]
    Feature(SupportsFeature),
    // TODO <general-enclosed>
}

#[ast_node]
pub enum SupportsFeature {
    #[tag("Declaration")]
    Declaration(Declaration),
}
