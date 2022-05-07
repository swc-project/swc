use super::ControlFlowGraph;
use crate::{graph::DiGraphNode, node::Node};

impl ControlFlowGraph<Node> {
    /// Ported from https://github.com/google/closure-compiler/blob/e60b2d7bb0977893e113f673fc0e78e7c485ec2f/src/com/google/javascript/jscomp/ControlFlowAnalysis.java
    pub fn analyze(root: &Node) -> Self {
        todo!()
    }
}

type N = DiGraphNode<Node>;

struct Analyzer<'a> {
    cfg: &'a mut ControlFlowGraph<Node>,
    root: N,
}

impl Analyzer<'_> {
    fn process(&mut self) {
        let root = self.root.clone();
        let cfg_entry = self.compute_fall_through(&root);
        self.cfg.entry = cfg_entry;
    }

    fn compute_fall_through(&mut self, node: &N) -> N {
        todo!()
    }
}
