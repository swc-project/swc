use std::ops::{Deref, DerefMut};

use crate::{data::Data, Proxy};

pub struct ProxyNode<'a, P>
where
    P: Proxy,
{
    data: Data<'a, P::AstNode>,
    inner: P,
}

impl<'a, P> ProxyNode<'a, P>
where
    P: Proxy,
{
    pub fn new(inner: P) -> Self {
        let data = inner.data().clone();
        Self { data, inner }
    }
}

impl<P> Deref for ProxyNode<'_, P>
where
    P: Proxy,
{
    type Target = P;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl<P> DerefMut for ProxyNode<'_, P>
where
    P: Proxy,
{
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.inner
    }
}
