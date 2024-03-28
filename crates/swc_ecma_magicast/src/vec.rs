use std::ops::Index;

use crate::AstProxyNode;

#[derive(Clone)]
pub struct VecNode<T>
where
    T: AstProxyNode,
{
    elems: Vec<T>,
}

impl<T> VecNode<T>
where
    T: AstProxyNode,
{
    pub fn new(elems: Vec<T>) -> Self {
        Self { elems }
    }
}

impl<T> AstProxyNode for VecNode<T> where T: AstProxyNode {}

impl<T> Index<usize> for VecNode<T>
where
    T: AstProxyNode,
{
    type Output = T;

    fn index(&self, index: usize) -> &Self::Output {
        &self.elems[index]
    }
}
