use std::{
    env,
    fs::{self, File},
    io::{BufWriter, Write},
    path::{Path, PathBuf},
};

use toml::Value;

/// Creates a compile time constant to pick up latest known working version of
/// swc_core for the plugin template.
/// This'll ensure each version of published swc_cli will create a plugin
/// template can be compiled correctly, then user can try to upgrade dependency
/// as needed.
fn main() {
    let core_path = PathBuf::from(&env::var("CARGO_MANIFEST_DIR").unwrap())
        .parent()
        .unwrap()
        .join("swc_core")
        .join("Cargo.toml");

    let core_metadata = fs::read_to_string(core_path).unwrap();
    let core_metadata: Value = toml::from_str(&core_metadata).unwrap();
    let core_version = core_metadata
        .get("package")
        .unwrap()
        .get("version")
        .unwrap()
        .as_str()
        .unwrap();
    let core_version: Vec<&str> = core_version[0..core_version.len() - 2].split('.').collect();
    // We'll pick semver major.minor, and allow any patch version.
    let core_version = format!("{}.{}.*", core_version[0], core_version[1]);

    let out_dir = env::var("OUT_DIR").expect("Outdir should exist");
    let dest_path = Path::new(&out_dir).join("core_semver_version.txt");
    let mut f = BufWriter::new(
        File::create(&dest_path).expect("Failed to create swc_core version constant"),
    );
    write!(f, "{}", core_version).expect("Failed to write swc_core version constant");
}
