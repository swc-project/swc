mod error;
mod handler;
mod identifier;
mod number;
mod source;
mod string;
mod token;
mod unicode;

use error::{Error, RawLexResult};
use handler::handler_from_byte;
use source::Source;
pub use token::{RawToken, RawTokenKind, RawTokenSpan, RawTokenValue};

#[derive(Clone)]
pub struct RawLexer<'source> {
    source: Source<'source>,

    token: RawToken,

    pub errors: Vec<Error>,
}

impl<'source> RawLexer<'source> {
    pub fn new(source: &'source str) -> Self {
        Self {
            source: Source::new(source),
            token: RawToken::first_default_token(),
            errors: Default::default(),
        }
    }

    pub fn read_next_token(&mut self) -> RawLexResult<RawToken> {
        loop {
            let start = self.offset();
            let kind = match self.peek_byte() {
                Some(byte) => {
                    let handler = handler_from_byte(byte);
                    handler(self)?
                }
                None => RawTokenKind::Eof,
            };

            if kind == RawTokenKind::Skip {
                continue;
            }

            let end = self.offset();
            return Ok(self.build_token(kind, start, end));
        }
    }

    /// Builds a new token with the given kind, start, and end positions.
    ///
    /// This method updates the current token's kind and span with the provided
    /// parameters and returns the updated token. The `std::mem::take` function
    /// is used to move the token out of the `self` context, effectively
    /// "taking" ownership of the token.
    fn build_token(&mut self, kind: RawTokenKind, start: u32, end: u32) -> RawToken {
        self.token.kind = kind;
        self.token.span = RawTokenSpan { start, end };

        std::mem::take(&mut self.token)
    }
}
