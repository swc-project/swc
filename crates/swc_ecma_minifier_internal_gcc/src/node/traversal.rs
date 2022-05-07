use super::Node;
use crate::graph::DiGraphNode;

pub trait Visit {
    fn visit(&mut self, node: &DiGraphNode<Node>);
}
