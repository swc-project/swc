use std::ops::{Deref, DerefMut};

use crate::{writer::XmlWriter, CodeGenerator};

impl<'b, W> CodeGenerator<'b, W>
where
    W: XmlWriter,
{
    /// Original context is restored when returned guard is dropped.
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_, 'b, W> {
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
    pub need_escape_text: bool,
}

pub(super) struct WithCtx<'w, 'a, I: 'w + XmlWriter> {
    inner: &'w mut CodeGenerator<'a, I>,
    orig_ctx: Ctx,
}

impl<'w, I: XmlWriter> Deref for WithCtx<'_, 'w, I> {
    type Target = CodeGenerator<'w, I>;

    fn deref(&self) -> &CodeGenerator<'w, I> {
        self.inner
    }
}
impl<'w, I: XmlWriter> DerefMut for WithCtx<'_, 'w, I> {
    fn deref_mut(&mut self) -> &mut CodeGenerator<'w, I> {
        self.inner
    }
}

impl<I: XmlWriter> Drop for WithCtx<'_, '_, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
