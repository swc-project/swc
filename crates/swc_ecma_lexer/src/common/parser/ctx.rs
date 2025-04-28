use std::ops::{Deref, DerefMut};

use crate::common::{context::Context, input::Tokens};

pub struct WithCtx<
    'w,
    TokenAndSpan,
    I: 'w + Tokens<TokenAndSpan>,
    Parser: super::Parser<TokenAndSpan, I>,
> {
    pub(super) inner: &'w mut Parser,
    pub(super) orig_ctx: Context,
    pub(super) marker: std::marker::PhantomData<(TokenAndSpan, I)>,
}
impl<TokenAndSpan, I: Tokens<TokenAndSpan>, Parser: super::Parser<TokenAndSpan, I>> Deref
    for WithCtx<'_, TokenAndSpan, I, Parser>
{
    type Target = Parser;

    fn deref(&self) -> &Parser {
        self.inner
    }
}
impl<TokenAndSpan, I: Tokens<TokenAndSpan>, Parser: super::Parser<TokenAndSpan, I>> DerefMut
    for WithCtx<'_, TokenAndSpan, I, Parser>
{
    fn deref_mut(&mut self) -> &mut Parser {
        self.inner
    }
}

impl<TokenAndSpan, I: Tokens<TokenAndSpan>, Parser: super::Parser<TokenAndSpan, I>> Drop
    for WithCtx<'_, TokenAndSpan, I, Parser>
{
    fn drop(&mut self) {
        self.inner.set_ctx(self.orig_ctx);
    }
}
