use swc_ecma_ast::{Expr, Stmt};
use swc_fast_graph::digraph::FastDiGraphMap;

/// The id of a basic block
pub(crate) type BlockId = u32;

pub(crate) enum NodeRef<'a> {
    Expr(&'a Expr),
    Stmt(&'a Stmt),
}

pub(crate) struct BasicBlock<'a> {
    pub(crate) id: BlockId,
    pub(crate) nodes: Vec<NodeRef<'a>>,
}

pub struct ControlFlowGraph<'a> {
    graph: FastDiGraphMap<u32, BasicBlock<'a>>,
}
