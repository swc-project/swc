use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub fn no_empty_source(ctx: LintRuleContext<()>) -> Box<dyn LintRule> {
    visitor_rule(ctx.reaction(), NoEmptySource { ctx })
}

const MESSAGE: &str = "Unexpected empty source.";

#[derive(Debug, Default)]
struct NoEmptySource {
    ctx: LintRuleContext<()>,
}

impl Visit for NoEmptySource {
    fn visit_stylesheet(&mut self, stylesheet: &Stylesheet) {
        // TODO: we should allow comments here,
        // but parser doesn't handle comments currently.
        if stylesheet.rules.is_empty() {
            self.ctx.report(stylesheet, MESSAGE);
        }

        stylesheet.visit_children_with(self);
    }
}
