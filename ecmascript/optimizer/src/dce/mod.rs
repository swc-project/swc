use crate::basic_block::Block;
use crate::basic_block::JumpCond;
use crate::block_id::BlockId;
use crate::control_flow_graph::traversal::Visitor;
use crate::control_flow_graph::ControlFlowGraph;
use fxhash::FxHashSet;

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

impl Visitor<'_> for Marker {}

#[derive(Debug)]
struct Remover<'a> {
    reachable: &'a FxHashSet<BlockId>,
}

impl Visitor<'_> for Remover<'_> {}
