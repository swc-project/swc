use crate::{
    atomicity::Atomicity,
    id::{ModuleId, ModuleIdGenerator},
    module::TransformedModule,
};

#[derive(Debug, Default)]
pub(super) struct Scope<A>
where
    A: Atomicity,
{
    pub module_id_gen: ModuleIdGenerator,

    /// Loaded modules
    loaded_modules: A::ModulesCache,
}

impl<A> Scope<A>
where
    A: Atomicity,
{
    /// Stores module information. The information should contain only
    /// information gotten from module itself. In other words, it should not
    /// contains information from a dependency.
    pub fn store_module(&self, info: TransformedModule) {
        self.loaded_modules.insert(info.id, info);
    }

    pub fn get_module_by_path(&self, path: &Arc<PathBuf>) -> Option<TransformedModule> {
        let (id, _) = self.module_id_gen.gen(path);
        self.get_module(id)
    }

    pub fn get_module(&self, id: ModuleId) -> Option<TransformedModule> {
        Some(self.loaded_modules.get(&id)?.value().clone())
    }
}
