use anyhow::{Context, Error};
use std::path::{Path, PathBuf};



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
