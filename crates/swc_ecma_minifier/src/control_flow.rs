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

pub(crate) enum Branch {
    OnTrue,
    OnFalse,
}

impl CfgAnalyzer {
    fn next_id(&mut self) -> BlockId {
        let id = self.data.next_node_id;
        self.data.next_node_id += 1;
        id
    }

    fn compute_fall_through(&mut self, s: &Stmt) -> BlockId {}

    fn create_edge(&mut self, from: &BasicBlock, branch: Branch, to: BlockId) -> BlockId {}

    fn handle_stmt(&mut self, s: &Stmt, next_block: BlockId) {}

    /// s === si should be true
    fn handle_if(&mut self, s: &Stmt, si: &IfStmt, next_block: BlockId) -> BlockId {
        self.create_edge(s, Branch::OnTrue, self.compute_fall_throuh(&si.cons));

        match &si.alt {
            None => {
                self.create_edge(s, Branch::OnFalse, next_block);
            }
            Some(alt) => {
                self.create_edge(s, Branch::OnFalse, self.compute_fall_through(alt));
            }
        }

        self.connect_to_possible_exception_handler(s, &si.test);
    }
}
