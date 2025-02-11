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

    token_value: Option<RawTokenValue>,

    is_on_new_line: bool,

    pub errors: Vec<Error>,
}

impl<'source> RawLexer<'source> {
    pub fn new(source: &'source str) -> Self {
        Self {
            source: Source::new(source),
            token_value: None,
            is_on_new_line: true,
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

            let end = self.offset();

            if kind == RawTokenKind::Skip {
                continue;
            }

            return Ok(RawToken {
                kind,
                span: RawTokenSpan { start, end },
                value: if self.token_value.is_some() {
                    self.token_value.take()
                } else {
                    None
                },
                is_on_new_line: if self.is_on_new_line {
                    std::mem::take(&mut self.is_on_new_line)
                } else {
                    false
                },
            });
        }
    }
}
