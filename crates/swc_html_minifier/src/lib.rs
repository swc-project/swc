#![deny(clippy::all)]

use swc_html_ast::*;
use swc_html_visit::{VisitMut, VisitMutWith};

mod steps;

struct Minifier;

impl VisitMut for Minifier {
    fn visit_mut_element(&mut self, n: &mut Element) {
        n.visit_mut_children_with(self);

        steps::remove_comments::remove_comments(n);
        steps::remove_default_attrs::remove_default_attributes(n);
    }

    fn visit_mut_attribute(&mut self, n: &mut Attribute) {
        n.visit_mut_children_with(self);

        steps::collapse_boolean_attrs::collapse_boolean_attributes(n);
    }
}

pub fn minify(document: &mut Document) {
    document.visit_mut_with(&mut Minifier);
}
