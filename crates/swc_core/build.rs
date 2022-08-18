use std::{
    env,
    fs::File,
    io::{BufWriter, Write},
    path::Path,
};

use vergen::{vergen, Config};

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

#[cfg(all(feature = "transforms", feature = "transforms_concurrent"))]
compile_error!(
    "'transforms' and 'transforms_concurrent' features are mutually exclusive. Please choose only \
     one feature."
);

fn main() {
    // Creates a static compile time constants for the version of swc_core.
    let pkg_version = env::var("CARGO_PKG_VERSION").unwrap();
    let out_dir = env::var("OUT_DIR").expect("Outdir should exist");
    let dest_path = Path::new(&out_dir).join("core_pkg_version.txt");
    let mut f = BufWriter::new(
        File::create(&dest_path).expect("Failed to create swc_core version constant"),
    );
    write!(f, "{}", pkg_version).expect("Failed to write swc_core version constant");

    // Attempt to collect some build time env values but will skip if there are any
    // errors.
    let _ = vergen(Config::default());
}
