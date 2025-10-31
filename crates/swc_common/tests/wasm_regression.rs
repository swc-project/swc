use ast_node::ast_node;
use swc_common::plugin::serialized::{PluginSerializedBytes, VersionedSerializable};

#[ast_node]
pub enum ExprV1 {
    Number(f64),
    String(String),
    Boolean(bool),
    Null,
    Undefined,
    Object(ObjectV1),
}

#[ast_node("Object")]
pub struct ObjectV1 {
    properties: Vec<PropertyV1>,
}

#[ast_node("Property")]
pub struct PropertyV1 {
    key: String,
    value: Box<ExprV1>,
}

#[ast_node]
pub enum ExprV2 {
    Number(f64),
    String(String),
    Boolean(bool),
    Null,
    Undefined,
    Object(ObjectV2),
    Array(Array),
}

#[ast_node("Object")]
pub struct ObjectV2 {
    properties: Vec<PropertyV2>,
}

#[ast_node("Property")]
pub struct PropertyV2 {
    key: String,
    value: Box<ExprV2>,
}

#[ast_node("Array")]
pub struct Array {
    elements: Vec<ExprV2>,
}

#[test]
fn bakward_compatible() {
    let v2_data = {
        let s1 = String::from("test-1");
        let s2 = String::from("test-2");
        let arr = Array {
            elements: vec![ExprV2::String(s1), ExprV2::String(s2)],
        };

        VersionedSerializable::new(ExprV2::Object(ObjectV2 {
            properties: vec![
                PropertyV2 {
                    key: String::from("string"),
                    value: Box::new(ExprV2::String(s)),
                },
                PropertyV2 {
                    key: String::from("array"),
                    value: Box::new(ExprV2::Array(arr)),
                },
            ],
        }))
    };

    let v2_bytes = PluginSerializedBytes::try_serialize(&v2_data).unwrap();
    v2_data
        .deserialize::<ExprV1>()
        .expect("failed to deserialize v2 data into v1 data");
}
