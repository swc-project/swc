use crate::util::SerializeUnion;
use serde::{Serialize, Deserialize};

use crate::{
    common::{BaseNode, Identifier, TypeAnnotOrNoop, RestElement, Decorator, PatternLike},
    expr::{Expression, MemberExpression},
    object::{ObjectProperty},
};

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Pattern {
    #[serde(rename = "AssignmentPattern")]
    Assignment(AssignmentPattern),
    #[serde(rename = "ArrayPattern")]
    Array(ArrayPattern),
    #[serde(rename = "ObjectPattern")]
    Object(ObjectPattern),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum ObjectPatternProp {
    #[serde(rename = "RestElement")]
    Rest(RestElement),
    #[serde(rename = "ObjectProperty")]
    Prop(ObjectProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub properties: Vec<ObjectPatternProp>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum AssignmentPatternLeft {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "ObjectPattern")]
    Object(ObjectPattern),
    #[serde(rename = "ArrayPattern")]
    Array(ArrayPattern),
    #[serde(rename = "MemberExpression")]
    Member(MemberExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct AssignmentPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: AssignmentPatternLeft,
    pub right: Box<Expression>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ArrayPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub elements: Vec<Option<PatternLike>>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}
