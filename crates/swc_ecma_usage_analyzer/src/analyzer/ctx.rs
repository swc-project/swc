#![allow(dead_code)]

use std::ops::{Deref, DerefMut};

use swc_common::SyntaxContext;
use swc_ecma_ast::{Expr, Ident, MemberExpr, VarDeclKind};
use swc_ecma_utils::{ExprCtx, ExprExt};

use super::{storage::Storage, UsageAnalyzer};

impl<S> UsageAnalyzer<S>
where
    S: Storage,
{
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<S> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            analyzer: self,
            orig_ctx,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]

pub enum CalleeKind {
    NoMutate,
    Unknown,
}

impl CalleeKind {
    pub fn from_expr(expr: &Expr, expr_ctx: &ExprCtx) -> Self {
        fn is_global_fn_wont_mutate(s: &Ident, unresolved: SyntaxContext) -> bool {
            s.span.ctxt == unresolved
                && matches!(
                    &*s.sym,
                    "JSON"
                    // | "Array"
                    | "String"
                    // | "Object"
                    | "Number"
                    | "Date"
                    | "BigInt"
                    | "Boolean"
                    | "Math"
                    | "Error"
                    | "console"
                    | "clearInterval"
                    | "clearTimeout"
                    | "setInterval"
                    | "setTimeout"
                    | "btoa"
                    | "decodeURI"
                    | "decodeURIComponent"
                    | "encodeURI"
                    | "encodeURIComponent"
                    | "escape"
                    | "eval"
                    | "EvalError"
                    | "Function"
                    | "isFinite"
                    | "isNaN"
                    | "parseFloat"
                    | "parseInt"
                    | "RegExp"
                    | "RangeError"
                    | "ReferenceError"
                    | "SyntaxError"
                    | "TypeError"
                    | "unescape"
                    | "URIError"
                    | "atob"
                    | "globalThis"
                    | "NaN"
                    | "Symbol"
                    | "Promise"
                )
        }

        if expr.is_pure_callee(expr_ctx) {
            Self::NoMutate
        } else {
            match expr {
                Expr::Ident(i) if is_global_fn_wont_mutate(i, expr_ctx.unresolved_ctxt) => {
                    Self::NoMutate
                }
                Expr::Member(MemberExpr { obj, .. }) => match &**obj {
                    Expr::Ident(i) if is_global_fn_wont_mutate(i, expr_ctx.unresolved_ctxt) => {
                        Self::NoMutate
                    }
                    _ => Self::Unknown,
                },
                _ => Self::Unknown,
            }
        }
    }
}

#[derive(Debug, Default, Clone, Copy)]
#[non_exhaustive]
pub struct Ctx {
    /// See [crate::marks::Marks]
    pub skip_standalone: bool,

    pub var_decl_kind_of_pat: Option<VarDeclKind>,

    pub in_decl_with_no_side_effect_for_member_access: bool,

    pub in_pat_of_var_decl: bool,
    pub in_pat_of_var_decl_with_init: bool,
    pub in_pat_of_param: bool,
    pub in_catch_param: bool,
    /// `true` for `foo.bar` and `false` for `foo` in `foo.bar++`
    pub is_exact_reassignment: bool,

    pub is_callee: bool,

    /// `true` for arguments of [swc_ecma_ast::Expr::Call] or
    /// [swc_ecma_ast::Expr::New]
    pub in_call_arg_of: Option<CalleeKind>,

    /// `false` for `array` in `array.length.
    pub is_exact_arg: bool,
    pub is_id_ref: bool,

    pub in_await_arg: bool,

    pub is_delete_arg: bool,

    pub in_left_of_for_loop: bool,

    pub executed_multiple_time: bool,
    /// Are we handling argument of an update expression.
    pub in_update_arg: bool,
    pub in_assign_lhs: bool,
    pub in_cond: bool,

    pub inline_prevented: bool,

    pub is_op_assign: bool,

    pub is_top_level: bool,

    pub fn_scope: SyntaxContext,
}

pub(super) struct WithCtx<'a, S>
where
    S: Storage,
{
    analyzer: &'a mut UsageAnalyzer<S>,
    orig_ctx: Ctx,
}

impl<S> Deref for WithCtx<'_, S>
where
    S: Storage,
{
    type Target = UsageAnalyzer<S>;

    fn deref(&self) -> &Self::Target {
        self.analyzer
    }
}

impl<S> DerefMut for WithCtx<'_, S>
where
    S: Storage,
{
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.analyzer
    }
}

impl<S> Drop for WithCtx<'_, S>
where
    S: Storage,
{
    fn drop(&mut self) {
        self.analyzer.ctx = self.orig_ctx;
    }
}
