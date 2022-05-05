use std::ops::Deref;

use petgraph::graph::NodeIndex;
use rustc_hash::FxHashMap;

use crate::{
    graph::{DiGraphNode, LinkedDirectedGraph},
    node::Node,
    ptr::Ptr,
};

pub(crate) struct ControlFlowGraph<N> {
    parent: LinkedDirectedGraph<N, Branch>,

    map: FxHashMap<Ptr<N>, NodeIndex>,

    implicit_return: DiGraphNode<N>,
    entry: DiGraphNode<N>,
}

impl<N> Deref for ControlFlowGraph<N> {
    type Target = LinkedDirectedGraph<N, Branch>;

    fn deref(&self) -> &Self::Target {
        &self.parent
    }
}

impl ControlFlowGraph<Node> {
    pub fn analyze(root: &Node) -> Self {
        todo!()
    }
}

impl<N> ControlFlowGraph<N> {
    pub fn get_entry(&self) -> &DiGraphNode<N> {
        &self.entry
    }

    pub fn get_implicit_return(&self) -> &DiGraphNode<N> {
        &self.implicit_return
    }

    pub fn is_implicit_return(&self, n: &DiGraphNode<N>) -> bool {
        self.implicit_return == *n
    }

    pub(crate) fn node_ix(&self, n: &Ptr<N>) -> NodeIndex {
        self.map[n]
    }
}

/// The edge object for the control flow graph.
///
///
/// Ported from https://github.com/google/closure-compiler/blob/04b38ec900b50629f8427b7ed3d2886c80eb88f0/src/com/google/javascript/jscomp/ControlFlowGraph.java#L92-L118
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Branch {
    /// Edge is taken if the condition is true.
    OnTrue,
    /// Edge is taken if the condition is false.
    OnFalse,
    /// Unconditional branch.
    Unconditional,
    ///
    /// Exception-handling code paths.
    /// Conflates two kind of control flow passing:
    /// - An exception is thrown, and falls into a catch or finally block
    /// - During exception handling, a finally block finishes and control
    ///  passes to the next finally block.
    ///  In theory, we need 2 different edge types. In practice, we
    /// can just treat them as "the edges we can't really optimize".
    OnEX,
    ///  Possible folded-away template
    SynBlock,
}

impl Branch {
    pub fn is_conditional(&self) -> bool {
        matches!(self, Branch::OnTrue | Branch::OnFalse)
    }
}
