use super::*;

impl<'a, I: Input> Lexer<'a, I> {
    pub(super) fn read_jsx_token(&mut self) -> LexResult<Token> {
        unimplemented!("read_jsx_token")
    }

    pub(super) fn read_jsx_str(&mut self) -> LexResult<Token> {
        unimplemented!("read_jsx_str")
    }

    pub(super) fn read_jsx_word(&mut self) -> LexResult<Token> {
        unimplemented!("read_jsx_word")
    }
}
