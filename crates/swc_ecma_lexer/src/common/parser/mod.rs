use self::{
    ctx::WithCtx,
    state::{State, WithState},
};
use super::{context::Context, input::Tokens};
use crate::Syntax;

pub type PResult<T> = Result<T, crate::error::Error>;
pub mod buffer;
pub mod ctx;
pub mod expr_ext;
pub mod state;
pub mod token_and_span;

pub trait Parser<TokenAndSpan, I: Tokens<TokenAndSpan>>: Sized {
    fn input(&self) -> &I;
    fn input_mut(&mut self) -> &mut I;
    fn state_mut(&mut self) -> &mut State;

    fn with_state(&mut self, state: State) -> WithState<TokenAndSpan, I, Self> {
        let orig_state = std::mem::replace(self.state_mut(), state);
        WithState {
            orig_state,
            inner: self,
            marker: std::marker::PhantomData,
        }
    }

    #[inline(always)]
    fn ctx(&self) -> Context {
        self.input().ctx()
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn with_ctx(&mut self, ctx: Context) -> WithCtx<TokenAndSpan, I, Self> {
        let orig_ctx = self.ctx();
        self.set_ctx(ctx);
        WithCtx {
            orig_ctx,
            inner: self,
            marker: std::marker::PhantomData,
        }
    }

    #[inline(always)]
    fn set_ctx(&mut self, ctx: Context) {
        self.input_mut().set_ctx(ctx);
    }

    #[inline(always)]
    fn strict_mode(&mut self) -> WithCtx<TokenAndSpan, I, Self> {
        let ctx = self.ctx() | Context::Strict;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn in_type(&mut self) -> WithCtx<TokenAndSpan, I, Self> {
        let ctx = self.ctx() | Context::InType;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn include_in_expr(&mut self, include_in_expr: bool) -> WithCtx<TokenAndSpan, I, Self> {
        let mut ctx = self.ctx();
        ctx.set(Context::IncludeInExpr, include_in_expr);
        self.with_ctx(ctx)
    }

    #[inline(always)]
    fn syntax(&self) -> Syntax {
        self.input().syntax()
    }

    /// Parse with given closure
    #[inline(always)]
    fn parse_with<F, Ret>(&mut self, f: F) -> PResult<Ret>
    where
        F: FnOnce(&mut Self) -> PResult<Ret>,
    {
        f(self)
    }
}
