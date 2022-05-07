use super::Node;
use crate::graph::DiGraphNode;

pub trait Visit<'ast> {
    fn visit(&mut self, node: &DiGraphNode<Node<'ast>>);
}
