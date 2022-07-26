use std::env;

use crate::collections::AHashMap;

#[derive(Copy, Clone)]
pub enum TransformPluginMetadataContextKind {
    Filename = 1,
    Env = 2,
    Cwd = 3,
}

/// Host side metadata context plugin may need to access.
/// This is a global context - any plugin in single transform will have same
/// values.
pub struct TransformPluginMetadataContext {
    pub filename: Option<String>,
    pub env: String,
    pub cwd: Option<String>,
    pub experimental: AHashMap<String, String>,
}

impl TransformPluginMetadataContext {
    pub fn new(
        filename: Option<String>,
        env: String,
        experimental: Option<AHashMap<String, String>>,
    ) -> Self {
        TransformPluginMetadataContext {
            filename,
            env,
            cwd: env::current_dir()
                .map(|cwd| cwd.as_path().to_string_lossy().to_string())
                .ok(),
            experimental: experimental.unwrap_or_default(),
        }
    }
}
