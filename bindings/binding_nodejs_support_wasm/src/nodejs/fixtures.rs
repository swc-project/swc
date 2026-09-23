use std::{fs, path::PathBuf};

use serde::Deserialize;
use serde_json::Value;

use super::{
    find_top_level_awaits, is_recoverable_error, parse_program_result, tokenize, ParseOutcome,
    SyntaxError,
};

#[derive(Deserialize)]
struct Case {
    source: String,
    expected: Value,
}

fn check_cases(path: PathBuf, run: impl Fn(String) -> Value) {
    let cases: Vec<Case> = serde_json::from_str(&fs::read_to_string(path).unwrap()).unwrap();
    for case in cases {
        assert_eq!(
            run(case.source.clone()),
            case.expected,
            "source: {:?}",
            case.source
        );
    }
}

#[testing::fixture("__tests__/fixtures/tokenize/*.json")]
fn tokens(path: PathBuf) {
    check_cases(path, |source| {
        serde_json::to_value(tokenize(&source)).unwrap()
    });
}

#[testing::fixture("__tests__/fixtures/awaits/*.json")]
fn awaits(path: PathBuf) {
    check_cases(path, |source| {
        serde_json::to_value(find_top_level_awaits(&source)).unwrap()
    });
}

#[testing::fixture("__tests__/fixtures/recoverable/*.json")]
fn recoverable(path: PathBuf) {
    check_cases(path, |source| Value::Bool(is_recoverable_error(source)));
}

#[testing::fixture("__tests__/fixtures/recoverable/unexpected-eof.json")]
fn unexpected_eof_variant(path: PathBuf) {
    check_cases(path, |source| {
        let ParseOutcome::Invalid(errors) = parse_program_result(&source) else {
            panic!("expected a parse error: {source:?}");
        };
        assert!(errors.iter().any(|error| matches!(error.kind(), SyntaxError::Unexpected { got, .. } if got == "<eof>")), "errors: {errors:?}");
        Value::Bool(true)
    });
}
