use swc_css_ast::AtRule;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn custom_media_query() -> impl VisitMut {
    CustomMediaQuery {}
}

struct CustomMediaQuery {}

impl VisitMut for CustomMediaQuery {
    fn visit_mut_at_rule(&mut self, n: &mut AtRule) {
        n.visit_mut_children_with(self);

        if n.name == *"custom-media" {
            dbg!(n);
        }
    }
}
