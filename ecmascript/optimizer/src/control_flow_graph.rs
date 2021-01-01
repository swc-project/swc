use crate::basic_block::Block;
use crate::block_id::BlockId;
use fxhash::FxHashMap;

/// This struct is required for optimizaiotn.
#[derive(Debug)]
pub struct ControlFlowGraph<T> {
    blocks: FxHashMap<BlockId, Block<T>>,
    next: FxHashMap<BlockId, Vec<BlockId>>,
    start: BlockId,
}

impl<T> ControlFlowGraph<T> {
    pub fn anaylze(stmts: Vec<T>) -> Self {}

    pub fn take(self) -> Vec<T> {}
}

/// Used while creating control flow graph from ast.
struct Scope<'a> {}
