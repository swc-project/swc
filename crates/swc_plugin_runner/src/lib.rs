use std::path::Path;

use anyhow::{Context, Error};
use once_cell::sync::Lazy;
use swc_common::plugin::Serialized;
use transform_executor::TransformExecutor;

pub mod cache;
mod host_environment;
mod imported_fn;
mod load_plugin;
mod memory_interop;
mod transform_executor;

// entrypoint fn swc calls to perform its transform via plugin.
pub fn apply_transform_plugin(
    plugin_name: &str,
    path: &Path,
    cache: &Lazy<cache::PluginModuleCache>,
    program: Serialized,
    config_json: Serialized,
    context_json: Serialized,
    should_enable_comments_proxy: bool,
) -> Result<Serialized, Error> {
    (|| -> Result<_, Error> {
        let mut transform_tracker = TransformExecutor::new(path, cache)?;
        let should_enable_comments_proxy = if should_enable_comments_proxy { 1 } else { 0 };
        transform_tracker.transform(
            &program,
            &config_json,
            &context_json,
            should_enable_comments_proxy,
        )
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin at {}",
            plugin_name,
            path.display()
        )
    })
}
