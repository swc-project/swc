use std::{fs, path::PathBuf};

use walkdir::WalkDir;

#[test]
fn src_does_not_reference_swc_ecma_crates() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src");

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("rs") {
            continue;
        }

        let source = fs::read_to_string(path)
            .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));
        assert!(
            !source.contains("swc_ecma_"),
            "source file {} must not reference swc_ecma_ crates",
            path.display()
        );
    }
}

#[test]
fn tests_do_not_reference_swc_ecma_crates() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests");

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("rs") {
            continue;
        }
        if path.file_name().and_then(|name| name.to_str()) == Some("no_ecma_dependency.rs") {
            continue;
        }

        let source = fs::read_to_string(path)
            .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));
        assert!(
            !source.contains("swc_ecma_"),
            "test file {} must not reference swc_ecma_ crates",
            path.display()
        );
    }
}

#[test]
fn cargo_toml_does_not_depend_on_swc_ecma_crates() {
    let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("Cargo.toml");
    let source = fs::read_to_string(&manifest)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", manifest.display()));

    assert!(
        !source.contains("swc_ecma_"),
        "Cargo.toml must not declare swc_ecma_ dependency: {}",
        manifest.display()
    );
}
