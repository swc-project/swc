use std::collections::HashMap;
use ahash::RandomState;
use serde::{Serialize, Deserialize};
use serde_json::Value;

use crate::ast::{
    comment::{Comment},
    expr::{Expression, MemberExpression},
    flow::{TypeAnnotation, TypeParameterDeclaration, TypeParameterInstantiation},
    jsx::{JSXNamespacedName},
    lit::{StringLiteral},
    pat::{Pattern, AssignmentPattern, ArrayPattern, ObjectPattern},
    typescript::{TSTypeAnnotation, TSTypeParameterDeclaration, TSParameterProperty, TSTypeParameterInstantiation},
};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LineCol {
    pub line: usize,
    pub column: usize,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Loc {
    pub start: LineCol,
    pub end: LineCol,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseNode {
    #[serde(default)]
    pub leading_comments: Vec<Comment>,
    #[serde(default)]
    pub inner_comments: Vec<Comment>,
    #[serde(default)]
    pub trailing_comments: Vec<Comment>,

    #[serde(default)]
    pub start: Option<usize>,
    #[serde(default)]
    pub end: Option<usize>,
    #[serde(default)]
    pub loc: Option<Loc>,

    #[serde(default)]
    pub extra: Option<HashMap<String, Value, RandomState>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SpreadElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

/// Deprecated. Use SpreadElement instead.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SpreadProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct RestElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<LVal>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

/// Deprecated. Use RestElement element.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct RestProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: LVal,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct Identifier {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct QualifiedTypeIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub qualification: Box<IdOrQualifiedId>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum IdOrQualifiedId {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "QualifiedTypeIdentifier")]
    QualifiedId(QualifiedTypeIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum IdOrString {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum IdOrRest {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "RestElement")]
    Rest(RestElement),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Decorator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Noop {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Param {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "Pattern")]
    Pat(Pattern),
    #[serde(rename = "RestElement")]
    Rest(RestElement),
    #[serde(rename = "TSParameterProperty")]
    TSProp(TSParameterProperty),
}


#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ArgumentPlaceholder {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Arg {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "SpreadElement")]
    Spread(SpreadElement),
    #[serde(rename = "JSXNamespacedName")]
    JSXName(JSXNamespacedName),
    #[serde(rename = "ArgumentPlaceholder")]
    Placeholder(ArgumentPlaceholder),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum LVal {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "MemberExpression")]
    MemberExpr(MemberExpression),
    #[serde(rename = "RestElement")]
    RestEl(RestElement),
    #[serde(rename = "AssignmentPattern")]
    AssignmentPat(AssignmentPattern),
    #[serde(rename = "ArrayPattern")]
    ArrayPat(ArrayPattern),
    #[serde(rename = "ObjectPattern")]
    ObjectPat(ObjectPattern),
    #[serde(rename = "TSParameterProperty")]
    TSParamProp(TSParameterProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum PatternLike {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "RestElement")]
    RestEl(RestElement),
    #[serde(rename = "AssignmentPattern")]
    AssignmentPat(AssignmentPattern),
    #[serde(rename = "ArrayPattern")]
    ArrayPat(ArrayPattern),
    #[serde(rename = "ObjectPattern")]
    ObjectPat(ObjectPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TypeAnnotOrNoop {
    #[serde(rename = "TypeAnnotation")]
    Flow(TypeAnnotation),
    #[serde(rename = "TSTypeAnnotation")]
    TS(TSTypeAnnotation),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum TypeParamDeclOrNoop {
    #[serde(rename = "TypeParameterDeclaration")]
    Flow(TypeParameterDeclaration),
    #[serde(rename = "TSTypeParameterDeclaration")]
    TS(TSTypeParameterDeclaration),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SuperTypeParams {
    #[serde(rename = "TypeParameterInstantiation")]
    Flow(TypeParameterInstantiation),
    #[serde(rename = "TSTypeParameterInstantiation")]
    TS(TSTypeParameterInstantiation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct PrivateName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Access {
    Public,
    Private,
    Protected,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct V8IntrinsicIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Callee {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "V8IntrinsicIdentifier")]
    V8Id(V8IntrinsicIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct MetaProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub meta: Identifier,
    pub property: Identifier,
}
