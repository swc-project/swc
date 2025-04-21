use super::Parser;
use crate::input::Tokens;

impl<I: Tokens> Parser<I> {
    pub fn input(&mut self) -> &mut I {
        &mut self.input.iter
    }

    pub(crate) fn input_ref(&self) -> &I {
        &self.input.iter
    }
}
