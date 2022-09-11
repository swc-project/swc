use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub fn keyframe_declaration_no_important(ctx: LintRuleContext<()>) -> Box<dyn LintRule> {
    visitor_rule(
        ctx.reaction(),
        KeyframeDeclarationNoImportant {
            ctx,
            in_keyframes_at_rule: false,
        },
    )
}

const MESSAGE: &str = "Unexpected '!important'.";

#[derive(Debug, Default)]
struct KeyframeDeclarationNoImportant {
    ctx: LintRuleContext<()>,
    in_keyframes_at_rule: bool,
}

impl Visit for KeyframeDeclarationNoImportant {
    fn visit_at_rule(&mut self, at_rule: &AtRule) {
        if let Some(AtRulePrelude::KeyframesPrelude(_)) = at_rule.prelude.as_deref() {
            let old_value_in_keyframes_at_rule = self.in_keyframes_at_rule;

            self.in_keyframes_at_rule = true;

            at_rule.visit_children_with(self);

            self.in_keyframes_at_rule = old_value_in_keyframes_at_rule;
        }
    }

    fn visit_important_flag(&mut self, important_flag: &ImportantFlag) {
        important_flag.visit_children_with(self);

        if !self.in_keyframes_at_rule {
            return;
        }

        self.ctx.report(important_flag, MESSAGE);
    }
}
