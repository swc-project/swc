#![cfg_attr(not(feature = "encoding-impl"), allow(warnings))]

use std::sync::Arc;

use swc_common::{plugin::metadata::TransformPluginMetadataContext, SourceMap};
use transform_executor::TransformExecutor;

pub mod cache;
mod host_environment;
#[cfg(feature = "encoding-impl")]
mod imported_fn;
#[cfg(feature = "encoding-impl")]
mod memory_interop;
pub mod plugin_module_bytes;
pub mod runtime;
mod transform_executor;

use plugin_module_bytes::PluginModuleBytes;

/**
 * Creates an executor to run plugin binaries.
 */
#[cfg(feature = "encoding-impl")]
pub fn create_plugin_transform_executor(
    source_map: &Arc<SourceMap>,
    unresolved_mark: &swc_common::Mark,
    metadata_context: &Arc<TransformPluginMetadataContext>,
    plugin_env_vars: Option<Arc<Vec<swc_atoms::Atom>>>,
    plugin_module: Box<dyn PluginModuleBytes>,
    plugin_config: Option<serde_json::Value>,
    plugin_runtime: Arc<dyn runtime::Runtime>,
) -> TransformExecutor {
    TransformExecutor::new(
        plugin_module,
        source_map,
        unresolved_mark,
        metadata_context,
        plugin_env_vars,
        plugin_config,
        plugin_runtime,
    )
}

#[cfg(not(feature = "encoding-impl"))]
pub fn create_plugin_transform_executor(
    source_map: &Arc<SourceMap>,
    unresolved_mark: &swc_common::Mark,
    metadata_context: &Arc<TransformPluginMetadataContext>,
    plugin_env_vars: Option<Arc<Vec<swc_atoms::Atom>>>,
    plugin_module: Box<dyn PluginModuleBytes>,
    plugin_config: Option<serde_json::Value>,
    runtime: Option<()>,
) -> TransformExecutor {
    unimplemented!("Transform plugin cannot be used without serialization support")
}
