#![allow(missing_copy_implementations)]
use serde::{Deserialize, Serialize};

use crate::{
    class::Decorator,
    expr::Expr,
    ident::Ident,
    lit::{Bool, Number, Str},
    module::ModuleItem,
    pat::{AssignPat, ObjectPat, RestPat},
};
#[cfg(feature = "fold")]
use swc_common::Fold;
use swc_common::{ast_node, Span};

#[ast_node("TsTypeAnnotation")]
pub struct TsTypeAnn {
    #[serde(default)]
    pub span: Span,
    #[serde(rename = "type_annotation")]
    pub type_ann: Box<TsType>,
}

#[ast_node("TsTypeParameterDeclaration")]
pub struct TsTypeParamDecl {
    #[serde(default)]
    pub span: Span,
    #[serde(rename = "parameters")]
    pub params: Vec<TsTypeParam>,
}

#[ast_node]
pub struct TsTypeParam {
    #[serde(default)]
    pub span: Span,
    pub name: Ident,
    pub constraint: Option<Box<TsType>>,
    pub default: Option<Box<TsType>>,
}

#[ast_node]
pub struct TsTypeParamInstantiation {
    #[serde(default)]
    pub span: Span,
    pub params: Vec<Box<TsType>>,
}

#[ast_node]
pub struct TsTypeCastExpr {
    #[serde(default)]
    pub span: Span,
    pub expr: Box<Expr>,
    pub type_ann: TsTypeAnn,
}

#[ast_node]
pub struct TsParamProp {
    #[serde(default)]
    pub span: Span,
    #[serde(default)]
    pub decorators: Vec<Decorator>,
    /// At least one of `accessibility` or `readonly` must be set.
    pub accessibility: Option<Accessibility>,
    pub readonly: bool,
    pub param: TsParamPropParam,
}

#[ast_node]
pub enum TsParamPropParam {
    Ident(Ident),
    Assign(AssignPat),
}

#[ast_node]
pub struct TsQualifiedName {
    #[span(lo)]
    pub left: TsEntityName,
    #[span(hi)]
    pub right: Ident,
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum TsEntityName {
    TsQualifiedName(Box<TsQualifiedName>),
    Ident(Ident),
}

#[ast_node]
pub enum TsSignatureDecl {
    TsCallSignatureDecl(TsCallSignatureDecl),
    TsConstructSignatureDecl(TsConstructSignatureDecl),
    TsMethodSignature(TsMethodSignature),
    TsFnType(TsFnType),
    TsConstructorType(TsConstructorType),
}

// ================
// TypeScript type members (for type literal / interface / class)
// ================

#[ast_node]
pub enum TsTypeElement {
    TsCallSignatureDecl(TsCallSignatureDecl),
    TsConstructSignatureDecl(TsConstructSignatureDecl),
    TsPropertySignature(TsPropertySignature),
    TsMethodSignature(TsMethodSignature),
    TsIndexSignature(TsIndexSignature),
}

#[ast_node]
pub struct TsCallSignatureDecl {
    #[serde(default)]
    pub span: Span,
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TsTypeAnn>,
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node]
pub struct TsConstructSignatureDecl {
    #[serde(default)]
    pub span: Span,
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TsTypeAnn>,
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node]
pub struct TsPropertySignature {
    #[serde(default)]
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    pub init: Option<Box<Expr>>,
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TsTypeAnn>,
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node]
pub struct TsMethodSignature {
    #[serde(default)]
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TsTypeAnn>,
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node]
pub struct TsIndexSignature {
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TsTypeAnn>,

    pub readonly: bool,
    #[serde(default)]
    pub span: Span,
}

// ================
// TypeScript types
// ================

#[ast_node]
pub enum TsType {
    TsKeywordType(TsKeywordType),
    TsThisType(TsThisType),
    TsFnOrConstructorType(TsFnOrConstructorType),
    TsTypeRef(TsTypeRef),
    TsTypeQuery(TsTypeQuery),
    TsTypeLit(TsTypeLit),
    TsArrayType(TsArrayType),
    TsTupleType(TsTupleType),
    TsOptionalType(TsOptionalType),
    TsRestType(TsRestType),
    TsUnionOrIntersectionType(TsUnionOrIntersectionType),
    TsConditionalType(TsConditionalType),
    TsInferType(TsInferType),
    TsParenthesizedType(TsParenthesizedType),
    TsTypeOperator(TsTypeOperator),
    TsIndexedAccessType(TsIndexedAccessType),
    TsMappedType(TsMappedType),
    TsLitType(TsLitType),
    TsTypePredicate(TsTypePredicate),
}

#[ast_node]
pub enum TsFnOrConstructorType {
    TsFnType(TsFnType),
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

#[ast_node]
pub struct TsKeywordType {
    #[serde(default)]
    pub span: Span,
    pub kind: TsKeywordTypeKind,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[cfg_attr(feature = "fold", derive(Fold))]
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
}

#[ast_node]
pub struct TsThisType {
    #[serde(default)]
    pub span: Span,
}

#[ast_node]
pub enum TsFnParam {
    Ident(Ident),
    Rest(RestPat),
    Object(ObjectPat),
}

#[ast_node]
pub struct TsFnType {
    #[serde(default)]
    pub span: Span,
    pub params: Vec<TsFnParam>,

    pub type_params: Option<TsTypeParamDecl>,
    pub type_ann: TsTypeAnn,
}

#[ast_node]
pub struct TsConstructorType {
    #[serde(default)]
    pub span: Span,
    pub params: Vec<TsFnParam>,
    pub type_params: Option<TsTypeParamDecl>,
    pub type_ann: TsTypeAnn,
}

#[ast_node]
pub struct TsTypeRef {
    #[serde(default)]
    pub span: Span,
    pub type_name: TsEntityName,
    pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node]
pub struct TsTypePredicate {
    #[serde(default)]
    pub span: Span,
    pub param_name: TsThisTypeOrIdent,
    pub type_ann: TsTypeAnn,
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum TsThisTypeOrIdent {
    TsThisType(TsThisType),
    Ident(Ident),
}

/// `typeof` operator
#[ast_node]
pub struct TsTypeQuery {
    #[serde(default)]
    pub span: Span,
    pub expr_name: TsEntityName,
}

#[ast_node]
pub struct TsTypeLit {
    #[serde(default)]
    pub span: Span,
    pub members: Vec<TsTypeElement>,
}

#[ast_node]
pub struct TsArrayType {
    #[serde(default)]
    pub span: Span,
    pub elem_type: Box<TsType>,
}

#[ast_node]
pub struct TsTupleType {
    #[serde(default)]
    pub span: Span,
    pub elem_types: Vec<Box<TsType>>,
}

#[ast_node]
pub struct TsOptionalType {
    #[serde(default)]
    pub span: Span,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsRestType {
    #[serde(default)]
    pub span: Span,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub enum TsUnionOrIntersectionType {
    TsUnionType(TsUnionType),
    TsIntersectionType(TsIntersectionType),
}

#[ast_node]
pub struct TsUnionType {
    #[serde(default)]
    pub span: Span,
    pub types: Vec<Box<TsType>>,
}

#[ast_node]
pub struct TsIntersectionType {
    #[serde(default)]
    pub span: Span,
    pub types: Vec<Box<TsType>>,
}

#[ast_node]
pub struct TsConditionalType {
    #[serde(default)]
    pub span: Span,
    pub check_type: Box<TsType>,
    pub extends_type: Box<TsType>,
    pub true_type: Box<TsType>,
    pub false_type: Box<TsType>,
}

#[ast_node]
pub struct TsInferType {
    #[serde(default)]
    pub span: Span,
    pub type_param: TsTypeParam,
}

#[ast_node]
pub struct TsParenthesizedType {
    #[serde(default)]
    pub span: Span,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsTypeOperator {
    #[serde(default)]
    pub span: Span,
    pub op: TsTypeOperatorOp,
    pub type_ann: Box<TsType>,
}

#[derive(StringEnum, Clone, Copy, PartialEq, Eq)]
#[cfg_attr(feature = "fold", derive(Fold))]
pub enum TsTypeOperatorOp {
    /// `keyof`
    KeyOf,
    /// `unique`
    Unique,
}

#[ast_node("TsIndexedAccessType")]
pub struct TsIndexedAccessType {
    #[serde(default)]
    pub span: Span,
    pub obj_type: Box<TsType>,
    pub index_type: Box<TsType>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[cfg_attr(feature = "fold", derive(Fold))]
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

#[ast_node]
pub struct TsMappedType {
    #[serde(default)]
    pub span: Span,
    pub readonly: Option<TruePlusMinus>,
    pub type_param: TsTypeParam,
    pub optional: Option<TruePlusMinus>,
    pub type_ann: Option<Box<TsType>>,
}

#[ast_node]
pub struct TsLitType {
    #[serde(default)]
    pub span: Span,
    pub lit: TsLit,
}

#[ast_node]
pub enum TsLit {
    Number(Number),
    Str(Str),
    Bool(Bool),
}

// // ================
// // TypeScript declarations
// // ================

#[ast_node]
pub struct TsInterfaceDecl {
    #[serde(default)]
    pub span: Span,
    pub id: Ident,
    pub declare: bool,
    pub type_params: Option<TsTypeParamDecl>,
    pub extends: Vec<TsExprWithTypeArgs>,
    pub body: TsInterfaceBody,
}

#[ast_node]
pub struct TsInterfaceBody {
    #[serde(default)]
    pub span: Span,
    pub body: Vec<TsTypeElement>,
}

#[ast_node]
pub struct TsExprWithTypeArgs {
    #[serde(default)]
    pub span: Span,
    pub expr: TsEntityName,
    pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node]
pub struct TsTypeAliasDecl {
    #[serde(default)]
    pub span: Span,
    pub declare: bool,
    pub id: Ident,
    pub type_params: Option<TsTypeParamDecl>,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsEnumDecl {
    #[serde(default)]
    pub span: Span,
    pub declare: bool,
    pub is_const: bool,
    pub id: Ident,
    pub members: Vec<TsEnumMember>,
}

#[ast_node]
pub struct TsEnumMember {
    #[serde(default)]
    pub span: Span,
    pub id: TsEnumMemberId,
    pub init: Option<Box<Expr>>,
}

#[ast_node]
pub enum TsEnumMemberId {
    Ident(Ident),
    Str(Str),
}

#[ast_node]
pub struct TsModuleDecl {
    #[serde(default)]
    pub span: Span,
    pub declare: bool,
    /// In TypeScript, this is only available through`node.flags`.
    pub global: bool,
    pub id: TsModuleName,
    pub body: Option<TsNamespaceBody>,
}

/// `namespace A.B { }` is a namespace named `A` with another TsNamespaceDecl as
/// its body.
#[ast_node]
pub enum TsNamespaceBody {
    TsModuleBlock(TsModuleBlock),
    TsNamespaceDecl(TsNamespaceDecl),
}

#[ast_node]
pub struct TsModuleBlock {
    #[serde(default)]
    pub span: Span,
    pub body: Vec<ModuleItem>,
}

#[ast_node]
pub struct TsNamespaceDecl {
    #[serde(default)]
    pub span: Span,
    pub declare: bool,
    /// In TypeScript, this is only available through`node.flags`.
    pub global: bool,
    pub id: Ident,
    pub body: Box<TsNamespaceBody>,
}

#[ast_node]
pub enum TsModuleName {
    Ident(Ident),
    Str(Str),
}

#[ast_node]
pub struct TsImportEqualsDecl {
    #[serde(default)]
    pub span: Span,
    pub declare: bool,
    pub is_export: bool,
    pub id: Ident,
    pub module_ref: TsModuleRef,
}

#[ast_node]
pub enum TsModuleRef {
    TsEntityName(TsEntityName),
    TsExternalModuleRef(TsExternalModuleRef),
}

#[ast_node]
pub struct TsExternalModuleRef {
    #[serde(default)]
    pub span: Span,
    pub expr: Str,
}

/// TypeScript's own parser uses ExportAssignment for both `export default` and
/// `export =`. But for @babel/parser, `export default` is an ExportDefaultDecl,
/// so a TsExportAssignment is always `export =`.
#[ast_node]
pub struct TsExportAssignment {
    #[serde(default)]
    pub span: Span,
    pub expr: Box<Expr>,
}

#[ast_node]
pub struct TsNamespaceExportDecl {
    #[serde(default)]
    pub span: Span,
    pub id: Ident,
}

// // ================
// // TypeScript exprs
// // ================

#[ast_node]
pub struct TsAsExpr {
    #[serde(default)]
    pub span: Span,
    pub expr: Box<Expr>,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsTypeAssertion {
    #[serde(default)]
    pub span: Span,
    pub expr: Box<Expr>,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsNonNullExpr {
    #[serde(default)]
    pub span: Span,
    pub expr: Box<Expr>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[cfg_attr(feature = "fold", derive(Fold))]
pub enum Accessibility {
    #[serde(rename = "public")]
    Public,
    #[serde(rename = "protected")]
    Protected,
    #[serde(rename = "private")]
    Private,
}
