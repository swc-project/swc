use super::*;

impl<I: Tokens> Parser<I> {
    /// Original context is restored when returned guard is dropped.
    pub(super) fn with_ctx(&mut self, ctx: Context) -> WithCtx<I> {
        let orig_ctx = self.ctx();
        self.set_ctx(ctx);
        WithCtx {
            orig_ctx,
            inner: self,
        }
    }

    pub(super) fn set_ctx(&mut self, ctx: Context) {
        self.input.set_ctx(ctx);
    }

    pub(super) fn strict_mode(&mut self) -> WithCtx<I> {
        let ctx = self.ctx() | Context::Strict;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    pub(super) fn in_type(&mut self) -> WithCtx<I> {
        let ctx = self.ctx() | Context::InType;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    pub(super) fn include_in_expr(&mut self, include_in_expr: bool) -> WithCtx<I> {
        let mut ctx = self.ctx();
        ctx.set(Context::IncludeInExpr, include_in_expr);
        self.with_ctx(ctx)
    }

    /// Parse with given closure
    #[inline(always)]
    pub(super) fn parse_with<F, Ret>(&mut self, f: F) -> PResult<Ret>
    where
        F: FnOnce(&mut Self) -> PResult<Ret>,
    {
        f(self)
    }

    pub(super) fn syntax(&self) -> Syntax {
        self.input.syntax()
    }
}
pub trait ParseObject<Obj> {
    type Prop;
    fn make_object(
        &mut self,
        span: Span,
        props: Vec<Self::Prop>,
        trailing_comma: Option<Span>,
    ) -> PResult<Obj>;
    fn parse_object_prop(&mut self) -> PResult<Self::Prop>;
}

pub struct WithState<'w, I: 'w + Tokens> {
    inner: &'w mut Parser<I>,
    orig_state: swc_ecma_lexer::common::parser::state::State,
}
impl<I: Tokens> Deref for WithState<'_, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<I: Tokens> DerefMut for WithState<'_, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}
impl<I: Tokens> Drop for WithState<'_, I> {
    fn drop(&mut self) {
        std::mem::swap(&mut self.inner.state, &mut self.orig_state);
    }
}

pub struct WithCtx<'w, I: 'w + Tokens> {
    inner: &'w mut Parser<I>,
    orig_ctx: Context,
}
impl<I: Tokens> Deref for WithCtx<'_, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<I: Tokens> DerefMut for WithCtx<'_, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}

impl<I: Tokens> Drop for WithCtx<'_, I> {
    fn drop(&mut self) {
        self.inner.set_ctx(self.orig_ctx);
    }
}
