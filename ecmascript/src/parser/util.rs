use super::*;
impl<I: Input> Parser<I> {
    /// Original context is restored when returned guard is dropped.
    pub(super) fn with_ctx(&mut self, ctx: Context) -> WithCtx<I> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            orig_ctx,
            inner: self,
        }
    }

    /// Original context is restored when returned guard is dropped.
    pub(super) fn include_in_expr(&mut self, include_in_expr: bool) -> WithCtx<I> {
        self.with_ctx(Context {
            include_in_expr,
            ..self.ctx
        })
    }

    /// Parse with given closure
    pub(super) fn parse_with<F, Ret>(&mut self, f: F) -> Ret
    where
        F: FnOnce(&mut Self) -> Ret,
    {
        f(self)
    }
}

pub trait ParseObject<Obj> {
    type Prop;
    fn make_object(span: Span, props: Vec<Self::Prop>) -> Obj;
    fn parse_object_prop(&mut self) -> PResult<Self::Prop>;
}

pub struct WithCtx<'a, I: 'a + Input> {
    inner: &'a mut Parser<I>,
    orig_ctx: Context,
}
impl<'a, I: Input> Deref for WithCtx<'a, I> {
    type Target = Parser<I>;
    fn deref(&self) -> &Parser<I> {
        &self.inner
    }
}
impl<'a, I: Input> DerefMut for WithCtx<'a, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        &mut self.inner
    }
}

impl<'a, I: Input> Drop for WithCtx<'a, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
