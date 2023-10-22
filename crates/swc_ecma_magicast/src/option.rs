use std::cell::RefCell;

use crate::Proxy;

pub type WithDefault<'a, T> = OptionalNode<T, Defaultable<'a, T>>;

pub struct OptionalNode<T, M = NoDefault>
where
    T: Proxy,
{
    data: RefCell<Option<T>>,
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

impl<'a, T> OptionalNode<T, Defaultable<'a, T>>
where
    T: Proxy,
{
    pub fn new_with_default(data: Option<T>, default: Box<dyn 'a + Fn() -> T>) -> Self {
        OptionalNode {
            data,
            default: Defaultable(default),
        }
    }

    pub fn ensure(&self) -> T {
        let mut data = self.data.borrow_mut();

        if let Some(data) = &*data {
            return data.clone();
        }

        let data = (self.default.0)();

        *data.borrow_mut() = Some(data.clone());

        data
    }
}

impl<T> Clone for OptionalNode<T>
where
    T: Proxy,
{
    fn clone(&self) -> Self {
        Self {
            data: self.data.clone(),
            default: self.default.clone(),
        }
    }
}

impl<T> Proxy for OptionalNode<T> where T: Proxy {}

pub struct NoDefault;

impl<T> Mode<T> for NoDefault {}

pub struct Defaultable<'a, T>(Box<dyn 'a + Fn() -> T>);

pub trait Mode<T> {}

impl<T> Mode<T> for Defaultable<'_, T> {}
