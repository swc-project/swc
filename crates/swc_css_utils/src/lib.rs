#![deny(clippy::all)]

use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub struct IdentReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for IdentReplacer<'_> {
    fn visit_mut_ident(&mut self, n: &mut Ident) {
        n.visit_mut_children_with(self);

        if &*n.value.to_lowercase() == self.from {
            n.value = self.to.into();
            n.raw = None;
        }
    }
}

pub fn replace_ident<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<IdentReplacer<'aa>>,
{
    node.visit_mut_with(&mut IdentReplacer { from, to });
}

pub struct FunctionNameReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for FunctionNameReplacer<'_> {
    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        if &*n.name.value.to_lowercase() == self.from {
            n.name.value = self.to.into();
            n.name.raw = None;
        }
    }
}

pub fn replace_function_name<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<FunctionNameReplacer<'aa>>,
{
    node.visit_mut_with(&mut FunctionNameReplacer { from, to });
}

pub struct PseudoClassSelectorNameReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for PseudoClassSelectorNameReplacer<'_> {
    fn visit_mut_pseudo_class_selector(&mut self, n: &mut PseudoClassSelector) {
        n.visit_mut_children_with(self);

        if &*n.name.value.to_lowercase() == self.from {
            n.name.value = self.to.into();
            n.name.raw = None;
        }
    }
}

pub fn replace_pseudo_class_selector_name<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<PseudoClassSelectorNameReplacer<'aa>>,
{
    node.visit_mut_with(&mut PseudoClassSelectorNameReplacer { from, to });
}

pub struct PseudoElementSelectorNameReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for PseudoElementSelectorNameReplacer<'_> {
    fn visit_mut_pseudo_element_selector(&mut self, n: &mut PseudoElementSelector) {
        n.visit_mut_children_with(self);

        if &*n.name.value.to_lowercase() == self.from {
            n.name.value = self.to.into();
            n.name.raw = None;
        }
    }
}

pub fn replace_pseudo_element_selector_name<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<PseudoElementSelectorNameReplacer<'aa>>,
{
    node.visit_mut_with(&mut PseudoElementSelectorNameReplacer { from, to });
}

pub struct PseudoElementOnPseudoClassReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for PseudoElementOnPseudoClassReplacer<'_> {
    fn visit_mut_subclass_selector(&mut self, n: &mut SubclassSelector) {
        n.visit_mut_children_with(self);

        match n {
            SubclassSelector::PseudoElement(PseudoElementSelector { name, span, .. })
                if &*name.value.to_lowercase() == self.from =>
            {
                *n = SubclassSelector::PseudoClass(PseudoClassSelector {
                    span: *span,
                    name: Ident {
                        span: name.span,
                        value: self.to.into(),
                        raw: None,
                    },
                    children: None,
                })
            }
            _ => {}
        }
    }
}

pub fn replace_pseudo_class_selector_on_pseudo_element_selector<N>(
    node: &mut N,
    from: &str,
    to: &str,
) where
    N: for<'aa> VisitMutWith<PseudoElementOnPseudoClassReplacer<'aa>>,
{
    node.visit_mut_with(&mut PseudoElementOnPseudoClassReplacer { from, to });
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NamedColor {
    pub hex: String,
    pub rgb: Vec<u8>,
}

pub static NAMED_COLORS: Lazy<AHashMap<JsWord, NamedColor>> = Lazy::new(|| {
    let named_colors: AHashMap<JsWord, NamedColor> =
        serde_json::from_str(include_str!("./named-colors.json"))
            .expect("failed to parse named-colors.json for html entities");

    named_colors
});
