use fxhash::FxHashMap;
use once_cell::sync::Lazy;
use swc_atoms::JsWord;
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;

static ENTRIES: Lazy<FxHashMap<String, Vec<String>>> = Lazy::new(|| {
    serde_json::from_str(include_str!("entries.json"))
        .expect("failed to parse entries.json from core js 3")
});

#[derive(Debug)]
pub struct Entry {
    pub imports: Vec<JsWord>,
}

impl Entry {
    pub fn new() -> Self {
        Entry {
            imports: Default::default(),
        }
    }

    /// Add imports
    fn add(&mut self, src: &str) {
        if let Some(features) = ENTRIES.get(src) {
            for f in &**features {
                self.imports.push(format!("core-js/modules/{}", f).into());
            }
        }
    }
}

impl Visit<ImportDecl> for Entry {
    fn visit(&mut self, i: &ImportDecl) {
        i.visit_children(self);

        //        if is_corejs_src(&i.src.value) {}
    }
}

//fn is_corejs_src(s: &str) -> bool {}
