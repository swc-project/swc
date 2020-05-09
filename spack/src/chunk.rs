use crate::ModuleId;

#[derive(Debug)]
pub(crate) struct Chunk {
    modules: Vec<ModuleId>,
}

impl Chunk {
    pub fn new(modules: Vec<ModuleId>) -> Self {
        Chunk { modules }
    }

    pub fn modules(&self) -> &[ModuleId] {
        &self.modules
    }
}
