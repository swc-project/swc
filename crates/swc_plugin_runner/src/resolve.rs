use std::{env::current_dir, path::PathBuf};

use anyhow::{Context, Error};
use wasmer_cache::FileSystemCache;

/// Type of cache to store compiled bytecodes of plugins.
/// Currently only supports filesystem, but _may_ supports
/// other type (in-memory, etcs) for the long-running processes like devserver.
pub enum PluginCache {
    File(FileSystemCache),
}

/// Build a path to cache location where plugin's bytecode cache will be stored.
/// This fn does a side effect to create path to cache if given path is not
/// resolvable. If root is not specified, it'll generate default root for cache
/// location.
///
/// Note SWC's plugin should not fail to load when cache location is not
/// available. It'll make each invocation to cold start.
pub fn resolve_plugin_cache_root(root: Option<String>) -> Result<PluginCache, Error> {
    let root_path = match root {
        Some(root) => {
            let mut root = PathBuf::from(root);
            root.push("plugins");
            root
        }
        None => {
            let mut cwd = current_dir().context("failed to get current directory")?;
            cwd.push(".swc");
            cwd.push("plugins");
            cwd
        }
    };

    FileSystemCache::new(root_path)
        .map(PluginCache::File)
        .context("Failed to create cache location for the plugins")
}
