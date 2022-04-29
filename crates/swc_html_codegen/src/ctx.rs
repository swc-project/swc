use std::ops::{Deref, DerefMut};

use crate::{writer::HtmlWriter, CodeGenerator};

impl<W> CodeGenerator<W>
where
    W: HtmlWriter,
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
    pub skip_escape_text: bool,
}

pub(super) struct WithCtx<'w, I: 'w + HtmlWriter> {
    inner: &'w mut CodeGenerator<I>,
    orig_ctx: Ctx,
}

impl<'w, I: HtmlWriter> Deref for WithCtx<'w, I> {
    type Target = CodeGenerator<I>;

    fn deref(&self) -> &CodeGenerator<I> {
        self.inner
    }
}
impl<'w, I: HtmlWriter> DerefMut for WithCtx<'w, I> {
    fn deref_mut(&mut self) -> &mut CodeGenerator<I> {
        self.inner
    }
}

impl<'w, I: HtmlWriter> Drop for WithCtx<'w, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
