use swc_atoms::Atom;
use swc_common::{
    errors::{DiagnosticBuilder, Handler, Level},
    Span,
};

/// Error severity level.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Severity {
    /// Non-fatal warning.
    Warning,
    /// Recoverable parse error.
    Error,
    /// Fatal parse error.
    Fatal,
}

/// Parser error code.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[non_exhaustive]
pub enum ErrorCode {
    /// Unexpected end of file.
    Eof,
    /// Unexpected token.
    UnexpectedToken,
    /// Invalid or unsupported assignment target.
    InvalidAssignTarget,
    /// Invalid statement in the current context.
    InvalidStatement,
    /// Import/export used in script context.
    ImportExportInScript,
    /// Unterminated string literal.
    UnterminatedString,
    /// Unterminated block comment.
    UnterminatedBlockComment,
    /// Invalid numeric literal.
    InvalidNumber,
    /// Invalid escape sequence.
    InvalidEscape,
    /// Invalid identifier.
    InvalidIdentifier,
    /// Return statement outside function body.
    ReturnOutsideFunction,
    /// Reserved word was used as an identifier.
    ReservedWord(Atom),
}

/// Parser error object.
#[derive(Debug, Clone, PartialEq)]
pub struct Error {
    span: Span,
    severity: Severity,
    code: ErrorCode,
    message: String,
}

impl Error {
    /// Constructs a new parser error.
    pub fn new(
        span: Span,
        severity: Severity,
        code: ErrorCode,
        message: impl Into<String>,
    ) -> Self {
        Self {
            span,
            severity,
            code,
            message: message.into(),
        }
    }

    /// Returns the error span.
    pub fn span(&self) -> Span {
        self.span
    }

    /// Returns the severity.
    pub fn severity(&self) -> Severity {
        self.severity
    }

    /// Returns the code.
    pub fn code(&self) -> &ErrorCode {
        &self.code
    }

    /// Returns human-readable message.
    pub fn message(&self) -> &str {
        &self.message
    }

    /// Converts this error into an SWC diagnostic.
    pub fn into_diagnostic<'a>(self, handler: &'a Handler) -> DiagnosticBuilder<'a> {
        let mut diagnostic = DiagnosticBuilder::new(
            handler,
            match self.severity {
                Severity::Warning => Level::Warning,
                Severity::Error | Severity::Fatal => Level::Error,
            },
            &self.message,
        );
        diagnostic.set_span(self.span);
        diagnostic.note(&format!("code: {:?}", self.code));
        diagnostic
    }
}
