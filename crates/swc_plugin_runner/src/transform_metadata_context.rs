use swc_common::collections::AHashMap;

/// Host side metadata context plugin may need to access.
/// This is a global context - any plugin will have same values.
pub struct TransformPluginMetadataContext {
    pub filename: Option<String>,
    pub env: String,
    // swcconfig
    // cwd
    pub experimental: AHashMap<String, String>,
}

impl TransformPluginMetadataContext {
    pub fn new(filename: Option<String>, env: String) -> Self {
        TransformPluginMetadataContext {
            filename,
            env,
            experimental: AHashMap::default(),
        }
    }
}
