use std::ops::{Deref, DerefMut};

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{BytePos, Span};

use crate::common::input::Tokens;

#[derive(Clone, Default)]
pub struct State {
    pub labels: Vec<Atom>,
    /// Start position of an assignment expression.
    pub potential_arrow_start: Option<BytePos>,
    /// Start position of an AST node and the span of its trailing comma.
    pub trailing_commas: FxHashMap<BytePos, Span>,
}

pub struct WithState<
    'w,
    TokenAndSpan,
    I: 'w + Tokens<TokenAndSpan>,
    Parser: super::Parser<TokenAndSpan, I>,
> {
    pub(super) inner: &'w mut Parser,
    pub(super) orig_state: crate::common::parser::state::State,
    pub(super) marker: std::marker::PhantomData<(TokenAndSpan, I)>,
}

impl<TokenAndSpan, I: Tokens<TokenAndSpan>, Parser: super::Parser<TokenAndSpan, I>> Deref
    for WithState<'_, TokenAndSpan, I, Parser>
{
    type Target = Parser;

    fn deref(&self) -> &Parser {
        self.inner
    }
}
impl<TokenAndSpan, I: Tokens<TokenAndSpan>, Parser: super::Parser<TokenAndSpan, I>> DerefMut
    for WithState<'_, TokenAndSpan, I, Parser>
{
    fn deref_mut(&mut self) -> &mut Parser {
        self.inner
    }
}

impl<TokenAndSpan, I: Tokens<TokenAndSpan>, Parser: super::Parser<TokenAndSpan, I>> Drop
    for WithState<'_, TokenAndSpan, I, Parser>
{
    fn drop(&mut self) {
        std::mem::swap(self.inner.state_mut(), &mut self.orig_state);
    }
}
