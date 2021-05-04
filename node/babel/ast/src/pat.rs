use serde::{Deserialize, Serialize};
use swc_common::ast_serde;

use crate::{
    common::{BaseNode, Decorator, Identifier, PatternLike, RestElement, TypeAnnotOrNoop},
    expr::{Expression, MemberExpression},
    object::ObjectProperty,
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Pattern {
    #[tag("AssignmentPattern")]
    Assignment(AssignmentPattern),
    #[tag("ArrayPattern")]
    Array(ArrayPattern),
    #[tag("ObjectPattern")]
    Object(ObjectPattern),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectPatternProp {
    #[tag("RestElement")]
    Rest(RestElement),
    #[tag("ObjectProperty")]
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

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum AssignmentPatternLeft {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("ObjectPattern")]
    Object(ObjectPattern),
    #[tag("ArrayPattern")]
    Array(ArrayPattern),
    #[tag("MemberExpression")]
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
