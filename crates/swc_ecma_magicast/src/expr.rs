use crate::{Proxy, VecNode};

pub struct ArrayNode {
    elems: VecNode<SpreadNode<ExprNode>>,
}

pub struct ObjectNode {}

pub trait ExprLike {}

pub struct ExprNode {}

impl Proxy for ExprNode {}

impl ExprNode {
    pub fn cast<T>(&self) -> &T
    where
        T: ExprLike,
    {
        unimplemented!()
    }
}

pub struct SpreadNode<T>
where
    T: Proxy,
{
    has_spread: bool,
    node: T,
}

impl<T> Proxy for SpreadNode<T> where T: Proxy {}
