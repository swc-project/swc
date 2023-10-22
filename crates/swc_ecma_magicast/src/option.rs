use crate::Proxy;

pub type WithDefault<T> = OptionalNode<T, Defaultable<T>>;

pub struct OptionalNode<T, M = NoDefault>
where
    T: Proxy,
{
    data: Option<T>,
    default: M,
}

impl<T> OptionalNode<T, NoDefault>
where
    T: Proxy,
{
    pub fn new(data: Option<T>) -> Self {
        OptionalNode {
            data,
            default: NoDefault,
        }
    }
}

impl<T> OptionalNode<T, Defaultable<T>>
where
    T: Proxy,
{
    pub fn new_with_default(data: Option<T>, default: Box<dyn Fn() -> T>) -> Self {
        OptionalNode {
            data,
            default: Defaultable(default),
        }
    }
}

impl<T> Proxy for OptionalNode<T> where T: Proxy {}

pub struct NoDefault;

impl<T> Mode<T> for NoDefault {}

pub struct Defaultable<T>(Box<dyn Fn() -> T>);

pub trait Mode<T> {}

impl<T> Mode<T> for Defaultable<T> {}
