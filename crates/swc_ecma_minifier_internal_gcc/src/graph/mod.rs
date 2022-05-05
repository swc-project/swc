use petgraph::graph::DiGraph;

use crate::ptr::Ptr;

pub type LinkedDirectedGraph<N, E> = DiGraph<DiGraphNode<N>, E>;

pub struct DiGraphNode<N> {
    data: Ptr<N>,
}

impl<N> DiGraphNode<N> {
    pub fn get_value(&self) -> &Ptr<N> {
        &self.data
    }
}

impl<N> std::ops::Deref for DiGraphNode<N> {
    type Target = Ptr<N>;

    fn deref(&self) -> &Self::Target {
        &self.data
    }
}

impl<N> PartialEq for DiGraphNode<N> {
    fn eq(&self, other: &Self) -> bool {
        self.data == other.data
    }
}
