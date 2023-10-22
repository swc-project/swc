use std::marker::PhantomData;

use crate::Proxy;

pub type WithDefault<T> = OptionalNode<T, Defaultable<T>>;

pub struct OptionalNode<T, M = NoDefault>
where
    T: Proxy,
{
    data: Option<T>,
    _mode: PhantomData<M>,
}

impl<T> Proxy for OptionalNode<T> where T: Proxy {}

pub struct NoDefault;

impl<T> Mode<T> for NoDefault {}

pub struct Defaultable<T>(Box<dyn Fn() -> T>);

pub trait Mode<T> {}

impl<T> Mode<T> for Defaultable<T> {}
