use std::{
    env,
    fs::File,
    io::{BufWriter, Write},
    path::Path,
};

use vergen::{CargoBuilder, Emitter};

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
    let cargo = CargoBuilder::all_cargo().unwrap();

    // Creates a static compile time constants for the version of swc_core.
    let pkg_version = env::var("CARGO_PKG_VERSION").unwrap();
    let out_dir = env::var("OUT_DIR").expect("Outdir should exist");
    let dest_path = Path::new(&out_dir).join("core_pkg_version.txt");
    let mut f = BufWriter::new(
        File::create(dest_path).expect("Failed to create swc_core version constant"),
    );
    write!(f, "{}", pkg_version).expect("Failed to write swc_core version constant");

    // Attempt to collect some build time env values but will skip if there are any
    // errors.

    Emitter::default()
        .add_instructions(&cargo)
        .unwrap()
        .emit()
        .unwrap();
}
