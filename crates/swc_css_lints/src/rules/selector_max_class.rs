use swc_common::errors::HANDLER;
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, LintRule},
};

pub fn selector_max_class(config: &RuleConfig<Option<usize>>) -> Box<dyn LintRule> {
    visitor_rule(SelectorMaxClass {
        reaction: config.get_rule_reaction(),
        max: config.get_rule_config().unwrap_or(3),
    })
}

#[derive(Debug, Default)]
struct SelectorMaxClass {
    reaction: LintRuleReaction,
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
            HANDLER.with(|handler| match self.reaction {
                LintRuleReaction::Error => handler
                    .struct_span_err(complex_selector.span, &message)
                    .emit(),
                LintRuleReaction::Warning => handler
                    .struct_span_warn(complex_selector.span, &message)
                    .emit(),
                _ => {}
            });
        }

        complex_selector.visit_children_with(self);
    }
}
