//! Import/export analyzer

use swc_atoms::{js_word, JsWord};
use swc_css_ast::{
    ComponentValue, Declaration, DeclarationName, Ident, ImportHref, ImportPrelude, Stylesheet,
    UrlValue,
};
use swc_css_visit::{Visit, VisitWith};

pub fn analyze_imports(ss: &Stylesheet) -> Vec<JsWord> {
    let mut v = Analyzer {
        imports: Default::default(),
    };
    ss.visit_with(&mut v);
    v.imports.sort();
    v.imports.dedup();
    v.imports
}

struct Analyzer {
    imports: Vec<JsWord>,
}

impl Visit for Analyzer {
    fn visit_import_prelude(&mut self, n: &ImportPrelude) {
        n.visit_children_with(self);

        match &*n.href {
            ImportHref::Url(u) => {
                if let Some(s) = &u.value {
                    match &**s {
                        UrlValue::Str(s) => {
                            self.imports.push(s.value.clone());
                        }
                        UrlValue::Raw(v) => {
                            self.imports.push(v.value.clone());
                        }
                    }
                }
            }
            ImportHref::Str(s) => {
                self.imports.push(s.value.clone());
            }
        }
    }

    fn visit_declaration(&mut self, d: &Declaration) {
        d.visit_children_with(self);

        if let DeclarationName::Ident(name) = &d.name {
            if &*name.value == "composes" {
                // composes: name from 'foo.css'
                if d.value.len() >= 3 {
                    if let (
                        ComponentValue::Ident(box Ident {
                            value: js_word!("from"),
                            ..
                        }),
                        ComponentValue::Str(s),
                    ) = (&d.value[d.value.len() - 2], &d.value[d.value.len() - 1])
                    {
                        self.imports.push(s.value.clone());
                    }
                }
            }
        }
    }
}
