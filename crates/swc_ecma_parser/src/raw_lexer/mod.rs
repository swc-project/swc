mod context;
mod error;
mod identifier;
mod jsx;
mod number;
mod primary;
mod source;
mod string;
mod template;
mod token;
mod unicode;

use context::RawLexerContext;
use error::{Error, RawLexResult};
use jsx::is_jsx;
use source::Source;
pub use token::{RawToken, RawTokenKind, RawTokenSpan, RawTokenValue};

use crate::{EsSyntax, Syntax, TsSyntax};

pub type ByteHandler = for<'source> fn(&mut RawLexer<'source>) -> RawLexResult<RawTokenKind>;

#[derive(Clone)]
pub struct RawLexer<'source> {
    source: Source<'source>,

    token: RawToken,

    context: RawLexerContext,

    syntax: Syntax,

    pub errors: Vec<Error>,
}

impl<'source> RawLexer<'source> {
    pub fn new(source: &'source str, syntax: Syntax) -> Self {
        let context = if is_jsx(&syntax) {
            RawLexerContext::Jsx
        } else {
            Default::default()
        };

        Self {
            syntax,
            context,
            source: Source::new(source),
            token: RawToken::first_default_token(),
            errors: Default::default(),
        }
    }

    pub fn read_next_token(&mut self) -> RawLexResult<RawToken> {
        loop {
            let start = self.offset();
            let kind = self.read_next_token_kind()?;

            if kind == RawTokenKind::Skip || kind == RawTokenKind::WhiteSpace {
                continue;
            }

            let end = self.offset();
            return Ok(self.build_token(kind, start, end));
        }
    }

    fn read_next_token_kind(&mut self) -> RawLexResult<RawTokenKind> {
        match self.peek_byte() {
            Some(byte) => {
                let handler = self.handler_from_byte(byte);
                handler(self)
            }
            None => Ok(RawTokenKind::Eof),
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
