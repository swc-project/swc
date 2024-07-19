use std::iter::once;

use swc_common::{util::take::Take, DUMMY_SP};
use swc_css_ast::*;

use crate::compiler::Compiler;

impl Compiler {
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
                        let mut selectors = Vec::new();

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
        let mut new_selectors = Vec::new();

        'complex: for complex in selectors.take() {
            for compound in &complex.children {
                match compound {
                    ComplexSelectorChildren::CompoundSelector(compound) => {
                        if compound.nesting_selector.is_some() {
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
                                        compound.type_selector.clone_from(&c.type_selector);
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

    fn relative_selector_list_to_selector_list(
        &mut self,
        base: &SelectorList,
        relative_selector_list: &RelativeSelectorList,
    ) -> SelectorList {
        let mut children = Vec::new();

        for base_complex in &base.children {
            for relative_selector in &relative_selector_list.children {
                let mut complex_selector = ComplexSelector {
                    span: relative_selector.span,
                    children: Default::default(),
                };

                let is_non_relative = relative_selector.combinator.is_none()
                    && relative_selector.selector.children.iter().any(|s| match s {
                        ComplexSelectorChildren::CompoundSelector(s) => {
                            s.nesting_selector.is_some()
                        }
                        _ => false,
                    });

                if let Some(combinator) = &relative_selector.combinator {
                    complex_selector
                        .children
                        .extend(base_complex.children.clone());
                    complex_selector
                        .children
                        .push(ComplexSelectorChildren::Combinator(combinator.clone()))
                } else if !is_non_relative {
                    complex_selector
                        .children
                        .extend(base_complex.children.clone());
                    complex_selector
                        .children
                        .push(ComplexSelectorChildren::Combinator(Combinator {
                            span: DUMMY_SP,
                            value: CombinatorValue::Descendant,
                        }))
                }

                for relative_complex_selector_children in &relative_selector.selector.children {
                    match relative_complex_selector_children {
                        ComplexSelectorChildren::CompoundSelector(compound) => {
                            self.append_compound(
                                base,
                                &mut complex_selector,
                                base_complex,
                                compound,
                            );
                        }
                        ComplexSelectorChildren::Combinator(combinator) => {
                            complex_selector
                                .children
                                .push(ComplexSelectorChildren::Combinator(combinator.clone()));
                        }
                    }
                }

                children.push(complex_selector);
            }
        }

        SelectorList {
            span: relative_selector_list.span,
            children,
        }
    }

    /// Prepend current selector
    fn process_prelude(&mut self, base: &QualifiedRulePrelude, to: &mut QualifiedRulePrelude) {
        if let (
            QualifiedRulePrelude::SelectorList(base),
            QualifiedRulePrelude::RelativeSelectorList(relative_selector_list),
        ) = (base, &to)
        {
            let selector_list =
                self.relative_selector_list_to_selector_list(base, relative_selector_list);

            *to = QualifiedRulePrelude::SelectorList(selector_list);
        }
    }

    pub(crate) fn extract_nested_rules(&mut self, rule: &mut QualifiedRule) -> Vec<Rule> {
        let mut nested_rules = Vec::new();
        let mut block_values = Vec::new();

        for value in rule.block.value.take() {
            match value {
                ComponentValue::QualifiedRule(mut nested) => {
                    self.process_prelude(&rule.prelude, &mut nested.prelude);

                    nested_rules.push(Rule::QualifiedRule(nested));

                    continue;
                }
                ComponentValue::AtRule(ref at_rule) => {
                    if let Some(
                        AtRulePrelude::MediaPrelude(..)
                        | AtRulePrelude::SupportsPrelude(..)
                        | AtRulePrelude::ContainerPrelude(..)
                        | AtRulePrelude::DocumentPrelude(..),
                    ) = at_rule.prelude.as_deref()
                    {
                        if let Some(block) = &at_rule.block {
                            let mut decls_of_media = Vec::new();
                            let mut nested_of_media = Vec::new();

                            for n in &block.value {
                                match n {
                                    ComponentValue::QualifiedRule(n) => {
                                        let mut q = n.clone();

                                        self.process_prelude(&rule.prelude, &mut q.prelude);

                                        let rules = self.extract_nested_rules(&mut q);

                                        nested_of_media.extend(
                                            once(Rule::QualifiedRule(q))
                                                .chain(rules)
                                                .map(From::from),
                                        );
                                    }

                                    _ => {
                                        decls_of_media.push(n.clone());
                                    }
                                }
                            }

                            if !decls_of_media.is_empty() {
                                let rule = Box::new(QualifiedRule {
                                    span: DUMMY_SP,
                                    prelude: rule.prelude.clone(),
                                    block: SimpleBlock {
                                        value: decls_of_media,
                                        ..block.clone()
                                    },
                                });

                                nested_of_media.insert(0, ComponentValue::QualifiedRule(rule));
                            }

                            nested_rules.push(Rule::AtRule(Box::new(AtRule {
                                block: Some(SimpleBlock {
                                    value: nested_of_media,
                                    ..block.clone()
                                }),
                                ..*at_rule.clone()
                            })));

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
