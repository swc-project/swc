use swc_common::util::take::Take;
use swc_css_ast::{ComponentValue, QualifiedRule, QualifiedRulePrelude, Rule, StyleBlock};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn nesting() -> impl VisitMut {
    NestingHandler {}
}

struct NestingHandler {}

impl NestingHandler {
    /// Prepend current selector
    fn process_selector(&mut self, prelude: &QualifiedRulePrelude, to: &mut QualifiedRulePrelude) {}

    fn extract_nested_rules(&mut self, rule: &mut QualifiedRule) -> Vec<Box<QualifiedRule>> {
        let mut rules = vec![];

        let mut block_values = vec![];
        for value in rule.block.value.take() {
            match value {
                ComponentValue::StyleBlock(StyleBlock::QualifiedRule(mut q)) => {
                    self.process_selector(&rule.prelude, &mut q.prelude);

                    rules.push(q);
                }
                _ => {
                    block_values.push(value);
                }
            }
        }
        rule.block.value = block_values;

        rules
    }
}

impl VisitMut for NestingHandler {
    fn visit_mut_rules(&mut self, n: &mut Vec<Rule>) {
        n.visit_mut_children_with(self);

        let mut new = vec![];
        for n in n.take() {
            match n {
                Rule::QualifiedRule(mut n) => {
                    let rules = self.extract_nested_rules(&mut n);
                    new.push(Rule::QualifiedRule(n));
                    new.extend(rules.into_iter().map(Rule::QualifiedRule));
                }
                _ => {
                    new.push(n);
                }
            }
        }
        *n = new;
    }

    fn visit_mut_component_values(&mut self, n: &mut Vec<ComponentValue>) {
        n.visit_mut_children_with(self);

        let mut new = vec![];
        for n in n.take() {
            match n {
                ComponentValue::StyleBlock(StyleBlock::QualifiedRule(mut n)) => {
                    let rules = self.extract_nested_rules(&mut n);
                    new.push(ComponentValue::StyleBlock(StyleBlock::QualifiedRule(n)));
                    new.extend(
                        rules
                            .into_iter()
                            .map(StyleBlock::QualifiedRule)
                            .map(ComponentValue::StyleBlock),
                    );
                }
                _ => {
                    new.push(n);
                }
            }
        }
        *n = new;
    }
}
