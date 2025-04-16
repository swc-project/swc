#![allow(dead_code)]

use std::ops::{Deref, DerefMut};

use bitflags::bitflags;
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
    pub in_pat_of_var_decl_with_init: Option<Value<Type>>,
    pub(crate) bit_ctx: BitContext,
}

impl Ctx {
    #[inline]
    pub(crate) fn with(mut self, flag: BitContext, value: bool) -> Self {
        self.bit_ctx = self.bit_ctx.with(flag, value);
        self
    }

    #[inline]
    pub fn in_decl_with_no_side_effect_for_member_access(&self) -> bool {
        self.bit_ctx
            .contains(BitContext::InDeclWithNoSideEffectForMemberAccess)
    }

    #[inline]
    pub fn in_pat_of_param(&self) -> bool {
        self.bit_ctx.contains(BitContext::InPatOfParam)
    }

    #[inline]
    pub fn in_catch_param(&self) -> bool {
        self.bit_ctx.contains(BitContext::InCatchParam)
    }

    #[inline]
    pub fn is_id_ref(&self) -> bool {
        self.bit_ctx.contains(BitContext::IsIdRef)
    }

    #[inline]
    pub fn inline_prevented(&self) -> bool {
        self.bit_ctx.contains(BitContext::InlinePrevented)
    }

    #[inline]
    pub fn in_cond(&self) -> bool {
        self.bit_ctx.contains(BitContext::InCond)
    }

    #[inline]
    pub fn executed_multiple_time(&self) -> bool {
        self.bit_ctx.contains(BitContext::ExecutedMultipleTime)
    }

    #[inline]
    pub fn is_top_level(&self) -> bool {
        self.bit_ctx.contains(BitContext::IsTopLevel)
    }
}

bitflags! {
    #[derive(Debug, Clone, Copy, Default)]
    pub(crate) struct BitContext: u16 {
        const InDeclWithNoSideEffectForMemberAccess = 1 << 0;
        const InPatOfVarDecl = 1 << 1;
        const InPatOfParam = 1 << 2;
        const InCatchParam = 1 << 3;
        const IsIdRef = 1 << 4;
        const InAwaitArg = 1 << 5;
        const InLeftOfForLoop = 1 << 6;
        const ExecutedMultipleTime = 1 << 7;
        const InCond = 1 << 8;
        const InlinePrevented = 1 << 9;
        const IsTopLevel = 1 << 10;
    }
}

impl BitContext {
    #[inline]
    pub fn with(mut self, flag: Self, value: bool) -> Self {
        self.set(flag, value);
        self
    }
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
