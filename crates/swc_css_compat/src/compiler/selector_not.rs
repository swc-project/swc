use swc_atoms::js_word;
use swc_css_ast::{
    CompoundSelector, PseudoClassSelector, PseudoClassSelectorChildren, SelectorList,
    SubclassSelector,
};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_selector_not(&mut self, n: &mut CompoundSelector) {
        let has_not = n.subclass_selectors.iter().any(|n| matches!(n, SubclassSelector::PseudoClass(PseudoClassSelector { name, children: Some(children), ..}) if name.value == js_word!("not")
            && matches!(children.get(0), Some(PseudoClassSelectorChildren::SelectorList(selector_list)) if selector_list.children.len() > 1)));

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
                }) if name.value == js_word!("not")
                    && matches!(children.get(0), Some(PseudoClassSelectorChildren::SelectorList(selector_list)) if selector_list.children.len() > 1) =>
                {
                    if let Some(PseudoClassSelectorChildren::SelectorList(selector_list)) =
                        children.get(0)
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
