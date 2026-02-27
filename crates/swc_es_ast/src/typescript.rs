use swc_common::Span;

use crate::{ExprId, Ident};

/// TypeScript type annotation.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsTypeAnn {
    /// Original source span.
    pub span: Span,
    /// Referenced type node.
    pub ty: crate::TsTypeId,
}

/// TypeScript literal type.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum TsLitType {
    /// String literal type.
    Str(crate::StrLit),
    /// Number literal type.
    Num(crate::NumberLit),
    /// Boolean literal type.
    Bool(crate::BoolLit),
}

/// TypeScript type node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum TsType {
    /// Keyword type (`string`, `number`, ...).
    Keyword(TsKeywordType),
    /// Type reference.
    TypeRef(TsTypeRef),
    /// Literal type.
    Lit(TsLitType),
    /// Array type (`T[]`).
    Array(TsArrayType),
    /// Tuple type (`[A, B]`).
    Tuple(TsTupleType),
    /// Union type (`A | B`).
    Union(TsUnionType),
    /// Intersection type (`A & B`).
    Intersection(TsIntersectionType),
    /// Parenthesized type (`(T)`).
    Parenthesized(TsParenthesizedType),
    /// Type literal (`{ ... }`).
    TypeLit(TsTypeLit),
    /// Function type (`(a: A) => B`).
    Fn(TsFnType),
}

/// TypeScript keyword type.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum TsKeywordType {
    /// `any`
    Any,
    /// `unknown`
    Unknown,
    /// `never`
    Never,
    /// `void`
    Void,
    /// `string`
    String,
    /// `number`
    Number,
    /// `boolean`
    Boolean,
}

/// TypeScript type reference.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsTypeRef {
    /// Original source span.
    pub span: Span,
    /// Referenced type name.
    pub name: Ident,
    /// Optional type arguments.
    pub type_args: Vec<crate::TsTypeId>,
}

/// TypeScript array type.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsArrayType {
    /// Original source span.
    pub span: Span,
    /// Element type.
    pub elem_type: crate::TsTypeId,
}

/// TypeScript tuple type.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsTupleType {
    /// Original source span.
    pub span: Span,
    /// Tuple element types.
    pub elem_types: Vec<crate::TsTypeId>,
}

/// TypeScript union type.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsUnionType {
    /// Original source span.
    pub span: Span,
    /// Union member types.
    pub types: Vec<crate::TsTypeId>,
}

/// TypeScript intersection type.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsIntersectionType {
    /// Original source span.
    pub span: Span,
    /// Intersection member types.
    pub types: Vec<crate::TsTypeId>,
}

/// TypeScript parenthesized type.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsParenthesizedType {
    /// Original source span.
    pub span: Span,
    /// Inner type.
    pub ty: crate::TsTypeId,
}

/// TypeScript type literal.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsTypeLit {
    /// Original source span.
    pub span: Span,
    /// Number of parsed members.
    pub member_count: usize,
}

/// TypeScript function type parameter.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsFnParam {
    /// Original source span.
    pub span: Span,
    /// Optional parameter name.
    pub name: Option<Ident>,
    /// Optional type annotation.
    pub ty: Option<crate::TsTypeId>,
    /// Whether this is a rest parameter.
    pub is_rest: bool,
    /// Whether this parameter is optional.
    pub optional: bool,
}

/// TypeScript function type.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsFnType {
    /// Original source span.
    pub span: Span,
    /// Parameters.
    pub params: Vec<TsFnParam>,
    /// Return type.
    pub return_type: crate::TsTypeId,
}

/// Type assertion expression (`expr as T`).
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsAsExpr {
    /// Original source span.
    pub span: Span,
    /// Expression being asserted.
    pub expr: ExprId,
    /// Target type.
    pub ty: crate::TsTypeId,
}
