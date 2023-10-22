use std::ops::{Deref, Shl};

pub use crate::{expr::*, module::*, option::OptionalNode, traits::*, vec::VecNode};

mod data;
mod expr;
mod module;
mod option;
mod traits;
mod vec;

pub struct BindingRef {}

pub struct Value<T>(T);

impl<'a, T> Shl<T> for &'a mut Value<T> {
    type Output = ();

    fn shl(self, rhs: T) -> Self::Output {
        self.0 = rhs
    }
}

impl<T> Deref for Value<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// Required for moving .cast() calls from the user code to our code
pub trait CastableTo<T>: Proxy {}
