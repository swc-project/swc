use std::{fs, path::PathBuf};

use walkdir::WalkDir;

fn scan_tree_for_ecma_refs(root: &PathBuf, skip_file_name: Option<&str>) {
    for entry in WalkDir::new(root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }

        let path = entry.path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("rs") {
            continue;
        }
        if skip_file_name
            .is_some_and(|name| path.file_name().and_then(|n| n.to_str()) == Some(name))
        {
            continue;
        }

        let source = fs::read_to_string(path)
            .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));
        assert!(
            !source.contains("swc_ecma_"),
            "source file {} must not reference swc_ecma_*",
            path.display()
        );
    }
}

#[test]
fn src_does_not_reference_swc_ecma_crates() {
    let src_root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src");
    scan_tree_for_ecma_refs(&src_root, None);
}

#[test]
fn tests_do_not_reference_swc_ecma_crates() {
    let test_root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests");
    scan_tree_for_ecma_refs(&test_root, Some("no_ecma_dependency.rs"));
}

#[test]
fn cargo_manifest_does_not_reference_swc_ecma_crates() {
    let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("Cargo.toml");
    let source = fs::read_to_string(&manifest)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", manifest.display()));

    assert!(
        !source.contains("swc_ecma_"),
        "Cargo.toml must not reference swc_ecma_*: {}",
        manifest.display()
    );
}
