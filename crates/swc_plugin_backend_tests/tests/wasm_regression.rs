use swc_common::{
    ast_node,
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

/// Test that we can deserialize a v2 data into a v1 data and then serialize it
/// back to a v2 data and it should be the same.
///
/// This is a test for Wasm plugin tests.
///
/// This test simulates serializing from the latest runtime (v2) and deserialize
/// it from the old Wasm plugin (v1), serialize it back as old data (v1), and
/// deserialize it back from latest runtime (v2).
#[test]
fn backward_compatible() {
    let v2_data = {
        let _s1 = Str {
            span: DUMMY_SP,
            value: String::from("test-1"),
        };
        let s2 = Str {
            span: DUMMY_SP,
            value: String::from("test-2"),
        };

        VersionedSerializable::new(ExprV2::Object(ObjectV2 {
            span: DUMMY_SP,
            properties: vec![PropertyV2 {
                span: DUMMY_SP,
                key: String::from("string"),
                value: Box::new(ExprV2::String(s2)),
            }],
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
