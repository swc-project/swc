use std::ops::Add;

use super::RawLexer;
use crate::error::Error;

pub(super) type RawLexResult<T> = Result<T, Error>;

impl RawLexer<'_> {
    pub(super) fn error(&self, start: u32, end: u32, error: SyntaxError) -> RawLexResult<RawToken> {
        let span = swc_common::Span::new(swc_common::BytePos(start), swc_common::BytePos(end));
        Err(Error::new(span, error))
    }

    pub(super) fn error_with_single_byte(
        &self,
        start: u32,
        error: SyntaxError,
    ) -> RawLexResult<RawToken> {
        self.error(start, start.add(1), error)
    }
}
