use super::builtin::BUILTINS;
use crate::{version::should_enable, Version, Versions};
use fxhash::FxHashSet;
use swc_atoms::JsWord;

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

    /// Add imports.
    /// Returns true if it's replaced.
    fn add(&mut self, src: &str) -> bool {
        let Entry {
            is_any_target,
            target,
            ..
        } = self;

        if !*is_any_target {
            if let Some(feature) = BUILTINS.get(src) {
                if !should_enable(*target, *feature, true) {
                    return false;
                }
            }
        }

        self.imports
            .insert(format!("core-js/modules/{}", src).into());
        true
    }
}
