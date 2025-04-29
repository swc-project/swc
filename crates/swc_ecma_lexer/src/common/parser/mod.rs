use buffer::{Buffer, NextTokenAndSpan};
use swc_common::Span;
use token_and_span::TokenAndSpan;

use self::{
    ctx::WithCtx,
    state::{State, WithState},
};
use super::{context::Context, input::Tokens, lexer::token::TokenFactory};
use crate::{error::SyntaxError, Syntax};

pub type PResult<T> = Result<T, crate::error::Error>;

pub mod buffer;
pub mod ctx;
pub mod expr_ext;
pub mod is_directive;
pub mod is_invalid_class_name;
pub mod is_simple_param_list;
pub mod parse_object;
pub mod state;
pub mod token_and_span;
mod util;

pub use util::{
    get_qualified_jsx_name, has_use_strict, is_constructor, is_not_this, unwrap_ts_non_null,
};

pub trait Parser<'a>: Sized {
    type Token: std::fmt::Debug
        + PartialEq
        + Clone
        + TokenFactory<'a, Self::TokenAndSpan, Self::I, Buffer = Self::Buffer>;
    type Lexer: super::lexer::Lexer<'a, Self::TokenAndSpan>;
    type Next: NextTokenAndSpan<Token = Self::Token>;
    type TokenAndSpan: TokenAndSpan<Token = Self::Token>;
    type I: Tokens<Self::TokenAndSpan>;
    type Buffer: self::buffer::Buffer<
        'a,
        Lexer = Self::Lexer,
        Token = Self::Token,
        TokenAndSpan = Self::TokenAndSpan,
        I = Self::I,
    >;

    fn input(&self) -> &Self::Buffer;
    fn input_mut(&mut self) -> &mut Self::Buffer;
    fn state_mut(&mut self) -> &mut State;

    fn with_state<'w>(
        &'w mut self,
        state: State,
    ) -> WithState<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
        let orig_state = std::mem::replace(self.state_mut(), state);
        WithState {
            orig_state,
            inner: self,
            marker: std::marker::PhantomData,
        }
    }

    #[inline(always)]
    fn ctx(&self) -> Context {
        self.input().get_ctx()
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn with_ctx<'w>(
        &'w mut self,
        ctx: Context,
    ) -> WithCtx<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
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
    fn strict_mode<'w>(&'w mut self) -> WithCtx<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
        let ctx = self.ctx() | Context::Strict;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn in_type<'w>(&'w mut self) -> WithCtx<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
        let ctx = self.ctx() | Context::InType;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn include_in_expr<'w>(
        &'w mut self,
        include_in_expr: bool,
    ) -> WithCtx<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
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

    #[cold]
    fn emit_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }
        self.emit_error(crate::error::Error::new(span, error))
    }

    #[cold]
    fn emit_error(&mut self, error: crate::error::Error) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }
        let cur = self.input_mut().cur();
        if cur.is_some_and(|cur| cur.is_error()) {
            let err = self.input_mut().bump();
            let err = err.take_error(self.input_mut());
            self.input().iter().add_error(err);
        }
        self.input().iter().add_error(error);
    }

    #[cold]
    fn emit_strict_mode_err(&self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) {
            return;
        }
        let error = crate::error::Error::new(span, error);
        self.input().iter().add_module_mode_error(error);
    }
}
