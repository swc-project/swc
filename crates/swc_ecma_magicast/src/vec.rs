use crate::Proxy;

pub struct VecNode<T>
where
    T: Proxy,
{
    elems: Vec<T>,
}

impl<T> Proxy for VecNode<T>
where
    T: Proxy,
{
    type Item = Vec<T::Item>;
}
