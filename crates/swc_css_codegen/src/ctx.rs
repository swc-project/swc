use std::ops::{Deref, DerefMut};

use crate::{writer::CssWriter, CodeGenerator};

impl<'a, W: CssWriter> CodeGenerator<'a, W> {
    /// Original context is restored when returned guard is dropped.
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'a, '_, W> {
        let orig_ctx = self.ctx;

        self.ctx = ctx;

        WithCtx {
            orig_ctx,
            inner: self,
        }
    }
}

#[derive(Debug, Default, Clone, Copy)]
pub(crate) struct Ctx {}

pub(super) struct WithCtx<'a, 'w, I: 'w + CssWriter> {
    inner: &'w mut CodeGenerator<'a, I>,
    orig_ctx: Ctx,
}

impl<'a, 'w, I: CssWriter> Deref for WithCtx<'a, 'w, I> {
    type Target = CodeGenerator<'a, I>;

    fn deref(&self) -> &CodeGenerator<'a, I> {
        self.inner
    }
}
impl<'a, 'w, I: CssWriter> DerefMut for WithCtx<'a, 'w, I> {
    fn deref_mut(&mut self) -> &mut CodeGenerator<'a, I> {
        self.inner
    }
}

impl<'a, 'w, I: CssWriter> Drop for WithCtx<'a, 'w, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
