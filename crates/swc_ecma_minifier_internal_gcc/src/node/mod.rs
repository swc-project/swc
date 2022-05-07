use std::{any::Any, rc::Rc};

use owning_ref::OwningRef;

use crate::ptr::Ptr;

#[derive(Clone)]
pub struct Node {
    data: Ptr<dyn Any>,
    parent: Option<Ptr<Node>>,
}

impl Node {
    pub fn new_root<N>(data: N) -> Self
    where
        N: 'static + Any,
    {
        let data = Rc::new(data);
        let or = OwningRef::new(data);

        let inner = or.erase_owner();
        let inner = inner.map(|v| v as &dyn Any);

        Self {
            data: inner.into(),
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
