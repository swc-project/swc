use fxhash::FxHashSet;

use super::ControlFlowGraph;
use crate::basic_block::Block;
use crate::basic_block::JumpCond;
use crate::block_id::BlockId;
use crate::mutations::Mutations;
use std::collections::VecDeque;
pub(crate) trait Visitor<'cfg> {
    fn visit_block(
        &mut self,
        mutations: &mut Mutations,
        id: BlockId,
        block: &mut Block<'cfg>,
        next_blocks: &mut Vec<(BlockId, JumpCond<'cfg>)>,
    );
}

impl<'cfg> ControlFlowGraph<'cfg> {
    pub(crate) fn traverse<V>(&mut self, v: &mut V)
    where
        V: Visitor<'cfg>,
    {
        let mut visited = FxHashSet::default();
        let mut stack = VecDeque::new();
        stack.push_front(self.start);

        while let Some(cur) = stack.pop_front() {
            visited.insert(cur);

            if let Some(block) = self.blocks.get_mut(&cur) {
                let next = self.next.entry(cur).or_default();
                for (next, _) in &*next {
                    if visited.contains(&*next) {
                        continue;
                    }

                    stack.push_front(*next);
                }

                v.visit_block(&mut self.mutations, cur, block, next);
            }
        }
    }
}
