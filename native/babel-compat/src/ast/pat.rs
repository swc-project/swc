use serde::{Serialize, Deserialize};

use crate::ast::{
    common::{BaseNode, Identifier, TypeAnnotOrNoop, RestElement, Decorator, PatternLike},
    expr::{Expression, MemberExpression},
    object::{ObjectKey},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Pattern {
    #[serde(rename = "AssignmentPattern")]
    Assignment(AssignmentPattern),
    #[serde(rename = "ArrayPattern")]
    Array(ArrayPattern),
    #[serde(rename = "ObjectPattern")]
    Object(ObjectPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ObjectPropVal {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "PatternLike")]
    Pattern(PatternLike),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: ObjectKey,
    pub value: ObjectPropVal,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub shorthand: bool,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ObjectPatternProp {
    #[serde(rename = "RestElement")]
    Rest(RestElement),
    #[serde(rename = "ObjectProperty")]
    Prop(ObjectProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AssignmentPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: AssignmentPatternLeft,
    pub right: Expression,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ArrayPattern {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub elements: Vec<Option<PatternLike>>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}
