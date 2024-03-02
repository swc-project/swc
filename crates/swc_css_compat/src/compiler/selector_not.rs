use swc_css_ast::{
    CompoundSelector, PseudoClassSelector, PseudoClassSelectorChildren, SelectorList,
    SubclassSelector,
};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_selector_not(&mut self, n: &mut CompoundSelector) {
        let has_not = n.subclass_selectors.iter().any(|n| matches!(n, SubclassSelector::PseudoClass(PseudoClassSelector { name, children: Some(children), ..}) if name.value == "not"
            && matches!(children.first(), Some(PseudoClassSelectorChildren::SelectorList(selector_list)) if selector_list.children.len() > 1)));

        if !has_not {
            return;
        }

        let mut new_subclass_selectors = Vec::with_capacity(n.subclass_selectors.len());

        for selector in &mut n.subclass_selectors.drain(..) {
            match selector {
                SubclassSelector::PseudoClass(PseudoClassSelector {
                    span,
                    name,
                    children: Some(children),
                    ..
                }) if name.value == "not"
                    && matches!(children.first(), Some(PseudoClassSelectorChildren::SelectorList(selector_list)) if selector_list.children.len() > 1) =>
                {
                    if let Some(PseudoClassSelectorChildren::SelectorList(selector_list)) =
                        children.first()
                    {
                        for child in &selector_list.children {
                            new_subclass_selectors.push(SubclassSelector::PseudoClass(
                                PseudoClassSelector {
                                    span,
                                    name: name.clone(),
                                    children: Some(vec![
                                        PseudoClassSelectorChildren::SelectorList(SelectorList {
                                            span: child.span,
                                            children: vec![child.clone()],
                                        }),
                                    ]),
                                },
                            ));
                        }
                    }
                }
                _ => new_subclass_selectors.push(selector),
            }
        }

        n.subclass_selectors = new_subclass_selectors;
    }
}
