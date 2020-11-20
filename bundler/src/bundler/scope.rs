use super::load::TransformedModule;
use crate::{
    id::{Id, ModuleId, ModuleIdGenerator},
    util::CloneMap,
};
use std::sync::atomic::{AtomicBool, Ordering};
use swc_common::{sync::Lrc, FileName};

#[derive(Debug, Default)]
pub(super) struct Metadata {
    pub bundle_cnt: u32,
}

#[derive(Debug, Default)]
pub(super) struct Scope {
    pub module_id_gen: ModuleIdGenerator,

    loaded_modules: CloneMap<ModuleId, ()>,

    /// Cached after applying basical transformations.
    transformed_modules: CloneMap<ModuleId, TransformedModule>,

    accessed_with_computed_key: CloneMap<ModuleId, Lrc<AtomicBool>>,
}

impl Scope {
    pub fn mark_as_loaded(&self, id: ModuleId) {
        self.loaded_modules.insert(id, ());
    }

    /// Stores module information. The information should contain only
    /// information gotten from module itself. In other words, it should not
    /// contains information from a dependency.
    pub fn store_module(&self, info: TransformedModule) {
        self.transformed_modules.insert(info.id, info);
    }

    pub fn get_module_by_path(&self, file_name: &FileName) -> Option<TransformedModule> {
        let (id, _, _) = self.module_id_gen.gen(file_name);
        self.get_module(id)
    }

    pub fn get_module(&self, id: ModuleId) -> Option<TransformedModule> {
        Some(self.transformed_modules.get(&id)?.clone())
    }

    /// Set the module as
    pub fn mark_as_wrapping_required(&self, id: ModuleId) {
        if let Some(v) = self.accessed_with_computed_key.get(&id) {
            v.store(true, Ordering::SeqCst);
            return;
        }

        self.accessed_with_computed_key
            .insert(id, Lrc::new(AtomicBool::from(true)));
    }

    pub fn should_be_wrapped_with_a_fn(&self, id: ModuleId) -> bool {
        if let Some(v) = self.accessed_with_computed_key.get(&id) {
            v.load(Ordering::SeqCst)
        } else {
            false
        }
    }

    /// Returns `Some(module_ident)` if the module should be wrapped
    /// with a function.
    pub fn wrapped_esm_id(&self, id: ModuleId) -> Option<Id> {
        if !self.should_be_wrapped_with_a_fn(id) {
            return None;
        }
        let info = self.get_module(id)?;

        Some(Id::new("mod".into(), info.export_ctxt()))
    }
}
