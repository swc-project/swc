use anyhow::Error;
use std::{path::Path, sync::Arc};
use swc_common::SourceFile;
use swc_ecma_ast::Module;

pub trait Load: Send + Sync {
    fn load(&self, path: &Path) -> Result<(Arc<SourceFile>, Module), Error>;
}

impl<T: ?Sized + Load> Load for Box<T> {
    fn load(&self, path: &Path) -> Result<(Arc<SourceFile>, Module), Error> {
        T::load(self, path)
    }
}

impl<'a, T: ?Sized + Load> Load for &'a T {
    fn load(&self, path: &Path) -> Result<(Arc<SourceFile>, Module), Error> {
        T::load(self, path)
    }
}
