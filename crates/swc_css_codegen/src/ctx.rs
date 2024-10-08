use std::ops::{Deref, DerefMut};

use crate::{writer::CssWriter, CodeGenerator};

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
    pub allow_to_lowercase: bool,
    pub is_dimension_unit: bool,
    pub in_single_line_selectors: bool,
    pub in_list_of_component_values: bool,
}

pub(super) struct WithCtx<'w, I: 'w + CssWriter> {
    inner: &'w mut CodeGenerator<I>,
    orig_ctx: Ctx,
}

impl<I: CssWriter> Deref for WithCtx<'_, I> {
    type Target = CodeGenerator<I>;

    fn deref(&self) -> &CodeGenerator<I> {
        self.inner
    }
}
impl<I: CssWriter> DerefMut for WithCtx<'_, I> {
    fn deref_mut(&mut self) -> &mut CodeGenerator<I> {
        self.inner
    }
}

impl<I: CssWriter> Drop for WithCtx<'_, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
