#![allow(clippy::vec_box)]
#![allow(missing_copy_implementations)]

#[cfg(feature = "serde-impl")]
use std::fmt;

use is_macro::Is;
#[cfg(feature = "serde-impl")]
use serde::{
    de::{self, Unexpected, Visitor},
    Deserialize, Deserializer, Serialize,
};
use string_enum::StringEnum;
use swc_allocator::arena::{Box, Vec};
use swc_atoms::Atom;
use swc_common::{
    arena::{ast_node, CloneIn},
    EqIgnoreSpan, Span,
};

use super::{
    class::Decorator,
    expr::Expr,
    ident::Ident,
    lit::{Bool, Number, Str},
    module::ModuleItem,
    pat::{ArrayPat, AssignPat, ObjectPat, Pat, RestPat},
    BigInt, BindingIdent, IdentName, TplElement,
};

#[ast_node("TsTypeAnnotation")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeAnn<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[ast_node("TsTypeParameterDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeParamDecl<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "parameters"))]
    pub params: Vec<'a, TsTypeParam<'a>>,
}

#[ast_node("TsTypeParameter")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeParam<'a> {
    pub span: Span,
    pub name: Ident,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "in"))]
    pub is_in: bool,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "out"))]
    pub is_out: bool,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "const"))]
    pub is_const: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub constraint: Option<TsType<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub default: Option<TsType<'a>>,
}

#[ast_node("TsTypeParameterInstantiation")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeParamInstantiation<'a> {
    pub span: Span,
    pub params: Vec<'a, TsType<'a>>,
}

#[ast_node("TsParameterProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsParamProp<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<'a, Decorator<'a>>,
    /// At least one of `accessibility` or `readonly` must be set.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub accessibility: Option<Accessibility>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "override"))]
    pub is_override: bool,
    pub readonly: bool,
    pub param: TsParamPropParam<'a>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsParamPropParam<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, BindingIdent<'a>>),

    // #[tag("AssignmentPattern")]
    Assign(Box<'a, AssignPat<'a>>),
}

#[ast_node("TsQualifiedName")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsQualifiedName<'a> {
    pub span: Span,
    pub left: TsEntityName<'a>,
    pub right: IdentName,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsEntityName<'a> {
    // #[tag("TsQualifiedName")]
    TsQualifiedName(Box<'a, TsQualifiedName<'a>>),

    // #[tag("Identifier")]
    Ident(Box<'a, Ident>),
}

// ================
// TypeScript type members (for type literal / interface / class)
// ================

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsTypeElement<'a> {
    // #[tag("TsCallSignatureDeclaration")]
    TsCallSignatureDecl(Box<'a, TsCallSignatureDecl<'a>>),

    // #[tag("TsConstructSignatureDeclaration")]
    TsConstructSignatureDecl(Box<'a, TsConstructSignatureDecl<'a>>),

    // #[tag("TsPropertySignature")]
    TsPropertySignature(Box<'a, TsPropertySignature<'a>>),

    // #[tag("TsGetterSignature")]
    TsGetterSignature(Box<'a, TsGetterSignature<'a>>),

    // #[tag("TsSetterSignature")]
    TsSetterSignature(Box<'a, TsSetterSignature<'a>>),

    // #[tag("TsMethodSignature")]
    TsMethodSignature(Box<'a, TsMethodSignature<'a>>),

    // #[tag("TsIndexSignature")]
    TsIndexSignature(Box<'a, TsIndexSignature<'a>>),
}

#[ast_node("TsCallSignatureDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsCallSignatureDecl<'a> {
    pub span: Span,
    pub params: Vec<'a, TsFnParam<'a>>,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,
}

#[ast_node("TsConstructSignatureDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsConstructSignatureDecl<'a> {
    pub span: Span,
    pub params: Vec<'a, TsFnParam<'a>>,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,
}

#[ast_node("TsPropertySignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsPropertySignature<'a> {
    pub span: Span,
    pub readonly: bool,
    pub key: Expr<'a>,
    pub computed: bool,
    pub optional: bool,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
}

#[ast_node("TsGetterSignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsGetterSignature<'a> {
    pub span: Span,
    pub key: Expr<'a>,
    pub computed: bool,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
}

#[ast_node("TsSetterSignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsSetterSignature<'a> {
    pub span: Span,
    pub key: Expr<'a>,
    pub computed: bool,
    pub param: TsFnParam<'a>,
}

#[ast_node("TsMethodSignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsMethodSignature<'a> {
    pub span: Span,
    pub key: Expr<'a>,
    pub computed: bool,
    pub optional: bool,
    pub params: Vec<'a, TsFnParam<'a>>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,
}

#[ast_node("TsIndexSignature")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsIndexSignature<'a> {
    pub params: Vec<'a, TsFnParam<'a>>,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,

    pub readonly: bool,
    #[cfg_attr(feature = "serde-impl", serde(rename = "static"))]
    pub is_static: bool,
    pub span: Span,
}

// ================
// TypeScript types
// ================

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsType<'a> {
    // #[tag("TsKeywordType")]
    TsKeywordType(Box<'a, TsKeywordType>),

    // #[tag("TsThisType")]
    TsThisType(Box<'a, TsThisType>),

    // #[tag("TsFunctionType")]
    // #[tag("TsConstructorType")]
    TsFnOrConstructorType(Box<'a, TsFnOrConstructorType<'a>>),

    // #[tag("TsTypeReference")]
    TsTypeRef(Box<'a, TsTypeRef<'a>>),

    // #[tag("TsTypeQuery")]
    TsTypeQuery(Box<'a, TsTypeQuery<'a>>),

    // #[tag("TsTypeLiteral")]
    TsTypeLit(Box<'a, TsTypeLit<'a>>),

    // #[tag("TsArrayType")]
    TsArrayType(Box<'a, TsArrayType<'a>>),

    // #[tag("TsTupleType")]
    TsTupleType(Box<'a, TsTupleType<'a>>),

    // #[tag("TsOptionalType")]
    TsOptionalType(Box<'a, TsOptionalType<'a>>),

    // #[tag("TsRestType")]
    TsRestType(Box<'a, TsRestType<'a>>),

    // #[tag("TsUnionType")]
    // #[tag("TsIntersectionType")]
    TsUnionOrIntersectionType(Box<'a, TsUnionOrIntersectionType<'a>>),

    // #[tag("TsConditionalType")]
    TsConditionalType(Box<'a, TsConditionalType<'a>>),

    // #[tag("TsInferType")]
    TsInferType(Box<'a, TsInferType<'a>>),

    // #[tag("TsParenthesizedType")]
    TsParenthesizedType(Box<'a, TsParenthesizedType<'a>>),

    // // #[tag("TsTypeOperator")]
    TsTypeOperator(Box<'a, TsTypeOperator<'a>>),

    // #[tag("TsIndexedAccessType")]
    TsIndexedAccessType(Box<'a, TsIndexedAccessType<'a>>),

    // #[tag("TsMappedType")]
    TsMappedType(Box<'a, TsMappedType<'a>>),

    // #[tag("TsLiteralType")]
    TsLitType(Box<'a, TsLitType<'a>>),

    // #[tag("TsTypePredicate")]
    TsTypePredicate(Box<'a, TsTypePredicate<'a>>),

    // #[tag("TsImportType")]
    TsImportType(Box<'a, TsImportType<'a>>),
}

// Implement Clone without inline to avoid multiple copies of the
// implementation.
// impl Clone for TsType {
//     fn clone(&self) -> Self {
//         use TsType::*;
//         match self {
//             TsKeywordType(t) => TsKeywordType(t.clone()),
//             TsThisType(t) => TsThisType(t.clone()),
//             TsFnOrConstructorType(t) => TsFnOrConstructorType(t.clone()),
//             TsTypeRef(t) => TsTypeRef(t.clone()),
//             TsTypeQuery(t) => TsTypeQuery(t.clone()),
//             TsTypeLit(t) => TsTypeLit(t.clone()),
//             TsArrayType(t) => TsArrayType(t.clone()),
//             TsTupleType(t) => TsTupleType(t.clone()),
//             TsOptionalType(t) => TsOptionalType(t.clone()),
//             TsRestType(t) => TsRestType(t.clone()),
//             TsUnionOrIntersectionType(t) =>
// TsUnionOrIntersectionType(t.clone()),             TsConditionalType(t) =>
// TsConditionalType(t.clone()),             TsInferType(t) =>
// TsInferType(t.clone()),             TsParenthesizedType(t) =>
// TsParenthesizedType(t.clone()),             TsTypeOperator(t) =>
// TsTypeOperator(t.clone()),             TsIndexedAccessType(t) =>
// TsIndexedAccessType(t.clone()),             TsMappedType(t) =>
// TsMappedType(t.clone()),             TsLitType(t) => TsLitType(t.clone()),
//             TsTypePredicate(t) => TsTypePredicate(t.clone()),
//             TsImportType(t) => TsImportType(t.clone()),
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsFnOrConstructorType<'a> {
    // #[tag("TsFunctionType")]
    TsFnType(Box<'a, TsFnType<'a>>),
    // #[tag("TsConstructorType")]
    TsConstructorType(Box<'a, TsConstructorType<'a>>),
}

// impl<'a> FromWith<'a, TsFnType<'a>> for TsType<'a> {
//     fn from_with(value: TsFnType<'a>, allocator: &'a
// swc_allocator::Allocator) -> Self {         TsType::TsFnOrConstructorType(
//             TsFnOrConstructorType::TsFnType(Box::new_in(value,
// allocator)).into_with(allocator),         )
//     }
// }

// impl<'a> FromWith<'a, TsConstructorType<'a>> for TsType<'a> {
//     fn from_with(value: TsConstructorType<'a>, allocator: &'a
// swc_allocator::Allocator) -> Self {         TsType::TsFnOrConstructorType(
//             TsFnOrConstructorType::TsConstructorType(Box::new_in(value,
// allocator))                 .into_with(allocator),
//         )
//     }
// }

// impl<'a> FromWith<'a, TsUnionType<'a>> for TsType<'a> {
//     fn from_with(value: TsUnionType<'a>, allocator: &'a
// swc_allocator::Allocator) -> Self {
//         TsType::TsUnionOrIntersectionType(
//             TsUnionOrIntersectionType::TsUnionType(Box::new_in(value,
// allocator))                 .into_with(allocator),
//         )
//     }
// }

// impl<'a> FromWith<'a, TsIntersectionType<'a>> for TsType<'a> {
//     fn from_with(value: TsIntersectionType<'a>, allocator: &'a
// swc_allocator::Allocator) -> Self {
//         TsType::TsUnionOrIntersectionType(
//             TsUnionOrIntersectionType::TsIntersectionType(Box::new_in(value,
// allocator))                 .into_with(allocator),
//         )
//     }
// }

#[ast_node("TsKeywordType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsKeywordType {
    pub span: Span,
    pub kind: TsKeywordTypeKind,
}

#[derive(Debug, Copy, Clone, CloneIn, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(u32))]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
pub enum TsKeywordTypeKind {
    #[cfg_attr(feature = "serde-impl", serde(rename = "any"))]
    TsAnyKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "unknown"))]
    TsUnknownKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "number"))]
    TsNumberKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "object"))]
    TsObjectKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "boolean"))]
    TsBooleanKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "bigint"))]
    TsBigIntKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "string"))]
    TsStringKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "symbol"))]
    TsSymbolKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "void"))]
    TsVoidKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "undefined"))]
    TsUndefinedKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "null"))]
    TsNullKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "never"))]
    TsNeverKeyword,

    #[cfg_attr(feature = "serde-impl", serde(rename = "intrinsic"))]
    TsIntrinsicKeyword,
}

#[ast_node("TsThisType")]
#[derive(Copy, Clone, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsThisType {
    pub span: Span,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsFnParam<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, BindingIdent<'a>>),

    // #[tag("ArrayPattern")]
    Array(Box<'a, ArrayPat<'a>>),

    // #[tag("RestElement")]
    Rest(Box<'a, RestPat<'a>>),

    // #[tag("ObjectPattern")]
    Object(Box<'a, ObjectPat<'a>>),
}

#[ast_node("TsFunctionType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsFnType<'a> {
    pub span: Span,
    pub params: Vec<'a, TsFnParam<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: Box<'a, TsTypeAnn<'a>>,
}

#[ast_node("TsConstructorType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsConstructorType<'a> {
    pub span: Span,
    pub params: Vec<'a, TsFnParam<'a>>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: Box<'a, TsTypeAnn<'a>>,
    pub is_abstract: bool,
}

#[ast_node("TsTypeReference")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeRef<'a> {
    pub span: Span,
    pub type_name: TsEntityName<'a>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamInstantiation<'a>>>,
}

#[ast_node("TsTypePredicate")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypePredicate<'a> {
    pub span: Span,
    pub asserts: bool,
    pub param_name: TsThisTypeOrIdent<'a>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsThisTypeOrIdent<'a> {
    // #[tag("TsThisType")]
    TsThisType(Box<'a, TsThisType>),

    // #[tag("Identifier")]
    Ident(Box<'a, Ident>),
}

/// `typeof` operator
#[ast_node("TsTypeQuery")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeQuery<'a> {
    pub span: Span,
    pub expr_name: TsTypeQueryExpr<'a>,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeArguments"))]
    pub type_args: Option<Box<'a, TsTypeParamInstantiation<'a>>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsTypeQueryExpr<'a> {
    // #[tag("TsQualifiedName")]
    // #[tag("Identifier")]
    TsEntityName(Box<'a, TsEntityName<'a>>),
    // #[tag("TsImportType")]
    Import(Box<'a, TsImportType<'a>>),
}

#[ast_node("TsImportType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsImportType<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "argument"))]
    pub arg: Str,
    pub qualifier: Option<TsEntityName<'a>>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeArguments"))]
    pub type_args: Option<Box<'a, TsTypeParamInstantiation<'a>>>,
}

#[ast_node("TsTypeLiteral")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeLit<'a> {
    pub span: Span,
    pub members: Vec<'a, TsTypeElement<'a>>,
}

#[ast_node("TsArrayType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsArrayType<'a> {
    pub span: Span,
    pub elem_type: TsType<'a>,
}

#[ast_node("TsTupleType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTupleType<'a> {
    pub span: Span,
    pub elem_types: Vec<'a, TsTupleElement<'a>>,
}

#[ast_node("TsTupleElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTupleElement<'a> {
    pub span: Span,
    /// `Ident` or `RestPat { arg: Ident }`
    pub label: Option<Pat<'a>>,
    pub ty: TsType<'a>,
}

#[ast_node("TsOptionalType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsOptionalType<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[ast_node("TsRestType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsRestType<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsUnionOrIntersectionType<'a> {
    // #[tag("TsUnionType")]
    TsUnionType(Box<'a, TsUnionType<'a>>),

    // #[tag("TsIntersectionType")]
    TsIntersectionType(Box<'a, TsIntersectionType<'a>>),
}

#[ast_node("TsUnionType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsUnionType<'a> {
    pub span: Span,
    pub types: Vec<'a, TsType<'a>>,
}

#[ast_node("TsIntersectionType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsIntersectionType<'a> {
    pub span: Span,
    pub types: Vec<'a, TsType<'a>>,
}

#[ast_node("TsConditionalType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsConditionalType<'a> {
    pub span: Span,
    pub check_type: TsType<'a>,
    pub extends_type: TsType<'a>,
    pub true_type: TsType<'a>,
    pub false_type: TsType<'a>,
}

#[ast_node("TsInferType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsInferType<'a> {
    pub span: Span,
    pub type_param: TsTypeParam<'a>,
}

#[ast_node("TsParenthesizedType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsParenthesizedType<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[ast_node("TsTypeOperator")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeOperator<'a> {
    pub span: Span,
    pub op: TsTypeOperatorOp,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[derive(StringEnum, Clone, CloneIn, Copy, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(u32))]
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
pub struct TsIndexedAccessType<'a> {
    pub span: Span,
    pub readonly: bool,
    #[cfg_attr(feature = "serde-impl", serde(rename = "objectType"))]
    pub obj_type: TsType<'a>,
    pub index_type: TsType<'a>,
}

#[derive(Debug, Clone, CloneIn, Copy, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(u32))]
pub enum TruePlusMinus {
    True,
    Plus,
    Minus,
}

#[cfg(feature = "serde-impl")]
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

// #[cfg(feature = "serde-impl")]
// impl<'de> Deserialize<'de> for TruePlusMinus {
//     fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
//     where
//         D: Deserializer<'de>,
//     {
//         struct TruePlusMinusVisitor;

//         impl Visitor<'_> for TruePlusMinusVisitor {
//             type Value = TruePlusMinus;

//             fn expecting(&self, formatter: &mut fmt::Formatter<'_>) ->
// fmt::Result {                 formatter.write_str("one of '+', '-', true")
//             }

//             fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
//             where
//                 E: de::Error,
//             {
//                 match value {
//                     "+" => Ok(TruePlusMinus::Plus),
//                     "-" => Ok(TruePlusMinus::Minus),
//                     "true" => Ok(TruePlusMinus::True),
//                     _ => Err(de::Error::invalid_value(Unexpected::Str(value),
// &self)),                 }
//             }

//             fn visit_bool<E>(self, value: bool) -> Result<Self::Value, E>
//             where
//                 E: de::Error,
//             {
//                 if value {
//                     Ok(TruePlusMinus::True)
//                 } else {
//                     Err(de::Error::invalid_value(Unexpected::Bool(value),
// &self))                 }
//             }
//         }

//         deserializer.deserialize_any(TruePlusMinusVisitor)
//     }
// }

#[ast_node("TsMappedType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsMappedType<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub readonly: Option<TruePlusMinus>,
    pub type_param: TsTypeParam<'a>,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "nameType"))]
    pub name_type: Option<TsType<'a>>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub optional: Option<TruePlusMinus>,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<TsType<'a>>,
}

#[ast_node("TsLiteralType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsLitType<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "literal"))]
    pub lit: TsLit<'a>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsLit<'a> {
    // #[tag("NumericLiteral")]
    Number(Box<'a, Number>),

    // #[tag("StringLiteral")]
    Str(Box<'a, Str>),

    // #[tag("BooleanLiteral")]
    Bool(Box<'a, Bool>),

    // #[tag("BigIntLiteral")]
    BigInt(Box<'a, BigInt<'a>>),

    // #[tag("TemplateLiteral")]
    Tpl(Box<'a, TsTplLitType<'a>>),
}

#[ast_node("TemplateLiteral")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTplLitType<'a> {
    pub span: Span,

    pub types: Vec<'a, TsType<'a>>,

    pub quasis: Vec<'a, TplElement>,
}

// // ================
// // TypeScript declarations
// // ================

#[ast_node("TsInterfaceDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsInterfaceDecl<'a> {
    pub span: Span,
    pub id: Ident,
    pub declare: bool,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,
    pub extends: Vec<'a, TsExprWithTypeArgs<'a>>,
    pub body: TsInterfaceBody<'a>,
}

#[ast_node("TsInterfaceBody")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsInterfaceBody<'a> {
    pub span: Span,
    pub body: Vec<'a, TsTypeElement<'a>>,
}

#[ast_node("TsExpressionWithTypeArguments")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsExprWithTypeArgs<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeArguments"))]
    pub type_args: Option<Box<'a, TsTypeParamInstantiation<'a>>>,
}

#[ast_node("TsTypeAliasDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeAliasDecl<'a> {
    pub span: Span,
    pub declare: bool,
    pub id: Ident,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[ast_node("TsEnumDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsEnumDecl<'a> {
    pub span: Span,
    pub declare: bool,
    pub is_const: bool,
    pub id: Ident,
    pub members: Vec<'a, TsEnumMember<'a>>,
}

#[ast_node("TsEnumMember")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsEnumMember<'a> {
    pub span: Span,
    pub id: TsEnumMemberId<'a>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub init: Option<Expr<'a>>,
}

///
/// - Invalid: [Ident] with empty symbol.
#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsEnumMemberId<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, Ident>),

    // #[tag("StringLiteral")]
    Str(Box<'a, Str>),
}

// impl AsRef<Atom> for TsEnumMemberId {
//     fn as_ref(&self) -> &Atom {
//         match &self {
//             TsEnumMemberId::Str(Str { value: ref sym, .. })
//             | TsEnumMemberId::Ident(Ident { ref sym, .. }) => sym,
//         }
//     }
// }

#[ast_node("TsModuleDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsModuleDecl<'a> {
    pub span: Span,
    pub declare: bool,
    /// In TypeScript, this is only available through`node.flags`.
    pub global: bool,
    pub id: TsModuleName<'a>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub body: Option<TsNamespaceBody<'a>>,
}

/// `namespace A.B { }` is a namespace named `A` with another TsNamespaceDecl as
/// its body.
#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsNamespaceBody<'a> {
    // #[tag("TsModuleBlock")]
    TsModuleBlock(Box<'a, TsModuleBlock<'a>>),

    // #[tag("TsNamespaceDeclaration")]
    TsNamespaceDecl(Box<'a, TsNamespaceDecl<'a>>),
}

#[ast_node("TsModuleBlock")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsModuleBlock<'a> {
    pub span: Span,
    pub body: Vec<'a, ModuleItem<'a>>,
}

#[ast_node("TsNamespaceDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsNamespaceDecl<'a> {
    pub span: Span,
    pub declare: bool,
    /// In TypeScript, this is only available through`node.flags`.
    pub global: bool,
    pub id: Ident,
    pub body: Box<'a, TsNamespaceBody<'a>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsModuleName<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, Ident>),

    // #[tag("StringLiteral")]
    Str(Box<'a, Str>),
}

#[ast_node("TsImportEqualsDeclaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsImportEqualsDecl<'a> {
    pub span: Span,
    pub is_export: bool,
    pub is_type_only: bool,
    pub id: Ident,
    pub module_ref: TsModuleRef<'a>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum TsModuleRef<'a> {
    // #[tag("TsQualifiedName")]
    // #[tag("Identifier")]
    TsEntityName(Box<'a, TsEntityName<'a>>),

    // #[tag("TsExternalModuleReference")]
    TsExternalModuleRef(Box<'a, TsExternalModuleRef>),
}

#[ast_node("TsExternalModuleReference")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsExternalModuleRef {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Str,
}

/// TypeScript's own parser uses ExportAssignment for both `export default` and
/// `export =`. But for @babel/parser, `export default` is an ExportDefaultDecl,
/// so a TsExportAssignment is always `export =`.
#[ast_node("TsExportAssignment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsExportAssignment<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
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
pub struct TsAsExpr<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[ast_node("TsTypeAssertion")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsTypeAssertion<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[ast_node("TsNonNullExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsNonNullExpr<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
}

#[ast_node("TsSatisfiesExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsSatisfiesExpr<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeAnnotation"))]
    pub type_ann: TsType<'a>,
}

#[derive(Debug, Clone, CloneIn, Copy, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(u32))]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
pub enum Accessibility {
    #[cfg_attr(feature = "serde-impl", serde(rename = "public"))]
    Public,
    #[cfg_attr(feature = "serde-impl", serde(rename = "protected"))]
    Protected,
    #[cfg_attr(feature = "serde-impl", serde(rename = "private"))]
    Private,
}

#[ast_node("TsConstAssertion")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsConstAssertion<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
}

#[ast_node("TsInstantiation")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TsInstantiation<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "typeArguments"))]
    pub type_args: Box<'a, TsTypeParamInstantiation<'a>>,
}
