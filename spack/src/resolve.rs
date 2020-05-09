use anyhow::{Context, Error};
use std::path::{Path, PathBuf};

pub trait Resolve {
    ///
    /// Returned filename will be hashed if possible and used to generate module
    /// id.
    fn resolve(&self, base: &Path, import: &str) -> Result<PathBuf, Error>;
}

impl<T: ?Sized + Resolve> Resolve for Box<T> {
    fn resolve(&self, base: &Path, import: &str) -> Result<PathBuf, Error> {
        T::resolve(self, base, import)
    }
}

impl<'a, T: ?Sized + Resolve> Resolve for &'a T {
    fn resolve(&self, base: &Path, import: &str) -> Result<PathBuf, Error> {
        T::resolve(self, base, import)
    }
}

pub struct NodeResolver;

impl Resolve for NodeResolver {
    fn resolve(&self, base: &Path, import: &str) -> Result<PathBuf, Error> {
        Ok(node_resolve::Resolver::new()
            .with_basedir(base.to_path_buf())
            .resolve(import)
            .with_context(|| {
                format!(
                    "node-resolve failed; basedir = {}, import = {}",
                    base.parent().unwrap().display(),
                    import
                )
            })?)
    }
}
