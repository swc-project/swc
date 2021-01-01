use swc_ecma_ast::*;

#[derive(Debug)]
pub(crate) enum BlockData {
    ModuleItems(Vec<ModuleItem>),
    Stmts(Vec<Stmt>),
}

/// Basic block.
#[derive(Debug)]
pub(crate) struct Block {
    data: BlockData,
}

impl Default for Block {
    fn default() -> Self {
        Block {
            data: BlockData::ModuleItems(vec![]),
        }
    }
}

impl Block {
    pub fn into_inner(self) -> BlockData {
        self.data
    }
}
