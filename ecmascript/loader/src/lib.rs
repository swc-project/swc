use std::rc::Rc;
use std::sync::Arc;
use swc_common::errors::Diagnostic;
use swc_common::FileName;
use swc_ecma_ast::Module;

pub mod tsc;

pub trait Loader {
    fn load(&self, file: &FileName) -> Result<Arc<Module>, Diagnostic>;
}

pub trait Resolver {
    fn resolve(&self, base: &FileName, target: &str) -> Result<FileName, Diagnostic>;
}

macro_rules! impl_ref {
    ($TP:ident,$T:ty) => {
        impl<$TP> Loader for $T
        where
            $TP: Loader,
        {
            fn load(&self, file: &FileName) -> Result<Arc<Module>, Diagnostic> {
                (**self).load(file)
            }
        }

        impl<$TP> Resolver for $T
        where
            $TP: Resolver,
        {
            fn resolve(&self, base: &FileName, target: &str) -> Result<FileName, Diagnostic> {
                (**self).resolve(base, target)
            }
        }
    };
}

impl_ref!(T, &'_ T);
impl_ref!(T, Box<T>);
impl_ref!(T, Rc<T>);
impl_ref!(T, Arc<T>);
