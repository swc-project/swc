use serde_json;

use crate::{parse_swcrc, Options};

#[test]
fn object() {
    let _ = parse_swcrc(include_str!("object.json")).expect("failed to parse");
}

#[test]
fn array() {
    let _ = parse_swcrc(include_str!("array.json")).expect("failed to parse");
}

#[test]
fn issue_4390() {
    let _ = parse_swcrc(include_str!("issue-4390.json")).expect("failed to parse");
}

#[test]
fn issue_1532() {
    let res = serde_json::from_str::<Options>(include_str!("issue-1532.json"));

    let err = res.expect_err("should fail");
    assert!(err.to_string().contains("unknown variant `esnext`"));
}
