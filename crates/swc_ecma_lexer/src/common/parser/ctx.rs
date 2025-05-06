use std::ops::{Deref, DerefMut};

use crate::common::context::Context;

pub struct WithCtx<'a, 'w, Parser: super::Parser<'a>> {
    pub(super) inner: &'w mut Parser,
    pub(super) orig_ctx: Context,
    pub(super) marker: std::marker::PhantomData<&'a ()>,
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
        self.inner.set_ctx(self.orig_ctx);
    }
}
