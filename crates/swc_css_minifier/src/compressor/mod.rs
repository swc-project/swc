use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

mod time;
mod unicode_range;
mod url;

struct Compressor {}

impl VisitMut for Compressor {
    fn visit_mut_time(&mut self, n: &mut Time) {
        n.visit_mut_children_with(self);

        self.compress_time(n);
    }

    fn visit_mut_unicode_range(&mut self, n: &mut UnicodeRange) {
        n.visit_mut_children_with(self);

        self.compress_unicode_range(n);
    }

    fn visit_mut_url(&mut self, n: &mut Url) {
        n.visit_mut_children_with(self);

        self.compress_url(n);
    }
}
