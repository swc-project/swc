use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub type SelectorMaxCombinatorsConfig = Option<usize>;

pub fn selector_max_combinators(
    ctx: LintRuleContext<SelectorMaxCombinatorsConfig>,
) -> Box<dyn LintRule> {
    let max = ctx.config().unwrap_or(3);
    visitor_rule(ctx.reaction(), SelectorMaxCombinators { ctx, max })
}

#[derive(Debug, Default)]
struct SelectorMaxCombinators {
    ctx: LintRuleContext<SelectorMaxCombinatorsConfig>,
    max: usize,
}

impl SelectorMaxCombinators {
    fn build_message(&self, count: usize) -> String {
        let combinators = if self.max == 1 {
            "combinator"
        } else {
            "combinators"
        };
        format!(
            "Expected selector to have no more than {} {}, but {} actually.",
            self.max, combinators, count
        )
    }
}

impl Visit for SelectorMaxCombinators {
    fn visit_complex_selector(&mut self, complex_selector: &ComplexSelector) {
        let count = complex_selector
            .children
            .iter()
            .filter(|child| matches!(child, ComplexSelectorChildren::Combinator(..)))
            .count();

        if count > self.max {
            self.ctx.report(complex_selector, self.build_message(count));
        }

        complex_selector.visit_children_with(self);
    }
}
