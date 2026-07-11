//! Static token collection configuration.
//!
//! The generic configuration follows OXC's lexer config split. Calls on
//! [`NoTokens`] compile to no-ops, leaving no collection branch in the default
//! lexer hot loop.

use super::{
    byte_handlers::{self, ByteHandlers},
    PackedToken,
};

/// Compile-time lexer behavior used by the parser.
pub(crate) trait Config: Default + 'static {
    /// Whether this configuration retains tokens.
    const CAPTURE_TOKENS: bool;

    /// Byte dispatch table specialized for this configuration.
    fn byte_handlers(&self) -> &'static ByteHandlers<Self>
    where
        Self: Sized;

    /// Record a token after it has been accepted by the lexer.
    fn push(&mut self, token: PackedToken);

    /// Number of retained tokens, used by checkpoints.
    fn len(&self) -> usize;

    /// Restore the retained token length during rewind.
    fn truncate(&mut self, len: usize);

    /// Replace the most recently retained token after parser-directed re-lex.
    fn replace_last(&mut self, token: PackedToken);

    /// Return retained tokens after parsing.
    fn into_tokens(self) -> Vec<PackedToken>;
}

/// Default configuration with token collection compiled out.
#[derive(Clone, Copy, Default)]
pub(crate) struct NoTokens;

impl Config for NoTokens {
    const CAPTURE_TOKENS: bool = false;

    #[inline(always)]
    fn byte_handlers(&self) -> &'static ByteHandlers<Self> {
        &byte_handlers::NO_TOKENS
    }

    #[inline(always)]
    fn push(&mut self, _token: PackedToken) {}

    #[inline(always)]
    fn len(&self) -> usize {
        0
    }

    #[inline(always)]
    fn truncate(&mut self, len: usize) {
        debug_assert_eq!(len, 0);
    }

    #[inline(always)]
    fn replace_last(&mut self, _token: PackedToken) {}

    #[inline]
    fn into_tokens(self) -> Vec<PackedToken> {
        Vec::new()
    }
}

/// Opt-in configuration that retains packed tokens in source order.
#[derive(Default)]
pub(crate) struct WithTokens {
    tokens: Vec<PackedToken>,
}

impl WithTokens {
    /// Create a token sink with an estimated capacity.
    pub(crate) fn with_capacity(capacity: usize) -> Self {
        Self {
            tokens: Vec::with_capacity(capacity),
        }
    }
}

impl Config for WithTokens {
    const CAPTURE_TOKENS: bool = true;

    #[inline(always)]
    fn byte_handlers(&self) -> &'static ByteHandlers<Self> {
        &byte_handlers::WITH_TOKENS
    }

    #[inline(always)]
    fn push(&mut self, token: PackedToken) {
        self.tokens.push(token);
    }

    #[inline(always)]
    fn len(&self) -> usize {
        self.tokens.len()
    }

    #[inline(always)]
    fn truncate(&mut self, len: usize) {
        self.tokens.truncate(len);
    }

    #[inline(always)]
    fn replace_last(&mut self, token: PackedToken) {
        let last = self
            .tokens
            .last_mut()
            .expect("re-lex requires a previously emitted token");
        debug_assert_eq!(last.start(), token.start());
        *last = token;
    }

    #[inline]
    fn into_tokens(self) -> Vec<PackedToken> {
        self.tokens
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{BytePos, Span};

    use super::{Config, NoTokens, WithTokens};
    use crate::{lexer::Token as Kind, next::lexer::PackedToken};

    fn token(start: u32) -> PackedToken {
        PackedToken::new(
            Kind::Ident,
            Span::new_with_checked(BytePos(start), BytePos(start + 1)),
            false,
            false,
        )
    }

    #[test]
    fn no_tokens_does_not_retain_values() {
        let mut config = NoTokens;
        config.push(token(1));
        config.truncate(0);
        assert_eq!(config.len(), 0);
        assert!(config.into_tokens().is_empty());
    }

    #[test]
    fn with_tokens_rewinds_by_length() {
        let mut config = WithTokens::with_capacity(2);
        config.push(token(1));
        let checkpoint = config.len();
        config.push(token(2));
        config.truncate(checkpoint);

        let tokens = config.into_tokens();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].start(), BytePos(1));
    }
}
