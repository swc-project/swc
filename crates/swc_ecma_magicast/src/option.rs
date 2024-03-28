use std::{cell::RefCell, rc::Rc};

use crate::AstProxyNode;

pub type WithDefault<'a, T> = OptionalNode<T, Defaultable<'a, T>>;

#[derive(Clone)]
pub struct OptionalNode<T, M = NoDefault>
where
    T: AstProxyNode,
{
    data: RefCell<Option<T>>,
    default: M,
}

impl<T> OptionalNode<T, NoDefault>
where
    T: AstProxyNode,
{
    pub fn new(data: Option<T>) -> Self {
        OptionalNode {
            data: RefCell::new(data),
            default: NoDefault,
        }
    }
}

impl<'a, T> OptionalNode<T, Defaultable<'a, T>>
where
    T: AstProxyNode,
{
    pub fn new_with_default(data: Option<T>, default: impl 'a + Fn() -> T) -> Self {
        OptionalNode {
            data: RefCell::new(data),
            default: Defaultable(Rc::new(default)),
        }
    }

    pub fn ensure(&self) -> T {
        let mut data = self.data.borrow_mut();

        if let Some(data) = &*data {
            return data.clone();
        }

        let new_data = (self.default.0)();

        *data = Some(new_data.clone());

        new_data
    }
}

impl<T> AstProxyNode for OptionalNode<T> where T: AstProxyNode {}

#[derive(Clone)]
pub struct NoDefault;

impl<T> Mode<T> for NoDefault {}

pub struct Defaultable<'a, T>(Rc<dyn 'a + Fn() -> T>);

pub trait Mode<T>: Clone {}

impl<T> Clone for Defaultable<'_, T> {
    fn clone(&self) -> Self {
        Defaultable(self.0.clone())
    }
}

impl<T> Mode<T> for Defaultable<'_, T> {}
