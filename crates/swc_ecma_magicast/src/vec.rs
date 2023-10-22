use std::ops::Index;

use crate::Proxy;

#[derive(Clone)]
pub struct VecNode<T>
where
    T: Proxy,
{
    elems: Vec<T>,
}

impl<T> Proxy for VecNode<T> where T: Proxy {}

impl<T> Index<usize> for VecNode<T>
where
    T: Proxy,
{
    type Output = T;

    fn index(&self, index: usize) -> &Self::Output {
        &self.elems[index]
    }
}
