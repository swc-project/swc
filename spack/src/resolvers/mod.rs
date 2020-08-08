use anyhow::{bail, Context, Error};
use std::path::{Path, PathBuf};
use swc_bundler::Resolve;
use swc_common::FileName;

pub struct NodeResolver(node_resolve::Resolver);

impl NodeResolver {
    pub fn new() -> Self {
        Self(
            node_resolve::Resolver::new()
                .with_extensions(&[".ts", ".tsx", ".js", ".jsx", ".json", ".node"])
                .with_main_fields(&["swc-main", "esnext", "main"]),
        )
    }
}

impl Resolve for NodeResolver {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error> {
        let base = match base {
            FileName::Real(v) => v,
            _ => bail!("node-resolver supports only files"),
        };

        let base_dir = base
            .parent()
            .map(Path::to_path_buf)
            .unwrap_or_else(|| PathBuf::from("."));

        let path = self
            .0
            .with_basedir(base_dir.clone())
            .resolve(module_specifier)
            .with_context(|| {
                format!(
                    "node-resolver failed; basedir = {}, import = {}",
                    base_dir.display(),
                    module_specifier
                )
            })?;
        Ok(FileName::Real(path))
    }
}
