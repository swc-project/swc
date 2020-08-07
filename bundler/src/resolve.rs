use anyhow::Error;
use swc_common::FileName;

pub trait Resolve: swc_common::sync::Send + swc_common::sync::Sync {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error>;
}

impl<T: ?Sized + Resolve> Resolve for Box<T> {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error> {
        (**self).resolve(base, module_specifier)
    }
}

impl<'a, T: ?Sized + Resolve> Resolve for &'a T {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error> {
        (**self).resolve(base, module_specifier)
    }
}
