use std::any::Any;

use crate::ptr::Ptr;

pub mod traversal;

#[derive(Clone)]
pub struct Node<'ast> {
    data: Ptr<'ast, dyn Any>,
    parent: Option<Ptr<'ast, Node<'ast>>>,
}

impl<'ast> Node<'ast> {
    pub fn new_root<N>(data: &'ast N) -> Self
    where
        N: 'static + Any,
    {
        Self {
            data: Ptr::<'ast, dyn Any>::new(data),
            parent: None,
        }
    }
}

macro_rules! children {
    (
        $T:ident,
        [
            $($field:ident),*
        ]
    ) => {};
}
