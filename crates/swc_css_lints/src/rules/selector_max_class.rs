use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub(crate) type SelectorMaxClassConfig = Option<usize>;

pub fn selector_max_class(ctx: LintRuleContext<SelectorMaxClassConfig>) -> Box<dyn LintRule> {
    let max = ctx.config().unwrap_or(3);
    visitor_rule(ctx.reaction(), SelectorMaxClass { ctx, max })
}

#[derive(Debug, Default)]
struct SelectorMaxClass {
    ctx: LintRuleContext<SelectorMaxClassConfig>,
    max: usize,
}

impl SelectorMaxClass {
    fn build_message(&self, count: usize) -> String {
        let class = if self.max == 1 { "class" } else { "classes" };
        format!(
            "Expected selector to have no more than {} {}, but {} actually.",
            self.max, class, count
        )
    }
}

impl Visit for SelectorMaxClass {
    fn visit_complex_selector(&mut self, complex_selector: &ComplexSelector) {
        let count = complex_selector
            .children
            .iter()
            .filter_map(|selector| match selector {
                ComplexSelectorChildren::CompoundSelector(compound_selector) => {
                    Some(compound_selector)
                }
                _ => None,
            })
            .flat_map(|selector| {
                selector
                    .subclass_selectors
                    .iter()
                    .filter(|selector| matches!(selector, SubclassSelector::Class(..)))
            })
            .count();

        if count > self.max {
            let message = self.build_message(count);
            self.ctx.report(complex_selector, message);
        }

        complex_selector.visit_children_with(self);
    }
}
