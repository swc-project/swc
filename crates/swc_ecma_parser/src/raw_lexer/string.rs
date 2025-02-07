// implement string literals parse
use super::RawLexer;
use crate::lexer::LexResult;

impl RawLexer<'_> {
    pub(super) fn read_string_literal(&mut self, terminal: u8) -> LexResult<String> {
        todo!()
    }
}
