use std::iter::once;

use swc_common::util::take::Take;
use swc_css_ast::{
    AtRule, AtRulePrelude, ComplexSelector, ComplexSelectorChildren, ComponentValue,
    CompoundSelector, ForgivingComplexSelector, ForgivingSelectorList, PseudoClassSelector,
    PseudoClassSelectorChildren, QualifiedRule, QualifiedRulePrelude, Rule, SelectorList,
    SimpleBlock, StyleBlock, SubclassSelector,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn nesting() -> impl VisitMut {
    NestingHandler {}
}

struct NestingHandler {}

impl NestingHandler {
    fn append_compound(
        &mut self,
        prelude: &SelectorList,
        to: &mut ComplexSelector,
        base: &ComplexSelector,
        c: &CompoundSelector,
    ) {
        if c.nesting_selector.is_some() {
            let len = base.children.len();

            to.children
                .extend(
                    base.children
                        .iter()
                        .cloned()
                        .enumerate()
                        .map(|(idx, mut children)| {
                            if idx == len - 1 {
                                if let ComplexSelectorChildren::CompoundSelector(compound) =
                                    &mut children
                                {
                                    if c.type_selector.is_some() {
                                        compound.type_selector = c.type_selector.clone();
                                    }

                                    let mut subclass = c.subclass_selectors.clone();

                                    self.process_subclass_selectors(prelude, &mut subclass);

                                    compound.subclass_selectors.extend(subclass);
                                }
                            }

                            children
                        }),
                );
        } else {
            to.children
                .push(ComplexSelectorChildren::CompoundSelector(c.clone()));
        }
    }

    fn process_subclass_selectors(
        &mut self,
        prelude: &SelectorList,
        subclass: &mut Vec<SubclassSelector>,
    ) {
        for sel in subclass {
            if let SubclassSelector::PseudoClass(PseudoClassSelector {
                children: Some(children),
                ..
            }) = sel
            {
                for c in children {
                    if let PseudoClassSelectorChildren::ForgivingSelectorList(c) = c {
                        let mut selectors = vec![];

                        for sel in &mut c.children {
                            match sel {
                                ForgivingComplexSelector::ComplexSelector(sel) => {
                                    selectors.push(sel.clone());
                                }
                                ForgivingComplexSelector::ListOfComponentValues(_) => {
                                    // Abort
                                    return;
                                }
                            }
                        }

                        self.process_complex_selectors(prelude, &mut selectors);

                        *c = ForgivingSelectorList {
                            children: selectors
                                .into_iter()
                                .map(ForgivingComplexSelector::ComplexSelector)
                                .collect(),
                            ..*c
                        };
                    }
                }
            }
        }
    }

    fn process_complex_selectors(
        &mut self,
        prelude: &SelectorList,
        selectors: &mut Vec<ComplexSelector>,
    ) {
        let mut new_selectors = vec![];

        //
        'complex: for complex in selectors.take() {
            for compound in &complex.children {
                match compound {
                    ComplexSelectorChildren::CompoundSelector(compound) => {
                        if compound.nesting_selector.is_some() {
                            //

                            for prelude_children in &prelude.children {
                                let mut new = ComplexSelector {
                                    span: Default::default(),
                                    children: Default::default(),
                                };
                                for compound in &complex.children {
                                    match compound {
                                        ComplexSelectorChildren::CompoundSelector(compound) => {
                                            self.append_compound(
                                                prelude,
                                                &mut new,
                                                prelude_children,
                                                compound,
                                            );
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

    fn extract_nested_rules(&mut self, rule: &mut QualifiedRule) -> Vec<Rule> {
        let mut nested_rules = vec![];

        let mut block_values = vec![];
        for value in rule.block.value.take() {
            match value {
                ComponentValue::StyleBlock(StyleBlock::QualifiedRule(mut q)) => {
                    self.process_prelude(&rule.prelude, &mut q.prelude);

                    nested_rules.push(Rule::QualifiedRule(q));
                    continue;
                }
                ComponentValue::StyleBlock(StyleBlock::AtRule(ref at_rule)) => {
                    if let Some(AtRulePrelude::MediaPrelude(media)) = at_rule.prelude.as_deref() {
                        if let Some(block) = &at_rule.block {
                            let mut decls_of_media = vec![];
                            let mut nested_of_media = vec![];

                            for n in &block.value {
                                match n {
                                    ComponentValue::StyleBlock(StyleBlock::QualifiedRule(n)) => {
                                        let mut n = n.clone();
                                        let rules = self.extract_nested_rules(&mut n);

                                        nested_of_media.extend(
                                            once(Rule::QualifiedRule(n))
                                                .chain(rules.into_iter())
                                                .map(rule_to_component_value)
                                                .map(|v| {
                                                    Rule::AtRule(Box::new(AtRule {
                                                        block: Some(SimpleBlock {
                                                            value: vec![v],

                                                            ..block.clone()
                                                        }),

                                                        ..*at_rule.clone()
                                                    }))
                                                }),
                                        );
                                    }

                                    _ => {
                                        decls_of_media.push(n.clone());
                                    }
                                }
                            }

                            if !decls_of_media.is_empty() {
                                nested_rules.push(Rule::AtRule(Box::new(AtRule {
                                    block: Some(SimpleBlock {
                                        value: decls_of_media.into_iter().collect(),
                                        ..*block
                                    }),
                                    ..*at_rule.clone()
                                })));
                            }

                            nested_rules.extend(nested_of_media);
                            continue;
                        }
                    }
                }
                _ => {}
            }

            block_values.push(value);
        }
        rule.block.value = block_values;

        nested_rules
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
                    new.extend(rules);
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
                    new.extend(rules.into_iter().map(rule_to_component_value));
                }

                _ => {
                    new.push(n);
                }
            }
        }
        *n = new;
    }
}

fn rule_to_component_value(rule: Rule) -> ComponentValue {
    match rule {
        Rule::QualifiedRule(q) => ComponentValue::StyleBlock(StyleBlock::QualifiedRule(q)),
        Rule::AtRule(r) => ComponentValue::StyleBlock(StyleBlock::AtRule(r)),
        Rule::Invalid(..) => ComponentValue::Rule(rule),
    }
}
