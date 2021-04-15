use crate::ser_union::SerializeUnion;
use serde::{Serialize, Deserialize};

use crate::ast::{
    common::{
        BaseNode, Identifier, Decorator, Param, PatternLike, TypeAnnotOrNoop, TypeParamDeclOrNoop
    },
    expr::Expression,
    flow::{
        ObjectTypeSpreadProperty, ObjectTypeProperty, ObjectTypeInternalSlot,
        ObjectTypeCallProperty, ObjectTypeIndexer
    },
    lit::{StringLiteral, NumericLiteral},
    stmt::BlockStatement,
};

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum UserWhitespacable {
    ObjectMethod(ObjectMethod),
    ObjectProperty(ObjectProperty),
    ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    ObjectTypeCallProperty(ObjectTypeCallProperty),
    ObjectTypeIndexer(ObjectTypeIndexer),
    ObjectTypeProperty(ObjectTypeProperty),
    ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum ObjectMember {
    #[serde(rename = "ObjectMember")]
    Method(ObjectMethod),
    #[serde(rename = "ObjectProperty")]
    Prop(ObjectProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ObjectMethodKind {
    Method,
    Get,
    Set,
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum ObjectKey {
    #[serde(rename = "Expression")]
    Expr(Box<Expression>),
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
    #[serde(rename = "NumericLiteral")]
    Numeric(NumericLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: ObjectMethodKind,
    pub key: ObjectKey,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub decorator: Option<Vec<Decorator>>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum ObjectPropVal {
    #[serde(rename = "Expression")]
    Expr(Box<Expression>),
    #[serde(rename = "PatternLike")]
    Pattern(PatternLike),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

