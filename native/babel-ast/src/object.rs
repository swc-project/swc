use serde::{Deserialize, Serialize};
use swc_common::ast_serde;

use crate::{
    common::{
        BaseNode, Decorator, Identifier, Param, PatternLike, TypeAnnotOrNoop, TypeParamDeclOrNoop,
    },
    expr::Expression,
    flow::{
        ObjectTypeCallProperty, ObjectTypeIndexer, ObjectTypeInternalSlot, ObjectTypeProperty,
        ObjectTypeSpreadProperty,
    },
    lit::{NumericLiteral, StringLiteral},
    stmt::BlockStatement,
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum UserWhitespacable {
    #[tag("ObjectMethod")]
    ObjectMethod(ObjectMethod),
    #[tag("ObjectProperty")]
    ObjectProperty(ObjectProperty),
    #[tag("ObjectTypeInternalSlot")]
    ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    #[tag("ObjectTypeCallProperty")]
    ObjectTypeCallProperty(ObjectTypeCallProperty),
    #[tag("ObjectTypeIndexer")]
    ObjectTypeIndexer(ObjectTypeIndexer),
    #[tag("ObjectTypeProperty")]
    ObjectTypeProperty(ObjectTypeProperty),
    #[tag("ObjectTypeSpreadProperty")]
    ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectMember {
    #[tag("ObjectMember")]
    Method(ObjectMethod),
    #[tag("ObjectProperty")]
    Prop(ObjectProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ObjectMethodKind {
    Method,
    Get,
    Set,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectKey {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("StringLiteral")]
    String(StringLiteral),
    #[tag("NumericLiteral")]
    Numeric(NumericLiteral),
    #[tag("*")]
    Expr(Box<Expression>),
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
    pub return_type: Option<Box<TypeAnnotOrNoop>>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectPropVal {
    #[tag("Identifier")]
    #[tag("RestElement")]
    #[tag("AssignmentPattern")]
    #[tag("ArrayPattern")]
    #[tag("ObjectPattern")]
    Pattern(PatternLike),
    #[tag("*")]
    Expr(Box<Expression>),
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
