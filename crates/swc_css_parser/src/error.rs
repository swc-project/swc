use std::borrow::Cow;

use swc_atoms::JsWord;
use swc_common::{
    errors::{DiagnosticBuilder, Handler},
    Span,
};

/// Size is same as a size of a pointer.
#[derive(Debug, Clone, PartialEq)]
pub struct Error {
    inner: Box<(Span, ErrorKind)>,
}

impl Error {
    pub fn kind(&self) -> &ErrorKind {
        &self.inner.1
    }

    pub fn into_inner(self) -> Box<(Span, ErrorKind)> {
        self.inner
    }

    pub fn new(span: Span, kind: ErrorKind) -> Self {
        if cfg!(debug_assertions) && span.is_dummy() {
            panic!("parser should not create an error with dummy span")
        }
        Error {
            inner: Box::new((span, kind)),
        }
    }

    pub fn message(&self) -> Cow<'static, str> {
        match &self.inner.1 {
            ErrorKind::Eof => "Unexpected end of file".into(),
            ErrorKind::Ignore => "Not an error".into(),
            ErrorKind::UnexpectedChar(c) => format!("Unexpected character `{:?}`", c).into(),
            ErrorKind::UnterminatedUrl => "Unterminated url literal".into(),
            ErrorKind::InvalidEscape => "Invalid escape".into(),
            ErrorKind::Expected(s) => format!("Expected {}", s).into(),
            ErrorKind::ExpectedButGot(s) => format!("Expected {}", s).into(),
            ErrorKind::ExpectedSelectorText => "Expected a text for selector".into(),
            ErrorKind::UnterminatedBlockComment => "Unterminated block comment".into(),
            ErrorKind::InvalidCharsetAtRule => "Invalid @charset at-rule".into(),
            ErrorKind::InvalidTypeSelector => "Invalid type selector".into(),
            ErrorKind::InvalidSelector => "Invalid selector".into(),
            ErrorKind::InvalidAttrSelectorName => "Invalid attribute name".into(),
            ErrorKind::InvalidAttrSelectorMatcher => "Invalid attribute matcher".into(),
            ErrorKind::InvalidAttrSelectorMatcherValue => "Invalid attribute matcher value".into(),
            ErrorKind::InvalidAttrSelectorModifier => "Invalid attribute modifier".into(),
            ErrorKind::ExpectedNumber => "Expected a number".into(),
            ErrorKind::InvalidSupportQuery => "Invalid support query".into(),
            ErrorKind::InvalidMediaQuery => "Invalid media query".into(),
            ErrorKind::InvalidLayerBlockAtRule => "Invalid @layer block at-rule".into(),
            ErrorKind::UnknownAtRuleNotTerminated => "Unknown @rule is not terminated".into(),
            ErrorKind::InvalidDeclarationValue => "Expected a property value".into(),
            ErrorKind::InvalidAnPlusBMicrosyntax => "Invalid An+B microsyntax".into(),
            ErrorKind::InvalidCustomIdent(s) => format!(
                "The CSS-wide keywords are not valid custom ident, found '{}'",
                s
            )
            .into(),
            ErrorKind::InvalidKeyframesName(s) => {
                format!("{} is not valid name for keyframes", s).into()
            }
        }
    }

    pub fn to_diagnostics<'a>(&self, handler: &'a Handler) -> DiagnosticBuilder<'a> {
        handler.struct_span_err(self.inner.0, &self.message())
    }
}

#[derive(Debug, Clone, PartialEq)]
#[non_exhaustive]
pub enum ErrorKind {
    Eof,
    Ignore,
    /// Lexing error.
    UnexpectedChar(char),
    /// Lexing error.
    UnterminatedUrl,
    /// Lexing error
    InvalidEscape,
    Expected(&'static str),
    ExpectedButGot(&'static str),
    ExpectedSelectorText,
    UnterminatedBlockComment,
    InvalidCharsetAtRule,
    InvalidTypeSelector,
    InvalidSelector,
    InvalidDeclarationValue,
    InvalidAttrSelectorName,
    InvalidAttrSelectorMatcher,
    InvalidAttrSelectorMatcherValue,
    InvalidAttrSelectorModifier,
    ExpectedNumber,
    InvalidSupportQuery,
    InvalidLayerBlockAtRule,
    InvalidMediaQuery,
    InvalidAnPlusBMicrosyntax,
    InvalidCustomIdent(JsWord),
    InvalidKeyframesName(&'static str),

    UnknownAtRuleNotTerminated,
}
