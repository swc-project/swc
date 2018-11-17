#![feature(specialization)]
#![feature(never_type)]
#![deny(unreachable_patterns)]
#![deny(missing_copy_implementations)]
#![deny(missing_debug_implementations)]
#![deny(trivial_casts)]
#![deny(trivial_numeric_casts)]
#![deny(unreachable_pub)]
#![deny(variant_size_differences)]

#[macro_use]
extern crate enum_kind;
#[macro_use]
extern crate string_enum;
extern crate swc_atoms;
extern crate swc_common;

pub use self::{
    class::{Class, ClassMethod, ClassMethodKind},
    decl::{ClassDecl, Decl, FnDecl, VarDecl, VarDeclKind, VarDeclarator},
    expr::{
        ArrayLit, ArrowExpr, AssignExpr, AwaitExpr, BinExpr, BlockStmtOrExpr, CallExpr, ClassExpr,
        CondExpr, Expr, ExprOrSpread, ExprOrSuper, FnExpr, MemberExpr, MetaPropExpr, NewExpr,
        ObjectLit, ParenExpr, PatOrExpr, PropOrSpread, SeqExpr, SpreadElement, ThisExpr,
        TplElement, TplLit, UnaryExpr, UpdateExpr, YieldExpr,
    },
    function::Function,
    keywords::IdentExt,
    lit::{Bool, Lit, Null, Number, Regex, RegexFlags, Str},
    module::{Module, ModuleItem},
    module_decl::{
        ExportAll, ExportDefaultDecl, ExportSpecifier, ImportDecl, ImportDefault, ImportSpecific,
        ImportSpecifier, ImportStarAs, ModuleDecl, NamedExport,
    },
    operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp},
    pat::{
        ArrayPat, AssignPat, AssignPatProp, KeyValuePatProp, ObjectPat, ObjectPatProp, Pat, RestPat,
    },
    prop::{AssignProp, GetterProp, KeyValueProp, MethodProp, Prop, PropName, SetterProp},
    stmt::{
        BlockStmt, BreakStmt, CatchClause, ContinueStmt, DebuggerStmt, DoWhileStmt, EmptyStmt,
        ForInStmt, ForOfStmt, ForStmt, IfStmt, LabeledStmt, ReturnStmt, Stmt, SwitchCase,
        SwitchStmt, ThrowStmt, TryStmt, VarDeclOrExpr, VarDeclOrPat, WhileStmt, WithStmt,
    },
};
use std::fmt::{self, Debug, Display, Formatter};
use swc_atoms::JsWord;
use swc_common::{Fold, Span, Spanned};

mod class;
mod decl;
mod expr;
mod function;
mod keywords;
mod lit;
mod macros;
mod module;
mod module_decl;
mod operators;
mod pat;
mod prop;
mod stmt;

/// Ident with span.
#[derive(Spanned, Fold, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Ident {
    pub span: Span,
    #[fold(ignore)]
    pub sym: JsWord,
}

impl Debug for Ident {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        f.debug_tuple("Ident")
            .field(&DebugUsingDisplay(&self.sym))
            .field(&self.span)
            .finish()
    }
}

impl AsRef<str> for Ident {
    fn as_ref(&self) -> &str {
        &self.sym
    }
}

struct DebugUsingDisplay<T: Display>(T);
impl<T: Display> Debug for DebugUsingDisplay<T> {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Display::fmt(&self.0, f)
    }
}

impl Ident {
    pub fn new(sym: JsWord, span: Span) -> Self {
        Ident { span, sym }
    }
}
