use super::compat::DATA as CORE_JS_COMPAT_DATA;
use crate::{version::should_enable, Versions};
use fxhash::{FxHashMap, FxHashSet};
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
    is_any_target: bool,
    target: Versions,
    pub imports: FxHashSet<JsWord>,
}

impl Entry {
    pub fn new(target: Versions) -> Self {
        Entry {
            is_any_target: target.is_any_target(),
            target,
            imports: Default::default(),
        }
    }

    /// Add imports
    fn add(&mut self, src: &str) {
        let Entry {
            is_any_target,
            target,
            ..
        } = self;

        if let Some(features) = ENTRIES.get(src) {
            self.imports.extend(features.iter().filter_map(|f| {
                let feature = CORE_JS_COMPAT_DATA.get(&**f);

                if !*is_any_target {
                    if let Some(feature) = feature {
                        if !should_enable(*target, *feature, true) {
                            return None;
                        }
                    }
                }
                Some(format!("core-js/modules/{}", f).into())
            }));
        }
    }
}

impl Visit<ImportDecl> for Entry {
    fn visit(&mut self, i: &ImportDecl) {
        i.visit_children(self);

        self.add(&i.src.value);
    }
}
