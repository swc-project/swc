use super::Parser;
use crate::{common::input::Tokens, token::TokenAndSpan};

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub fn input(&mut self) -> &mut I {
        &mut self.input.iter
    }

    pub(crate) fn input_ref(&self) -> &I {
        &self.input.iter
    }
}
