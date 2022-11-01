use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};
use swc_fast_graph::digraph::FastDiGraphMap;

/// The id of a basic block
pub(crate) type BlockId = u32;

pub(crate) enum NodeRef<'a> {
    Expr(&'a Expr),
    Stmt(&'a Stmt),
}

pub(crate) struct BasicBlock<'a> {
    pub(crate) id: BlockId,
    pub(crate) node: NodeRef<'a>,
}

pub struct ControlFlowGraph<'a> {
    graph: FastDiGraphMap<u32, BasicBlock<'a>>,
}

impl ControlFlowGraph<'_> {
    pub fn analyze(program: &Program) -> Self {
        let mut cfg = ControlFlowGraph {
            graph: Default::default(),
        };

        cfg.analyze_program(program);

        cfg
    }

    fn analyze_program(&mut self, program: &Program) {}
}

struct CfgAnalyzer {
    data: Data,
}

#[derive(Default)]
struct Data {
    next_node_id: BlockId,
}

impl CfgAnalyzer {
    fn handle_stmt(&mut self, s: &Stmt, next_block: BlockId) {}

    /// s === si should be true
    fn handle_if(&mut self, s: &Stmt, si: &IfStmt, next_block: BlockId) -> BlockId {}
}
