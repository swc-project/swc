//! Import/export analyzer

use swc_atoms::JsWord;
use swc_css_ast::{Declaration, DeclarationName, Stylesheet};
use swc_css_visit::{Visit, VisitWith};

pub fn analyze_imports(ss: &Stylesheet) -> Vec<JsWord> {
    todo!()
}

struct Analyzer {
    imports: Vec<JsWord>,
}

impl Visit for Analyzer {
    fn visit_declaration(&mut self, d: &Declaration) {
        d.visit_children_with(self);

        if let DeclarationName::Ident(name) = &d.name {
            if &*name.value == "compose" {
                dbg!(&d.value);
            }
        }
    }
}
