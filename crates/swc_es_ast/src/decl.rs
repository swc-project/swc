use swc_common::Span;

use crate::{BindingIdent, ExprId, Ident, PatId, StmtId, TsTypeId};

/// Declaration node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum Decl {
    /// Variable declaration.
    Var(VarDecl),
    /// Function declaration.
    Fn(FnDecl),
    /// TypeScript type alias declaration.
    TsTypeAlias(TsTypeAliasDecl),
}

/// Variable declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct VarDecl {
    /// Original source span.
    pub span: Span,
    /// Declaration kind.
    pub kind: VarDeclKind,
    /// Declared bindings.
    pub declarators: Vec<VarDeclarator>,
}

/// Variable declaration kind.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum VarDeclKind {
    /// `var`
    Var,
    /// `let`
    Let,
    /// `const`
    Const,
    /// `using`
    Using,
    /// `await using`
    AwaitUsing,
}

/// One variable declarator.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct VarDeclarator {
    /// Original source span.
    pub span: Span,
    /// Binding pattern.
    pub name: PatId,
    /// Optional initializer.
    pub init: Option<ExprId>,
}

/// Function declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct FnDecl {
    /// Original source span.
    pub span: Span,
    /// Function name.
    pub ident: BindingIdent,
    /// Parameter patterns.
    pub params: Vec<PatId>,
    /// Function body statements.
    pub body: Vec<StmtId>,
}

/// TypeScript type alias declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsTypeAliasDecl {
    /// Original source span.
    pub span: Span,
    /// Alias identifier.
    pub ident: Ident,
    /// Generic type parameters.
    pub type_params: Vec<Ident>,
    /// Type definition.
    pub ty: TsTypeId,
}
