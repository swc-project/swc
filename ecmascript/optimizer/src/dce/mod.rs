use crate::basic_block::Block;
use crate::basic_block::Item;
use crate::basic_block::JumpCond;
use crate::block_id::BlockId;
use crate::control_flow_graph::traversal::Visitor;
use crate::control_flow_graph::ControlFlowGraph;
use crate::mutations::Mutations;
use fxhash::FxHashSet;
use swc_common::Spanned;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Value::Known;

/// Mark-sweep dce.
pub(crate) fn remove_dead_code(cfg: &mut ControlFlowGraph) {
    let mut marker = Marker::default();

    {
        cfg.traverse(&mut marker);
    }

    let mut remover = Remover {
        reachable: &marker.reachable,
    };

    cfg.traverse(&mut remover);
}

#[derive(Debug, Default)]
struct Marker {
    reachable: FxHashSet<BlockId>,
}

impl<'cfg> Visitor<'cfg> for Marker {
    fn init(&mut self, start: BlockId, _: &mut Mutations) {
        self.reachable.insert(start);
    }

    fn visit_block(
        &mut self,
        _: &mut Mutations,
        id: BlockId,
        _: &mut Block<'cfg>,
        next_blocks: &mut Vec<(BlockId, JumpCond<'cfg>)>,
    ) {
        if !self.reachable.contains(&id) {
            return;
        }

        let mut always_jump_to = None;

        for (next_id, cond) in next_blocks.iter_mut() {
            match cond {
                JumpCond::Always => {
                    always_jump_to = Some(*next_id);
                    break;
                }

                JumpCond::Cond { test, if_true } => {
                    //
                    if let Known(test_val) = test.ast.as_pure_bool() {
                        let should_jump = *if_true == test_val;
                        if should_jump {
                            always_jump_to = Some(*next_id);
                            break;
                        }
                    }
                }
            }
        }

        if let Some(next) = always_jump_to {
            next_blocks.push((next, JumpCond::Always));
            self.reachable.insert(next);
        } else {
            for (next, _) in next_blocks {
                self.reachable.insert(*next);
            }
        }
    }
}

#[derive(Debug)]
struct Remover<'a> {
    reachable: &'a FxHashSet<BlockId>,
}

impl<'cfg> Visitor<'cfg> for Remover<'_> {
    fn init(&mut self, _: BlockId, _: &mut Mutations) {}

    fn visit_block(
        &mut self,
        mutations: &mut Mutations,
        id: BlockId,
        block: &mut Block<'cfg>,
        next_blocks: &mut Vec<(BlockId, JumpCond<'cfg>)>,
    ) {
        if !self.reachable.contains(&id) {
            for item in &block.items {
                match item {
                    Item::ModuleItem(i) => {
                        let ctxt = i.span().ctxt;

                        mutations.module_items.entry(ctxt).or_default().drop = true;
                    }
                    Item::Stmt(s) => {
                        let ctxt = s.span().ctxt;

                        mutations.module_items.entry(ctxt).or_default().drop = true;
                    }
                    Item::Expr(_) => {}
                }

                next_blocks.clear();
            }
        }
    }
}
