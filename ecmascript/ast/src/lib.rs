#![feature(specialization)]
#![feature(never_type)]
#![feature(proc_macro)]
#![deny(unreachable_patterns)]
#![deny(missing_copy_implementations)]
#![deny(missing_debug_implementations)]
#![deny(trivial_casts)]
#![deny(trivial_numeric_casts)]
#![deny(unreachable_pub)]
#![deny(variant_size_differences)]

extern crate swc_atoms;
extern crate swc_common;
#[macro_use]
extern crate swc_macros;

pub use self::class::{Class, ClassMethod, ClassMethodKind};
pub use self::decl::{ClassDecl, Decl, FnDecl, VarDecl, VarDeclKind, VarDeclarator};
pub use self::expr::{ArrayLit, ArrowExpr, AssignExpr, AwaitExpr, BinExpr, BlockStmtOrExpr,
                     CallExpr, ClassExpr, CondExpr, Expr, ExprOrSpread, ExprOrSuper, FnExpr,
                     MemberExpr, MetaPropExpr, NewExpr, ObjectLit, ParenExpr, PatOrExpr, SeqExpr,
                     ThisExpr, TplElement, TplLit, UnaryExpr, UpdateExpr, YieldExpr};
pub use self::function::Function;
pub use self::lit::{Bool, Lit, Null, Number, Regex, RegexFlags, Str};
pub use self::module::{Module, ModuleItem};
pub use self::module_decl::{ExportAll, ExportDefaultDecl, ExportSpecifier, ImportDecl,
                            ImportDefault, ImportSpecific, ImportSpecifier, ImportStarAs,
                            ModuleDecl, NamedExport};
pub use self::operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp};
pub use self::pat::{ArrayPat, AssignPat, AssignPatProp, KeyValuePatProp, ObjectPat, ObjectPatProp,
                    Pat, RestPat};
pub use self::prop::{AssignProp, GetterProp, KeyValueProp, MethodProp, Prop, PropName, SetterProp};
pub use self::stmt::{BlockStmt, BreakStmt, CatchClause, ContinueStmt, DebuggerStmt, DoWhileStmt,
                     EmptyStmt, ForInStmt, ForOfStmt, ForStmt, IfStmt, LabeledStmt, ReturnStmt,
                     Stmt, SwitchCase, SwitchStmt, ThrowStmt, TryStmt, VarDeclOrExpr,
                     VarDeclOrPat, WhileStmt, WithStmt};
use std::fmt::{self, Debug, Display, Formatter};
use swc_atoms::JsWord;
use swc_common::Span;
use swc_macros::Fold;

mod macros;
mod class;
mod decl;
mod expr;
mod function;
mod lit;
mod module_decl;
mod module;
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
