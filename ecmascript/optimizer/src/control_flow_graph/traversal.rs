use super::ControlFlowGraph;
use crate::basic_block::Block;
use crate::basic_block::JumpCond;
use crate::block_id::BlockId;
use std::collections::VecDeque;
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
        let mut stack = VecDeque::new();
        stack.push_front(self.start);

        while let Some(cur) = stack.pop_front() {
            if let Some(block) = self.blocks.get_mut(&cur) {
                let next = self.next.entry(cur).or_default();
                v.visit_block(cur, block, next)
            }
        }
    }
}
