use super::compat::DATA as CORE_JS_COMPAT_DATA;
use crate::{version::should_enable, Version, Versions};
use fxhash::{FxHashMap, FxHashSet};
use once_cell::sync::Lazy;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

static ENTRIES: Lazy<FxHashMap<String, Vec<&'static str>>> = Lazy::new(|| {
    serde_json::from_str::<FxHashMap<String, Vec<String>>>(include_str!("entries.json"))
        .expect("failed to parse entries.json from core js 3")
        .into_iter()
        .map(|(k, v)| {
            (
                k,
                v.into_iter()
                    .map(|s: String| &*Box::leak(s.into_boxed_str()))
                    .collect::<Vec<_>>(),
            )
        })
        .collect()
});

static MODULES_BY_VERSION: Lazy<FxHashMap<Version, Vec<&'static str>>> = Lazy::new(|| {
    serde_json::from_str::<FxHashMap<_, _>>(include_str!("modules-by-versions.json"))
        .expect("failed to parse modules-by-versions.json")
        .into_iter()
        .map(|(k, v): (Version, Vec<String>)| {
            (
                k,
                v.into_iter()
                    .map(|s: String| &*Box::leak(s.into_boxed_str()))
                    .collect::<Vec<_>>(),
            )
        })
        .collect()
});

#[derive(Debug)]
pub struct Entry {
    is_any_target: bool,
    target: Versions,
    corejs_version: Version,
    pub imports: FxHashSet<&'static str>,
    remove_regenerator: bool,
}

impl Entry {
    pub fn new(target: Versions, corejs_version: Version, remove_regenerator: bool) -> Self {
        assert_eq!(corejs_version.major, 3);

        Entry {
            is_any_target: target.is_any_target(),
            target,
            corejs_version,
            imports: Default::default(),
            remove_regenerator,
        }
    }

    /// Add imports.
    /// Returns true if it's replaced.
    fn add(&mut self, src: &str) -> bool {
        let Entry {
            is_any_target,
            target,
            corejs_version,
            remove_regenerator,
            ..
        } = self;

        if *remove_regenerator && src == "regenerator-runtime/runtime" {
            return true;
        }

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

                //                println!("{} -> {}", src, f);

                for (_, features) in MODULES_BY_VERSION
                    .iter()
                    .filter(|(version, _features)| *corejs_version < **version)
                {
                    if features.contains(&*f) {
                        return None;
                    }
                }

                Some(f)
            }));

            true
        } else {
            false
        }
    }
}

impl Fold for Entry {
    fn fold_import_decl(&mut self, i: ImportDecl) -> ImportDecl {
        let i: ImportDecl = i.fold_children_with(self);

        let remove = i.specifiers.is_empty() && self.add(&i.src.value);

        if remove {
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
