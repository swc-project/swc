#![allow(missing_copy_implementations)]

use crate::{
    class::Decorator,
    expr::Expr,
    ident::Ident,
    lit::{Bool, Number, Str},
    pat::{AssignPat, ObjectPat, RestPat},
    module::ModuleItem,
};
use swc_common::{ast_node, Fold, Span};

#[ast_node]
pub struct TsTypeAnn {
    pub span: Span,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsTypeParamDecl {
    pub span: Span,
    pub params: Vec<TsTypeParam>,
}

#[ast_node]
pub struct TsTypeParam {
    pub span: Span,
    pub name: Ident,
    pub constraint: Option<Box<TsType>>,
    pub default: Option<Box<TsType>>,
}

#[ast_node]
pub struct TsTypeParamInstantiation {
    pub span: Span,
    pub params: Vec<Box<TsType>>,
}

#[ast_node]
pub struct TsTypeCastExpr {
    pub span: Span,
    pub expr: Box<Expr>,
    pub type_ann: TsTypeAnn,
}

#[ast_node]
pub struct TsParamProp {
    pub span: Span,
    pub decorators: Vec<Decorator>,
    /// At least one of `accessibility` or `readonly` must be set.
    pub accessibility: Option<Accessibility>,
    pub readonly: bool,
    pub param: TsParamPropParam,
}

#[ast_node]
pub enum TsParamPropParam {
    Ident(Ident),
    AssignPat(AssignPat),
}

/// declare function foo()
#[ast_node]
pub struct TsDeclareFn {
    pub span: Span,
}

#[ast_node]
pub struct TsDeclareMethod {
    pub span: Span,
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
    pub span: Span,
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TsTypeAnn>,
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node]
pub struct TsConstructSignatureDecl {
    pub span: Span,
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TsTypeAnn>,
    pub type_params: Option<TsTypeParamDecl>,
}

#[ast_node]
pub struct TsPropertySignature {
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
    pub span: Span,
    pub kind: TsKeywordTypeKind,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, Fold)]
pub enum TsKeywordTypeKind {
    TsAnyKeyword,
    TsUnknownKeyword,
    TsNumberKeyword,
    TsObjectKeyword,
    TsBooleanKeyword,
    TsBigIntKeyword,
    TsStringKeyword,
    TsSymbolKeyword,
    TsVoidKeyword,
    TsUndefinedKeyword,
    TsNullKeyword,
    TsNeverKeyword,
}

#[ast_node]
pub struct TsThisType {
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
    pub span: Span,
    pub params: Vec<TsFnParam>,

    pub type_params: Option<TsTypeParamDecl>,
    pub type_ann: TsTypeAnn,
}

#[ast_node]
pub struct TsConstructorType {
    pub span: Span,
    pub params: Vec<TsFnParam>,
    pub type_params: Option<TsTypeParamDecl>,
    pub type_ann: TsTypeAnn,
}

#[ast_node]
pub struct TsTypeRef {
    pub span: Span,
    pub type_name: TsEntityName,
    pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node]
pub struct TsTypePredicate {
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
    pub span: Span,
    pub expr_name: TsEntityName,
}

#[ast_node]
pub struct TsTypeLit {
    pub span: Span,
    pub members: Vec<TsTypeElement>,
}

#[ast_node]
pub struct TsArrayType {
    pub span: Span,
    pub elem_type: Box<TsType>,
}

#[ast_node]
pub struct TsTupleType {
    pub span: Span,
    pub elem_types: Vec<Box<TsType>>,
}

#[ast_node]
pub struct TsOptionalType {
    pub span: Span,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsRestType {
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
    pub span: Span,
    pub types: Vec<Box<TsType>>,
}

#[ast_node]
pub struct TsIntersectionType {
    pub span: Span,
    pub types: Vec<Box<TsType>>,
}

#[ast_node]
pub struct TsConditionalType {
    pub span: Span,
    pub check_type: Box<TsType>,
    pub extends_type: Box<TsType>,
    pub true_type: Box<TsType>,
    pub false_type: Box<TsType>,
}

#[ast_node]
pub struct TsInferType {
    pub span: Span,
    pub type_param: TsTypeParam,
}

#[ast_node]
pub struct TsParenthesizedType {
    pub span: Span,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsTypeOperator {
    pub span: Span,
    pub op: TsTypeOperatorOp,
    pub type_ann: Box<TsType>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Fold)]
pub enum TsTypeOperatorOp {
    KeyOf,
    Unique,
}

#[ast_node]
pub struct TsIndexedAccessType {
    pub span: Span,
    pub obj_type: Box<TsType>,
    pub index_type: Box<TsType>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Fold)]
pub enum TruePlusMinus {
    True,
    Plus,
    Minus,
}

#[ast_node]
pub struct TsMappedType {
    pub span: Span,
    pub readonly: Option<TruePlusMinus>,
    pub type_param: TsTypeParam,
    pub optional: Option<TruePlusMinus>,
    pub type_ann: Option<Box<TsType>>,
}

#[ast_node]
pub struct TsLitType {
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
    pub span: Span,
    pub id: Ident,
    pub declare: bool,
    pub type_params: Option<TsTypeParamDecl>,
    pub extends: Vec<TsExprWithTypeArgs>,
    pub body: TsInterfaceBody,
}

#[ast_node]
pub struct TsInterfaceBody {
    pub span: Span,
    pub body: Vec<TsTypeElement>,
}

#[ast_node]
pub struct TsExprWithTypeArgs {
    pub span: Span,
    pub expr: TsEntityName,
    pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node]
pub struct TsTypeAliasDecl {
    pub span: Span,
    pub declare: bool,
    pub id: Ident,
    pub type_params: Option<TsTypeParamDecl>,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsEnumDecl {
    pub span: Span,
    pub declare: bool,
    pub is_const: bool,
    pub id: Ident,
    pub members: Vec<TsEnumMember>,
}

#[ast_node]
pub struct TsEnumMember {
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
    pub span: Span,
    pub body: Vec<ModuleItem>,
}

#[ast_node]
pub struct TsNamespaceDecl {
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
    pub span: Span,
    pub expr: Str,
}

/// TypeScript's own parser uses ExportAssignment for both `export default` and
/// `export =`. But for @babel/parser, `export default` is an ExportDefaultDecl,
/// so a TsExportAssignment is always `export =`.
#[ast_node]
pub struct TsExportAssignment {
    pub span: Span,
    pub expr: Box<Expr>,
}

#[ast_node]
pub struct TsNamespaceExportDecl {
    pub span: Span,
    pub id: Ident,
}

// // ================
// // TypeScript exprs
// // ================

#[ast_node]
pub struct TsAsExpr {
    pub span: Span,
    pub expr: Box<Expr>,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsTypeAssertion {
    pub span: Span,
    pub expr: Box<Expr>,
    pub type_ann: Box<TsType>,
}

#[ast_node]
pub struct TsNonNullExpr {
    pub span: Span,
    pub expr: Box<Expr>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Fold)]
pub enum Accessibility {
    Public,
    Protected,
    Private,
}
