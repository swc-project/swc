use anyhow::{Context, Error};
use std::path::{Path, PathBuf};

pub trait Resolve: Send + Sync {
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
        let base_dir = base
            .parent()
            .map(Path::to_path_buf)
            .unwrap_or_else(|| PathBuf::from("."));

        Ok(node_resolve::Resolver::new()
            .with_extensions(&[".ts", ".tsx", ".js", ".jsx", ".json", ".node"])
            .with_main_fields(&["swc-main", "esnext", "main"])
            .with_basedir(base_dir.clone())
            .resolve(import)
            .with_context(|| {
                format!(
                    "node-resolve failed; basedir = {}, import = {}",
                    base_dir.display(),
                    import
                )
            })?)
    }
}
