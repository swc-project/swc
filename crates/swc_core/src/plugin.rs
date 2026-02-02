// #[plugin_transform] macro
#[cfg(any(
    all(
        docsrs,
        any(
            feature = "__common_plugin_transform",
            feature = "__ecma_plugin_transform"
        )
    ),
    feature = "__common_plugin_transform",
    feature = "__ecma_plugin_transform"
))]
#[cfg_attr(
    docsrs,
    doc(cfg(any(
        feature = "__common_plugin_transform",
        feature = "__ecma_plugin_transform"
    )))
)]
pub use swc_plugin_macro::plugin_transform;

/// exported __alloc / __free fn for the guest (plugin)
/// allows to allocate memory from the host side.
/// This should not be directly referenced.
#[cfg(all(feature = "__common_plugin_transform", target_arch = "wasm32"))]
pub mod memory {
    pub use swc_plugin::allocation::*;
}

/// Global HANDLER implementation for the plugin
/// for error reporting.
#[cfg(any(
    all(
        docsrs,
        any(
            feature = "__common_plugin_transform",
            feature = "__ecma_plugin_transform"
        )
    ),
    feature = "__common_plugin_transform",
    feature = "__ecma_plugin_transform"
))]
#[cfg_attr(
    docsrs,
    doc(cfg(any(
        feature = "__common_plugin_transform",
        feature = "__ecma_plugin_transform"
    )))
)]
pub mod errors {
    pub use swc_common::errors::HANDLER;
}

/// Plugin's environment metadata context.
#[cfg(any(
    all(
        docsrs,
        any(
            feature = "__common_plugin_transform",
            feature = "__ecma_plugin_transform"
        )
    ),
    feature = "__common_plugin_transform",
    feature = "__ecma_plugin_transform"
))]
#[cfg_attr(
    docsrs,
    doc(cfg(any(
        feature = "__common_plugin_transform",
        feature = "__ecma_plugin_transform"
    )))
)]
pub mod metadata {
    pub use swc_common::plugin::metadata::TransformPluginMetadataContextKind;
    pub use swc_plugin_proxy::TransformPluginProgramMetadata;
}

/// Proxy to the host's data not attached to the AST, like sourcemap / comments.
/// Or interfaces to setup the plugin's environment from the host.
#[cfg(any(
    all(
        docsrs,
        any(
            feature = "__common_plugin_transform",
            feature = "__plugin_transform_host"
        )
    ),
    feature = "__common_plugin_transform",
    feature = "__plugin_transform_host"
))]
#[cfg_attr(
    docsrs,
    doc(cfg(any(
        feature = "__common_plugin_transform",
        feature = "__plugin_transform_host"
    )))
)]
pub mod proxies {
    pub use swc_plugin_proxy::*;
}
