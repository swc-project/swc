use super::Parser;
use std::ops::{Deref, DerefMut};
use swc_common::input::Input;

#[derive(Debug, Default, Clone, Copy)]
pub(super) struct Ctx {
    pub in_asterisk: bool,
}

impl<I> Parser<I>
where
    I: Input,
{
    /// Original context is restored when returned guard is dropped.
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<I> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            orig_ctx,
            inner: self,
        }
    }
}

pub(super) struct WithCtx<'a, I>
where
    I: Input,
{
    orig_ctx: Ctx,
    inner: &'a mut Parser<I>,
}

impl<'w, I: Input> Deref for WithCtx<'w, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        &self.inner
    }
}
impl<'w, I: Input> DerefMut for WithCtx<'w, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        &mut self.inner
    }
}

impl<'w, I: Input> Drop for WithCtx<'w, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
