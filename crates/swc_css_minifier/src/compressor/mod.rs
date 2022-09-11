use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

mod color;
mod declaration;
mod empty;
mod frequency;
mod time;
mod unicode_range;
mod url;

pub fn compressor() -> impl VisitMut {
    Compressor::default()
}

#[derive(Default)]
struct Compressor {}

impl VisitMut for Compressor {
    fn visit_mut_stylesheet(&mut self, n: &mut Stylesheet) {
        n.visit_mut_children_with(self);

        self.compresss_empty_stylesheet(n);
    }

    fn visit_mut_simple_block(&mut self, n: &mut SimpleBlock) {
        n.visit_mut_children_with(self);

        self.compresss_empty_simple_block(n);
    }

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

    fn visit_mut_declaration(&mut self, n: &mut Declaration) {
        n.visit_mut_children_with(self);

        self.compress_declaration(n);
    }

    fn visit_mut_color(&mut self, n: &mut Color) {
        n.visit_mut_children_with(self);

        self.compress_color(n);
    }

    fn visit_mut_frequency(&mut self, n: &mut Frequency) {
        n.visit_mut_children_with(self);

        self.compress_frequency(n);
    }
}
