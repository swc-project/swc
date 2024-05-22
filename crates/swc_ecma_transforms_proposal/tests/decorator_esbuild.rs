use std::{fs::read_to_string, process::Command};

use testing::find_executable;

#[test]
fn execute() {
    let node = find_executable("node").expect("node not found");

    let code = read_to_string("tests/decorator-tests/decorator-tests.js")
        .expect("failed to read test input file");

    // Transpile with swc

    let status = Command::new(node)
        .arg("-e")
        .arg(&code)
        .status()
        .expect("failed to execute process");

    assert!(status.success());
}
