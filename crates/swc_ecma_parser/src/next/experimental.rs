//! Temporary entry point for parity testing the independent parser.

use swc_common::{BytePos, Span};
use swc_ecma_ast::Script;

use super::{
    lexer::{config::NoTokens, core::Lexer},
    parser::{context::Context, cursor::Parser as ParserImpl},
};
use crate::error::{Error, SyntaxError};

/// Independent OXC-derived parser under development.
///
/// This type is exposed under `unstable::next` only while grammar production
/// parity is being established. It does not call the reference parser.
pub struct Parser<'a> {
    source: &'a str,
    start_pos: BytePos,
}

impl<'a> Parser<'a> {
    /// Create an independent parser for JavaScript source.
    pub fn new(source: &'a str) -> Self {
        Self {
            source,
            start_pos: BytePos(1),
        }
    }

    /// Set the absolute position of the first source byte.
    #[must_use]
    pub fn with_start_pos(mut self, start_pos: BytePos) -> Self {
        self.start_pos = start_pos;
        self
    }

    /// Parse a JavaScript script using only the new engine.
    pub fn parse_script(self) -> Result<Script, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser = ParserImpl::new(lexer, Context::default());
        parser.parse_script()
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Decl, Stmt};

    use super::Parser;

    #[test]
    fn parses_without_reference_engine() {
        let script = Parser::new("const answer = 40 + 2;")
            .with_start_pos(BytePos(17))
            .parse_script()
            .unwrap();

        assert_eq!(script.span.lo, BytePos(17));
        assert!(matches!(script.body[0], Stmt::Decl(Decl::Var(_))));
    }
}
