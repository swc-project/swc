use swc_common::errors::HANDLER;
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

pub fn no_empty_source(config: &RuleConfig<()>) -> Box<dyn Rule> {
    visitor_rule(NoEmptySource {
        reaction: config.get_rule_reaction(),
    })
}

const MESSAGE: &str = "Unexpected empty source.";

#[derive(Debug, Default)]
struct NoEmptySource {
    reaction: LintRuleReaction,
}

impl Visit for NoEmptySource {
    fn visit_stylesheet(&mut self, stylesheet: &Stylesheet) {
        // TODO: we should allow comments here,
        // but parser doesn't handle comments currently.
        if stylesheet.rules.is_empty() {
            HANDLER.with(|handler| match self.reaction {
                LintRuleReaction::Error => handler.struct_span_err(stylesheet.span, MESSAGE).emit(),
                LintRuleReaction::Warning => {
                    handler.struct_span_warn(stylesheet.span, MESSAGE).emit()
                }
                _ => {}
            });
        }

        stylesheet.visit_children_with(self);
    }
}
