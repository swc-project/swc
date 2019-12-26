use super::compat::DATA as CORE_JS_COMPAT_DATA;
use crate::{version::should_enable, Version, Versions};
use fxhash::{FxHashMap, FxHashSet};
use once_cell::sync::Lazy;
use swc_atoms::JsWord;
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;

static ENTRIES: Lazy<FxHashMap<String, Vec<String>>> = Lazy::new(|| {
    serde_json::from_str(include_str!("entries.json"))
        .expect("failed to parse entries.json from core js 3")
});

static MODULES_BY_VERSION: Lazy<FxHashMap<Version, Vec<String>>> = Lazy::new(|| {
    serde_json::from_str(include_str!("modules-by-versions.json"))
        .expect("failed to parse modules-by-versions.json")
});

#[derive(Debug)]
pub struct Entry {
    is_any_target: bool,
    target: Versions,
    corejs_version: Version,
    pub imports: FxHashSet<JsWord>,
}

impl Entry {
    pub fn new(target: Versions, corejs_version: Version) -> Self {
        assert_eq!(corejs_version.major, 3);

        Entry {
            is_any_target: target.is_any_target(),
            target,
            corejs_version,
            imports: Default::default(),
        }
    }

    /// Add imports
    fn add(&mut self, src: &str) {
        let Entry {
            is_any_target,
            target,
            corejs_version,
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

                println!("{} -> {}", src, f);

                for (_, features) in MODULES_BY_VERSION
                    .iter()
                    .filter(|(version, features)| *corejs_version < **version)
                {
                    if features.contains(&f) {
                        return None;
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
