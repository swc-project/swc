use crate::{common::BaseNode, expr::Expression, flavor::Flavor, typescript::TSType};
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::ast_serde;

#[derive(Debug, Clone, PartialEq)]
pub enum Literal {
    String(StringLiteral),
    Numeric(NumericLiteral),
    Null(NullLiteral),
    Boolean(BooleanLiteral),
    RegExp(RegExpLiteral),
    Template(TemplateLiteral),
    BigInt(BigIntLiteral),
    Decimal(DecimalLiteral),
}

impl Serialize for Literal {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match Flavor::current() {
            Flavor::Babel => {
                let b = match self {
                    Literal::String(l) => BabelLiteral::String(l.clone()),
                    Literal::Numeric(l) => BabelLiteral::Numeric(l.clone()),
                    Literal::Null(l) => BabelLiteral::Null(l.clone()),
                    Literal::Boolean(l) => BabelLiteral::Boolean(l.clone()),
                    Literal::RegExp(l) => BabelLiteral::RegExp(l.clone()),
                    Literal::Template(l) => BabelLiteral::Template(l.clone()),
                    Literal::BigInt(l) => BabelLiteral::BigInt(l.clone()),
                    Literal::Decimal(l) => BabelLiteral::Decimal(l.clone()),
                };
                BabelLiteral::serialize(&b, serializer)
            }
            Flavor::Acorn => {
                let acorn = AcornLiteral {
                    value: match self {
                        Literal::String(l) => AcornLiteralValue::String(l.value.clone()),
                        Literal::Numeric(l) => AcornLiteralValue::Numeric(l.value.clone()),
                        Literal::Null(..) => AcornLiteralValue::Null(None),
                        Literal::Boolean(l) => AcornLiteralValue::Boolean(l.value.clone()),
                        Literal::RegExp(l) => AcornLiteralValue::RegExp {
                            pattern: l.pattern.clone(),
                            flags: l.flags.clone(),
                        },
                        Literal::Template(..) => todo!(),
                        Literal::BigInt(l) => AcornLiteralValue::BigInt(l.value.clone()),
                        Literal::Decimal(l) => AcornLiteralValue::Decimal(l.value.clone()),
                    },
                };

                AcornLiteral::serialize(&acorn, serializer)
            }
        }
    }
}

impl<'de> Deserialize<'de> for Literal {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        BabelLiteral::deserialize(deserializer).map(|b| match b {
            BabelLiteral::String(l) => Literal::String(l),
            BabelLiteral::Numeric(l) => Literal::Numeric(l),
            BabelLiteral::Null(l) => Literal::Null(l),
            BabelLiteral::Boolean(l) => Literal::Boolean(l),
            BabelLiteral::RegExp(l) => Literal::RegExp(l),
            BabelLiteral::Template(l) => Literal::Template(l),
            BabelLiteral::BigInt(l) => Literal::BigInt(l),
            BabelLiteral::Decimal(l) => Literal::Decimal(l),
        })
    }
}

/// Used for serialization/deserialization
#[ast_serde]
enum BabelLiteral {
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

#[derive(Serialize)]
struct AcornLiteral {
    value: AcornLiteralValue,
}

#[derive(Serialize)]
#[serde(untagged)]
enum AcornLiteralValue {
    String(JsWord),
    Numeric(f64),
    Null(Option<()>),
    Boolean(bool),
    RegExp { pattern: JsWord, flags: JsWord },
    BigInt(String),
    Decimal(JsWord),
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
