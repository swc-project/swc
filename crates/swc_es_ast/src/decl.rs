use swc_common::Span;

use crate::{
    BindingIdent, ClassId, ExprId, Ident, NumberLit, PatId, StmtId, StrLit, TsModuleDecl, TsTypeId,
    TsTypeMember,
};

/// Declaration node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum Decl {
    /// Variable declaration.
    Var(VarDecl),
    /// Function declaration.
    Fn(FnDecl),
    /// Class declaration.
    Class(ClassDecl),
    /// TypeScript type alias declaration.
    TsTypeAlias(TsTypeAliasDecl),
    /// TypeScript interface declaration.
    TsInterface(TsInterfaceDecl),
    /// TypeScript enum declaration.
    TsEnum(TsEnumDecl),
    /// TypeScript module / namespace declaration.
    TsModule(TsModuleDecl),
}

/// Variable declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct VarDecl {
    /// Original source span.
    pub span: Span,
    /// Declaration kind.
    pub kind: VarDeclKind,
    /// `declare` marker.
    pub declare: bool,
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
    /// `declare` marker.
    pub declare: bool,
    /// Parameter patterns.
    pub params: Vec<PatId>,
    /// Function body statements.
    pub body: Vec<StmtId>,
}

/// Class declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ClassDecl {
    /// Original source span.
    pub span: Span,
    /// Class name.
    pub ident: BindingIdent,
    /// `declare` marker.
    pub declare: bool,
    /// Referenced class node.
    pub class: ClassId,
}

/// TypeScript type alias declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsTypeAliasDecl {
    /// Original source span.
    pub span: Span,
    /// Alias identifier.
    pub ident: Ident,
    /// `declare` marker.
    pub declare: bool,
    /// Generic type parameters.
    pub type_params: Vec<Ident>,
    /// Type definition.
    pub ty: TsTypeId,
}

/// TypeScript interface declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsInterfaceDecl {
    /// Original source span.
    pub span: Span,
    /// Interface identifier.
    pub ident: Ident,
    /// `declare` marker.
    pub declare: bool,
    /// Generic type parameters.
    pub type_params: Vec<Ident>,
    /// Extended interfaces.
    pub extends: Vec<Ident>,
    /// Parsed body members.
    pub body: Vec<TsTypeMember>,
}

/// Enum member name.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum TsEnumMemberName {
    /// Identifier member.
    Ident(Ident),
    /// String-literal member.
    Str(StrLit),
    /// Numeric member.
    Num(NumberLit),
}

/// TypeScript enum member.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsEnumMember {
    /// Original source span.
    pub span: Span,
    /// Member name.
    pub name: TsEnumMemberName,
    /// Optional initializer.
    pub init: Option<ExprId>,
}

/// TypeScript enum declaration.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TsEnumDecl {
    /// Original source span.
    pub span: Span,
    /// Enum identifier.
    pub ident: Ident,
    /// `declare` marker.
    pub declare: bool,
    /// `const enum` marker.
    pub is_const: bool,
    /// Enum members.
    pub members: Vec<TsEnumMember>,
}
