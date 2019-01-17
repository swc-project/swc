use super::Handler;
use rustc_errors::{Diagnostic as RustcDiagnostic, Level};
pub use rustc_errors::{DiagnosticId, DiagnosticStyledString};
use std::fmt;
use MultiSpan;
use Span;

#[must_use]
pub struct Diagnostic {
    pub(crate) inner: Box<RustcDiagnostic>,
}

impl Diagnostic {
    #[inline(always)]
    pub fn new(level: Level, msg: &str) -> Self {
        Self::new_with_code(level, None, msg)
    }

    #[inline(always)]
    pub fn new_with_code(level: Level, code: Option<DiagnosticId>, msg: &str) -> Self {
        Diagnostic {
            inner: Box::new(RustcDiagnostic::new_with_code(level, code, msg)),
        }
    }

    #[inline(always)]
    pub fn new_note(msg: &str) -> Self {
        Self::new(Level::Note, msg)
    }

    #[inline(always)]
    pub fn new_warn(msg: &str) -> Self {
        Self::new(Level::Warning, msg)
    }

    #[inline(always)]
    pub fn new_error(msg: &str) -> Self {
        Self::new(Level::Error, msg)
    }

    #[inline(always)]
    pub fn new_fatal(msg: &str) -> Self {
        Self::new(Level::Fatal, msg)
    }

    #[inline(always)]
    pub fn emit_to(self, handler: &Handler) {
        handler.emit(self)
    }

    /// Cancel the diagnostic (a structured diagnostic must either be emitted or
    /// canceled or it will panic when dropped).
    #[inline(always)]
    pub fn cancel(mut self) -> Self {
        self.inner.cancel();
        self
    }
    pub fn cancelled(&self) -> bool {
        self.inner.cancelled()
    }

    /// Add a span/label to be included in the resulting snippet.
    /// This is pushed onto the `MultiSpan` that was created when the
    /// diagnostic was first built. If you don't call this function at
    /// all, and you just supplied a `Span` to create the diagnostic,
    /// then the snippet will just include that `Span`, which is
    /// called the primary span.
    #[inline(always)]
    pub fn span_label<T: Into<String>>(mut self, span: Span, label: T) -> Self {
        self.inner.span_label(span, label.into());
        self
    }

    #[inline(always)]
    pub fn note_expected_found(
        mut self,
        label: &fmt::Display,
        expected: DiagnosticStyledString,
        found: DiagnosticStyledString,
    ) -> Self {
        self.inner.note_expected_found(label, expected, found);
        self
    }

    #[inline(always)]
    pub fn note_expected_found_extra(
        mut self,
        label: &fmt::Display,
        expected: DiagnosticStyledString,
        found: DiagnosticStyledString,
        expected_extra: &fmt::Display,
        found_extra: &fmt::Display,
    ) -> Self {
        self.inner
            .note_expected_found_extra(label, expected, found, expected_extra, found_extra);
        self
    }

    #[inline(always)]
    pub fn note(mut self, msg: &str) -> Self {
        self.inner.note(msg);
        self
    }

    // pub fn highlighted_note(mut self, msg: Vec<(String, Style)>) -> Self {
    //     self.inner.highlighted_note(msg);
    //     self
    // }

    #[inline(always)]
    pub fn span_note<S: Into<MultiSpan>>(mut self, sp: S, msg: &str) -> Self {
        self.inner.span_note(sp, msg);
        self
    }

    #[inline(always)]
    pub fn warn(mut self, msg: &str) -> Self {
        self.inner.warn(msg);
        self
    }

    #[inline(always)]
    pub fn span_warn<S: Into<MultiSpan>>(mut self, sp: S, msg: &str) -> Self {
        self.inner.span_warn(sp, msg);
        self
    }

    #[inline(always)]
    pub fn help(mut self, msg: &str) -> Self {
        self.inner.help(msg);
        self
    }

    #[inline(always)]
    pub fn span_help<S: Into<MultiSpan>>(mut self, sp: S, msg: &str) -> Self {
        self.inner.span_help(sp, msg);
        self
    }

    /// Prints out a message with a suggested edit of the code. If the
    /// suggestion is presented inline it will only show the text message
    /// and not the text.
    ///
    /// See `CodeSuggestion` for more information.
    #[inline(always)]
    pub fn span_suggestion_short(mut self, sp: Span, msg: &str, suggestion: String) -> Self {
        self.inner.span_suggestion_short(sp, msg, suggestion);
        self
    }

    /// Prints out a message with a suggested edit of the code.
    ///
    /// In case of short messages and a simple suggestion,
    /// rustc displays it as a label like
    ///
    /// "try adding parentheses: `(tup.0).1`"
    ///
    /// The message
    ///
    /// * should not end in any punctuation (a `:` is added automatically)
    /// * should not be a question
    /// * should not contain any parts like "the following", "as shown"
    /// * may look like "to do xyz, use" or "to do xyz, use abc"
    /// * may contain a name of a function, variable or type, but not whole
    /// expressions
    ///
    /// See `CodeSuggestion` for more information.
    #[inline(always)]
    pub fn span_suggestion(mut self, sp: Span, msg: &str, suggestion: String) -> Self {
        self.inner.span_suggestion(sp, msg, suggestion);
        self
    }

    /// Prints out a message with multiple suggested edits of the code.
    #[inline(always)]
    pub fn span_suggestions(mut self, sp: Span, msg: &str, suggestions: Vec<String>) -> Self {
        self.inner.span_suggestions(sp, msg, suggestions);
        self
    }

    #[inline(always)]
    pub fn span<S: Into<MultiSpan>>(mut self, sp: S) -> Self {
        self.inner.set_span(sp);
        self
    }

    #[inline(always)]
    pub fn code(mut self, s: DiagnosticId) -> Self {
        self.inner.code(s);
        self
    }

    // /// Used by a lint. Copies over all details *but* the "main
    // /// message".
    // pub fn copy_details_not_message(mut self, from: &Diagnostic) {
    //     self.span = from.span.clone();
    //     self.code = from.code.clone();
    //     self.children.extend(from.children.iter().cloned())
    // }
}

impl From<RustcDiagnostic> for Diagnostic {
    #[inline(always)]
    fn from(inner: RustcDiagnostic) -> Self {
        Diagnostic {
            inner: Box::new(inner),
        }
    }
}
