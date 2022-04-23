#![deny(clippy::all)]

use swc_html_ast::*;
use swc_html_visit::{VisitMut, VisitMutWith};

static BOOLEAN_ATTRIBUTES: &[&str] = &[
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "compact",
    "controls",
    "declare",
    "default",
    "defaultchecked",
    "defaultmuted",
    "defaultselected",
    "defer",
    "disabled",
    "enabled",
    "formnovalidate",
    "hidden",
    "indeterminate",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nohref",
    "noresize",
    "noshade",
    "novalidate",
    "nowrap",
    "open",
    "pauseonexit",
    "readonly",
    "required",
    "reversed",
    "scoped",
    "seamless",
    "selected",
    "sortable",
    "truespeed",
    "typemustmatch",
    "visible",
];

struct Minifier {}

impl Minifier {
    fn is_boolean_attribute(&self, name: &str) -> bool {
        BOOLEAN_ATTRIBUTES.contains(&name)
    }

    fn is_conditional_comment(&self, data: &str) -> bool {
        let trimmed = data.trim();

        if trimmed.starts_with("[if") || trimmed.ends_with("[endif]") {
            return true;
        }

        false
    }
}

impl VisitMut for Minifier {
    fn visit_mut_element(&mut self, n: &mut Element) {
        n.visit_mut_children_with(self);

        n.children.retain(|child| !matches!(child, Child::Comment(comment) if !self.is_conditional_comment(&comment.data)));
    }

    fn visit_mut_attribute(&mut self, n: &mut Attribute) {
        n.visit_mut_children_with(self);

        match &n.name {
            name if n.value.is_some() && self.is_boolean_attribute(name) => {
                n.value = None;
            }
            _ => {}
        }
    }
}

pub fn minify(document: &mut Document) {
    document.visit_mut_with(&mut Minifier {});
}
