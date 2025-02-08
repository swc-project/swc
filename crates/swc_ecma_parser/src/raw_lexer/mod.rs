mod error;
mod handler;
mod identifier;
mod number;
mod source;
mod string;
mod token;
mod unicode;

use error::RawLexResult;
use handlers::handler_from_byte;
use source::Source;
use token::{RawToken, RawTokenKind, RawTokenSpan, RawTokenValue};

use crate::error::{Error, SyntaxError};

pub struct RawLexer<'source> {
    source: Source<'source>,

    token_value: Option<RawTokenValue>,
}

impl<'source> RawLexer<'source> {
    pub fn new(source: &'source str) -> Self {
        Self {
            source: Source::new(source),
            token_value: None,
        }
    }

    pub fn read_next_token(&mut self) -> RawLexResult<RawToken> {
        let start = self.offset();

        let kind = match self.peek_byte() {
            Some(byte) => {
                let handler = handler_from_byte(byte);
                handler(self)?
            }
            None => RawTokenKind::Eof,
        };

        let end = self.offset();

        Ok(RawToken {
            kind,
            span: RawTokenSpan { start, end },
            value: if self.token_value.is_some() {
                self.token_value.take()
            } else {
                None
            },
            // TODO check is on new line?
            is_on_new_line: false,
        })
    }
}
