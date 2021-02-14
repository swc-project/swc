use crate::ModuleId;
use swc_ecma_ast::*;

/// The unit of sorting.
#[derive(Debug)]
pub(super) struct Chunk {
    /// This [None] for injected items.
    pub module_id: Option<ModuleId>,
    pub stmts: Vec<ModuleItem>,
}
