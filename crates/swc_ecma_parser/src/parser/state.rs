use std::ops::{Deref, DerefMut};

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{BytePos, Span};

use crate::{input::Tokens, Parser};

#[derive(Clone)]
pub struct State {
    pub labels: Vec<Atom>,
    /// Start position of an assignment expression that can become an arrow.
    ///
    /// `BytePos::SYNTHESIZED` is reserved outside real source positions, so it
    /// works as the no-potential-arrow sentinel without the extra `Option`
    /// branch on expression parser hot paths.
    pub potential_arrow_start: BytePos,
    /// First `await` binding parsed by the cover grammar while an enclosing
    /// `async (...)` construct may still become an async arrow.
    pub pending_async_arrow_param_await: Option<Span>,
    /// Whether arrow bindings should be checked for the pending async arrow.
    pub collect_async_arrow_param_await: bool,
    /// Start position of an AST node and the span of its trailing comma.
    pub trailing_commas: FxHashMap<BytePos, Span>,
}

impl Default for State {
    fn default() -> Self {
        State {
            labels: Default::default(),
            potential_arrow_start: BytePos::SYNTHESIZED,
            pending_async_arrow_param_await: None,
            collect_async_arrow_param_await: false,
            trailing_commas: Default::default(),
        }
    }
}

pub struct WithState<'w, I: Tokens> {
    pub(super) inner: &'w mut Parser<I>,
    pub(super) orig_state: State,
}

impl<I: Tokens> Deref for WithState<'_, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<I: Tokens> DerefMut for WithState<'_, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}

impl<I: Tokens> Drop for WithState<'_, I> {
    fn drop(&mut self) {
        std::mem::swap(self.inner.state_mut(), &mut self.orig_state);
    }
}
