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
        let module = self.load_module(path);

        if let Some(export) = module.1.exports.get(&import.sym) {
            return Ok((export).clone());
        }
        Err(Error::NoSuchExport { span: import.span })
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
