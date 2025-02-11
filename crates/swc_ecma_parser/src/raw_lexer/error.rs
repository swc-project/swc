use std::ops::Add;

use super::RawLexer;
pub use crate::error::Error;
use crate::error::SyntaxError;
pub(super) type RawLexResult<T> = Result<T, Error>;

impl RawLexer<'_> {
    pub(super) fn error<T>(&self, start: u32, end: u32, error: SyntaxError) -> RawLexResult<T> {
        let span =
            swc_common::Span::new(swc_common::BytePos(start + 1), swc_common::BytePos(end + 1));
        Err(Error::new(span, error))
    }

    pub(super) fn error_with_single_byte<T>(
        &self,
        start: u32,
        error: SyntaxError,
    ) -> RawLexResult<T> {
        self.error(start, start.add(1), error)
    }

    /// Accumulates an error without halting the parsing process.
    pub fn add_error(&mut self, start: u32, end: u32, error: SyntaxError) {
        let span =
            swc_common::Span::new(swc_common::BytePos(start + 1), swc_common::BytePos(end + 1));
        self.errors.push(Error::new(span, error));
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        // FIXME:
        self.errors.clone()
    }
}
