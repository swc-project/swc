use serde_json::from_str;
use swc_common::ast_serde;

#[ast_serde]
#[derive(Debug, PartialEq)]
pub enum Ambiguous {
    #[tag("A")]
    A(A),
    #[tag("B")]
    B(B),
}
#[ast_serde("B")]
#[derive(Debug, PartialEq)]
pub struct A {}

#[ast_serde("B")]
#[derive(Debug, PartialEq)]
pub struct B {}

#[test]
fn deserialize() {
    assert_eq!(A {}, from_str(r#"{"type": "A"}"#).unwrap());
    assert_eq!(B {}, from_str(r#"{"type": "B"}"#).unwrap());
}
