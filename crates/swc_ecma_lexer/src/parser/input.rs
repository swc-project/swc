use super::Parser;
use crate::{common::input::Tokens, token::TokenAndSpan};

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    pub fn input(&mut self) -> &mut I {
        &mut self.input.iter
    }
}
