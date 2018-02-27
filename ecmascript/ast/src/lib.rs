#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![feature(never_type)]
#![feature(proc_macro)]
#![deny(unreachable_patterns)]

extern crate swc_atoms;
extern crate swc_common;
#[macro_use]
extern crate swc_macros;

pub use self::class::{Class, ClassMethod, ClassMethodKind};
pub use self::decl::{ClassDecl, Decl, FnDecl, VarDecl, VarDeclKind, VarDeclarator};
pub use self::expr::{ArrayLit, ArrowExpr, AssignExpr, AwaitExpr, BinExpr, BlockStmtOrExpr,
                     CallExpr, ClassExpr, CondExpr, Expr, ExprKind, ExprOrSpread, ExprOrSuper,
                     FnExpr, MemberExpr, MetaPropExpr, NewExpr, ObjectLit, PatOrExpr, SeqExpr,
                     TplElement, TplLit, UnaryExpr, UpdateExpr, YieldExpr};
pub use self::function::Function;
pub use self::lit::{Lit, Number, Regex, RegexFlags};
pub use self::module::{Module, ModuleItem};
pub use self::module_decl::{ExportDefaultDecl, ExportSpecifier, ImportSpecifier,
                            ImportSpecifierKind, ModuleDecl, ModuleDeclKind};
pub use self::operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp};
pub use self::pat::{ObjectPatProp, Pat, PatKind};
pub use self::prop::{Prop, PropKind, PropName};
pub use self::stmt::{BlockStmt, BreakStmt, CatchClause, ContinueStmt, DoWhileStmt, ForInStmt,
                     ForOfStmt, ForStmt, IfStmt, LabeledStmt, ReturnStmt, Stmt, StmtKind,
                     SwitchCase, SwitchStmt, ThrowStmt, TryStmt, VarDeclOrExpr, VarDeclOrPat,
                     WhileStmt, WithStmt};
use std::fmt::{self, Debug, Display, Formatter};
use std::io::{self, Write};
use swc_atoms::JsWord;
use swc_common::{Span, Spanned, ToCode};
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
#[derive(AstNode, Fold, Clone, PartialEq, Eq)]
pub struct Ident {
    pub span: Span,
    #[fold(ignore)]
    pub sym: JsWord,
}

impl ToCode for Ident {
    fn to_code<W: io::Write>(&self, mut w: W) -> io::Result<()> {
        w.write(&self.sym[..].as_bytes())?;
        Ok(())
    }
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

impl Spanned<JsWord> for Ident {
    fn from_unspanned(sym: JsWord, span: Span) -> Self {
        Ident { span, sym }
    }
}
