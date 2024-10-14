#![allow(dead_code)]

use std::ops::{Deref, DerefMut};

use swc_ecma_ast::VarDeclKind;
use swc_ecma_utils::{Type, Value};

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

#[derive(Debug, Default, Clone, Copy)]
#[non_exhaustive]
pub struct Ctx {
    pub var_decl_kind_of_pat: Option<VarDeclKind>,

    pub in_decl_with_no_side_effect_for_member_access: bool,

    pub in_pat_of_var_decl: bool,
    pub in_pat_of_var_decl_with_init: Option<Value<Type>>,
    pub in_pat_of_param: bool,
    pub in_catch_param: bool,

    pub is_id_ref: bool,

    pub in_await_arg: bool,

    pub in_left_of_for_loop: bool,

    pub executed_multiple_time: bool,
    pub in_cond: bool,

    pub inline_prevented: bool,

    pub is_top_level: bool,
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
