use super::load::TransformedModule;
use crate::{
    id::{ModuleId, ModuleIdGenerator},
    util::CloneMap,
};
use swc_common::FileName;

#[derive(Debug, Default)]
pub(super) struct Scope {
    pub module_id_gen: ModuleIdGenerator,

    loaded_modules: CloneMap<ModuleId, ()>,

    /// Cached after applying basical transformations.
    transformed_modules: CloneMap<ModuleId, TransformedModule>,
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
        let (id, _) = self.module_id_gen.gen(file_name);
        self.get_module(id)
    }

    pub fn get_module(&self, id: ModuleId) -> Option<TransformedModule> {
        Some(self.transformed_modules.get(&id)?.clone())
    }
}
