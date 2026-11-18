use std::{fs::read_to_string, path::PathBuf};

use crate::{exec_node_js, node, JsExecOptions};

#[testing::fixture("tests/node-exec/**/input.js")]
#[testing::fixture("tests/node-exec/**/input.mjs")]
fn node_exec(input: PathBuf) {
    let code = read_to_string(&input).unwrap();
    let expected = read_to_string(input.with_file_name("output.txt")).unwrap();
    let opts = JsExecOptions {
        module: input.extension().unwrap() == "mjs",
        args: vec!["fixture argument".into(), "quotation\"backslash\\".into()],
        ..Default::default()
    };

    for prefix in [String::new(), format!("/*{}*/\n", "x".repeat(40_000))] {
        let code = format!("{prefix}{code}");
        // The large source exceeds Windows' command-line limit and exercises
        // the fallback there; direct stdin coverage also runs on other hosts.
        assert_eq!(exec_node_js(&code, opts.clone()).unwrap(), expected);
        let output = node::exec_with_stdin(&code, &opts).unwrap();
        assert!(output.status.success());
        assert_eq!(String::from_utf8(output.stdout).unwrap(), expected);
    }
}

#[testing::fixture("tests/node-exec/**/error.js")]
#[testing::fixture("tests/node-exec/**/error.mjs")]
fn node_error(input: PathBuf) {
    let code = read_to_string(&input).unwrap();
    let expected = read_to_string(input.with_file_name("error.txt")).unwrap();
    let opts = JsExecOptions {
        module: input.extension().unwrap() == "mjs",
        ..Default::default()
    };
    let code = format!("/*{}*/\n{code}", "x".repeat(40_000));
    assert!(exec_node_js(&code, opts.clone())
        .unwrap_err()
        .to_string()
        .contains(expected.trim()));
    let output = node::exec_with_stdin(&code, &opts).unwrap();
    assert!(!output.status.success());
    assert!(String::from_utf8(output.stderr)
        .unwrap()
        .contains(expected.trim()));
}
