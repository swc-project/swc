use swc_common::Span;

use crate::{BindingIdent, ExprId, PatId, StmtId};

/// Declaration node.
#[derive(Debug, Clone, PartialEq)]
pub enum Decl {
    /// Variable declaration.
    Var(VarDecl),
    /// Function declaration.
    Fn(FnDecl),
}

/// Variable declaration.
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
