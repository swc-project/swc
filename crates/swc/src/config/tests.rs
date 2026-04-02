use crate::parse_swcrc;

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
fn issue_6996() {
    let rc = parse_swcrc(include_str!("issue-6996.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn issue_9416() {
    let rc = parse_swcrc(include_str!("issue-9416.json")).expect("failed to parse");
    let config = rc
        .into_config(None)
        .expect("failed to convert swcrc to config")
        .expect("config should be available");

    assert!(config.suppress_source_map_error_logging.into_bool());
}
