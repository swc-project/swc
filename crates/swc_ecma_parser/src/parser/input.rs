use swc_ecma_lexer::input::Tokens;

use super::Parser;

impl<I: Tokens> Parser<I> {
    pub fn input(&mut self) -> &mut I {
        &mut self.input.iter
    }

    pub(crate) fn input_ref(&self) -> &I {
        &self.input.iter
    }
}
