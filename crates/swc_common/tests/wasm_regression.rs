use ast_node::ast_node;
use swc_common::{
    plugin::serialized::{PluginSerializedBytes, VersionedSerializable},
    Span, DUMMY_SP,
};

#[ast_node]
pub enum ExprV1 {
    #[tag("String")]
    String(Str),
    #[tag("Object")]
    Object(ObjectV1),
}

#[ast_node("Object")]
pub struct ObjectV1 {
    span: Span,
    properties: Vec<PropertyV1>,
}

#[ast_node("Property")]
pub struct PropertyV1 {
    span: Span,
    key: String,
    value: Box<ExprV1>,
}

#[ast_node]
pub enum ExprV2 {
    #[tag("String")]
    String(Str),
    #[tag("Object")]
    Object(ObjectV2),
    #[tag("Array")]
    Array(Array),
}

#[ast_node("Object")]
pub struct ObjectV2 {
    span: Span,
    properties: Vec<PropertyV2>,
}

#[ast_node("Property")]
pub struct PropertyV2 {
    span: Span,
    key: String,
    value: Box<ExprV2>,
}

#[ast_node("Array")]
pub struct Array {
    span: Span,
    elements: Vec<ExprV2>,
}

#[ast_node("String")]
pub struct Str {
    span: Span,
    value: String,
}

#[test]
fn bakward_compatible() {
    let v2_data = {
        let s1 = Str {
            span: DUMMY_SP,
            value: String::from("test-1"),
        };
        let s2 = Str {
            span: DUMMY_SP,
            value: String::from("test-2"),
        };
        let arr = Array {
            span: DUMMY_SP,
            elements: vec![ExprV2::String(s1)],
        };

        VersionedSerializable::new(ExprV2::Object(ObjectV2 {
            span: DUMMY_SP,
            properties: vec![
                PropertyV2 {
                    span: DUMMY_SP,
                    key: String::from("string"),
                    value: Box::new(ExprV2::String(s2)),
                },
                PropertyV2 {
                    span: DUMMY_SP,
                    key: String::from("array"),
                    value: Box::new(ExprV2::Array(arr)),
                },
            ],
        }))
    };

    let v2_bytes = PluginSerializedBytes::try_serialize(&v2_data).unwrap();

    let v1_data = v2_bytes
        .deserialize::<ExprV1>()
        .expect("failed to deserialize v2 into v1 data");

    let v1_bytes = PluginSerializedBytes::try_serialize(&v1_data).unwrap();

    let restored_v2_data = v1_bytes
        .deserialize::<ExprV2>()
        .expect("failed to deserialize v1 into v2 data");

    assert_eq!(restored_v2_data.into_inner(), v2_data.into_inner());
}
