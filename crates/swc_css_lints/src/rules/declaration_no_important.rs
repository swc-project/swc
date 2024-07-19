use swc_common::Span;
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub fn declaration_no_important(ctx: LintRuleContext<()>) -> Box<dyn LintRule> {
    visitor_rule(
        ctx.reaction(),
        DeclarationNoImportant {
            ctx,
            keyframe_rules: Vec::new(),
        },
    )
}

const MESSAGE: &str = "Unexpected '!important'.";

#[derive(Debug, Default)]
struct DeclarationNoImportant {
    ctx: LintRuleContext<()>,

    // rule internal
    keyframe_rules: Vec<Span>,
}

impl Visit for DeclarationNoImportant {
    fn visit_at_rule(&mut self, keyframes_rule: &AtRule) {
        if let Some(AtRulePrelude::KeyframesPrelude(_)) = keyframes_rule.prelude.as_deref() {
            self.keyframe_rules.push(keyframes_rule.span);

            keyframes_rule.visit_children_with(self);

            self.keyframe_rules.pop();
        }
    }

    fn visit_important_flag(&mut self, important_flag: &ImportantFlag) {
        match self.keyframe_rules.last() {
            Some(span) if span.contains(important_flag.span) => {
                // This rule doesn't check `!important` flag inside `@keyframe`.
            }
            _ => self.ctx.report(important_flag, MESSAGE),
        }

        important_flag.visit_children_with(self);
    }
}
