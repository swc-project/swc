use swc_common::Span;

use crate::{ExprId, Ident, PropName, StmtId, StrLit};

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

/// TypeScript type member kind.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum TsTypeMemberKind {
    /// Property signature.
    Property,
    /// Method signature.
    Method,
    /// Call signature.
    Call,
    /// Construct signature.
    Construct,
    /// Index signature.
    Index,
}

/// TypeScript type member.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsTypeMember {
    /// Original source span.
    pub span: Span,
    /// Member kind.
    pub kind: TsTypeMemberKind,
    /// Optional member name.
    pub name: Option<PropName>,
    /// Whether this member is optional.
    pub optional: bool,
    /// Whether this member is readonly.
    pub readonly: bool,
    /// Optional parameters for callable members.
    pub params: Vec<TsFnParam>,
    /// Optional type annotation.
    pub ty: Option<crate::TsTypeId>,
}

/// TypeScript type literal.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsTypeLit {
    /// Original source span.
    pub span: Span,
    /// Parsed members.
    pub members: Vec<TsTypeMember>,
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

/// TypeScript module name.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum TsModuleName {
    /// Identifier module name.
    Ident(Ident),
    /// String-literal module name.
    Str(StrLit),
}

/// TypeScript namespace body.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum TsNamespaceBody {
    /// Module block body.
    ModuleBlock(Vec<StmtId>),
    /// Nested namespace declaration.
    Namespace(Box<TsNamespaceDecl>),
}

/// Nested TypeScript namespace declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsNamespaceDecl {
    /// Original source span.
    pub span: Span,
    /// Whether this is declared.
    pub declare: bool,
    /// Whether this is global.
    pub global: bool,
    /// Namespace identifier.
    pub id: Ident,
    /// Namespace body.
    pub body: Box<TsNamespaceBody>,
}

/// TypeScript module / namespace declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsModuleDecl {
    /// Original source span.
    pub span: Span,
    /// Whether this is declared.
    pub declare: bool,
    /// Whether this is global.
    pub global: bool,
    /// Whether this is a namespace declaration.
    pub namespace: bool,
    /// Module name.
    pub id: TsModuleName,
    /// Optional body.
    pub body: Option<TsNamespaceBody>,
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
