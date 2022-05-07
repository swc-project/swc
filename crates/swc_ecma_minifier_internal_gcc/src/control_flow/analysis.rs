use super::ControlFlowGraph;
use crate::{graph::DiGraphNode, node::Node};

impl<'a, 'ast> ControlFlowGraph<'a, Node<'ast>> {
    /// Ported from https://github.com/google/closure-compiler/blob/e60b2d7bb0977893e113f673fc0e78e7c485ec2f/src/com/google/javascript/jscomp/ControlFlowAnalysis.java
    pub fn analyze(root: &Node) -> Self {
        todo!()
    }
}

type N<'ast> = DiGraphNode<'ast, Node<'ast>>;

struct Analyzer<'a, 'ast> {
    cfg: &'a mut ControlFlowGraph<'ast, Node<'ast>>,
    root: N<'ast>,
}

impl<'a, 'ast> Analyzer<'a, 'ast> {
    fn process(&mut self) {
        let root = self.root.clone();
        let cfg_entry = self.compute_fall_through(&root);
        self.cfg.entry = cfg_entry;
    }

    fn compute_fall_through(&mut self, node: &N<'ast>) -> N<'ast> {
        todo!()
    }
}
