//! Token cursor, expectation helpers, and checkpoint rewind.

use swc_atoms::Wtf8Atom;
use swc_common::BytePos;

use super::context::Context;
use crate::{
    error::{Error, SyntaxError},
    lexer::Token as Kind,
    next::lexer::{
        config::Config,
        core::{Lexer, LexerCheckpoint},
        PackedToken,
    },
};

/// Parser state restored after speculative parsing.
pub(crate) struct ParserCheckpoint {
    lexer: LexerCheckpoint,
    token: PackedToken,
    previous_end: BytePos,
    context: Context,
    diagnostics_len: usize,
    fatal_error: Option<Error>,
}

/// Recursive-descent parser cursor over the independent lexer.
pub(crate) struct Parser<'a, C: Config> {
    lexer: Lexer<'a, C>,
    token: PackedToken,
    previous_end: BytePos,
    context: Context,
    diagnostics: Vec<Error>,
    fatal_error: Option<Error>,
}

impl<'a, C: Config> Parser<'a, C> {
    /// Create a parser and read its first token.
    pub(crate) fn new(mut lexer: Lexer<'a, C>, context: Context) -> Self {
        let token = lexer.next_token();
        Self {
            lexer,
            token,
            previous_end: token.start(),
            context,
            diagnostics: Vec::new(),
            fatal_error: None,
        }
    }

    /// Current token.
    #[inline(always)]
    pub(crate) fn token(&self) -> PackedToken {
        self.token
    }

    /// Current token kind.
    #[inline(always)]
    pub(crate) fn kind(&self) -> Kind {
        self.token.kind()
    }

    /// Borrow source text for a token from the lexer's immutable input.
    #[inline(always)]
    pub(crate) fn token_source(&self, token: PackedToken) -> &'a str {
        self.lexer.token_source(token)
    }

    /// Decoded string value retained only for escaped string tokens.
    pub(crate) fn escaped_string(&self, token: PackedToken) -> Option<&Wtf8Atom> {
        self.lexer.escaped_string(token)
    }

    /// Reinterpret the current slash token as a regular expression literal.
    #[inline]
    pub(crate) fn re_lex_regex(&mut self) -> PackedToken {
        self.token = self.lexer.re_lex_regex();
        self.token
    }

    /// Reinterpret the current closing brace as a template middle or tail.
    #[inline]
    pub(crate) fn re_lex_template_substitution_tail(&mut self) -> PackedToken {
        self.token = self.lexer.re_lex_template_substitution_tail();
        self.token
    }

    /// End of the previously consumed token.
    #[inline(always)]
    pub(crate) fn previous_end(&self) -> BytePos {
        self.previous_end
    }

    /// Current grammar context.
    #[inline(always)]
    pub(crate) fn context(&self) -> Context {
        self.context
    }

    /// Whether the current token has `kind`.
    #[inline(always)]
    pub(crate) fn at(&self, kind: Kind) -> bool {
        self.kind() == kind
    }

    /// Whether the current token can be used as an identifier reference in
    /// the current JavaScript migration stage.
    #[inline(always)]
    pub(crate) fn at_identifier_reference(&self) -> bool {
        self.at(Kind::Ident) || self.kind().is_known_ident()
    }

    /// Whether the current token is an IdentifierName, including keywords.
    #[inline(always)]
    pub(crate) fn at_identifier_name(&self) -> bool {
        self.kind().is_word()
    }

    /// Consume the current token and read the next token.
    #[inline]
    pub(crate) fn advance(&mut self) {
        self.previous_end = self.token.end();
        self.token = self.lexer.next_token();
    }

    /// Consume `kind` when present.
    #[inline]
    pub(crate) fn eat(&mut self, kind: Kind) -> bool {
        if !self.at(kind) {
            return false;
        }
        self.advance();
        true
    }

    /// Require `kind`, recording one fatal diagnostic on mismatch.
    #[inline]
    pub(crate) fn expect(&mut self, kind: Kind) -> bool {
        if self.at(kind) {
            self.advance();
            true
        } else {
            self.expect_failure(kind);
            false
        }
    }

    #[cold]
    #[inline(never)]
    fn expect_failure(&mut self, expected: Kind) {
        if self.fatal_error.is_none() {
            self.fatal_error = Some(Error::new(
                self.token.span(),
                SyntaxError::Expected(expected.to_string(), self.kind().to_string()),
            ));
        }
    }

    /// Save all state mutated by speculative grammar productions.
    pub(crate) fn checkpoint(&mut self) -> ParserCheckpoint {
        ParserCheckpoint {
            lexer: self.lexer.checkpoint(),
            token: self.token,
            previous_end: self.previous_end,
            context: self.context,
            diagnostics_len: self.diagnostics.len(),
            fatal_error: self.fatal_error.take(),
        }
    }

    /// Restore a speculative parse without cloning the lexer or diagnostics.
    pub(crate) fn rewind(&mut self, checkpoint: ParserCheckpoint) {
        self.lexer.rewind(checkpoint.lexer);
        self.token = checkpoint.token;
        self.previous_end = checkpoint.previous_end;
        self.context = checkpoint.context;
        self.diagnostics.truncate(checkpoint.diagnostics_len);
        self.fatal_error = checkpoint.fatal_error;
    }

    /// Run a lookahead and restore parser state afterward.
    pub(crate) fn lookahead<T>(&mut self, predicate: impl FnOnce(&mut Self) -> T) -> T {
        let checkpoint = self.checkpoint();
        let result = predicate(self);
        self.rewind(checkpoint);
        result
    }

    /// Run a production with temporary context flags.
    pub(crate) fn with_context<T>(
        &mut self,
        add: Context,
        remove: Context,
        production: impl FnOnce(&mut Self) -> T,
    ) -> T {
        let previous = self.context;
        self.context = previous.difference(remove).union(add);
        let result = production(self);
        self.context = previous;
        result
    }

    /// Recoverable diagnostics collected so far.
    pub(crate) fn diagnostics(&self) -> &[Error] {
        &self.diagnostics
    }

    /// Fatal diagnostic, if parsing cannot continue.
    pub(crate) fn fatal_error(&self) -> Option<&Error> {
        self.fatal_error.as_ref()
    }

    /// Record a recoverable grammar diagnostic.
    #[inline]
    pub(crate) fn emit_error(&mut self, error: Error) {
        self.diagnostics.push(error);
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;

    use super::Parser;
    use crate::{
        lexer::Token as Kind,
        next::{
            lexer::{config::NoTokens, core::Lexer},
            parser::context::Context,
        },
    };

    #[test]
    fn checkpoint_restores_token_and_context() {
        let lexer = Lexer::new("value + other", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        assert_eq!(parser.kind(), Kind::Ident);
        let checkpoint = parser.checkpoint();
        parser.advance();
        assert_eq!(parser.kind(), Kind::Plus);

        parser.rewind(checkpoint);
        assert_eq!(parser.kind(), Kind::Ident);
        assert_eq!(parser.context(), Context::default());
    }

    #[test]
    fn lookahead_does_not_commit_fatal_error() {
        let lexer = Lexer::new("value", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let is_call = parser.lookahead(|parser| parser.expect(Kind::LParen));

        assert!(!is_call);
        assert_eq!(parser.kind(), Kind::Ident);
        assert!(parser.fatal_error().is_none());
    }
}
