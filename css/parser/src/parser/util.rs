use super::{input::ParserInput, Ctx, PResult, Parser};
use std::ops::{Deref, DerefMut};
use swc_common::Span;

pub(crate) trait Block {
    type Content;

    fn from_content(span: Span, content: Self::Content) -> Self;
}

impl<I> Parser<I>
where
    I: ParserInput,
{
    /// TOOD: error recovery.
    pub(super) fn parse_block<F, Ret>(&mut self, op: F) -> PResult<Ret>
    where
        Ret: Block,
        F: FnOnce(&mut Parser<I>) -> PResult<Ret::Content>,
    {
        let span = self.input.cur_span()?;
        expect!(self, "{");

        let content = op(self)?;

        expect!(self, "}");

        Ok(Block::from_content(span!(self, span.lo), content))
    }

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

    #[inline]
    pub(super) fn parse_with<F, Ret>(&mut self, op: F) -> PResult<Ret>
    where
        F: for<'aa> FnOnce(&'aa mut Parser<I>) -> PResult<Ret>,
    {
        op(self)
    }
}

pub(super) struct WithCtx<'w, I: 'w + ParserInput> {
    inner: &'w mut Parser<I>,
    orig_ctx: Ctx,
}

impl<'w, I: ParserInput> Deref for WithCtx<'w, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        &self.inner
    }
}
impl<'w, I: ParserInput> DerefMut for WithCtx<'w, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        &mut self.inner
    }
}

impl<'w, I: ParserInput> Drop for WithCtx<'w, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
