use std::str::FromStr;

use serde_json;

use crate::{parse_swcrc, Options, SourceMapsConfig};

#[test]
fn object() {
    let rc = parse_swcrc(include_str!("object.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn array() {
    let rc = parse_swcrc(include_str!("array.json")).expect("failed to parse");

    dbg!(&rc);
}

#[test]
fn issue_4390() {
    let rc = parse_swcrc(include_str!("issue-4390.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn jsonc() {
    let rc = parse_swcrc(include_str!("jsonc.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn source_maps_config() {
    assert_eq!(
        SourceMapsConfig::from_str("false").unwrap(),
        SourceMapsConfig::Bool(false)
    );
    assert_eq!(
        SourceMapsConfig::from_str("true").unwrap(),
        SourceMapsConfig::Bool(true)
    );
    assert_eq!(
        SourceMapsConfig::from_str("inline").unwrap(),
        SourceMapsConfig::Inline
    );
    assert_eq!(
        SourceMapsConfig::from_str("linked").unwrap(),
        SourceMapsConfig::Linked
    );
    assert!(SourceMapsConfig::from_str("test").is_err());
}
