use swc_ecma_ast::*;

/// The unit of sorting.
#[derive(Debug)]
pub(super) struct Chunk {
    pub stmts: Vec<ModuleItem>,
}
