use std::{fs, path::PathBuf};

use walkdir::WalkDir;

fn has_swc_ecma_reference(source: &str) -> bool {
    source.contains("use swc_ecma_")
        || source.contains("extern crate swc_ecma_")
        || source.contains("::swc_ecma_")
        || source.contains("\"swc_ecma_")
}

#[test]
fn src_does_not_reference_swc_ecma_crates() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src");

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }
        if entry.path().extension().and_then(|ext| ext.to_str()) != Some("rs") {
            continue;
        }

        let path = entry.path();
        let source = fs::read_to_string(path)
            .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));

        assert!(
            !has_swc_ecma_reference(&source),
            "source file {} must not reference swc_ecma_* crates",
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
        "Cargo.toml must not declare swc_ecma_* dependencies: {}",
        manifest.display()
    );
}
