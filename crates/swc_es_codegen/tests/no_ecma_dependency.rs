use std::{fs, path::PathBuf};

use walkdir::WalkDir;

fn contains_swc_ecma_import(source: &str) -> bool {
    source.contains("use swc_ecma_")
        || source.contains("extern crate swc_ecma_")
        || source.contains("::swc_ecma_")
}

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
        if path.file_name().and_then(|name| name.to_str()) == Some("no_ecma_dependency.rs") {
            continue;
        }

        let source = fs::read_to_string(path)
            .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));
        assert!(
            !source.contains("swc_ecma_"),
            "source file {} must not reference swc_ecma_* crates",
            path.display()
        );
    }
}

#[test]
fn tests_do_not_import_swc_ecma_crates() {
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
            !contains_swc_ecma_import(&source),
            "test file {} must not import swc_ecma_* crates",
            path.display()
        );
    }
}

#[test]
fn cargo_toml_runtime_dependencies_do_not_include_swc_ecma_crates() {
    let manifest_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("Cargo.toml");
    let source = fs::read_to_string(&manifest_path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", manifest_path.display()));

    let mut in_dependencies = false;

    for line in source.lines() {
        let trimmed = line.trim();

        if trimmed.starts_with('[') {
            in_dependencies = trimmed == "[dependencies]";
            continue;
        }

        if in_dependencies && trimmed.contains("swc_ecma_") {
            panic!(
                "runtime dependencies in {} must not include swc_ecma_*: {trimmed}",
                manifest_path.display()
            );
        }
    }
}
