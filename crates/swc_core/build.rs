/*#[cfg(all(not(feature = "swc_v1"), not(feature = "swc_v2")))]
compile_error!("Please enable swc_v1 or swc_v2 feature");*/

// Validate conflict between host / plugin features
#[cfg(all(
    feature = "plugin_transform",
    any(
        feature = "plugin_transform_host_native",
        feature = "plugin_transform_host_js"
    )
))]
compile_error!(
    "'plugin_transform' and 'plugin_transform_host*' features are mutually exclusive. If you're \
     writing a plugin, use 'plugin_transform' feature. If you're writing a custom SWC binary to \
     run plugin, use 'plugin_transform_host_*' instead."
);

fn main() {
    /* noop */
}
