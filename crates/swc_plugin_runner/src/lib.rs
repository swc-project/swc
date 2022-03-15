#![cfg_attr(
    not(any(feature = "embedded_runtime", feature = "native_runtime")),
    allow(unused)
)]

use std::path::Path;

use anyhow::{Context, Error};
use once_cell::sync::Lazy;
use swc_common::plugin::Serialized;
use transform_executor::TransformExecutor;

#[cfg(not(target_arch = "wasm32"))]
pub mod cache;
mod context;
mod imported_fn;
mod load_plugin;
mod memory_interop;
mod transform_executor;

// entrypoint fn swc calls to perform its transform via plugin.
#[cfg(not(target_arch = "wasm32"))]
pub fn apply_transform_plugin(
    plugin_name: &str,
    path: &Path,
    cache: &Lazy<cache::PluginModuleCache>,
    program: Serialized,
    config_json: Serialized,
    context_json: Serialized,
) -> Result<Serialized, Error> {
    (|| -> Result<_, Error> {
        let mut transform_tracker = TransformExecutor::new(path, cache)?;

        transform_tracker.transform(&program, &config_json, &context_json)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin at {}",
            plugin_name,
            path.display()
        )
    })
}

#[cfg(target_arch = "wasm32")]
pub fn apply_transform_plugin() -> Result<Serialized, Error> {
    unimplemented!("Not implemented yet");
}
