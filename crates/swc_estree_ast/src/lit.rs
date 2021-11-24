use crate::{common::BaseNode, expr::Expression, typescript::TSType};
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::ast_serde;

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Literal {
    #[tag("StringLiteral")]
    String(StringLiteral),
    #[tag("NumericLiteral")]
    Numeric(NumericLiteral),
    #[tag("NullLiteral")]
    Null(NullLiteral),
    #[tag("BooleanLiteral")]
    Boolean(BooleanLiteral),
    #[tag("RegExpLiteral")]
    RegExp(RegExpLiteral),
    #[tag("TemplateLiteral")]
    Template(TemplateLiteral),
    #[tag("BigIntLiteral")]
    BigInt(BigIntLiteral),
    #[tag("DecimalLiteral")]
    Decimal(DecimalLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct StringLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: JsWord,
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
    pub pattern: JsWord,
    #[serde(default)]
    pub flags: JsWord,
}

/// Deprecated. Use RegExpLiteral instead.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct RegexLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    pub pattern: JsWord,
    #[serde(default)]
    pub flags: JsWord,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct TemplateElVal {
    #[serde(default)]
    pub raw: JsWord,
    #[serde(default)]
    pub cooked: Option<JsWord>,
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

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TemplateLiteralExpr {
    #[tag("TSAnyKeyword")]
    #[tag("TSBooleanKeyword")]
    #[tag("TSBigIntKeyword")]
    #[tag("TSIntrinsicKeyword")]
    #[tag("TSNeverKeyword")]
    #[tag("TSNullKeyword")]
    #[tag("TSNumberKeyword")]
    #[tag("TSObjectKeyword")]
    #[tag("TSStringKeyword")]
    #[tag("TSSymbolKeyword")]
    #[tag("TSUndefinedKeyword")]
    #[tag("TSUnknownKeyword")]
    #[tag("TSVoidKeyword")]
    #[tag("TSThisType")]
    #[tag("TSFunctionType")]
    #[tag("TSConstructorType")]
    #[tag("TSTypeReference")]
    #[tag("TSTypePredicate")]
    #[tag("TSTypeQuery")]
    #[tag("TSTypeLiteral")]
    #[tag("TSArrayType")]
    #[tag("TSTupleType")]
    #[tag("TSOptionalType")]
    #[tag("TSRestType")]
    #[tag("TSUnionType")]
    #[tag("TSIntersectionType")]
    #[tag("TSConditionalType")]
    #[tag("TSInferType")]
    #[tag("TSParenthesizedType")]
    #[tag("TSTypeOperator")]
    #[tag("TSIndexedAccessType")]
    #[tag("TSMappedType")]
    #[tag("TSLiteralType")]
    #[tag("TSExpressionWithTypeArguments")]
    #[tag("TSImportType")]
    TSType(TSType),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TemplateLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub quasis: Vec<TemplateElement>,
    #[serde(default)]
    pub expressions: Vec<TemplateLiteralExpr>,
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
    pub value: JsWord,
}
