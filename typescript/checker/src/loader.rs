use super::Checker;
use crate::{
    analyzer::{ExportInfo, ImportInfo},
    errors::Error,
    resolver::Resolve,
};
use std::{path::PathBuf, sync::Arc};

pub trait Load: Send + Sync {
    fn load(&self, base: Arc<PathBuf>, import: ImportInfo) -> Result<Arc<ExportInfo>, Error>;
}

impl Load for Checker<'_> {
    fn load(&self, base: Arc<PathBuf>, import: ImportInfo) -> Result<Arc<ExportInfo>, Error> {
        let path = self.resolver.resolve((*base).clone(), &import.src)?;

        unimplemented!("load()")
    }
}

impl<'a, T> Load for &'a T
where
    T: ?Sized + Load,
{
    fn load(&self, base: Arc<PathBuf>, import: ImportInfo) -> Result<Arc<ExportInfo>, Error> {
        (**self).load(base, import)
    }
}
