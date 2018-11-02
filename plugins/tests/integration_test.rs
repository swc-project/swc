extern crate swc_plugins;
extern crate swc_common;

use std::path::{Path, PathBuf};
use std::process::Command;
use swc_plugins::Loader;

#[test]
fn run_the_dummy_plugin() {
    let library = compile_dummy_plugin();
    let mut loader = Loader::new();

    assert!(loader.registrar().is_empty());
    loader.load_plugin(&library).unwrap();
    assert_eq!(loader.registrar().len(), 1);

    let plugins = loader.get_mut::<u32>();
    assert_eq!(plugins.len(), 1);

    let plugin = &mut plugins[0];
    let original = 42;
    let got = plugin.fold(original);
    assert_eq!(got, original + 1);
}

fn compile_dummy_plugin() -> PathBuf {
    let plugins = Path::new(env!("CARGO_MANIFEST_DIR"));
    let dummy_plugin = plugins.join("tests").join("dummy_plugin");

    let mut cmd = Command::new("cargo");
    cmd.arg("build");

    #[cfg(not(debug_assertions))]
    cmd.arg("--release");

    let status = cmd
        .current_dir(&dummy_plugin)
        .status()
        .unwrap();
    assert!(status.success());

    let debug = plugins.parent()
        .unwrap()
        .join("target")
        .join("debug");

    let lib = debug.join("libdummy_plugin.so");
    assert!(lib.exists());

    lib
}
