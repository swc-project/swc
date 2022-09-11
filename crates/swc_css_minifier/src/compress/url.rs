use swc_atoms::js_word;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_url() -> impl VisitMut {
    CompressUrl {}
}

struct CompressUrl {}

impl VisitMut for CompressUrl {}
