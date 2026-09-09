#![allow(dead_code)]

use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
    sync::OnceLock,
};

pub fn fixture() -> &'static Path {
    static FIXTURE: OnceLock<(tempfile::TempDir, PathBuf)> = OnceLock::new();
    &FIXTURE
        .get_or_init(|| {
            let directory = tempfile::tempdir().unwrap();
            let output = directory.path().join("real-addon.node");
            let source = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures/abi.rs");
            compile(&source, &output);
            (directory, output)
        })
        .1
}

pub fn compile(source: &Path, output: &Path) {
    let result = Command::new("rustc")
        .args([
            "--edition=2021",
            "--crate-type=cdylib",
            "-C",
            "opt-level=2",
            "-C",
            "strip=symbols",
        ])
        .arg(source)
        .arg("-o")
        .arg(output)
        .output()
        .unwrap();
    assert!(
        result.status.success(),
        "fixture compilation failed: {}",
        String::from_utf8_lossy(&result.stderr)
    );
    #[cfg(target_os = "macos")]
    {
        let result = Command::new("/usr/bin/codesign")
            .args(["--force", "--sign", "-"])
            .arg(output)
            .output()
            .unwrap();
        assert!(
            result.status.success(),
            "fixture signing failed: {}",
            String::from_utf8_lossy(&result.stderr)
        );
    }
}

pub fn packed() -> Vec<u8> {
    swc_native_addon::format::pack(
        &fs::read(fixture()).unwrap(),
        swc_native_addon::format::NativeTarget::host().unwrap(),
    )
    .unwrap()
}
