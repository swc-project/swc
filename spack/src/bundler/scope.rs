use crate::{bundler::load_transformed::TransformedModule, id::ModuleIdGenerator, ModuleId};
use dashmap::DashMap;
use fxhash::FxBuildHasher;
use std::{path::PathBuf, sync::Arc};

#[derive(Debug, Default)]
pub(super) struct Scope {
    pub module_id_gen: ModuleIdGenerator,

    /// Phase 1 cache
    modules: DashMap<ModuleId, TransformedModule, FxBuildHasher>,
}

impl Scope {
    /// Stores module information. The information should contain only
    /// information gotten from module itself. In other words, it should not
    /// contains information from a dependency.
    pub fn store_module(&self, _path: Arc<PathBuf>, info: TransformedModule) {
        self.modules.insert(info.id, info);
    }

    pub fn get_module_by_path(&self, path: &Arc<PathBuf>) -> Option<TransformedModule> {
        let id = self.module_id_gen.gen(path);
        self.get_module(id)
    }

    pub fn get_module(&self, id: ModuleId) -> Option<TransformedModule> {
        Some(self.modules.get(&id)?.value().clone())
    }
}
