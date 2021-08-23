use std::mem::take;

use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn prefixer() -> impl VisitMut {
    Prefixer::default()
}

#[derive(Default)]
struct Prefixer {
    added: Vec<Property>,
}

impl VisitMut for Prefixer {
    fn visit_mut_properties(&mut self, props: &mut Vec<Property>) {
        let mut new = vec![];
        for mut n in take(props) {
            n.visit_mut_with(self);
            new.extend(self.added.drain(..));
            new.push(n);
        }

        *props = new;
    }

    fn visit_mut_property(&mut self, n: &mut Property) {
        n.visit_mut_children_with(self);
    }
}
