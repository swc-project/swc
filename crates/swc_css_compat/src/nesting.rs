use swc_common::util::take::Take;
use swc_css_ast::{
    ComplexSelector, ComplexSelectorChildren, ComponentValue, CompoundSelector, QualifiedRule,
    QualifiedRulePrelude, Rule, SelectorList, StyleBlock,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn nesting() -> impl VisitMut {
    NestingHandler {}
}

struct NestingHandler {}

impl NestingHandler {
    fn process_complex_selectors(
        &mut self,
        prelude: &SelectorList,
        selectors: &mut Vec<ComplexSelector>,
    ) {
        fn append_compound(to: &mut ComplexSelector, base: &ComplexSelector, c: &CompoundSelector) {
            if c.nesting_selector.is_some() {
                let len = base.children.len();

                to.children
                    .extend(base.children.iter().cloned().enumerate().map(
                        |(idx, mut children)| {
                            if idx == len - 1 {
                                if let ComplexSelectorChildren::CompoundSelector(compound) =
                                    &mut children
                                {
                                    if c.type_selector.is_some() {
                                        compound.type_selector = c.type_selector.clone();
                                    }
                                    compound
                                        .subclass_selectors
                                        .extend(c.subclass_selectors.clone());
                                }
                            }

                            children
                        },
                    ));
            } else {
                to.children
                    .push(ComplexSelectorChildren::CompoundSelector(c.clone()));
            }
        }

        let mut new_selectors = vec![];

        //
        'complex: for complex in selectors.take() {
            for compound in &complex.children {
                match compound {
                    ComplexSelectorChildren::CompoundSelector(compound) => {
                        if compound.nesting_selector.is_some() {
                            //

                            for prelude in &prelude.children {
                                let mut new = ComplexSelector {
                                    span: Default::default(),
                                    children: Default::default(),
                                };
                                for compound in &complex.children {
                                    match compound {
                                        ComplexSelectorChildren::CompoundSelector(compound) => {
                                            append_compound(&mut new, prelude, compound);
                                        }
                                        ComplexSelectorChildren::Combinator(_) => {
                                            new.children.push(compound.clone());
                                        }
                                    }
                                }
                                new_selectors.push(new);
                            }
                            continue 'complex;
                        }
                    }
                    ComplexSelectorChildren::Combinator(_) => {}
                }
            }

            new_selectors.push(complex);
        }

        *selectors = new_selectors;
    }

    /// Prepend current selector
    fn process_prelude(&mut self, prelude: &QualifiedRulePrelude, to: &mut QualifiedRulePrelude) {
        if let (
            QualifiedRulePrelude::SelectorList(prelude),
            QualifiedRulePrelude::SelectorList(selectors),
        ) = (prelude, to)
        {
            self.process_complex_selectors(prelude, &mut selectors.children);
        }
    }

    fn extract_nested_rules(&mut self, rule: &mut QualifiedRule) -> Vec<Box<QualifiedRule>> {
        let mut rules = vec![];

        let mut block_values = vec![];
        for value in rule.block.value.take() {
            match value {
                ComponentValue::StyleBlock(StyleBlock::QualifiedRule(mut q)) => {
                    self.process_prelude(&rule.prelude, &mut q.prelude);

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
