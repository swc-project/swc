use std::ops::{Deref, Shl};

pub use crate::{module::*, traits::*, vec::VecNode};

mod data;
mod expr;
mod module;
mod option;
mod traits;
mod vec;

pub struct OptionalNode<T> {
    node: Option<T>,
}

impl<N> OptionalNode<N> {
    pub fn ensure(&mut self) -> &mut N {
        self.node.get_or_insert_with(|| panic!("unreachable"))
    }
}

pub struct ExportItemNode {}

pub struct ArrayNode {
    elems: VecNode<ArrayElemNode>,
}

pub struct ObjectNode {}

pub trait ExprLike {}

pub struct ExprNode {}

impl ExprNode {
    pub fn cast<T>(&self) -> &T
    where
        T: ExprLike,
    {
        unimplemented!()
    }
}

pub struct ImportNamed {}

impl Deref for ImportNamed {
    type Target = BindingRef;
}

pub struct ImportFrom {}

impl Ensurable for ImportFrom {}

pub struct BindingRef {}

struct ModuleSpecifier(&'a str);

struct Identifier(&'a str);

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
