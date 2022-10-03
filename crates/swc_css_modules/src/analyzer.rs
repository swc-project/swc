//! Import/export analyzer

use swc_atoms::JsWord;
use swc_css_ast::Stylesheet;
use swc_css_visit::Visit;

pub fn analyze_imports(ss: &Stylesheet) -> Vec<JsWord> {
    todo!()
}

struct Analyzer {
    imports: Vec<JsWord>,
}

impl Visit for Analyzer {}
