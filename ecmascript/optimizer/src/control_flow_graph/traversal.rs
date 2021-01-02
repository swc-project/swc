use super::ControlFlowGraph;
use crate::basic_block::Block;
use crate::basic_block::JumpCond;
use crate::block_id::BlockId;
pub(crate) trait Visitor<'cfg> {
    fn visit_block(
        &mut self,
        _id: BlockId,
        _block: &mut Block<'cfg>,
        _next: &mut Vec<(BlockId, JumpCond<'cfg>)>,
    ) {
    }
}

impl<'cfg> ControlFlowGraph<'cfg> {
    pub(crate) fn traverse<V>(&mut self, v: &mut V)
    where
        V: Visitor<'cfg>,
    {
    }
}
