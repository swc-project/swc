#![deny(clippy::all)]
#![allow(clippy::vec_box)]

#[doc(hidden)]
pub extern crate swc_ecma_ast;

use std::{
    borrow::Cow,
    f64::{INFINITY, NAN},
    hash::Hash,
    num::FpCategory,
    ops::Add,
};

use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashSet, Mark, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_obj_and_computed, visit_obj_and_computed,
    Visit, VisitMut, VisitMutWith, VisitWith,
};
use tracing::trace;

#[allow(deprecated)]
pub use self::{
    factory::{ExprFactory, IntoIndirectCall},
    value::{
        Type::{
            self, Bool as BoolType, Null as NullType, Num as NumberType, Obj as ObjectType,
            Str as StringType, Symbol as SymbolType, Undefined as UndefinedType,
        },
        Value::{self, Known, Unknown},
    },
    Purity::{MayBeImpure, Pure},
};
use crate::ident::IdentLike;

#[macro_use]
mod macros;
pub mod constructor;
mod factory;
pub mod function;
pub mod ident;
mod value;
pub mod var;

// TODO: remove
pub struct ThisVisitor {
    found: bool,
}

impl Visit for ThisVisitor {
    noop_visit_type!();

    /// Don't recurse into constructor
    fn visit_constructor(&mut self, _: &Constructor) {}

    /// Don't recurse into fn
    fn visit_fn_decl(&mut self, _: &FnDecl) {}

    /// Don't recurse into fn
    fn visit_fn_expr(&mut self, _: &FnExpr) {}

    /// Don't recurse into fn
    fn visit_function(&mut self, _: &Function) {}

    /// Don't recurse into fn
    fn visit_getter_prop(&mut self, n: &GetterProp) {
        n.key.visit_with(self);
    }

    /// Don't recurse into fn
    fn visit_method_prop(&mut self, n: &MethodProp) {
        n.key.visit_with(self);
        n.function.visit_with(self);
    }

    /// Don't recurse into fn
    fn visit_setter_prop(&mut self, n: &SetterProp) {
        n.key.visit_with(self);
        n.param.visit_with(self);
    }

    fn visit_this_expr(&mut self, _: &ThisExpr) {
        self.found = true;
    }
}

/// This does not recurse into a function if `this` is changed by it.
///
/// e.g.
///
///   - The body of an arrow expression is visited.
///   - The body of a function expression is **not** visited.
pub fn contains_this_expr<N>(body: &N) -> bool
where
    N: VisitWith<ThisVisitor>,
{
    let mut visitor = ThisVisitor { found: false };
    body.visit_with(&mut visitor);
    visitor.found
}

pub fn contains_ident_ref<'a, N>(body: &N, ident: &'a Id) -> bool
where
    N: VisitWith<IdentRefFinder<'a>>,
{
    let mut visitor = IdentRefFinder {
        found: false,
        ident,
    };
    body.visit_with(&mut visitor);
    visitor.found
}

pub struct IdentRefFinder<'a> {
    ident: &'a Id,
    found: bool,
}

impl Visit for IdentRefFinder<'_> {
    noop_visit_type!();

    fn visit_expr(&mut self, e: &Expr) {
        e.visit_children_with(self);

        match *e {
            Expr::Ident(ref i) if i.sym == self.ident.0 && i.span.ctxt == self.ident.1 => {
                self.found = true;
            }
            _ => {}
        }
    }
}

// TODO: remove
pub fn contains_arguments<N>(body: &N) -> bool
where
    N: VisitWith<ArgumentsFinder>,
{
    let mut visitor = ArgumentsFinder { found: false };
    body.visit_with(&mut visitor);
    visitor.found
}

pub struct ArgumentsFinder {
    found: bool,
}

impl Visit for ArgumentsFinder {
    noop_visit_type!();

    /// Don't recurse into constructor
    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_expr(&mut self, e: &Expr) {
        e.visit_children_with(self);

        if let Expr::Ident(Ident {
            sym: js_word!("arguments"),
            ..
        }) = *e
        {
            self.found = true;
        }
    }

    /// Don't recurse into fn
    fn visit_function(&mut self, _: &Function) {}

    fn visit_prop(&mut self, n: &Prop) {
        n.visit_children_with(self);

        if let Prop::Shorthand(Ident {
            sym: js_word!("arguments"),
            ..
        }) = n
        {
            self.found = true;
        }
    }
}

pub trait StmtOrModuleItem: Send + Sync {
    fn into_stmt(self) -> Result<Stmt, ModuleDecl>;

    fn as_stmt(&self) -> Result<&Stmt, &ModuleDecl>;
}

impl StmtOrModuleItem for Stmt {
    #[inline]
    fn into_stmt(self) -> Result<Stmt, ModuleDecl> {
        Ok(self)
    }

    #[inline]
    fn as_stmt(&self) -> Result<&Stmt, &ModuleDecl> {
        Ok(self)
    }
}

impl StmtOrModuleItem for ModuleItem {
    #[inline]
    fn into_stmt(self) -> Result<Stmt, ModuleDecl> {
        match self {
            ModuleItem::ModuleDecl(v) => Err(v),
            ModuleItem::Stmt(v) => Ok(v),
        }
    }

    #[inline]
    fn as_stmt(&self) -> Result<&Stmt, &ModuleDecl> {
        match self {
            ModuleItem::ModuleDecl(v) => Err(v),
            ModuleItem::Stmt(v) => Ok(v),
        }
    }
}

pub trait ModuleItemLike: StmtLike {
    fn try_into_module_decl(self) -> Result<ModuleDecl, Self> {
        Err(self)
    }
    fn try_from_module_decl(decl: ModuleDecl) -> Result<Self, ModuleDecl> {
        Err(decl)
    }
}

pub trait StmtLike: Sized + 'static + Send + Sync {
    fn try_into_stmt(self) -> Result<Stmt, Self>;
    fn as_stmt(&self) -> Option<&Stmt>;
    fn as_stmt_mut(&mut self) -> Option<&mut Stmt>;
    fn from_stmt(stmt: Stmt) -> Self;
}

impl ModuleItemLike for Stmt {}

impl StmtLike for Stmt {
    #[inline]
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        Ok(self)
    }

    #[inline]
    fn as_stmt(&self) -> Option<&Stmt> {
        Some(self)
    }

    #[inline]
    fn as_stmt_mut(&mut self) -> Option<&mut Stmt> {
        Some(self)
    }

    #[inline]
    fn from_stmt(stmt: Stmt) -> Self {
        stmt
    }
}

impl ModuleItemLike for ModuleItem {
    #[inline]
    fn try_into_module_decl(self) -> Result<ModuleDecl, Self> {
        match self {
            ModuleItem::ModuleDecl(decl) => Ok(decl),
            _ => Err(self),
        }
    }

    #[inline]
    fn try_from_module_decl(decl: ModuleDecl) -> Result<Self, ModuleDecl> {
        Ok(ModuleItem::ModuleDecl(decl))
    }
}
impl StmtLike for ModuleItem {
    #[inline]
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        match self {
            ModuleItem::Stmt(stmt) => Ok(stmt),
            _ => Err(self),
        }
    }

    #[inline]
    fn as_stmt(&self) -> Option<&Stmt> {
        match &*self {
            ModuleItem::Stmt(stmt) => Some(stmt),
            _ => None,
        }
    }

    #[inline]
    fn as_stmt_mut(&mut self) -> Option<&mut Stmt> {
        match &mut *self {
            ModuleItem::Stmt(stmt) => Some(stmt),
            _ => None,
        }
    }

    #[inline]
    fn from_stmt(stmt: Stmt) -> Self {
        ModuleItem::Stmt(stmt)
    }
}

pub type BoolValue = Value<bool>;

pub trait IsEmpty {
    fn is_empty(&self) -> bool;
}

impl IsEmpty for BlockStmt {
    fn is_empty(&self) -> bool {
        self.stmts.is_empty()
    }
}
impl IsEmpty for CatchClause {
    fn is_empty(&self) -> bool {
        self.body.stmts.is_empty()
    }
}
impl IsEmpty for Stmt {
    fn is_empty(&self) -> bool {
        match *self {
            Stmt::Empty(_) => true,
            Stmt::Block(ref b) => b.is_empty(),
            _ => false,
        }
    }
}

impl<T: IsEmpty> IsEmpty for Option<T> {
    #[inline]
    fn is_empty(&self) -> bool {
        match *self {
            Some(ref node) => node.is_empty(),
            None => true,
        }
    }
}

impl<T: IsEmpty> IsEmpty for Box<T> {
    #[inline]
    fn is_empty(&self) -> bool {
        <T as IsEmpty>::is_empty(&*self)
    }
}

impl<T> IsEmpty for Vec<T> {
    #[inline]
    fn is_empty(&self) -> bool {
        self.is_empty()
    }
}

/// Extracts hoisted variables
pub fn extract_var_ids<T: VisitWith<Hoister>>(node: &T) -> Vec<Ident> {
    let mut v = Hoister { vars: vec![] };
    node.visit_with(&mut v);
    v.vars
}

pub trait StmtExt {
    /// Extracts hoisted variables
    fn extract_var_ids(&self) -> Vec<Ident>;

    fn extract_var_ids_as_var(&self) -> Option<VarDecl> {
        let ids = self.extract_var_ids();
        if ids.is_empty() {
            return None;
        }

        Some(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: ids
                .into_iter()
                .map(|i| VarDeclarator {
                    span: i.span,
                    name: Pat::Ident(i.into()),
                    init: None,
                    definite: false,
                })
                .collect(),
        })
    }

    /// stmts contain top level return/break/continue/throw
    fn terminates(&self) -> bool;
}

impl StmtExt for Stmt {
    fn extract_var_ids(&self) -> Vec<Ident> {
        extract_var_ids(self)
    }

    fn terminates(&self) -> bool {
        match self {
            Stmt::Break(_) | Stmt::Continue(_) | Stmt::Throw(_) | Stmt::Return(_) => true,
            Stmt::Block(block) => block.stmts.terminates(),
            Stmt::If(IfStmt {
                cons,
                alt: Some(alt),
                ..
            }) => cons.terminates() && alt.terminates(),
            _ => false,
        }
    }
}

impl StmtExt for Box<Stmt> {
    fn extract_var_ids(&self) -> Vec<Ident> {
        extract_var_ids(&**self)
    }

    fn terminates(&self) -> bool {
        (&**self).terminates()
    }
}

impl StmtExt for Vec<Stmt> {
    fn extract_var_ids(&self) -> Vec<Ident> {
        extract_var_ids(self)
    }

    fn terminates(&self) -> bool {
        self.iter().rev().any(|s| s.terminates())
    }
}

pub struct Hoister {
    vars: Vec<Ident>,
}

impl Visit for Hoister {
    noop_visit_type!();

    fn visit_assign_expr(&mut self, node: &AssignExpr) {
        node.right.visit_children_with(self);
    }

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp) {
        node.value.visit_with(self);

        self.vars.push(node.key.clone());
    }

    fn visit_fn_decl(&mut self, f: &FnDecl) {
        self.vars.push(f.ident.clone());

        f.visit_children_with(self)
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(ref i) = *p {
            self.vars.push(i.id.clone())
        }
    }

    fn visit_var_decl(&mut self, v: &VarDecl) {
        if v.kind != VarDeclKind::Var {
            return;
        }

        v.visit_children_with(self)
    }
}

#[derive(Debug, Clone)]

pub struct ExprCtx {
    /// This [SyntaxContext] should be applied only to unresolved references.
    ///
    /// In other words, this should be applied to identifier references to
    /// global objects like `Object` or `Math`, and when those are not shadowed
    /// by a local declaration.
    pub unresolved_ctxt: SyntaxContext,
}

/// Extension methods for [Expr].
pub trait ExprExt {
    fn as_expr(&self) -> &Expr;

    /// Returns true if this is an immutable value.
    fn is_immutable_value(&self) -> bool {
        // TODO(johnlenz): rename this function.  It is currently being used
        // in two disjoint cases:
        // 1) We only care about the result of the expression
        //    (in which case NOT here should return true)
        // 2) We care that expression is a side-effect free and can't
        //    be side-effected by other expressions.
        // This should only be used to say the value is immutable and
        // hasSideEffects and canBeSideEffected should be used for the other case.
        match *self.as_expr() {
            Expr::Lit(Lit::Bool(..))
            | Expr::Lit(Lit::Str(..))
            | Expr::Lit(Lit::Num(..))
            | Expr::Lit(Lit::Null(..)) => true,

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            })
            | Expr::Unary(UnaryExpr {
                op: op!("~"),
                ref arg,
                ..
            })
            | Expr::Unary(UnaryExpr {
                op: op!("void"),
                ref arg,
                ..
            }) => arg.is_immutable_value(),

            Expr::Ident(ref i) => {
                i.sym == js_word!("undefined")
                    || i.sym == js_word!("Infinity")
                    || i.sym == js_word!("NaN")
            }

            Expr::Tpl(Tpl { ref exprs, .. }) => exprs.iter().all(|e| e.is_immutable_value()),

            _ => false,
        }
    }

    fn is_number(&self) -> bool {
        matches!(*self.as_expr(), Expr::Lit(Lit::Num(..)))
    }

    fn is_str(&self) -> bool {
        matches!(*self.as_expr(), Expr::Lit(Lit::Str(..)))
    }

    fn is_array_lit(&self) -> bool {
        matches!(*self.as_expr(), Expr::Array(..))
    }

    /// Checks if `self` is `NaN`.
    fn is_nan(&self) -> bool {
        // NaN is special
        matches!(
            self.as_expr(),
            Expr::Ident(Ident {
                sym: js_word!("NaN"),
                ..
            })
        )
    }

    fn is_undefined(&self, ctx: &ExprCtx) -> bool {
        self.is_global_ref_to(ctx, "undefined")
    }

    fn is_void(&self) -> bool {
        matches!(
            *self.as_expr(),
            Expr::Unary(UnaryExpr {
                op: op!("void"),
                ..
            })
        )
    }

    /// Returns `true` if `id` references a global object.
    fn is_global_ref_to(&self, ctx: &ExprCtx, id: &str) -> bool {
        match self.as_expr() {
            Expr::Ident(i) => i.span.ctxt == ctx.unresolved_ctxt && &*i.sym == id,
            _ => false,
        }
    }

    /// Get bool value of `self` if it does not have any side effects.
    fn as_pure_bool(&self, ctx: &ExprCtx) -> BoolValue {
        match self.cast_to_bool(ctx) {
            (Pure, Known(b)) => Known(b),
            _ => Unknown,
        }
    }

    ///
    /// This method emulates the `Boolean()` JavaScript cast function.
    ///Note: unlike getPureBooleanValue this function does not return `None`
    ///for expressions with side-effects.
    fn cast_to_bool(&self, ctx: &ExprCtx) -> (Purity, BoolValue) {
        let expr = self.as_expr();
        if expr.is_global_ref_to(ctx, "undefined") {
            return (Pure, Known(false));
        }
        if expr.is_nan() {
            return (Pure, Known(false));
        }

        let val = match expr {
            Expr::Paren(ref e) => return e.expr.cast_to_bool(ctx),

            Expr::Assign(AssignExpr {
                ref right,
                op: op!("="),
                ..
            }) => {
                let (_, v) = right.cast_to_bool(ctx);
                return (MayBeImpure, v);
            }

            Expr::Unary(UnaryExpr {
                op: op!(unary, "-"),
                arg,
                ..
            }) => {
                let v = arg.as_pure_number(ctx);
                match v {
                    Known(n) => Known(!matches!(n.classify(), FpCategory::Nan | FpCategory::Zero)),
                    Unknown => return (MayBeImpure, Unknown),
                }
            }

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => {
                let (p, v) = arg.cast_to_bool(ctx);
                return (p, !v);
            }
            Expr::Seq(SeqExpr { exprs, .. }) => exprs.last().unwrap().cast_to_bool(ctx).1,

            Expr::Bin(BinExpr {
                left,
                op: op!(bin, "-"),
                right,
                ..
            }) => {
                let (lp, ln) = left.cast_to_number(ctx);
                let (rp, rn) = right.cast_to_number(ctx);

                return (
                    lp + rp,
                    match (ln, rn) {
                        (Known(ln), Known(rn)) => {
                            if ln == rn {
                                Known(false)
                            } else {
                                Known(true)
                            }
                        }
                        _ => Unknown,
                    },
                );
            }

            Expr::Bin(BinExpr {
                left,
                op: op!("/"),
                right,
                ..
            }) => {
                let lv = left.as_pure_number(ctx);
                let rv = right.as_pure_number(ctx);

                match (lv, rv) {
                    (Known(lv), Known(rv)) => {
                        // NaN is false
                        if lv == 0.0 && rv == 0.0 {
                            return (Pure, Known(false));
                        }
                        // Infinity is true.
                        if rv == 0.0 {
                            return (Pure, Known(true));
                        }
                        let v = lv / rv;

                        return (Pure, Known(v != 0.0));
                    }
                    _ => Unknown,
                }
            }

            Expr::Bin(BinExpr {
                ref left,
                op: op @ op!("&"),
                ref right,
                ..
            })
            | Expr::Bin(BinExpr {
                ref left,
                op: op @ op!("|"),
                ref right,
                ..
            }) => {
                // TODO: Ignore purity if value cannot be reached.

                let (lp, lv) = left.cast_to_bool(ctx);
                let (rp, rv) = right.cast_to_bool(ctx);

                let v = if *op == op!("&") {
                    lv.and(rv)
                } else {
                    lv.or(rv)
                };

                if lp + rp == Pure {
                    return (Pure, v);
                }

                v
            }

            Expr::Bin(BinExpr {
                ref left,
                op: op!("||"),
                ref right,
                ..
            }) => {
                let (lp, lv) = left.cast_to_bool(ctx);
                if let Known(true) = lv {
                    return (lp, lv);
                }

                let (rp, rv) = right.cast_to_bool(ctx);
                if let Known(true) = rv {
                    return (lp + rp, rv);
                }

                Unknown
            }

            Expr::Bin(BinExpr {
                ref left,
                op: op!("&&"),
                ref right,
                ..
            }) => {
                let (lp, lv) = left.cast_to_bool(ctx);
                if let Known(false) = lv {
                    return (lp, lv);
                }

                let (rp, rv) = right.cast_to_bool(ctx);
                if let Known(false) = rv {
                    return (lp + rp, rv);
                }

                Unknown
            }

            Expr::Bin(BinExpr {
                left,
                op: op!(bin, "+"),
                right,
                ..
            }) => {
                match &**left {
                    Expr::Lit(Lit::Str(s)) if !s.value.is_empty() => {
                        return (MayBeImpure, Known(true))
                    }
                    _ => {}
                }

                match &**right {
                    Expr::Lit(Lit::Str(s)) if !s.value.is_empty() => {
                        return (MayBeImpure, Known(true))
                    }
                    _ => {}
                }

                Unknown
            }

            Expr::Fn(..) | Expr::Class(..) | Expr::New(..) | Expr::Array(..) | Expr::Object(..) => {
                Known(true)
            }

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => Known(false),

            Expr::Lit(ref lit) => {
                return (
                    Pure,
                    Known(match *lit {
                        Lit::Num(Number { value: n, .. }) => {
                            !matches!(n.classify(), FpCategory::Nan | FpCategory::Zero)
                        }
                        Lit::BigInt(ref v) => v
                            .value
                            .to_string()
                            .contains(|c: char| matches!(c, '1'..='9')),
                        Lit::Bool(b) => b.value,
                        Lit::Str(Str { ref value, .. }) => !value.is_empty(),
                        Lit::Null(..) => false,
                        Lit::Regex(..) => true,
                        Lit::JSXText(..) => unreachable!("as_bool() for JSXText"),
                    }),
                );
            }

            //TODO?
            _ => Unknown,
        };

        if expr.may_have_side_effects(ctx) {
            (MayBeImpure, val)
        } else {
            (Pure, val)
        }
    }

    fn cast_to_number(&self, ctx: &ExprCtx) -> (Purity, Value<f64>) {
        let expr = self.as_expr();
        let v = match expr {
            Expr::Lit(l) => match l {
                Lit::Bool(Bool { value: true, .. }) => 1.0,
                Lit::Bool(Bool { value: false, .. }) | Lit::Null(..) => 0.0,
                Lit::Num(Number { value: n, .. }) => *n,
                Lit::Str(Str { value, .. }) => return (Pure, num_from_str(value)),
                _ => return (Pure, Unknown),
            },
            Expr::Ident(Ident { sym, .. }) => match *sym {
                js_word!("undefined") | js_word!("NaN") => NAN,
                js_word!("Infinity") => INFINITY,
                _ => return (Pure, Unknown),
            },
            Expr::Unary(UnaryExpr {
                op: op!(unary, "-"),
                arg,
                ..
            }) if matches!(
                &**arg,
                Expr::Ident(Ident {
                    sym: js_word!("Infinity"),
                    ..
                })
            ) =>
            {
                -INFINITY
            }
            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => match arg.cast_to_bool(ctx) {
                (Pure, Known(v)) => {
                    if v {
                        0.0
                    } else {
                        1.0
                    }
                }
                _ => return (MayBeImpure, Unknown),
            },
            Expr::Unary(UnaryExpr {
                op: op!("void"),
                ref arg,
                ..
            }) => {
                if arg.may_have_side_effects(ctx) {
                    return (MayBeImpure, Known(NAN));
                } else {
                    NAN
                }
            }

            Expr::Tpl(..) | Expr::Object(ObjectLit { .. }) | Expr::Array(ArrayLit { .. }) => {
                return (
                    Pure,
                    num_from_str(&*match self.as_pure_string(ctx) {
                        Known(v) => v,
                        Unknown => return (MayBeImpure, Unknown),
                    }),
                );
            }

            Expr::Seq(seq) => {
                if let Some(last) = seq.exprs.last() {
                    let (_, v) = last.cast_to_number(ctx);

                    // TODO: Purity
                    return (MayBeImpure, v);
                }

                return (MayBeImpure, Unknown);
            }

            _ => return (MayBeImpure, Unknown),
        };

        (Purity::Pure, Known(v))
    }

    /// Emulates javascript Number() cast function.
    ///
    /// Note: This method returns [Known] only if it's pure.
    fn as_pure_number(&self, ctx: &ExprCtx) -> Value<f64> {
        let (purity, v) = self.cast_to_number(ctx);
        if !purity.is_pure() {
            return Unknown;
        }

        v
    }

    /// Returns Known only if it's pure.
    fn as_pure_string(&self, ctx: &ExprCtx) -> Value<Cow<'_, str>> {
        let expr = self.as_expr();
        match *expr {
            Expr::Lit(ref l) => match *l {
                Lit::Str(Str { ref value, .. }) => Known(Cow::Borrowed(value)),
                Lit::Num(ref n) => Known(format!("{}", n).into()),
                Lit::Bool(Bool { value: true, .. }) => Known(Cow::Borrowed("true")),
                Lit::Bool(Bool { value: false, .. }) => Known(Cow::Borrowed("false")),
                Lit::Null(..) => Known(Cow::Borrowed("null")),
                _ => Unknown,
            },
            Expr::Tpl(_) => {
                Value::Unknown
                // TODO:
                // Only convert a template literal if all its expressions can be
                // converted. unimplemented!("TplLit.
                // as_string()")
            }
            Expr::Ident(Ident { ref sym, .. }) => match *sym {
                js_word!("undefined") | js_word!("Infinity") | js_word!("NaN") => {
                    Known(Cow::Borrowed(&**sym))
                }
                _ => Unknown,
            },
            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => Known(Cow::Borrowed("undefined")),
            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => Known(Cow::Borrowed(match arg.as_pure_bool(ctx) {
                Known(v) => {
                    if v {
                        "false"
                    } else {
                        "true"
                    }
                }
                Unknown => return Value::Unknown,
            })),
            Expr::Array(ArrayLit { ref elems, .. }) => {
                let mut first = true;
                let mut buf = String::new();
                // null, undefined is "" in array literal.
                for elem in elems {
                    let e = match *elem {
                        Some(ref elem) => {
                            let ExprOrSpread { ref expr, .. } = *elem;
                            match **expr {
                                Expr::Lit(Lit::Null(..))
                                | Expr::Ident(Ident {
                                    sym: js_word!("undefined"),
                                    ..
                                }) => Cow::Borrowed(""),
                                _ => match expr.as_pure_string(ctx) {
                                    Known(v) => v,
                                    Unknown => return Value::Unknown,
                                },
                            }
                        }
                        None => Cow::Borrowed(""),
                    };
                    buf.push_str(&e);

                    if first {
                        first = false;
                    } else {
                        buf.push(',');
                    }
                }
                Known(buf.into())
            }
            Expr::Object(ObjectLit { .. }) => Known(Cow::Borrowed("[object Object]")),
            _ => Unknown,
        }
    }

    /// Apply the supplied predicate against all possible result Nodes of the
    /// expression.
    fn get_type(&self) -> Value<Type> {
        let expr = self.as_expr();

        match *expr {
            Expr::Assign(AssignExpr {
                ref right,
                op: op!("="),
                ..
            }) => right.get_type(),

            Expr::Seq(SeqExpr { ref exprs, .. }) => exprs
                .last()
                .expect("sequence expression should not be empty")
                .get_type(),

            Expr::Bin(BinExpr {
                ref left,
                op: op!("&&"),
                ref right,
                ..
            })
            | Expr::Bin(BinExpr {
                ref left,
                op: op!("||"),
                ref right,
                ..
            })
            | Expr::Cond(CondExpr {
                cons: ref left,
                alt: ref right,
                ..
            }) => and(left.get_type(), right.get_type()),

            Expr::Bin(BinExpr {
                ref left,
                op: op!(bin, "+"),
                ref right,
                ..
            }) => {
                let rt = right.get_type();
                if rt == Known(StringType) {
                    return Known(StringType);
                }

                let lt = left.get_type();
                if lt == Known(StringType) {
                    return Known(StringType);
                }

                // There are some pretty weird cases for object types:
                //   {} + [] === "0"
                //   [] + {} ==== "[object Object]"
                if lt == Known(ObjectType) || rt == Known(ObjectType) {
                    return Unknown;
                }

                if !may_be_str(lt) && !may_be_str(rt) {
                    // ADD used with compilations of null, undefined, boolean and number always
                    // result in numbers.
                    return Known(NumberType);
                }

                // There are some pretty weird cases for object types:
                //   {} + [] === "0"
                //   [] + {} ==== "[object Object]"
                Unknown
            }

            Expr::Assign(AssignExpr {
                op: op!("+="),
                ref right,
                ..
            }) => {
                if right.get_type() == Known(StringType) {
                    return Known(StringType);
                }
                Unknown
            }

            Expr::Ident(Ident { ref sym, .. }) => Known(match *sym {
                js_word!("undefined") => UndefinedType,
                js_word!("NaN") | js_word!("Infinity") => NumberType,
                _ => return Unknown,
            }),

            Expr::Lit(Lit::Num(..))
            | Expr::Assign(AssignExpr { op: op!("&="), .. })
            | Expr::Assign(AssignExpr { op: op!("^="), .. })
            | Expr::Assign(AssignExpr { op: op!("|="), .. })
            | Expr::Assign(AssignExpr { op: op!("<<="), .. })
            | Expr::Assign(AssignExpr { op: op!(">>="), .. })
            | Expr::Assign(AssignExpr {
                op: op!(">>>="), ..
            })
            | Expr::Assign(AssignExpr { op: op!("-="), .. })
            | Expr::Assign(AssignExpr { op: op!("*="), .. })
            | Expr::Assign(AssignExpr { op: op!("**="), .. })
            | Expr::Assign(AssignExpr { op: op!("/="), .. })
            | Expr::Assign(AssignExpr { op: op!("%="), .. })
            | Expr::Unary(UnaryExpr { op: op!("~"), .. })
            | Expr::Bin(BinExpr { op: op!("|"), .. })
            | Expr::Bin(BinExpr { op: op!("^"), .. })
            | Expr::Bin(BinExpr { op: op!("&"), .. })
            | Expr::Bin(BinExpr { op: op!("<<"), .. })
            | Expr::Bin(BinExpr { op: op!(">>"), .. })
            | Expr::Bin(BinExpr { op: op!(">>>"), .. })
            | Expr::Bin(BinExpr {
                op: op!(bin, "-"), ..
            })
            | Expr::Bin(BinExpr { op: op!("*"), .. })
            | Expr::Bin(BinExpr { op: op!("%"), .. })
            | Expr::Bin(BinExpr { op: op!("/"), .. })
            | Expr::Bin(BinExpr { op: op!("**"), .. })
            | Expr::Update(UpdateExpr { op: op!("++"), .. })
            | Expr::Update(UpdateExpr { op: op!("--"), .. })
            | Expr::Unary(UnaryExpr {
                op: op!(unary, "+"),
                ..
            })
            | Expr::Unary(UnaryExpr {
                op: op!(unary, "-"),
                ..
            }) => Known(NumberType),

            // Primitives
            Expr::Lit(Lit::Bool(..))
            | Expr::Bin(BinExpr { op: op!("=="), .. })
            | Expr::Bin(BinExpr { op: op!("!="), .. })
            | Expr::Bin(BinExpr { op: op!("==="), .. })
            | Expr::Bin(BinExpr { op: op!("!=="), .. })
            | Expr::Bin(BinExpr { op: op!("<"), .. })
            | Expr::Bin(BinExpr { op: op!("<="), .. })
            | Expr::Bin(BinExpr { op: op!(">"), .. })
            | Expr::Bin(BinExpr { op: op!(">="), .. })
            | Expr::Bin(BinExpr { op: op!("in"), .. })
            | Expr::Bin(BinExpr {
                op: op!("instanceof"),
                ..
            })
            | Expr::Unary(UnaryExpr { op: op!("!"), .. })
            | Expr::Unary(UnaryExpr {
                op: op!("delete"), ..
            }) => Known(BoolType),

            Expr::Unary(UnaryExpr {
                op: op!("typeof"), ..
            })
            | Expr::Lit(Lit::Str { .. })
            | Expr::Tpl(..) => Known(StringType),

            Expr::Lit(Lit::Null(..)) => Known(NullType),

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => Known(UndefinedType),

            Expr::Fn(..)
            | Expr::New(NewExpr { .. })
            | Expr::Array(ArrayLit { .. })
            | Expr::Object(ObjectLit { .. })
            | Expr::Lit(Lit::Regex(..)) => Known(ObjectType),

            _ => Unknown,
        }
    }

    fn is_pure_callee(&self, ctx: &ExprCtx) -> bool {
        if self.is_global_ref_to(ctx, "Date") {
            return true;
        }

        match *self.as_expr() {
            Expr::Member(MemberExpr { ref obj, .. }) if obj.is_global_ref_to(ctx, "Math") => true,

            Expr::Fn(FnExpr {
                function:
                    Function {
                        body: Some(BlockStmt { ref stmts, .. }),
                        ..
                    },
                ..
            }) if stmts.is_empty() => true,

            _ => false,
        }
    }

    fn may_have_side_effects(&self, ctx: &ExprCtx) -> bool {
        if self.is_pure_callee(ctx) {
            return false;
        }

        match self.as_expr() {
            Expr::Ident(i) => i.span.ctxt == ctx.unresolved_ctxt,

            Expr::Lit(..) | Expr::This(..) | Expr::PrivateName(..) | Expr::TsConstAssertion(..) => {
                false
            }

            Expr::Paren(ref e) => e.expr.may_have_side_effects(ctx),

            // Function expression does not have any side effect if it's not used.
            Expr::Fn(..) | Expr::Arrow(ArrowExpr { .. }) => false,

            // TODO
            Expr::Class(..) => true,
            Expr::Array(ArrayLit { ref elems, .. }) => elems
                .iter()
                .filter_map(|e| e.as_ref())
                .any(|e| e.expr.may_have_side_effects(ctx)),
            Expr::Unary(UnaryExpr { ref arg, .. }) => arg.may_have_side_effects(ctx),
            Expr::Bin(BinExpr {
                ref left,
                ref right,
                ..
            }) => left.may_have_side_effects(ctx) || right.may_have_side_effects(ctx),

            //TODO
            Expr::Tpl(_) => true,
            Expr::TaggedTpl(_) => true,
            Expr::MetaProp(_) => true,

            Expr::Await(_)
            | Expr::Yield(_)
            | Expr::Member(_)
            | Expr::SuperProp(_)
            | Expr::OptChain(OptChainExpr {
                base: OptChainBase::Member(_),
                ..
            })
            | Expr::Update(_)
            | Expr::Assign(_) => true,

            // TODO
            Expr::New(_) => true,

            Expr::Call(CallExpr {
                callee: Callee::Expr(ref callee),
                ref args,
                ..
            })
            | Expr::OptChain(OptChainExpr {
                base:
                    OptChainBase::Call(OptCall {
                        ref callee,
                        ref args,
                        ..
                    }),
                ..
            }) if callee.is_pure_callee(ctx) => {
                args.iter().any(|arg| arg.expr.may_have_side_effects(ctx))
            }

            Expr::Call(_)
            | Expr::OptChain(OptChainExpr {
                base: OptChainBase::Call(_),
                ..
            }) => true,

            Expr::Seq(SeqExpr { ref exprs, .. }) => {
                exprs.iter().any(|e| e.may_have_side_effects(ctx))
            }

            Expr::Cond(CondExpr {
                ref test,
                ref cons,
                ref alt,
                ..
            }) => {
                test.may_have_side_effects(ctx)
                    || cons.may_have_side_effects(ctx)
                    || alt.may_have_side_effects(ctx)
            }

            Expr::Object(ObjectLit { ref props, .. }) => props.iter().any(|node| match node {
                PropOrSpread::Prop(node) => match &**node {
                    Prop::Shorthand(..) => false,
                    Prop::KeyValue(KeyValueProp { ref key, ref value }) => {
                        let k = match *key {
                            PropName::Computed(ref e) => e.expr.may_have_side_effects(ctx),
                            _ => false,
                        };

                        k || value.may_have_side_effects(ctx)
                    }
                    _ => true,
                },
                PropOrSpread::Spread(SpreadElement { expr, .. }) => expr.may_have_side_effects(ctx),
            }),

            Expr::JSXMember(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..)
            | Expr::JSXElement(..)
            | Expr::JSXFragment(..) => true,

            Expr::TsAs(TsAsExpr { ref expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { ref expr, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { ref expr, .. })
            | Expr::TsInstantiation(TsInstantiation { ref expr, .. }) => {
                expr.may_have_side_effects(ctx)
            }

            Expr::Invalid(..) => true,
        }
    }
}
fn and(lt: Value<Type>, rt: Value<Type>) -> Value<Type> {
    if lt == rt {
        return lt;
    }
    Unknown
}

/// Return if the node is possibly a string.
fn may_be_str(ty: Value<Type>) -> bool {
    match ty {
        Known(BoolType) | Known(NullType) | Known(NumberType) | Known(UndefinedType) => false,
        Known(ObjectType) | Known(StringType) | Unknown => true,
        // TODO: Check if this is correct
        Known(SymbolType) => true,
    }
}

fn num_from_str(s: &str) -> Value<f64> {
    if s.contains('\u{000b}') {
        return Unknown;
    }

    // TODO: Check if this is correct
    let s = s.trim();

    if s.is_empty() {
        return Known(0.0);
    }

    if s.starts_with("0x") || s.starts_with("0X") {
        return match s[2..4].parse() {
            Ok(n) => Known(n),
            Err(_) => Known(NAN),
        };
    }

    if (s.starts_with('-') || s.starts_with('+'))
        && (s[1..].starts_with("0x") || s[1..].starts_with("0X"))
    {
        // hex numbers with explicit signs vary between browsers.
        return Unknown;
    }

    // Firefox and IE treat the "Infinity" differently. Firefox is case
    // insensitive, but IE treats "infinity" as NaN.  So leave it alone.
    match s {
        "infinity" | "+infinity" | "-infinity" => return Unknown,
        _ => {}
    }

    Known(s.parse().ok().unwrap_or(NAN))
}

impl ExprExt for Box<Expr> {
    fn as_expr(&self) -> &Expr {
        self
    }
}

impl ExprExt for Expr {
    fn as_expr(&self) -> &Expr {
        self
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Purity {
    /// May have some side effects.
    MayBeImpure,
    /// Does not have any side effect.
    Pure,
}
impl Purity {
    /// Returns true if it's pure.
    pub fn is_pure(self) -> bool {
        self == Pure
    }
}

impl Add for Purity {
    type Output = Self;

    fn add(self, rhs: Self) -> Self {
        match (self, rhs) {
            (Pure, Pure) => Pure,
            _ => MayBeImpure,
        }
    }
}

/// Cast to javascript's int32
pub fn to_int32(d: f64) -> i32 {
    let id = d as i32;
    if id as f64 == d {
        // This covers -0.0 as well
        return id;
    }

    if d.is_nan() || d.is_infinite() {
        return 0;
    }

    let d = if d >= 0.0 { d.floor() } else { d.ceil() };

    const TWO32: f64 = 4_294_967_296.0;
    let d = d % TWO32;
    // (double)(long)d == d should hold here

    let l = d as i64;
    // returning (int)d does not work as d can be outside int range
    // but the result must always be 32 lower bits of l
    l as i32
}

// pub fn to_u32(_d: f64) -> u32 {
//     //   if (Double.isNaN(d) || Double.isInfinite(d) || d == 0) {
//     //   return 0;
//     // }

//     // d = Math.signum(d) * Math.floor(Math.abs(d));

//     // double two32 = 4294967296.0;
//     // // this ensures that d is positive
//     // d = ((d % two32) + two32) % two32;
//     // // (double)(long)d == d should hold here

//     // long l = (long) d;
//     // // returning (int)d does not work as d can be outside int range
//     // // but the result must always be 32 lower bits of l
//     // return (int) l;
//     unimplemented!("to_u32")
// }

pub fn has_rest_pat<T: VisitWith<RestPatVisitor>>(node: &T) -> bool {
    let mut v = RestPatVisitor { found: false };
    node.visit_with(&mut v);
    v.found
}

pub struct RestPatVisitor {
    found: bool,
}

impl Visit for RestPatVisitor {
    noop_visit_type!();

    fn visit_rest_pat(&mut self, _: &RestPat) {
        self.found = true;
    }
}

pub fn is_literal<T>(node: &T) -> bool
where
    T: VisitWith<LiteralVisitor>,
{
    let (v, _) = calc_literal_cost(node, true);
    v
}

#[inline(never)]
pub fn calc_literal_cost<T>(e: &T, allow_non_json_value: bool) -> (bool, usize)
where
    T: VisitWith<LiteralVisitor>,
{
    let mut v = LiteralVisitor {
        is_lit: true,
        cost: 0,
        allow_non_json_value,
    };
    e.visit_with(&mut v);

    (v.is_lit, v.cost)
}

pub struct LiteralVisitor {
    is_lit: bool,
    cost: usize,
    allow_non_json_value: bool,
}

impl Visit for LiteralVisitor {
    noop_visit_type!();

    fn visit_array_lit(&mut self, e: &ArrayLit) {
        if !self.is_lit {
            return;
        }

        self.cost += 2 + e.elems.len();

        e.visit_children_with(self);

        for elem in &e.elems {
            if !self.allow_non_json_value && elem.is_none() {
                self.is_lit = false;
            }
        }
    }

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
        self.is_lit = false
    }

    fn visit_assign_expr(&mut self, _: &AssignExpr) {
        self.is_lit = false;
    }

    fn visit_await_expr(&mut self, _: &AwaitExpr) {
        self.is_lit = false
    }

    fn visit_bin_expr(&mut self, _: &BinExpr) {
        self.is_lit = false
    }

    fn visit_call_expr(&mut self, _: &CallExpr) {
        self.is_lit = false
    }

    fn visit_class_expr(&mut self, _: &ClassExpr) {
        self.is_lit = false
    }

    fn visit_cond_expr(&mut self, _: &CondExpr) {
        self.is_lit = false;
    }

    fn visit_expr(&mut self, e: &Expr) {
        if !self.is_lit {
            return;
        }

        match *e {
            Expr::Ident(..) | Expr::Lit(Lit::Regex(..)) => self.is_lit = false,
            Expr::Tpl(ref tpl) if !tpl.exprs.is_empty() => self.is_lit = false,
            _ => e.visit_children_with(self),
        }
    }

    fn visit_fn_expr(&mut self, _: &FnExpr) {
        self.is_lit = false;
    }

    fn visit_invalid(&mut self, _: &Invalid) {
        self.is_lit = false;
    }

    fn visit_jsx_element(&mut self, _: &JSXElement) {
        self.is_lit = false
    }

    fn visit_jsx_empty_expr(&mut self, _: &JSXEmptyExpr) {
        self.is_lit = false
    }

    fn visit_jsx_fragment(&mut self, _: &JSXFragment) {
        self.is_lit = false
    }

    fn visit_jsx_member_expr(&mut self, _: &JSXMemberExpr) {
        self.is_lit = false
    }

    fn visit_jsx_namespaced_name(&mut self, _: &JSXNamespacedName) {
        self.is_lit = false
    }

    fn visit_member_expr(&mut self, _: &MemberExpr) {
        self.is_lit = false;
    }

    fn visit_meta_prop_expr(&mut self, _: &MetaPropExpr) {
        self.is_lit = false
    }

    fn visit_new_expr(&mut self, _: &NewExpr) {
        self.is_lit = false
    }

    fn visit_number(&mut self, node: &Number) {
        if !self.allow_non_json_value && node.value.is_infinite() {
            self.is_lit = false;
        }
    }

    fn visit_opt_chain_expr(&mut self, _: &OptChainExpr) {
        self.is_lit = false
    }

    fn visit_private_name(&mut self, _: &PrivateName) {
        self.is_lit = false
    }

    fn visit_prop(&mut self, p: &Prop) {
        if !self.is_lit {
            return;
        }

        p.visit_children_with(self);

        match p {
            Prop::KeyValue(..) => {
                self.cost += 1;
            }
            _ => self.is_lit = false,
        }
    }

    fn visit_prop_name(&mut self, node: &PropName) {
        if !self.is_lit {
            return;
        }

        node.visit_children_with(self);

        match node {
            PropName::Str(ref s) => self.cost += 2 + s.value.len(),
            PropName::Ident(ref id) => self.cost += 2 + id.sym.len(),
            PropName::Num(n) => {
                if n.value.fract() < 1e-10 {
                    // TODO: Count digits
                    self.cost += 5;
                } else {
                    self.is_lit = false
                }
            }
            PropName::BigInt(_) => self.is_lit = false,
            PropName::Computed(..) => self.is_lit = false,
        }
    }

    fn visit_seq_expr(&mut self, _: &SeqExpr) {
        self.is_lit = false
    }

    fn visit_spread_element(&mut self, _: &SpreadElement) {
        self.is_lit = false;
    }

    fn visit_tagged_tpl(&mut self, _: &TaggedTpl) {
        self.is_lit = false
    }

    fn visit_this_expr(&mut self, _: &ThisExpr) {
        self.is_lit = false;
    }

    fn visit_ts_const_assertion(&mut self, _: &TsConstAssertion) {
        self.is_lit = false
    }

    fn visit_ts_non_null_expr(&mut self, _: &TsNonNullExpr) {
        self.is_lit = false
    }

    fn visit_unary_expr(&mut self, _: &UnaryExpr) {
        self.is_lit = false;
    }

    fn visit_update_expr(&mut self, _: &UpdateExpr) {
        self.is_lit = false;
    }

    fn visit_yield_expr(&mut self, _: &YieldExpr) {
        self.is_lit = false
    }
}

/// Used to determine super_class_ident
pub fn alias_ident_for(expr: &Expr, default: &str) -> Ident {
    fn sym(expr: &Expr, default: &str) -> JsWord {
        match expr {
            Expr::Ident(ident)
            | Expr::Member(MemberExpr {
                prop: MemberProp::Ident(ident),
                ..
            })
            | Expr::Class(ClassExpr {
                ident: Some(ident), ..
            }) => format!("_{}", ident.sym).into(),
            Expr::Member(MemberExpr {
                prop: MemberProp::Computed(computed),
                ..
            }) => sym(&computed.expr, default),

            _ => default.into(),
        }
    }

    let span = expr.span().apply_mark(Mark::fresh(Mark::root()));
    quote_ident!(span, sym(expr, default))
}

/// Returns `(ident, aliased)`
pub fn alias_if_required(expr: &Expr, default: &str) -> (Ident, bool) {
    if let Expr::Ident(ref i) = *expr {
        return (Ident::new(i.sym.clone(), i.span), false);
    }

    (alias_ident_for(expr, default), true)
}

pub fn prop_name_to_expr(p: PropName) -> Expr {
    match p {
        PropName::Ident(i) => Expr::Ident(i),
        PropName::Str(s) => Expr::Lit(Lit::Str(s)),
        PropName::Num(n) => Expr::Lit(Lit::Num(n)),
        PropName::BigInt(b) => Expr::Lit(Lit::BigInt(b)),
        PropName::Computed(c) => *c.expr,
    }
}
/// Similar to `prop_name_to_expr`, but used for value position.
///
/// e.g. value from `{ key: value }`
pub fn prop_name_to_expr_value(p: PropName) -> Expr {
    match p {
        PropName::Ident(i) => Expr::Lit(Lit::Str(Str {
            span: i.span,
            raw: None,
            value: i.sym,
        })),
        PropName::Str(s) => Expr::Lit(Lit::Str(s)),
        PropName::Num(n) => Expr::Lit(Lit::Num(n)),
        PropName::BigInt(b) => Expr::Lit(Lit::BigInt(b)),
        PropName::Computed(c) => *c.expr,
    }
}

pub fn default_constructor(has_super: bool) -> Constructor {
    trace!(has_super = has_super, "Creating a default constructor");

    let span = DUMMY_SP;

    Constructor {
        span: DUMMY_SP,
        key: PropName::Ident(quote_ident!("constructor")),
        accessibility: Default::default(),
        is_optional: false,
        params: if has_super {
            vec![ParamOrTsParamProp::Param(Param {
                span,
                decorators: vec![],
                pat: Pat::Rest(RestPat {
                    span: DUMMY_SP,
                    dot3_token: DUMMY_SP,
                    arg: Box::new(Pat::Ident(quote_ident!(span, "args").into())),
                    type_ann: Default::default(),
                }),
            })]
        } else {
            vec![]
        },
        body: Some(BlockStmt {
            span: DUMMY_SP,
            stmts: if has_super {
                vec![CallExpr {
                    span: DUMMY_SP,
                    callee: Callee::Super(Super { span: DUMMY_SP }),
                    args: vec![ExprOrSpread {
                        spread: Some(DUMMY_SP),
                        expr: Box::new(Expr::Ident(quote_ident!(span, "args"))),
                    }],
                    type_args: Default::default(),
                }
                .into_stmt()]
            } else {
                vec![]
            },
        }),
    }
}

/// Check if `e` is `...arguments`
pub fn is_rest_arguments(e: &ExprOrSpread) -> bool {
    if e.spread.is_none() {
        return false;
    }

    matches!(
        *e.expr,
        Expr::Ident(Ident {
            sym: js_word!("arguments"),
            ..
        })
    )
}

/// Creates `void 0`.
#[inline]
pub fn undefined(span: Span) -> Box<Expr> {
    Expr::Unary(UnaryExpr {
        span,
        op: op!("void"),
        arg: Expr::Lit(Lit::Num(Number {
            span,
            value: 0.0,
            raw: None,
        }))
        .into(),
    })
    .into()
}

pub fn opt_chain_test(
    left: Box<Expr>,
    right: Box<Expr>,
    span: Span,
    no_document_all: bool,
) -> Expr {
    if no_document_all {
        Expr::Bin(BinExpr {
            span,
            left,
            op: op!("=="),
            right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        })
    } else {
        Expr::Bin(BinExpr {
            span,
            left: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left,
                op: op!("==="),
                right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
            })),
            op: op!("||"),
            right: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left: right,
                op: op!("==="),
                right: undefined(DUMMY_SP),
            })),
        })
    }
}

/// inject `branch` after directives
#[inline(never)]
pub fn prepend_stmt<T: StmtLike>(stmts: &mut Vec<T>, stmt: T) {
    let idx = stmts
        .iter()
        .position(|item| match item.as_stmt() {
            Some(&Stmt::Expr(ExprStmt { ref expr, .. }))
                if matches!(&**expr, Expr::Lit(Lit::Str(..))) =>
            {
                false
            }
            _ => true,
        })
        .unwrap_or(stmts.len());

    stmts.insert(idx, stmt);
}

/// inject `stmts` after directives
pub fn prepend_stmts<T: StmtLike>(
    to: &mut Vec<T>,
    stmts: impl Iterator + ExactSizeIterator<Item = T>,
) {
    let idx = to
        .iter()
        .position(|item| {
            if let Some(&Stmt::Expr(ExprStmt { ref expr, .. })) = item.as_stmt() {
                match &**expr {
                    Expr::Lit(Lit::Str(..)) => return false,
                    Expr::Call(expr) => match expr.callee {
                        Callee::Super(_) | Callee::Import(_) => return false,
                        Callee::Expr(_) => {}
                    },
                    _ => {}
                }
            }

            true
        })
        .unwrap_or(to.len());

    let mut buf = Vec::with_capacity(to.len() + stmts.len());
    // TODO: Optimize (maybe unsafe)

    buf.extend(to.drain(..idx));
    buf.extend(stmts);
    buf.append(to);
    debug_assert!(to.is_empty());

    *to = buf
}

pub trait IsDirective {
    fn as_ref(&self) -> Option<&Stmt>;
    fn is_use_strict(&self) -> bool {
        match self.as_ref() {
            Some(&Stmt::Expr(ref expr)) => match *expr.expr {
                Expr::Lit(Lit::Str(Str { ref raw, .. })) => {
                    matches!(raw, Some(value) if value == "\"use strict\"" || value == "'use strict'")
                }
                _ => false,
            },
            _ => false,
        }
    }
}

impl IsDirective for Stmt {
    fn as_ref(&self) -> Option<&Stmt> {
        Some(self)
    }
}

pub trait IdentExt {
    fn prefix(&self, prefix: &str) -> Ident;

    fn private(self) -> Ident;
}

impl IdentExt for Ident {
    fn prefix(&self, prefix: &str) -> Ident {
        Ident::new(format!("{}{}", prefix, self.sym).into(), self.span)
    }

    fn private(self) -> Ident {
        let span = self.span.apply_mark(Mark::fresh(Mark::root()));

        Ident::new(self.sym, span)
    }
}

/// Finds all **binding** idents of variables.
pub struct DestructuringFinder<'a, I: IdentLike> {
    pub found: &'a mut Vec<I>,
}

/// Finds all **binding** idents of `node`.
pub fn find_pat_ids<T, I: IdentLike>(node: &T) -> Vec<I>
where
    T: for<'any> VisitWith<DestructuringFinder<'any, I>>,
{
    let mut found = vec![];

    {
        let mut v = DestructuringFinder { found: &mut found };
        node.visit_with(&mut v);
    }

    found
}

impl<'a, I: IdentLike> Visit for DestructuringFinder<'a, I> {
    noop_visit_type!();

    /// No-op (we don't care about expressions)
    fn visit_expr(&mut self, _: &Expr) {}

    fn visit_ident(&mut self, i: &Ident) {
        self.found.push(I::from_ident(i));
    }

    /// No-op (we don't care about expressions)
    fn visit_prop_name(&mut self, _: &PropName) {}
}

pub fn is_valid_ident(s: &JsWord) -> bool {
    if s.len() == 0 {
        return false;
    }

    Ident::verify_symbol(s).is_ok()
}

pub fn drop_span<T>(mut t: T) -> T
where
    T: VisitMutWith<DropSpan>,
{
    t.visit_mut_with(&mut DropSpan {
        preserve_ctxt: false,
    });
    t
}

pub struct DropSpan {
    pub preserve_ctxt: bool,
}
impl VisitMut for DropSpan {
    fn visit_mut_span(&mut self, span: &mut Span) {
        *span = if self.preserve_ctxt {
            DUMMY_SP.with_ctxt(span.ctxt())
        } else {
            DUMMY_SP
        };
    }
}

/// Finds usage of `ident`
pub struct IdentUsageFinder<'a> {
    ident: &'a Id,
    found: bool,
}

impl<'a> Visit for IdentUsageFinder<'a> {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, i: &Ident) {
        if i.span.ctxt == self.ident.1 && i.sym == self.ident.0 {
            self.found = true;
        }
    }
}

impl<'a> IdentUsageFinder<'a> {
    pub fn find<N>(ident: &'a Id, node: &N) -> bool
    where
        N: VisitWith<Self>,
    {
        let mut v = IdentUsageFinder {
            ident,
            found: false,
        };
        node.visit_with(&mut v);
        v.found
    }
}

impl ExprCtx {
    /// make a new expression which evaluates `val` preserving side effects, if
    /// any.
    pub fn preserve_effects<I>(&self, span: Span, val: Expr, exprs: I) -> Expr
    where
        I: IntoIterator<Item = Box<Expr>>,
    {
        let mut exprs = exprs.into_iter().fold(vec![], |mut v, e| {
            self.extract_side_effects_to(&mut v, *e);
            v
        });

        if exprs.is_empty() {
            val
        } else {
            exprs.push(Box::new(val));

            Expr::Seq(SeqExpr { exprs, span })
        }
    }

    /// Add side effects of `expr` to `to`.
    //
    /// This function preserves order and conditions. (think a() ? yield b() :
    /// c())
    #[allow(clippy::vec_box)]
    pub fn extract_side_effects_to(&self, to: &mut Vec<Box<Expr>>, expr: Expr) {
        match expr {
            Expr::Lit(..)
            | Expr::This(..)
            | Expr::Fn(..)
            | Expr::Arrow(..)
            | Expr::Ident(..)
            | Expr::PrivateName(..) => {}

            // In most case, we can do nothing for this.
            Expr::Update(_) | Expr::Assign(_) | Expr::Yield(_) | Expr::Await(_) => {
                to.push(Box::new(expr))
            }

            // TODO
            Expr::MetaProp(_) => to.push(Box::new(expr)),

            Expr::Call(_) => to.push(Box::new(expr)),
            Expr::New(e) => {
                // Known constructors
                if let Expr::Ident(Ident { ref sym, .. }) = *e.callee {
                    if *sym == js_word!("Date") && e.args.is_empty() {
                        return;
                    }
                }

                to.push(Box::new(Expr::New(e)))
            }
            Expr::Member(_)
            | Expr::SuperProp(_)
            | Expr::OptChain(OptChainExpr {
                base: OptChainBase::Member(_),
                ..
            }) => to.push(Box::new(expr)),

            // We are at here because we could not determine value of test.
            //TODO: Drop values if it does not have side effects.
            Expr::Cond(_) => to.push(Box::new(expr)),

            Expr::Unary(UnaryExpr { arg, .. }) => self.extract_side_effects_to(to, *arg),
            Expr::Bin(BinExpr { left, right, .. }) => {
                self.extract_side_effects_to(to, *left);
                self.extract_side_effects_to(to, *right);
            }
            Expr::Seq(SeqExpr { exprs, .. }) => exprs
                .into_iter()
                .for_each(|e| self.extract_side_effects_to(to, *e)),

            Expr::Paren(e) => self.extract_side_effects_to(to, *e.expr),

            Expr::Object(ObjectLit {
                span, mut props, ..
            }) => {
                //
                let mut has_spread = false;
                props.retain(|node| match node {
                    PropOrSpread::Prop(node) => match &**node {
                        Prop::Shorthand(..) => false,
                        Prop::KeyValue(KeyValueProp { key, value }) => {
                            if let PropName::Computed(e) = key {
                                if e.expr.may_have_side_effects(self) {
                                    return true;
                                }
                            }

                            value.may_have_side_effects(self)
                        }
                        Prop::Getter(GetterProp { key, .. })
                        | Prop::Setter(SetterProp { key, .. })
                        | Prop::Method(MethodProp { key, .. }) => {
                            if let PropName::Computed(e) = key {
                                e.expr.may_have_side_effects(self)
                            } else {
                                false
                            }
                        }
                        Prop::Assign(..) => {
                            unreachable!("assign property in object literal is not a valid syntax")
                        }
                    },
                    PropOrSpread::Spread(SpreadElement { .. }) => {
                        has_spread = true;
                        true
                    }
                });

                if has_spread {
                    to.push(Box::new(Expr::Object(ObjectLit { span, props })))
                } else {
                    props.into_iter().for_each(|prop| match prop {
                        PropOrSpread::Prop(node) => match *node {
                            Prop::Shorthand(..) => {}
                            Prop::KeyValue(KeyValueProp { key, value }) => {
                                if let PropName::Computed(e) = key {
                                    self.extract_side_effects_to(to, *e.expr);
                                }

                                self.extract_side_effects_to(to, *value)
                            }
                            Prop::Getter(GetterProp { key, .. })
                            | Prop::Setter(SetterProp { key, .. })
                            | Prop::Method(MethodProp { key, .. }) => {
                                if let PropName::Computed(e) = key {
                                    self.extract_side_effects_to(to, *e.expr)
                                }
                            }
                            Prop::Assign(..) => {
                                unreachable!(
                                    "assign property in object literal is not a valid syntax"
                                )
                            }
                        },
                        _ => unreachable!(),
                    })
                }
            }

            Expr::Array(ArrayLit { elems, .. }) => {
                elems.into_iter().flatten().fold(to, |v, e| {
                    self.extract_side_effects_to(v, *e.expr);

                    v
                });
            }

            Expr::TaggedTpl { .. } => unimplemented!("add_effects for tagged template literal"),
            Expr::Tpl { .. } => unimplemented!("add_effects for template literal"),
            Expr::Class(ClassExpr { .. }) => unimplemented!("add_effects for class expression"),

            Expr::JSXMember(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..)
            | Expr::JSXElement(..)
            | Expr::JSXFragment(..) => to.push(Box::new(expr)),

            Expr::TsTypeAssertion(TsTypeAssertion { expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { expr, .. })
            | Expr::TsAs(TsAsExpr { expr, .. })
            | Expr::TsConstAssertion(TsConstAssertion { expr, .. })
            | Expr::TsInstantiation(TsInstantiation { expr, .. }) => {
                self.extract_side_effects_to(to, *expr)
            }
            Expr::OptChain(OptChainExpr { base: child, .. }) => {
                self.extract_side_effects_to(to, child.into())
            }

            Expr::Invalid(..) => unreachable!(),
        }
    }
}

pub fn prop_name_eq(p: &PropName, key: &str) -> bool {
    match &*p {
        PropName::Ident(i) => i.sym == *key,
        PropName::Str(s) => s.value == *key,
        PropName::Num(_) => false,
        PropName::BigInt(_) => false,
        PropName::Computed(e) => match &*e.expr {
            Expr::Lit(Lit::Str(Str { value, .. })) => *value == *key,
            _ => false,
        },
    }
}

/// Replace all `from` in `expr` with `to`.
///
/// # Usage

///
/// ```ignore
/// replace_ident(&mut dec.expr, cls_name.to_id(), alias);
/// ```
pub fn replace_ident<T>(node: &mut T, from: Id, to: &Ident)
where
    T: for<'any> VisitMutWith<IdentReplacer<'any>>,
{
    node.visit_mut_with(&mut IdentReplacer { from, to })
}

pub struct IdentReplacer<'a> {
    from: Id,
    to: &'a Ident,
}

impl VisitMut for IdentReplacer<'_> {
    noop_visit_mut_type!();

    visit_mut_obj_and_computed!();

    fn visit_mut_ident(&mut self, node: &mut Ident) {
        if node.sym == self.from.0 && node.span.ctxt == self.from.1 {
            *node = self.to.clone();
        }
    }
}

pub struct BindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    only: Option<SyntaxContext>,
    bindings: AHashSet<I>,
    is_pat_decl: bool,
}

impl<I> BindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    fn add(&mut self, i: &Ident) {
        if let Some(only) = self.only {
            if only != i.span.ctxt {
                return;
            }
        }

        self.bindings.insert(I::from_ident(i));
    }
}

impl<I> Visit for BindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        let old = self.is_pat_decl;

        for p in &n.params {
            self.is_pat_decl = true;
            p.visit_with(self);
        }

        n.body.visit_with(self);
        self.is_pat_decl = old;
    }

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp) {
        node.value.visit_with(self);

        if self.is_pat_decl {
            self.add(&node.key);
        }
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        node.visit_children_with(self);

        self.add(&node.ident);
    }

    fn visit_expr(&mut self, node: &Expr) {
        let old = self.is_pat_decl;
        self.is_pat_decl = false;
        node.visit_children_with(self);
        self.is_pat_decl = old;
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        node.visit_children_with(self);

        self.add(&node.ident);
    }

    fn visit_import_default_specifier(&mut self, node: &ImportDefaultSpecifier) {
        self.add(&node.local);
    }

    fn visit_import_named_specifier(&mut self, node: &ImportNamedSpecifier) {
        self.add(&node.local);
    }

    fn visit_import_star_as_specifier(&mut self, node: &ImportStarAsSpecifier) {
        self.add(&node.local);
    }

    fn visit_module_items(&mut self, nodes: &[ModuleItem]) {
        #[cfg(feature = "concurrent")]
        if nodes.len() > 16 {
            use rayon::prelude::*;
            let set = nodes
                .par_iter()
                .map(|node| {
                    let mut v = BindingCollector {
                        only: self.only,
                        bindings: Default::default(),
                        is_pat_decl: self.is_pat_decl,
                    };
                    node.visit_with(&mut v);
                    v.bindings
                })
                .reduce(AHashSet::default, |mut a, b| {
                    a.extend(b);
                    a
                });
            self.bindings.extend(set);
            return;
        }

        for node in nodes {
            node.visit_children_with(self)
        }
    }

    fn visit_param(&mut self, node: &Param) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        node.visit_children_with(self);
        self.is_pat_decl = old;
    }

    fn visit_pat(&mut self, node: &Pat) {
        node.visit_children_with(self);

        if self.is_pat_decl {
            if let Pat::Ident(i) = node {
                self.add(&i.id)
            }
        }
    }

    fn visit_stmts(&mut self, nodes: &[Stmt]) {
        #[cfg(feature = "concurrent")]
        if nodes.len() > 16 {
            use rayon::prelude::*;
            let set = nodes
                .par_iter()
                .map(|node| {
                    let mut v = BindingCollector {
                        only: self.only,
                        bindings: Default::default(),
                        is_pat_decl: self.is_pat_decl,
                    };
                    node.visit_with(&mut v);
                    v.bindings
                })
                .reduce(AHashSet::default, |mut a, b| {
                    a.extend(b);
                    a
                });
            self.bindings.extend(set);
            return;
        }

        for node in nodes {
            node.visit_children_with(self)
        }
    }

    fn visit_var_declarator(&mut self, node: &VarDeclarator) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        node.name.visit_with(self);

        self.is_pat_decl = false;
        node.init.visit_with(self);
        self.is_pat_decl = old;
    }
}

/// Collects binding identifiers.
pub fn collect_decls<I, N>(n: &N) -> AHashSet<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
    N: VisitWith<BindingCollector<I>>,
{
    let mut v = BindingCollector {
        only: None,
        bindings: Default::default(),
        is_pat_decl: false,
    };
    n.visit_with(&mut v);
    v.bindings
}

/// Collects binding identifiers, but only if it has a context which is
/// identical to `ctxt`.
pub fn collect_decls_with_ctxt<I, N>(n: &N, ctxt: SyntaxContext) -> AHashSet<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
    N: VisitWith<BindingCollector<I>>,
{
    let mut v = BindingCollector {
        only: Some(ctxt),
        bindings: Default::default(),
        is_pat_decl: false,
    };
    n.visit_with(&mut v);
    v.bindings
}

pub struct TopLevelAwait {
    found: bool,
}

impl Visit for TopLevelAwait {
    noop_visit_type!();

    fn visit_stmts(&mut self, _: &[Stmt]) {}

    fn visit_param(&mut self, _: &Param) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_class_member(&mut self, prop: &ClassMember) {
        match prop {
            ClassMember::ClassProp(ClassProp {
                key: PropName::Computed(computed),
                ..
            })
            | ClassMember::Method(ClassMethod {
                key: PropName::Computed(computed),
                ..
            }) => computed.visit_children_with(self),
            _ => (),
        };
    }

    fn visit_await_expr(&mut self, _: &AwaitExpr) {
        self.found = true;
    }
}

pub fn contains_top_level_await<V: VisitWith<TopLevelAwait>>(t: &V) -> bool {
    let mut finder = TopLevelAwait { found: false };

    t.visit_with(&mut finder);

    finder.found
}

#[cfg(test)]
mod test {
    use swc_common::{input::StringInput, BytePos};
    use swc_ecma_parser::{Parser, Syntax};

    use super::*;

    #[test]
    fn test_collect_decls() {
        run_collect_decls(
            "const { a, b = 1, inner: { c }, ...d } = {};",
            &["a", "b", "c", "d"],
        );
        run_collect_decls("const [ a, b = 1, [c], ...d ] = [];", &["a", "b", "c", "d"]);
    }

    fn run_collect_decls(text: &str, expected_names: &[&str]) {
        let module = parse_module(text);
        let decls: AHashSet<Id> = collect_decls(&module);
        let mut names = decls.iter().map(|d| d.0.to_string()).collect::<Vec<_>>();
        names.sort();
        assert_eq!(names, expected_names);
    }

    #[test]
    fn test_extract_var_ids() {
        run_extract_var_ids(
            "var { a, b = 1, inner: { c }, ...d } = {};",
            &["a", "b", "c", "d"],
        );
        run_extract_var_ids("var [ a, b = 1, [c], ...d ] = [];", &["a", "b", "c", "d"]);
    }

    fn run_extract_var_ids(text: &str, expected_names: &[&str]) {
        let module = parse_module(text);
        let decls = extract_var_ids(&module);
        let mut names = decls.iter().map(|d| d.sym.to_string()).collect::<Vec<_>>();
        names.sort();
        assert_eq!(names, expected_names);
    }

    fn parse_module(text: &str) -> Module {
        let syntax = Syntax::Es(Default::default());
        let mut p = Parser::new(
            syntax,
            StringInput::new(text, BytePos(0), BytePos(text.len() as u32)),
            None,
        );
        p.parse_module().unwrap()
    }
}
