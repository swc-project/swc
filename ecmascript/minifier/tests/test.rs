use std::path::PathBuf;
use walkdir::WalkDir;

/// Tests ported from uglifyjs.
#[testing::fixture("uglifyjs/**/input.js")]
fn uglify_js(path: PathBuf) {}

/// Generate tests using uglify js.
#[test]
#[ignore = "It's a script to update tests and it's not a test"]
fn update_uglifyjs_tests() {
    testing::run_test(true, |cm, handler| {
        // Walk uglifyjs test directories.
        let root = PathBuf::from(env!("CARGO_MANIFEST_DIR").to_string())
            .join("..")
            .join("..")
            .join("vendor")
            .join("UglifyJS")
            .join("test")
            .join("compress")
            .canonicalize()
            .unwrap();

        eprintln!("Loading tests from {}", root.display());

        for entry in WalkDir::new(&root) {
            let entry = entry.unwrap();
        }

        Ok(())
    })
    .unwrap();
}
