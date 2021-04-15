use crate::ser_union::SerializeUnion;
use serde::{Serialize, Deserialize};

use crate::ast::{
    common::BaseNode,
    expr::Expression,
    typescript::TSType,
};

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum Literal {
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
    #[serde(rename = "NumericLiteral")]
    Numeric(NumericLiteral),
    #[serde(rename = "NullLiteral")]
    Null(NullLiteral),
    #[serde(rename = "BooleanLiteral")]
    Boolean(BooleanLiteral),
    #[serde(rename = "RegExpLiteral")]
    RegExp(RegExpLiteral),
    #[serde(rename = "TemplateLiteral")]
    Template(TemplateLiteral),
    #[serde(rename = "BigIntLiteral")]
    BigInt(BigIntLiteral),
    #[serde(rename = "DecimalLiteral")]
    Decimal(DecimalLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct StringLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct NumericLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: f64,
}

/// Deprecated. Use NumericLiteral instead.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct NumberLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct NullLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct BooleanLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct RegExpLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub pattern: String,
    #[serde(default)]
    pub flags: String,
}

/// Deprecated. Use RegExpLiteral instead.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct RegexLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub pattern: String,
    #[serde(default)]
    pub flags: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TemplateElVal {
    #[serde(default)]
    pub raw: String,
    #[serde(default)]
    pub cooked: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TemplateElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: TemplateElVal,
    #[serde(default)]
    pub tail: bool,
}

#[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[serde(tag = "type")]
// #[serde(untagged)]
pub enum TemplateLiteralExpr {
    #[serde(rename = "Expression")]
    Expr(Box<Expression>),
    TSType(TSType),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TemplateLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub quasis: Vec<TemplateElement>,
    #[serde(default)]
    pub expressions: Vec<TemplateLiteralExpr>
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct BigIntLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct DecimalLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: String,
}

