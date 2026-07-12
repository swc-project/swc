//! Temporary entry point for parity testing the independent parser.

use swc_common::{BytePos, Span};
use swc_ecma_ast::{Module, Script};

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

    /// Parse a JavaScript module using only the new engine.
    pub fn parse_module(self) -> Result<Module, Error> {
        let lexer = Lexer::new(self.source, self.start_pos, NoTokens).ok_or_else(|| {
            Error::new(
                Span::new_with_checked(self.start_pos, self.start_pos),
                SyntaxError::Eof,
            )
        })?;
        let mut parser = ParserImpl::new(lexer, Context::default() | Context::MODULE);
        parser.parse_module()
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{BytePos, EqIgnoreSpan};
    use swc_ecma_ast::{Decl, Stmt};

    use super::Parser;
    use crate::{lexer::Lexer, EsSyntax, LegacyParser, StringInput, Syntax};

    fn assert_script_parity(source: &str) {
        let next = Parser::new(source).parse_script().unwrap();
        let start = BytePos(1);
        let end = start + BytePos(source.len() as u32);
        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..EsSyntax::default()
            }),
            Default::default(),
            StringInput::new(source, start, end),
            None,
        );
        let mut legacy = LegacyParser::new_from(lexer);
        let legacy = legacy.parse_script().unwrap();
        assert!(
            next.eq_ignore_span(&legacy),
            "independent AST differs from reference AST for {source}"
        );
    }

    #[test]
    fn parses_without_reference_engine() {
        let script = Parser::new("const answer = 40 + 2;")
            .with_start_pos(BytePos(17))
            .parse_script()
            .unwrap();

        assert_eq!(script.span.lo, BytePos(17));
        assert!(matches!(script.body[0], Stmt::Decl(Decl::Var(_))));
    }

    #[test]
    fn parses_module_without_reference_engine() {
        let module = Parser::new("export const answer = 42;")
            .parse_module()
            .unwrap();
        assert!(module.body[0].is_module_decl());
    }

    #[test]
    fn supported_javascript_ast_matches_reference_engine() {
        assert_script_parity(
            "const { value: [first = 1, ...rest] } = source; function* values(input) { yield* \
             input; }",
        );
        assert_script_parity(
            "class Counter extends Base { static initial = 1; constructor(value) { this.value = \
             value; } get current() { return this.value; } }",
        );
    }

    #[test]
    fn supported_jsx_ast_matches_reference_engine() {
        assert_script_parity(
            "const view = <App enabled value={answer}><Child /> text {item}</App>;",
        );
    }
}
