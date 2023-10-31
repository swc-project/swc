use swc_ecma_ast::Expr;

use crate::{data::Data, AstProxyNode, VecNode};

pub struct ArrayNode<'a> {
    elems: VecNode<SpreadNode<ExprNode<'a>>>,
}

pub struct ObjectNode {}

pub trait ExprLike {}

#[derive(Clone)]
pub struct ExprNode<'a>(pub(crate) Data<'a, Box<Expr>>);

impl AstProxyNode for ExprNode<'_> {}

impl<'a> ExprNode<'a> {
    pub fn cast<T>(&self) -> T
    where
        T: ExprLike,
    {
        todo!()
    }
}

#[derive(Clone)]
pub struct SpreadNode<T>
where
    T: AstProxyNode,
{
    has_spread: bool,
    node: T,
}

impl<T> AstProxyNode for SpreadNode<T> where T: AstProxyNode {}
