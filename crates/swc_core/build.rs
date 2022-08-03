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

#[cfg(all(feature = "__plugin_transform", feature = "common_concurrent"))]
compile_error!("plugin transform cannot enable concurrent mode.");

#[cfg(all(feature = "common", feature = "common_concurrent"))]
compile_error!(
    "'common' and 'common_concurrent' features are mutually exclusive. Please choose only one \
     feature."
);

#[cfg(all(feature = "transforms", feature = "transforms_concurrent"))]
compile_error!(
    "'transforms' and 'transforms_concurrent' features are mutually exclusive. Please choose only \
     one feature."
);

fn main() {
    /* noop */
}
