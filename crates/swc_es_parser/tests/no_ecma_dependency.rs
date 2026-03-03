use std::{fs, path::PathBuf};

use walkdir::WalkDir;

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
