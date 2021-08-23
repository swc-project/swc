use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub struct TextReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for TextReplacer<'_> {
    fn visit_mut_text(&mut self, n: &mut Text) {
        n.visit_mut_children_with(self);

        if &*n.value == self.from {
            n.value = self.to.into();
        }
    }
}

pub fn replace_text<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<TextReplacer<'aa>>,
{
    node.visit_mut_with(&mut TextReplacer { from, to });
}
