use crate::{
    analyzer::{ExportInfo, ImportInfo},
    errors::Error,
    resolver::Resolve,
};
use std::{path::PathBuf, sync::Arc};

pub trait Load: Send + Sync {
    fn load(&self, base: Arc<PathBuf>, import: ImportInfo) -> Result<Arc<ExportInfo>, Error>;
}

pub struct Loader<R>
where
    R: Resolve,
{
    resolver: R,
}

impl<R> Loader<R>
where
    R: Resolve,
{
    pub fn new(resolver: R) -> Self {
        Loader { resolver }
    }
}

impl<R> Load for Loader<R>
where
    R: Resolve,
{
    fn load(&self, base: Arc<PathBuf>, import: ImportInfo) -> Result<Arc<ExportInfo>, Error> {
        unimplemented!("load()")
    }
}
