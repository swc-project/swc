use crate::{
    id::{ModuleId, ModuleIdGenerator},
    module::TransformedModule,
    util::Map,
};
use swc_common::FileName;

#[derive(Debug, Default)]
pub(super) struct Scope {
    pub module_id_gen: ModuleIdGenerator,

    /// Loaded modules
    loaded_modules: Map<ModuleId, TransformedModule>,
}

impl Scope {
    /// Stores module information. The information should contain only
    /// information gotten from module itself. In other words, it should not
    /// contains information from a dependency.
    pub fn store_module(&self, info: TransformedModule) {
        self.loaded_modules.insert(info.id, info);
    }

    pub fn get_module_by_path(&self, path: &FileName) -> Option<TransformedModule> {
        let (id, _) = self.module_id_gen.gen(path);
        self.get_module(id)
    }

    pub fn get_module(&self, id: ModuleId) -> Option<TransformedModule> {
        Some(self.loaded_modules.get(&id)?.clone())
    }
}
