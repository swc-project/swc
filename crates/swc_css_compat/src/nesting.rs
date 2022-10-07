use swc_common::util::take::Take;
use swc_css_ast::{
    ComponentValue, Declaration, DeclarationOrAtRule, QualifiedRule, Rule, StyleBlock,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn nesting() -> impl VisitMut {
    NestingHandler {}
}

struct NestingHandler {}

impl NestingHandler {
    fn extract_nested_rules(&mut self, n: &mut QualifiedRule) -> Vec<Box<QualifiedRule>> {
        let mut rules = vec![];

        let mut block_values = vec![];
        for rule in n.block.value.take() {
            dbg!(&rule);
            match rule {
                ComponentValue::StyleBlock(StyleBlock::QualifiedRule(q)) => {
                    // TODO: Prepend current selector
                    rules.push(q);
                }
                _ => {
                    block_values.push(rule);
                }
            }
        }
        n.block.value = block_values;

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
}
