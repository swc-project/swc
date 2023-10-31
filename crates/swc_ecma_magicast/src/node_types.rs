use std::ops::Deref;

use crate::Proxy;

pub struct ProxyNode<P>
where
    P: Proxy,
{
    inner: P,
}

impl<P> Deref for ProxyNode<P>
where
    P: Proxy,
{
    type Target = P;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}
