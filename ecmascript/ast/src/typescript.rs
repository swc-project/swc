#![allow(clippy::vec_box)]
#![allow(missing_copy_implementations)]
use crate::BindingIdent;
use crate::{
    class::Decorator,
    expr::Expr,
    ident::Ident,
    lit::{Bool, Number, Str},
    module::ModuleItem,
    pat::{ArrayPat, AssignPat, ObjectPat, Pat, RestPat},
    BigInt, TplElement,
};
use is_macro::Is;
use serde::{
    de::{self, Unexpected, Visitor},
    Deserialize, Deserializer, Serialize,
};
use std::fmt;
use string_enum::StringEnum;
use swc_common::EqIgnoreSpan;
use swc_common::{ast_node, Span};

#[ast_node("TsTypeAnnotation")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeAnn {
    pub span: Span,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Box<TsType>,
}

#[ast_node("TsTypeParameterDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeParamDecl {
    pub span: Span,
    #[serde(rename = "parameters")]
    pub params: Vec<TsTypeParam>,
}

#[ast_node("TsTypeParameter")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeParam {
    pub span: Span,
    pub name: Ident,

    #[serde(default)]
    pub constraint: Option<Box<TsType>>,

    #[serde(default)]
    pub default: Option<Box<TsType>>,
}

#[ast_node("TsTypeParameterInstantiation")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeParamInstantiation {
    pub span: Span,
    pub params: Vec<Box<TsType>>,
}

#[ast_node("TsParameterProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsParamProp {
    pub span: Span,
    #[serde(default)]
    pub decorators: Vec<Decorator>,
    /// At least one of `accessibility` or `readonly` must be set.
    #[serde(default)]
    pub accessibility: Option<Accessibility>,
    pub readonly: bool,
    pub param: TsParamPropParam,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsParamPropParam {
    #[tag("Identifier")]
    Ident(BindingIdent),

    #[tag("AssignmentPattern")]
    Assign(AssignPat),
}

#[ast_node("TsQualifiedName")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsQualifiedName {
    #[span(lo)]
    pub left: TsEntityName,
    #[span(hi)]
    pub right: Ident,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsEntityName {
    #[tag("TsQualifiedName")]
    TsQualifiedName(Box<TsQualifiedName>),

    #[tag("Identifier")]
    Ident(Ident),
}

// ================
// TypeScript type members (for type literal / interface / class)
// ================

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsTypeElement {
    #[tag("TsCallSignatureDeclaration")]
    TsCallSignatureDecl(TsCallSignatureDecl),

    #[tag("TsConstructSignatureDeclaration")]
    TsConstructSignatureDecl(TsConstructSignatureDecl),

    #[tag("TsPropertySignature")]
    TsPropertySignature(TsPropertySignature),

    #[tag("TsGetterSignature")]
    TsGetterSignature(TsGetterSignature),

    #[tag("TsSetterSignature")]
    TsSetterSignature(TsSetterSignature),

    #[tag("TsMethodSignature")]
    TsMethodSignature(TsMethodSignature),

    #[tag("TsIndexSignature")]
    TsIndexSignature(TsIndexSignature),
}

#[ast_node("TsCallSignatureDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsCallSignatureDecl {
    pub span: Span,
    pub params: Vec<TsFnParam>,
    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node("TsConstructSignatureDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsConstructSignatureDecl {
    pub span: Span,
    pub params: Vec<TsFnParam>,
    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node("TsPropertySignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsPropertySignature {
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    #[serde(default)]
    pub init: Option<Box<Expr>>,
    pub params: Vec<TsFnParam>,
    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node("TsGetterSignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsGetterSignature {
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node("TsSetterSignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsSetterSignature {
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    pub param: TsFnParam,
}

#[ast_node("TsMethodSignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsMethodSignature {
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    pub params: Vec<TsFnParam>,
    #[serde(default)]
    pub type_ann: Option<TsTypeAnn>,
    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node("TsIndexSignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsIndexSignature {
    pub params: Vec<TsFnParam>,
    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,

    pub readonly: bool,
    #[serde(rename = "static")]
    pub is_static: bool,
    pub span: Span,
}

// ================
// TypeScript types
// ================

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsType {
    #[tag("TsKeywordType")]
    TsKeywordType(TsKeywordType),

    #[tag("TsThisType")]
    TsThisType(TsThisType),

    #[tag("TsFunctionType")]
    #[tag("TsConstructorType")]
    TsFnOrConstructorType(TsFnOrConstructorType),

    #[tag("TsTypeReference")]
    TsTypeRef(TsTypeRef),

    #[tag("TsTypeQuery")]
    TsTypeQuery(TsTypeQuery),

    #[tag("TsTypeLiteral")]
    TsTypeLit(TsTypeLit),

    #[tag("TsArrayType")]
    TsArrayType(TsArrayType),

    #[tag("TsTupleType")]
    TsTupleType(TsTupleType),

    #[tag("TsOptionalType")]
    TsOptionalType(TsOptionalType),

    #[tag("TsRestType")]
    TsRestType(TsRestType),

    #[tag("TsUnionType")]
    #[tag("TsIntersectionType")]
    TsUnionOrIntersectionType(TsUnionOrIntersectionType),

    #[tag("TsConditionalType")]
    TsConditionalType(TsConditionalType),

    #[tag("TsInferType")]
    TsInferType(TsInferType),

    #[tag("TsParenthesizedType")]
    TsParenthesizedType(TsParenthesizedType),

    #[tag("TsTypeOperator")]
    TsTypeOperator(TsTypeOperator),

    #[tag("TsIndexedAccessType")]
    TsIndexedAccessType(TsIndexedAccessType),

    #[tag("TsMappedType")]
    TsMappedType(TsMappedType),

    #[tag("TsLiteralType")]
    TsLitType(TsLitType),

    #[tag("TsTypePredicate")]
    TsTypePredicate(TsTypePredicate),

    #[tag("TsImportType")]
    TsImportType(TsImportType),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsFnOrConstructorType {
    #[tag("TsFunctionType")]
    TsFnType(TsFnType),
    #[tag("TsConstructorType")]
    TsConstructorType(TsConstructorType),
}

impl From<TsFnType> for TsType {
    fn from(t: TsFnType) -> Self {
        TsFnOrConstructorType::TsFnType(t).into()
    }
}

impl From<TsConstructorType> for TsType {
    fn from(t: TsConstructorType) -> Self {
        TsFnOrConstructorType::TsConstructorType(t).into()
    }
}

impl From<TsUnionType> for TsType {
    fn from(t: TsUnionType) -> Self {
        TsUnionOrIntersectionType::TsUnionType(t).into()
    }
}

impl From<TsIntersectionType> for TsType {
    fn from(t: TsIntersectionType) -> Self {
        TsUnionOrIntersectionType::TsIntersectionType(t).into()
    }
}

#[ast_node("TsKeywordType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsKeywordType {
    pub span: Span,
    pub kind: TsKeywordTypeKind,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsKeywordTypeKind {
    #[serde(rename = "any")]
    TsAnyKeyword,

    #[serde(rename = "unknown")]
    TsUnknownKeyword,

    #[serde(rename = "number")]
    TsNumberKeyword,

    #[serde(rename = "object")]
    TsObjectKeyword,

    #[serde(rename = "boolean")]
    TsBooleanKeyword,

    #[serde(rename = "bigint")]
    TsBigIntKeyword,

    #[serde(rename = "string")]
    TsStringKeyword,

    #[serde(rename = "symbol")]
    TsSymbolKeyword,

    #[serde(rename = "void")]
    TsVoidKeyword,

    #[serde(rename = "undefined")]
    TsUndefinedKeyword,

    #[serde(rename = "null")]
    TsNullKeyword,

    #[serde(rename = "never")]
    TsNeverKeyword,

    #[serde(rename = "intrinsic")]
    TsIntrinsicKeyword,
}

#[ast_node("TsThisType")]
#[derive(Copy, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsThisType {
    pub span: Span,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsFnParam {
    #[tag("Identifier")]
    Ident(BindingIdent),

    #[tag("ArrayPattern")]
    Array(ArrayPat),

    #[tag("RestElement")]
    Rest(RestPat),

    #[tag("ObjectPattern")]
    Object(ObjectPat),
}

#[ast_node("TsFunctionType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsFnType {
    pub span: Span,
    pub params: Vec<TsFnParam>,

    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: TsTypeAnn,
}

#[ast_node("TsConstructorType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsConstructorType {
    pub span: Span,
    pub params: Vec<TsFnParam>,
    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: TsTypeAnn,
    pub is_abstract: bool,
}

#[ast_node("TsTypeReference")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeRef {
    pub span: Span,
    pub type_name: TsEntityName,
    #[serde(default)]
    pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node("TsTypePredicate")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypePredicate {
    pub span: Span,
    pub asserts: bool,
    pub param_name: TsThisTypeOrIdent,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsThisTypeOrIdent {
    #[tag("TsThisType")]
    TsThisType(TsThisType),

    #[tag("Identifier")]
    Ident(Ident),
}

/// `typeof` operator
#[ast_node("TsTypeQuery")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeQuery {
    pub span: Span,
    pub expr_name: TsTypeQueryExpr,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsTypeQueryExpr {
    #[tag("TsQualifiedName")]
    #[tag("Identifier")]
    TsEntityName(TsEntityName),
    #[tag("TsImportType")]
    Import(TsImportType),
}

#[ast_node("TsImportType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsImportType {
    pub span: Span,
    #[serde(rename = "argument")]
    pub arg: Str,
    pub qualifier: Option<TsEntityName>,
    #[serde(rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
}

#[ast_node("TsTypeLiteral")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeLit {
    pub span: Span,
    pub members: Vec<TsTypeElement>,
}

#[ast_node("TsArrayType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsArrayType {
    pub span: Span,
    pub elem_type: Box<TsType>,
}

#[ast_node("TsTupleType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTupleType {
    pub span: Span,
    pub elem_types: Vec<TsTupleElement>,
}

#[ast_node("TsTupleElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTupleElement {
    pub span: Span,
    /// `Ident` or `RestPat { arg: Ident }`
    pub label: Option<Pat>,
    pub ty: TsType,
}

#[ast_node("TsOptionalType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsOptionalType {
    pub span: Span,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Box<TsType>,
}

#[ast_node("TsRestType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsRestType {
    pub span: Span,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Box<TsType>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsUnionOrIntersectionType {
    #[tag("TsUnionType")]
    TsUnionType(TsUnionType),

    #[tag("TsIntersectionType")]
    TsIntersectionType(TsIntersectionType),
}

#[ast_node("TsUnionType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsUnionType {
    pub span: Span,
    pub types: Vec<Box<TsType>>,
}

#[ast_node("TsIntersectionType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsIntersectionType {
    pub span: Span,
    pub types: Vec<Box<TsType>>,
}

#[ast_node("TsConditionalType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsConditionalType {
    pub span: Span,
    pub check_type: Box<TsType>,
    pub extends_type: Box<TsType>,
    pub true_type: Box<TsType>,
    pub false_type: Box<TsType>,
}

#[ast_node("TsInferType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsInferType {
    pub span: Span,
    pub type_param: TsTypeParam,
}

#[ast_node("TsParenthesizedType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsParenthesizedType {
    pub span: Span,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Box<TsType>,
}

#[ast_node("TsTypeOperator")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeOperator {
    pub span: Span,
    pub op: TsTypeOperatorOp,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Box<TsType>,
}

#[derive(StringEnum, Clone, Copy, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsTypeOperatorOp {
    /// `keyof`
    KeyOf,
    /// `unique`
    Unique,
    /// `readonly`
    ReadOnly,
}

#[ast_node("TsIndexedAccessType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsIndexedAccessType {
    pub span: Span,
    pub readonly: bool,
    #[serde(rename = "objectType")]
    pub obj_type: Box<TsType>,
    pub index_type: Box<TsType>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TruePlusMinus {
    True,
    Plus,
    Minus,
}

impl Serialize for TruePlusMinus {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: ::serde::Serializer,
    {
        match *self {
            TruePlusMinus::True => serializer.serialize_bool(true),
            TruePlusMinus::Plus => serializer.serialize_str("+"),
            TruePlusMinus::Minus => serializer.serialize_str("-"),
        }
    }
}

impl<'de> Deserialize<'de> for TruePlusMinus {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        struct TruePlusMinusVisitor;

        impl<'de> Visitor<'de> for TruePlusMinusVisitor {
            type Value = TruePlusMinus;
            fn expecting(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
                formatter.write_str("one of '+', '-', true")
            }

            fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                match value {
                    "+" => Ok(TruePlusMinus::Plus),
                    "-" => Ok(TruePlusMinus::Minus),
                    "true" => Ok(TruePlusMinus::True),
                    _ => Err(de::Error::invalid_value(Unexpected::Str(value), &self)),
                }
            }

            fn visit_bool<E>(self, value: bool) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                if value {
                    Ok(TruePlusMinus::True)
                } else {
                    Err(de::Error::invalid_value(Unexpected::Bool(value), &self))
                }
            }
        }

        deserializer.deserialize_any(TruePlusMinusVisitor)
    }
}

#[ast_node("TsMappedType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsMappedType {
    pub span: Span,
    #[serde(default)]
    pub readonly: Option<TruePlusMinus>,
    pub type_param: TsTypeParam,
    #[serde(default, rename = "nameType")]
    pub name_type: Option<Box<TsType>>,
    #[serde(default)]
    pub optional: Option<TruePlusMinus>,
    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<Box<TsType>>,
}

#[ast_node("TsLiteralType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsLitType {
    pub span: Span,
    #[serde(rename = "literal")]
    pub lit: TsLit,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsLit {
    #[tag("NumericLiteral")]
    Number(Number),

    #[tag("StringLiteral")]
    Str(Str),

    #[tag("BooleanLiteral")]
    Bool(Bool),

    #[tag("BigIntLiteral")]
    BigInt(BigInt),

    #[tag("TemplateLiteral")]
    Tpl(TsTplLitType),
}

#[ast_node("TemplateLiteral")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTplLitType {
    pub span: Span,

    pub types: Vec<Box<TsType>>,

    pub quasis: Vec<TplElement>,
}

// // ================
// // TypeScript declarations
// // ================

#[ast_node("TsInterfaceDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsInterfaceDecl {
    pub span: Span,
    pub id: Ident,
    pub declare: bool,
    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,
    pub extends: Vec<TsExprWithTypeArgs>,
    pub body: TsInterfaceBody,
}

#[ast_node("TsInterfaceBody")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsInterfaceBody {
    pub span: Span,
    pub body: Vec<TsTypeElement>,
}

#[ast_node("TsExpressionWithTypeArguments")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsExprWithTypeArgs {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: TsEntityName,
    #[serde(default, rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
}

#[ast_node("TsTypeAliasDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeAliasDecl {
    pub span: Span,
    pub declare: bool,
    pub id: Ident,
    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Box<TsType>,
}

#[ast_node("TsEnumDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsEnumDecl {
    pub span: Span,
    pub declare: bool,
    pub is_const: bool,
    pub id: Ident,
    pub members: Vec<TsEnumMember>,
}

#[ast_node("TsEnumMember")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsEnumMember {
    pub span: Span,
    pub id: TsEnumMemberId,
    #[serde(default)]
    pub init: Option<Box<Expr>>,
}

///
/// - Invalid: [Ident] with empty symbol.
#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsEnumMemberId {
    #[tag("Identifier")]
    Ident(Ident),

    #[tag("StringLiteral")]
    Str(Str),
}

#[ast_node("TsModuleDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsModuleDecl {
    pub span: Span,
    pub declare: bool,
    /// In TypeScript, this is only available through`node.flags`.
    pub global: bool,
    pub id: TsModuleName,
    #[serde(default)]
    pub body: Option<TsNamespaceBody>,
}

/// `namespace A.B { }` is a namespace named `A` with another TsNamespaceDecl as
/// its body.
#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsNamespaceBody {
    #[tag("TsModuleBlock")]
    TsModuleBlock(TsModuleBlock),

    #[tag("TsNamespaceDeclaration")]
    TsNamespaceDecl(TsNamespaceDecl),
}

#[ast_node("TsModuleBlock")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsModuleBlock {
    pub span: Span,
    pub body: Vec<ModuleItem>,
}

#[ast_node("TsNamespaceDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsNamespaceDecl {
    pub span: Span,
    pub declare: bool,
    /// In TypeScript, this is only available through`node.flags`.
    pub global: bool,
    pub id: Ident,
    pub body: Box<TsNamespaceBody>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsModuleName {
    #[tag("Identifier")]
    Ident(Ident),

    #[tag("StringLiteral")]
    Str(Str),
}

#[ast_node("TsImportEqualsDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsImportEqualsDecl {
    pub span: Span,
    pub declare: bool,
    pub is_export: bool,
    pub id: Ident,
    pub module_ref: TsModuleRef,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsModuleRef {
    #[tag("TsQualifiedName")]
    #[tag("Identifier")]
    TsEntityName(TsEntityName),

    #[tag("TsExternalModuleReference")]
    TsExternalModuleRef(TsExternalModuleRef),
}

#[ast_node("TsExternalModuleReference")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsExternalModuleRef {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Str,
}

/// TypeScript's own parser uses ExportAssignment for both `export default` and
/// `export =`. But for @babel/parser, `export default` is an ExportDefaultDecl,
/// so a TsExportAssignment is always `export =`.
#[ast_node("TsExportAssignment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsExportAssignment {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[ast_node("TsNamespaceExportDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsNamespaceExportDecl {
    pub span: Span,
    pub id: Ident,
}

// // ================
// // TypeScript exprs
// // ================

#[ast_node("TsAsExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsAsExpr {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Box<TsType>,
}

#[ast_node("TsTypeAssertion")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeAssertion {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
    #[serde(rename = "typeAnnotation")]
    pub type_ann: Box<TsType>,
}

#[ast_node("TsNonNullExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsNonNullExpr {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Accessibility {
    #[serde(rename = "public")]
    Public,
    #[serde(rename = "protected")]
    Protected,
    #[serde(rename = "private")]
    Private,
}

#[ast_node("TsConstAssertion")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsConstAssertion {
    pub span: Span,
    pub expr: Box<Expr>,
}
