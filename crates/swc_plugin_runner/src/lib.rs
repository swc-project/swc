use std::{path::Path, sync::Arc};

use anyhow::{Context, Error};
use once_cell::sync::Lazy;
use swc_common::{plugin::PluginSerializedBytes, SourceMap};
use transform_executor::TransformExecutor;

pub mod cache;
mod host_environment;
mod imported_fn;
mod load_plugin;
mod memory_interop;
mod transform_executor;

// entrypoint fn swc calls to perform its transform via plugin.
#[allow(clippy::too_many_arguments)]
pub fn apply_transform_plugin(
    plugin_name: &str,
    path: &Path,
    cache: &Lazy<cache::PluginModuleCache>,
    program: PluginSerializedBytes,
    config_json: PluginSerializedBytes,
    context_json: PluginSerializedBytes,
    should_enable_comments_proxy: bool,
    source_map: &Arc<SourceMap>,
) -> Result<PluginSerializedBytes, Error> {
    (|| -> Result<_, Error> {
        let mut transform_tracker = TransformExecutor::new(path, cache, source_map)?;
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
