use std::{ops::Range, sync::Arc};

use indexmap::IndexSet;
use preset_env_base::{
    version::{should_enable, Version},
    Versions,
};
use rustc_hash::FxBuildHasher;
use swc_atoms::atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::VisitMut;

use super::{compat::DATA as CORE_JS_COMPAT_DATA, data};
use crate::util::{PooledStr, SwcFold};

include!(concat!(env!("OUT_DIR"), "/corejs3_entries/lib.rs"));

pub struct FeatureSet(Range<u32>);

pub fn entries_get(name: &str) -> Option<FeatureSet> {
    let index = ENTRY_INDEX.get(name)?;
    ENTRY_VALUES_LIST.get(index).cloned().map(FeatureSet)
}

impl FeatureSet {
    pub fn iter(&self) -> impl ExactSizeIterator<Item = &'static str> {
        use precomputed_map::store::AccessSeq;

        use crate::util::PooledStr;

        self.0
            .clone()
            .map(|idx| EntryValuesStringId::index(idx as usize).unwrap())
            .map(|id| PooledStr(id).as_str())
    }
}

#[derive(Debug)]
pub struct Entry {
    is_any_target: bool,
    target: Arc<Versions>,
    corejs_version: Version,
    pub imports: IndexSet<&'static str, FxBuildHasher>,
    remove_regenerator: bool,
}

impl Entry {
    pub fn new(target: Arc<Versions>, corejs_version: Version, remove_regenerator: bool) -> Self {
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

        if *remove_regenerator && src == "regenerator-runtime/runtime.js" {
            return true;
        }

        if let Some(features) = entries_get(src) {
            self.imports.extend(features.iter().filter(|f| {
                let feature = CORE_JS_COMPAT_DATA.get(*f);

                if !*is_any_target {
                    if let Some(feature) = feature {
                        if !should_enable(target, feature, true) {
                            return false;
                        }
                    }
                }

                if let Some(version) = data::modules_by_version(f) {
                    return version <= *corejs_version;
                }

                true
            }));

            true
        } else {
            false
        }
    }
}

impl VisitMut for Entry {
    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {
        let remove = i.specifiers.is_empty() && self.add(&i.src.value.to_string_lossy());

        if remove {
            i.src.span = DUMMY_SP;
            i.src.value = atom!("").into();
        }
    }
}
