use super::compat::DATA as CORE_JS_COMPAT_DATA;
use crate::{version::should_enable, Version, Versions};
use fxhash::{FxHashMap, FxHashSet};
use once_cell::sync::Lazy;
use swc_atoms::{js_word, JsWord};
use swc_common::{Fold, FoldWith, DUMMY_SP};
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

    /// Add imports.
    /// Returns true if it's replaced.
    fn add(&mut self, src: &str) -> bool {
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

            true
        } else {
            false
        }
    }
}

impl Fold<ImportDecl> for Entry {
    fn fold(&mut self, i: ImportDecl) -> ImportDecl {
        let i = i.fold_children(self);
        if self.add(&i.src.value) {
            ImportDecl {
                src: Str {
                    span: DUMMY_SP,
                    value: js_word!(""),
                    ..i.src
                },
                ..i
            }
        } else {
            i
        }
    }
}
