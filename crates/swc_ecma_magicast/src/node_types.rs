use std::ops::{Deref, DerefMut};

use crate::{data::Data, AstProxyNode};

pub struct ProxyNode<'a, P>
where
    P: AstProxyNode,
{
    data: Data<'a, P::AstNode>,
    inner: P,
}

impl<'a, P> ProxyNode<'a, P>
where
    P: AstProxyNode,
{
    pub fn new(inner: P) -> Self {
        let data = inner.data().clone();
        Self { data, inner }
    }
}

impl<P> Deref for ProxyNode<'_, P>
where
    P: AstProxyNode,
{
    type Target = P;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl<P> DerefMut for ProxyNode<'_, P>
where
    P: AstProxyNode,
{
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.inner
    }
}
