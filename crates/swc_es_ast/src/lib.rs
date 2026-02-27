//! Arena-based ECMAScript AST.
//!
//! The nodes in this crate are referenced by typed [`Id`] handles backed by
//! [`swc_arena::Arena`]. This avoids pervasive lifetimes while keeping node
//! references strongly typed.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

#[cfg(feature = "encoding-impl")]
pub extern crate cbor4ii;

pub use swc_arena::Id;

pub use crate::{
    class::{Class, ClassMember, ClassMethod, ClassProp, MethodKind},
    decl::{Decl, FnDecl, TsTypeAliasDecl, VarDecl, VarDeclKind, VarDeclarator},
    expr::{
        ArrayExpr, AssignExpr, AssignOp, BinaryExpr, BinaryOp, CallExpr, Expr, ExprOrSpread,
        MemberExpr, MemberProp, ObjectExpr, UnaryExpr, UnaryOp,
    },
    function::{Function, Param},
    ident::{BindingIdent, Ident},
    jsx::{JSXAttr, JSXElement, JSXElementChild, JSXElementName, JSXOpeningElement},
    lit::{BoolLit, Lit, NullLit, NumberLit, StrLit},
    module_decl::{
        ExportDecl, ExportDefaultExprDecl, ExportNamedDecl, ExportSpecifier, ImportDecl, ModuleDecl,
    },
    operator::UpdateOp,
    pat::{ArrayPat, AssignPat, Pat, RestPat},
    program::{Program, ProgramKind},
    prop::{KeyValueProp, PropName},
    stmt::{
        BlockStmt, EmptyStmt, ExprStmt, ForBinding, ForClassicHead, ForHead, ForInHead, ForInit,
        ForOfHead, ForStmt, IfStmt, ReturnStmt, Stmt, WhileStmt,
    },
    store::AstStore,
    typescript::{
        TsArrayType, TsAsExpr, TsFnParam, TsFnType, TsIntersectionType, TsKeywordType, TsLitType,
        TsParenthesizedType, TsTupleType, TsType, TsTypeAnn, TsTypeLit, TsTypeRef, TsUnionType,
    },
};

mod class;
mod decl;
mod expr;
mod function;
mod ident;
mod jsx;
mod lit;
mod module_decl;
mod operator;
mod pat;
mod program;
mod prop;
mod stmt;
mod store;
mod typescript;

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
/// Id for [`ModuleDecl`].
pub type ModuleDeclId = Id<ModuleDecl>;
/// Id for [`Class`].
pub type ClassId = Id<Class>;
/// Id for [`ClassMember`].
pub type ClassMemberId = Id<ClassMember>;
/// Id for [`Function`].
pub type FunctionId = Id<Function>;
/// Id for [`JSXElement`].
pub type JSXElementId = Id<JSXElement>;
/// Id for [`TsType`].
pub type TsTypeId = Id<TsType>;
