use crate::Proxy;

pub struct OptionalNode<T>
where
    T: Proxy(Option<T>);

impl<T> Proxy for OptionalNode<T>
where
    T: Proxy,
{
    type Item = Option<T::Item>;
}
