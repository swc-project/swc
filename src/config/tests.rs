use super::Rc;
use serde_json;

#[test]
fn object() {
    let _: Rc = serde_json::from_str(include_str!("object.json")).expect("failed to parse");
}

#[test]
fn array() {
    let _: Rc = serde_json::from_str(include_str!("array.json")).expect("failed to parse");
}
