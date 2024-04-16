use std::sync::Arc;

use anyhow::Error;
use swc_atoms::Atom;
#[allow(unused_imports)]
use swc_common::{
    sync::{Send, Sync},
    FileName,
};

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Resolution {
    pub filename: FileName,
    pub slug: Option<Atom>,
}

pub trait Resolve: Send + Sync {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<Resolution, Error>;
}

macro_rules! impl_ref {
    ($R:ident, $T:ty) => {
        impl<$R> Resolve for $T
        where
            R: ?Sized + Resolve,
        {
            fn resolve(&self, base: &FileName, src: &str) -> Result<Resolution, Error> {
                (**self).resolve(base, src)
            }
        }
    };
}

impl_ref!(R, &'_ R);
impl_ref!(R, Box<R>);
impl_ref!(R, Arc<R>);
