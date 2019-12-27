use super::builtin::BUILTINS;
use crate::{version::should_enable, Version, Versions};
use fxhash::FxHashSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{Fold, FoldWith, DUMMY_SP};
use swc_ecma_ast::*;

#[derive(Debug)]
pub struct Entry {
    is_any_target: bool,
    target: Versions,
    pub imports: FxHashSet<JsWord>,
}

impl Entry {
    pub fn new(target: Versions, regenerator: bool) -> Self {
        let is_any_target = target.is_any_target();
        let is_web_target = target.iter().any(|(k, v)| {
            if k == "node" {
                return false;
            }

            v.is_some()
        });

        let mut v = Entry {
            is_any_target: target.is_any_target(),
            target,
            imports: Default::default(),
        };
        if is_any_target || is_web_target {
            v.imports.insert("core-js/modules/web.timers".into());
            v.imports.insert("core-js/modules/web.immediate".into());
            v.imports.insert("core-js/modules/web.dom.iterable".into());
        }

        if regenerator {
            v.imports.insert("regenerator-runtime/runtime".into());
        }

        v
    }

    /// Add imports.
    /// Returns true if it's replaced.
    fn add_all(&mut self, src: &str) -> bool {
        let Entry {
            is_any_target,
            target,
            ..
        } = self;

        if src != "@swc/polyfill" && src != "core-js" {
            return false;
        }

        for (feature, version) in BUILTINS.iter() {
            self.add_inner(&feature, *version);
        }

        true
    }

    fn add(&mut self, feature: &str) {
        if let Some(version) = BUILTINS.get(feature) {
            self.add_inner(feature, *version);
        }
    }

    fn add_inner(&mut self, feature: &str, version: Versions) {
        if self.is_any_target || should_enable(self.target, version, true) {
            self.imports
                .insert(format!("core-js/modules/{}", feature).into());
        }
    }
}

impl Fold<ImportDecl> for Entry {
    fn fold(&mut self, i: ImportDecl) -> ImportDecl {
        let i: ImportDecl = i.fold_children(self);

        let remove = i.specifiers.is_empty() && self.add_all(&i.src.value);

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
