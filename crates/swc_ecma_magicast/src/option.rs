use crate::Proxy;

pub struct OptionalNode<T>
where
    T: Proxy,
{
    data: Option<T>,
}

impl<T> Proxy for OptionalNode<T> where T: Proxy {}
