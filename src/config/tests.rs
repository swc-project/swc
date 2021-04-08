use super::Rc;
use crate::Options;
use serde_json;

#[test]
fn object() {
    let _: Rc = serde_json::from_str(include_str!("object.json")).expect("failed to parse");
}

#[test]
fn array() {
    let _: Rc = serde_json::from_str(include_str!("array.json")).expect("failed to parse");
}

#[test]
fn issue_1532() {
    let res = serde_json::from_str::<Options>(include_str!("issue-1532.json"));

    let err = res.expect_err("should fail");
    assert!(err.to_string().contains("unknown variant `esnext`"));
}
