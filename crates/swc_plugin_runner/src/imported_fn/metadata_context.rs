use std::sync::Arc;

use wasmer::{LazyInit, Memory};

use crate::TransformPluginMetadataContext;

#[derive(wasmer::WasmerEnv, Clone)]
pub struct MetadataContextHostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    pub metadata_context: Arc<TransformPluginMetadataContext>,
    pub plugin_config: Option<serde_json::Value>,
}

impl MetadataContextHostEnvironment {
    pub fn new(
        metadata_context: Arc<TransformPluginMetadataContext>,
        plugin_config: Option<serde_json::Value>,
    ) -> Self {
        MetadataContextHostEnvironment {
            memory: LazyInit::default(),
            metadata_context,
            plugin_config,
        }
    }
}

pub fn get_raw_experiemtal_transform_context(env: &MetadataContextHostEnvironment) -> u32 {
    0
}
