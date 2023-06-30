#![cfg_attr(not(feature = "__rkyv"), allow(warnings))]

use std::sync::Arc;

use swc_common::{plugin::metadata::TransformPluginMetadataContext, SourceMap};
use transform_executor::TransformExecutor;

pub mod cache;
mod host_environment;
#[cfg(feature = "__rkyv")]
mod imported_fn;
#[cfg(feature = "__rkyv")]
mod memory_interop;
pub mod plugin_module_bytes;
mod transform_executor;
pub mod wasix_runtime;

use plugin_module_bytes::PluginModuleBytes;

/**
 * Creates an executor to run plugin binaries.
 */
#[cfg(feature = "__rkyv")]
pub fn create_plugin_transform_executor(
    source_map: &Arc<SourceMap>,
    unresolved_mark: &swc_common::Mark,
    metadata_context: &Arc<TransformPluginMetadataContext>,
    plugin_module: Box<dyn PluginModuleBytes>,
    plugin_config: Option<serde_json::Value>,
    runtime: Option<Arc<dyn wasmer_wasix::Runtime + Send + Sync>>,
) -> TransformExecutor {
    TransformExecutor::new(
        plugin_module,
        source_map,
        unresolved_mark,
        metadata_context,
        plugin_config,
        runtime,
    )
}

#[cfg(not(feature = "__rkyv"))]
pub fn create_plugin_transform_executor(
    source_map: &Arc<SourceMap>,
    unresolved_mark: &swc_common::Mark,
    metadata_context: &Arc<TransformPluginMetadataContext>,
    plugin_module: Box<dyn PluginModuleBytes>,
    plugin_config: Option<serde_json::Value>,
    runtime: Option<()>,
) -> TransformExecutor {
    unimplemented!("Transform plugin cannot be used without serialization support")
}
