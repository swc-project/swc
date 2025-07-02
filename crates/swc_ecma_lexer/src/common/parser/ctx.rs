use std::ops::{Deref, DerefMut};

use crate::common::context::Context;

pub struct WithCtx<'a, 'w, Parser: super::Parser<'a>> {
    inner: &'w mut Parser,
    orig_ctx: Option<Context>,
    marker: std::marker::PhantomData<&'a ()>,
}

impl<'a, 'w, Parser: super::Parser<'a>> WithCtx<'a, 'w, Parser> {
    pub(super) fn new(inner: &'w mut Parser, ctx: Context) -> Self {
        let orig_ctx = inner.ctx();
        // TODO: add `assert!(ctx != orig_ctx)` to ensure no invalid operation.
        inner.set_ctx(ctx);
        WithCtx {
            inner,
            orig_ctx: Some(orig_ctx),
            marker: std::marker::PhantomData,
        }
    }

    pub(super) fn new_without_ctx(inner: &'w mut Parser) -> Self {
        WithCtx {
            inner,
            orig_ctx: None,
            marker: std::marker::PhantomData,
        }
    }
}

impl<'a, Parser: super::Parser<'a>> Deref for WithCtx<'a, '_, Parser> {
    type Target = Parser;

    fn deref(&self) -> &Parser {
        self.inner
    }
}

impl<'a, Parser: super::Parser<'a>> DerefMut for WithCtx<'a, '_, Parser> {
    fn deref_mut(&mut self) -> &mut Parser {
        self.inner
    }
}

impl<'a, Parser: super::Parser<'a>> Drop for WithCtx<'a, '_, Parser> {
    fn drop(&mut self) {
        if let Some(orig_ctx) = self.orig_ctx.take() {
            self.inner.set_ctx(orig_ctx);
        }
    }
}
