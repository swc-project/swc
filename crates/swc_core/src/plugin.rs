// #[plugin_transform] macro
#[cfg(feature = "plugin_transform")]
pub use swc_plugin_macro::plugin_transform;

/// exported __alloc / __free fn for the guest (plugin)
/// allows to allocate memory from the host side.
/// This should not be directly referenced.
#[cfg(all(feature = "plugin_transform", target_arch = "wasm32"))]
pub mod memory {
    pub use swc_plugin::allocation::*;
}

/// Global HANDLER implementation for the plugin
/// for error reporting.
#[cfg(feature = "plugin_transform")]
pub mod errors {
    /// global context HANDLER in plugin's transform function.
    pub static HANDLER: swc_plugin::pseudo_scoped_key::PseudoScopedKey<
        swc_common::errors::Handler,
    > = swc_plugin::pseudo_scoped_key::PseudoScopedKey {
        inner: once_cell::sync::OnceCell::new(),
    };
}

/// Plugin's environment metadata context.
#[cfg(feature = "plugin_transform")]
pub mod metadata {
    pub use swc_common::plugin::metadata::TransformPluginMetadataContextKind;
    pub use swc_plugin_proxy::TransformPluginProgramMetadata;
}

/// Proxy to the host's data not attached to the AST, like sourcemap / comments.
#[cfg(feature = "plugin_transform")]
pub mod proxies {
    pub use swc_plugin_proxy::*;
}
