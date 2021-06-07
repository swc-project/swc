use super::UsageAnalyzer;
use std::ops::Deref;
use std::ops::DerefMut;
use swc_ecma_ast::VarDeclKind;

impl UsageAnalyzer {
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            analyzer: self,
            orig_ctx,
        }
    }
}

#[derive(Debug, Default, Clone, Copy)]
pub(super) struct Ctx {
    pub var_decl_kind_of_pat: Option<VarDeclKind>,
    pub in_pat_of_var_decl: bool,
    pub in_pat_of_var_decl_with_init: bool,
    pub in_pat_of_param: bool,
    pub in_catch_param: bool,
    /// `true` for `foo.bar` and `false` for `foo` in `foo.bar++`
    pub is_exact_reassignment: bool,

    /// `true` for arugments of [swc_ecma_ast::Expr::Call] or
    /// [swc_ecma_ast::Expr::New]
    pub in_call_arg: bool,

    /// `false` for `array` in `array.length.
    pub is_exact_arg: bool,

    pub in_left_of_for_loop: bool,

    pub in_loop: bool,
    /// Are we handling argument of an update exprssion.
    pub in_update_arg: bool,
    pub in_assign_lhs: bool,
    pub in_cond: bool,
}

pub(super) struct WithCtx<'a> {
    analyzer: &'a mut UsageAnalyzer,
    orig_ctx: Ctx,
}

impl Deref for WithCtx<'_> {
    type Target = UsageAnalyzer;

    fn deref(&self) -> &Self::Target {
        &self.analyzer
    }
}

impl DerefMut for WithCtx<'_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.analyzer
    }
}

impl Drop for WithCtx<'_> {
    fn drop(&mut self) {
        self.analyzer.ctx = self.orig_ctx;
    }
}
