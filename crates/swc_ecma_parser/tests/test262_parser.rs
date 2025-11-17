//! Test262 parser conformance tests
//!
//! This test runs the full Test262 suite against SWC's parser.

use std::path::PathBuf;

use swc_test262::{ParserTest262Case, Suite};

/// Find the workspace root by walking up the directory tree
fn find_workspace_root() -> Option<PathBuf> {
    let mut current = std::env::current_dir().ok()?;

    loop {
        let cargo_toml = current.join("Cargo.toml");
        if cargo_toml.exists() {
            if let Ok(contents) = std::fs::read_to_string(&cargo_toml) {
                if contents.contains("[workspace]") {
                    return Some(current);
                }
            }
        }

        if !current.pop() {
            break;
        }
    }

    None
}

#[test]
#[ignore] // Run with: cargo test --test test262_parser -- --ignored
fn test262_parser_conformance() {
    // Debug: print current directory
    let cwd = std::env::current_dir().unwrap();
    println!("Current directory: {}", cwd.display());

    let test_root = cwd.join("test262").join("test");
    println!("Looking for tests in: {}", test_root.display());
    println!("Directory exists: {}", test_root.exists());

    let mut suite = Suite::<ParserTest262Case>::new();
    suite.load();

    println!("Running {} parser tests...", suite.len());

    let report = suite.run();
    report.print_summary();

    // Save detailed report to snapshots directory
    let workspace_root = find_workspace_root().unwrap();
    let snapshots_dir = workspace_root.join("crates/swc_ecma_parser/tests/snapshots");

    // Create snapshots directory if it doesn't exist
    let _ = std::fs::create_dir_all(&snapshots_dir);

    let report_path = snapshots_dir.join("test262_parser.snap");

    if let Err(e) = report.save_to_file(&report_path, "test262_parser") {
        eprintln!("Warning: Failed to save report to file: {e}");
    } else {
        println!("\nDetailed report saved to: {}", report_path.display());
    }

    // Baseline: We should maintain at least 90% pass rate
    let pass_rate = report.pass_rate();
    assert!(
        pass_rate >= 0.90,
        "Pass rate should be at least 90%, got {:.2}% ({} passed out of {} total)",
        pass_rate * 100.0,
        report.passed,
        report.total
    );
}
