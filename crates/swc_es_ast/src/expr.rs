use swc_common::Span;

use crate::{ExprId, Ident, Lit, PatId};

/// Expression node.
#[derive(Debug, Clone, PartialEq)]
pub enum Expr {
    /// Identifier expression.
    Ident(Ident),
    /// Literal expression.
    Lit(Lit),
    /// Unary expression.
    Unary(UnaryExpr),
    /// Binary expression.
    Binary(BinaryExpr),
    /// Assignment expression.
    Assign(AssignExpr),
    /// Function call expression.
    Call(CallExpr),
    /// Member access expression.
    Member(MemberExpr),
}

/// Unary expression.
#[derive(Debug, Clone, PartialEq)]
pub struct UnaryExpr {
    /// Original source span.
    pub span: Span,
    /// Operator kind.
    pub op: UnaryOp,
    /// Operand expression.
    pub arg: ExprId,
}

/// Binary expression.
#[derive(Debug, Clone, PartialEq)]
pub struct BinaryExpr {
    /// Original source span.
    pub span: Span,
    /// Operator kind.
    pub op: BinaryOp,
    /// Left-hand side expression.
    pub left: ExprId,
    /// Right-hand side expression.
    pub right: ExprId,
}

/// Assignment expression.
#[derive(Debug, Clone, PartialEq)]
pub struct AssignExpr {
    /// Original source span.
    pub span: Span,
    /// Left-hand side pattern.
    pub left: PatId,
    /// Assignment operator kind.
    pub op: AssignOp,
    /// Right-hand side expression.
    pub right: ExprId,
}

/// Function call expression.
#[derive(Debug, Clone, PartialEq)]
pub struct CallExpr {
    /// Original source span.
    pub span: Span,
    /// Call target expression.
    pub callee: ExprId,
    /// Positional arguments.
    pub args: Vec<ExprOrSpread>,
}

/// Call argument.
#[derive(Debug, Clone, PartialEq)]
pub struct ExprOrSpread {
    /// Whether this argument is spread.
    pub spread: bool,
    /// Argument expression.
    pub expr: ExprId,
}

/// Member access expression.
#[derive(Debug, Clone, PartialEq)]
pub struct MemberExpr {
    /// Original source span.
    pub span: Span,
    /// Object expression.
    pub obj: ExprId,
    /// Member property.
    pub prop: MemberProp,
}

/// Member property.
#[derive(Debug, Clone, PartialEq)]
pub enum MemberProp {
    /// Dot access by identifier.
    Ident(Ident),
    /// Computed property expression.
    Computed(ExprId),
}

/// Unary operator.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum UnaryOp {
    /// Unary `+`.
    Plus,
    /// Unary `-`.
    Minus,
    /// Logical not `!`.
    Bang,
    /// `typeof`.
    TypeOf,
    /// `void`.
    Void,
}

/// Binary operator.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum BinaryOp {
    /// `+`
    Add,
    /// `-`
    Sub,
    /// `*`
    Mul,
    /// `/`
    Div,
    /// `%`
    Mod,
    /// `==`
    EqEq,
    /// `===`
    EqEqEq,
    /// `!=`
    NotEq,
    /// `!==`
    NotEqEq,
    /// `&&`
    LogicalAnd,
    /// `||`
    LogicalOr,
}

/// Assignment operator.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum AssignOp {
    /// `=`
    Assign,
    /// `+=`
    AddAssign,
    /// `-=`
    SubAssign,
    /// `*=`
    MulAssign,
    /// `/=`
    DivAssign,
    /// `%=`
    ModAssign,
}
