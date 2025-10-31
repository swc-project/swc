use ast_node::ast_node;

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
