use std::{path::Path, sync::Arc};

use anyhow::Error;
use once_cell::sync::Lazy;
use swc_common::{plugin::metadata::TransformPluginMetadataContext, SourceMap};
use transform_executor::TransformExecutor;

pub mod cache;
mod host_environment;
#[cfg(feature = "__rkyv")]
mod imported_fn;
#[cfg(feature = "__rkyv")]
mod load_plugin;
#[cfg(feature = "__rkyv")]
mod memory_interop;
mod transform_executor;

/**
 * Attempt to create a executor to run plugin binaries.
 * Internally this will try to load binary from given cache which can fail,
 * returns error in that case.
 *
 * Note you CANNOT reuse executor once trasform has been executed: executor
 * is stateful.
 */
#[cfg(feature = "__rkyv")]
pub fn create_plugin_transform_executor(
    path: &Path,
    cache: &Lazy<cache::PluginModuleCache>,
    source_map: &Arc<SourceMap>,
    metadata_context: &Arc<TransformPluginMetadataContext>,
    plugin_config: Option<serde_json::Value>,
) -> Result<TransformExecutor, Error> {
    TransformExecutor::new(path, cache, source_map, metadata_context, plugin_config)
}

#[cfg(not(feature = "__rkyv"))]
pub fn create_plugin_transform_executor(
    path: &Path,
    cache: &Lazy<cache::PluginModuleCache>,
    source_map: &Arc<SourceMap>,
    metadata_context: &Arc<TransformPluginMetadataContext>,
    plugin_config: Option<serde_json::Value>,
) -> Result<TransformExecutor, Error> {
    unimplemented!("Transform plugin cannot be used without serialization support")
}
