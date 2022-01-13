use crate::{writer::CssWriter, CodeGenerator};
use std::ops::{Deref, DerefMut};

impl<W> CodeGenerator<W>
where
    W: CssWriter,
{
    /// Original context is restored when returned guard is dropped.
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<W> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            orig_ctx,
            inner: self,
        }
    }
}

#[derive(Debug, Default, Clone, Copy)]
pub(crate) struct Ctx {
    pub semi_after_property: bool,
}

pub(super) struct WithCtx<'w, I: 'w + CssWriter> {
    inner: &'w mut CodeGenerator<I>,
    orig_ctx: Ctx,
}

impl<'w, I: CssWriter> Deref for WithCtx<'w, I> {
    type Target = CodeGenerator<I>;

    fn deref(&self) -> &CodeGenerator<I> {
        self.inner
    }
}
impl<'w, I: CssWriter> DerefMut for WithCtx<'w, I> {
    fn deref_mut(&mut self) -> &mut CodeGenerator<I> {
        self.inner
    }
}

impl<'w, I: CssWriter> Drop for WithCtx<'w, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
