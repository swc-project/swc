//! Import/export analyzer

use swc_atoms::{js_word, JsWord};
use swc_css_ast::{CombinatorValue, ComponentValue, Declaration, DeclarationName, Stylesheet};
use swc_css_visit::{Visit, VisitWith};

pub fn analyze_imports(ss: &Stylesheet) -> Vec<JsWord> {
    let mut v = Analyzer {
        imports: Default::default(),
    };
    ss.visit_with(&mut v);
    v.imports
}

struct Analyzer {
    imports: Vec<JsWord>,
}

impl Visit for Analyzer {
    fn visit_declaration(&mut self, d: &Declaration) {
        d.visit_children_with(self);

        if let DeclarationName::Ident(name) = &d.name {
            if &*name.value == "composes" {
                // comoses: name from 'foo.css'
                if d.value.len() == 3 {
                    match (&d.value[0], &d.value[1], &d.value[2]) {
                        (
                            ComponentValue::Ident(..),
                            ComponentValue::Ident(ident2),
                            ComponentValue::Str(s),
                        ) if ident2.value == js_word!("from") => {
                            self.imports.push(s.value.clone());
                        }
                        _ => {}
                    }
                }
            }
        }
    }
}
