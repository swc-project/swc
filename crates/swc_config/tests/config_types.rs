use serde::Deserialize;
use serde_json::{json, Value};
use swc_config::types::{BoolConfig, BoolOr, BoolOrDataConfig};

fn bool_config(v: Value) -> BoolConfig<false> {
    serde_json::from_value(v).unwrap()
}

#[test]
fn test_bool_config_serde() {
    assert_eq!(bool_config(Value::Null), BoolConfig::new(None));

    assert_eq!(bool_config(Value::Bool(true)), BoolConfig::new(Some(true)));
    assert_eq!(
        bool_config(Value::Bool(false)),
        BoolConfig::new(Some(false))
    );
}

#[test]
fn test_bool_config_default() {
    assert_eq!(
        BoolConfig::<false>::default(),
        BoolConfig::<false>::new(None)
    );
    assert_eq!(BoolConfig::<true>::default(), BoolConfig::<true>::new(None));

    assert!(!BoolConfig::<false>::default().into_bool());
    assert!(BoolConfig::<true>::default().into_bool());
}

#[derive(Debug, Default, PartialEq, Deserialize)]
#[serde(deny_unknown_fields)]
struct Options {
    #[serde(default)]
    enabled: bool,
}

fn bool_or_data(v: Value) -> Result<BoolOrDataConfig<Options>, serde_json::Error> {
    serde_json::from_value(v)
}

#[test]
fn test_bool_or_data_serde() {
    assert!(bool_or_data(json!(true)).unwrap().is_true());
    assert!(bool_or_data(json!(false)).unwrap().is_false());
    assert!(bool_or_data(json!({})).unwrap().is_true());
    assert_eq!(
        bool_or_data(json!({ "enabled": true }))
            .unwrap()
            .into_inner(),
        Some(BoolOr::Data(Options { enabled: true }))
    );
}

#[test]
fn test_bool_or_data_keeps_object_error() {
    let err = bool_or_data(json!({ "typo": true })).unwrap_err();

    assert!(
        err.to_string().contains("unknown field `typo`"),
        "unexpected error: {err}"
    );
}

#[test]
fn test_bool_or_data_rejects_other_values() {
    let err = bool_or_data(json!(5)).unwrap_err();

    assert_eq!(err.to_string(), "expected boolean or object");
}
