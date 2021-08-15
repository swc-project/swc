use anyhow::Error;
use std::sync::Arc;
use swc_common::{
    sync::{Send, Sync},
    FileName,
};

pub trait Resolve: Send + Sync {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error>;
}

macro_rules! impl_ref {
    ($R:ident, $T:ty) => {
        impl<$R> Resolve for $T
        where
            R: ?Sized + Resolve,
        {
            fn resolve(&self, base: &FileName, src: &str) -> Result<FileName, Error> {
                (**self).resolve(base, src)
            }
        }
    };
}

impl_ref!(R, &'_ R);
impl_ref!(R, Box<R>);
impl_ref!(R, Arc<R>);
