//! Arena-based ECMAScript AST.
//!
//! The nodes in this crate are referenced by typed [`Id`] handles backed by
//! [`swc_arena::Arena`]. This avoids pervasive lifetimes while keeping node
//! references strongly typed.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

pub use swc_arena::Id;

pub use crate::{
    decl::{Decl, FnDecl, VarDecl, VarDeclKind, VarDeclarator},
    expr::{
        AssignExpr, AssignOp, BinaryExpr, BinaryOp, CallExpr, Expr, ExprOrSpread, MemberExpr,
        MemberProp, UnaryExpr, UnaryOp,
    },
    ident::{BindingIdent, Ident},
    lit::{BoolLit, Lit, NullLit, NumberLit, StrLit},
    pat::{ArrayPat, AssignPat, Pat, RestPat},
    program::{Program, ProgramKind},
    stmt::{BlockStmt, EmptyStmt, ExprStmt, IfStmt, ReturnStmt, Stmt, WhileStmt},
    store::AstStore,
};

mod decl;
mod expr;
mod ident;
mod lit;
mod pat;
mod program;
mod stmt;
mod store;

/// Id for [`Program`].
pub type ProgramId = Id<Program>;
/// Id for [`Stmt`].
pub type StmtId = Id<Stmt>;
/// Id for [`Decl`].
pub type DeclId = Id<Decl>;
/// Id for [`Pat`].
pub type PatId = Id<Pat>;
/// Id for [`Expr`].
pub type ExprId = Id<Expr>;
