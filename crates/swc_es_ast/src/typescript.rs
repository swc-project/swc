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
