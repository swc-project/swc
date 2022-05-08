use serde_json::Value;
use swc_config::config_types::BoolConfig;

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
