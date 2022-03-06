use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub fn block_no_empty(ctx: LintRuleContext<()>) -> Box<dyn LintRule> {
    visitor_rule(ctx.reaction(), BlockNoEmpty { ctx })
}

const MESSAGE: &str = "Unexpected empty block.";

#[derive(Debug, Default)]
struct BlockNoEmpty {
    ctx: LintRuleContext<()>,
}

impl Visit for BlockNoEmpty {
    fn visit_simple_block(&mut self, simple_block: &SimpleBlock) {
        if simple_block.value.is_empty() {
            self.ctx.report(simple_block, MESSAGE);
        }

        simple_block.visit_children_with(self);
    }
}
