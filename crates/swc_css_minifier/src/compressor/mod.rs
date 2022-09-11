use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

mod url;

struct Compressor {}

impl VisitMut for Compressor {
    fn visit_mut_url(&mut self, n: &mut Url) {
        n.visit_mut_children_with(self);

        self.compress_url(n);
    }
}
