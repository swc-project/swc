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

// TODO: need exhaustive list of features support __common
#[cfg(all(feature = "perf", not(feature = "__common")))]
compile_error!(
    "'perf' feature is only available when enabling 'common' feature. Enabling \
     'plugin_transform*' will enable common features internally."
);

fn main() {
    /* noop */
}
