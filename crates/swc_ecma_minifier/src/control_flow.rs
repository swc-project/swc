use swc_ecma_ast::{Expr, Program, Stmt};
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
    pub(crate) nodes: Vec<NodeRef<'a>>,
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
struct Data {}

impl Visit for CfgAnalyzer {
    noop_visit_type!();
}
