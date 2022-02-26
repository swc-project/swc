use swc_common::errors::HANDLER;
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

pub fn block_no_empty(config: &RuleConfig<()>) -> Box<dyn Rule> {
    visitor_rule(BlockNoEmpty {
        reaction: config.get_rule_reaction(),
    })
}

const MESSAGE: &str = "Unexpected empty block.";

#[derive(Debug, Default)]
struct BlockNoEmpty {
    reaction: LintRuleReaction,
}

impl Visit for BlockNoEmpty {
    fn visit_simple_block(&mut self, simple_block: &SimpleBlock) {
        if simple_block.value.is_empty() {
            HANDLER.with(|handler| match self.reaction {
                LintRuleReaction::Error => {
                    handler.struct_span_err(simple_block.span, MESSAGE).emit()
                }
                LintRuleReaction::Warning => {
                    handler.struct_span_warn(simple_block.span, MESSAGE).emit()
                }
                _ => {}
            });
        }

        simple_block.visit_children_with(self);
    }
}
