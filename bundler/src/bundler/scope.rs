use super::load::{Specifier, TransformedModule};
use crate::{
    id::{ModuleId, ModuleIdGenerator},
    util::CloneMap,
};
use swc_common::FileName;
use swc_ecma_ast::Str;

#[derive(Debug, Default)]
pub(super) struct Scope {
    pub module_id_gen: ModuleIdGenerator,

    /// To make code clear and performant, circular dependencies are stored
    /// here.
    incomplete: CloneMap<ModuleId, (Str, Vec<Specifier>)>,
    circular_modules: CloneMap<ModuleId, ()>,
    loaded_modules: CloneMap<ModuleId, ()>,

    /// Cached after applying basical transformations.
    transformed_modules: CloneMap<ModuleId, TransformedModule>,
}

impl Scope {
    pub fn is_circular(&self, id: ModuleId) -> bool {
        self.circular_modules.get(&id).is_some()
    }

    pub fn mark_as_circular(&self, file_name: &FileName) {
        let (id, ..) = self.module_id_gen.gen(file_name);

        self.circular_modules.insert(id, ());
    }

    pub fn mark_as_incomplete(&self, id: ModuleId, src: Str, specifiers: Vec<Specifier>) {
        self.incomplete.insert(id, (src, specifiers));
    }

    pub fn is_loaded(&self, file_name: &FileName) -> bool {
        let id = self.module_id_gen.gen(file_name);

        self.loaded_modules.get(&id.0).is_some()
    }

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
