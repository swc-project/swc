use swc_common::{errors::HANDLER, Span};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, LintRule},
};

pub fn keyframe_declaration_no_important(config: &RuleConfig<()>) -> Box<dyn LintRule> {
    visitor_rule(KeyframeDeclarationNoImportant {
        reaction: config.get_rule_reaction(),
        keyframe_rules: vec![],
    })
}

const MESSAGE: &str = "Unexpected '!important'.";

#[derive(Debug, Default)]
struct KeyframeDeclarationNoImportant {
    reaction: LintRuleReaction,

    // rule interal
    keyframe_rules: Vec<Span>,
}

impl Visit for KeyframeDeclarationNoImportant {
    fn visit_keyframes_rule(&mut self, keyframes_rule: &KeyframesRule) {
        self.keyframe_rules.push(keyframes_rule.span);

        keyframes_rule.visit_children_with(self);

        self.keyframe_rules.pop();
    }

    fn visit_important_flag(&mut self, important_flag: &ImportantFlag) {
        match self.keyframe_rules.last() {
            Some(span) if span.contains(important_flag.span) => {
                HANDLER.with(|handler| match self.reaction {
                    LintRuleReaction::Error => {
                        handler.struct_span_err(important_flag.span, MESSAGE).emit()
                    }
                    LintRuleReaction::Warning => handler
                        .struct_span_warn(important_flag.span, MESSAGE)
                        .emit(),
                    _ => {}
                });
            }
            _ => {}
        }

        important_flag.visit_children_with(self);
    }
}
