#![cfg(feature = "suite-parser")]

use std::path::PathBuf;

use swc_test262::{metadata, model::TestCase, parser_suite};

fn fixture(name: &str, code: &str) -> TestCase {
    TestCase {
        path: PathBuf::from(format!("synthetic/{name}.js")),
        metadata: metadata::parse(code).unwrap(),
        code: code.into(),
    }
}

#[test]
fn accepts_positive_and_non_parse_negative_fixtures() {
    let positive = fixture("positive", include_str!("fixtures/parser/positive.js"));
    let resolution = fixture(
        "resolution-negative",
        include_str!("fixtures/parser/resolution-negative.js"),
    );
    let runtime = fixture(
        "runtime-negative",
        include_str!("fixtures/parser/runtime-negative.js"),
    );
    let cases = [&positive, &resolution, &runtime];

    assert!(parser_suite::run(&cases).is_empty());
}

#[test]
fn accepts_parse_and_early_error_fixtures() {
    let parse = fixture(
        "parse-negative",
        include_str!("fixtures/parser/parse-negative.js"),
    );
    let early = fixture(
        "early-negative",
        include_str!("fixtures/parser/early-negative.js"),
    );
    let cases = [&parse, &early];

    assert!(parser_suite::run(&cases).is_empty());
}
