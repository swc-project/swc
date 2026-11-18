use std::{env, fs, path::Path};

// Validate conflict between host / plugin features
#[cfg(all(
    feature = "ecma_plugin_transform",
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
    // Keep these generated files deterministic so sccache can reuse builds.
    let pkg_version = env::var("CARGO_PKG_VERSION").unwrap();
    let out_dir = env::var("OUT_DIR").expect("Outdir should exist");
    let out_dir = Path::new(&out_dir);

    fs::write(out_dir.join("core_pkg_version.txt"), pkg_version)
        .expect("Failed to write swc_core version constant");
    fs::write(out_dir.join("cargo_features.txt"), cargo_features())
        .expect("Failed to write swc_core feature list");
}

fn cargo_features() -> String {
    let mut features = env::vars()
        .filter_map(|(key, _)| {
            key.strip_prefix("CARGO_FEATURE_")
                .map(|feature| feature.to_ascii_lowercase())
        })
        .collect::<Vec<_>>();

    features.sort_unstable();
    features.join(",")
}
