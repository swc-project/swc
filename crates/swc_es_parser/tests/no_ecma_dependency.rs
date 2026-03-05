use std::{fs, path::PathBuf, process::Command};

use walkdir::WalkDir;

fn contains_swc_ecma_parser_import(source: &str) -> bool {
    source.contains("use swc_ecma_parser")
        || source.contains("extern crate swc_ecma_parser")
        || source.contains("::swc_ecma_parser::")
}

#[test]
fn src_does_not_reference_swc_ecma_parser() {
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
            !source.contains("swc_ecma_parser"),
            "source file {} must not reference swc_ecma_parser",
            path.display()
        );
    }
}

#[test]
fn tests_do_not_import_swc_ecma_parser_crate() {
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
            !contains_swc_ecma_parser_import(&source),
            "test file {} must not import swc_ecma_parser crate",
            path.display()
        );
    }
}

#[test]
fn examples_and_benches_do_not_import_swc_ecma_parser_crate() {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    for rel in ["examples", "benches"] {
        let root = manifest_dir.join(rel);
        if !root.exists() {
            continue;
        }
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
                !contains_swc_ecma_parser_import(&source),
                "file {} must not import swc_ecma_parser crate",
                path.display()
            );
        }
    }
}

#[test]
fn cargo_toml_does_not_depend_on_swc_ecma_parser() {
    let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("Cargo.toml");
    let source = fs::read_to_string(&manifest)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", manifest.display()));

    assert!(
        !source.contains("swc_ecma_parser"),
        "Cargo.toml must not declare swc_ecma_parser dependency: {}",
        manifest.display()
    );
}

#[test]
fn runtime_dependency_graph_does_not_contain_swc_ecma_parser() {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let output = Command::new("cargo")
        .args(["tree", "-p", "swc_es_parser", "--prefix", "none"])
        .current_dir(&manifest_dir)
        .output()
        .unwrap_or_else(|err| panic!("failed to run `cargo tree`: {err}"));

    assert!(
        output.status.success(),
        "`cargo tree` failed with status {:?}\nstdout:\n{}\nstderr:\n{}",
        output.status.code(),
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );

    let stdout = String::from_utf8_lossy(&output.stdout);
    let has_runtime_dep = stdout
        .lines()
        .any(|line| line.trim_start().starts_with("swc_ecma_parser "));
    assert!(
        !has_runtime_dep,
        "runtime dependency graph of swc_es_parser must not include swc_ecma_parser:\n{stdout}"
    );
}
