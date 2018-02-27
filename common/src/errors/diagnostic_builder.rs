use super::Handler;
use {MultiSpan, Span};
use rustc_errors::{Diagnostic as RustcDiagnostic, DiagnosticBuilder as Builder, Level};
use rustc_errors::{DiagnosticId, DiagnosticStyledString};
use std::fmt;

#[must_use]
pub struct DiagnosticBuilder<'a> {
    db: Box<Builder<'a>>,
}

impl<'a> DiagnosticBuilder<'a> {
    pub fn new(handler: &'a Handler, level: Level, msg: &str) -> Self {
        Self::new_with_code(handler, level, None, msg)
    }

    pub fn new_with_code(
        handler: &'a Handler,
        level: Level,
        code: Option<DiagnosticId>,
        msg: &str,
    ) -> Self {
        DiagnosticBuilder {
            db: box Builder::new_diagnostic(
                &handler.inner,
                RustcDiagnostic::new_with_code(level, code, msg),
            ),
        }
    }

    pub fn emit(mut self) {
        self.db.emit()
    }

    /// Cancel the diagnostic (a structured diagnostic must either be emitted or
    /// canceled or it will panic when dropped).
    pub fn cancel(mut self) -> Self {
        self.db.cancel();
        self
    }
    pub fn cancelled(&self) -> bool {
        self.db.cancelled()
    }

    /// Add a span/label to be included in the resulting snippet.
    /// This is pushed onto the `MultiSpan` that was created when the
    /// diagnostic was first built. If you don't call this function at
    /// all, and you just supplied a `Span` to create the diagnostic,
    /// then the snippet will just include that `Span`, which is
    /// called the primary span.
    pub fn span_label<T: Into<String>>(mut self, span: Span, label: T) -> Self {
        self.db.span_label(span, label.into());
        self
    }

    pub fn note_expected_found(
        mut self,
        label: &fmt::Display,
        expected: DiagnosticStyledString,
        found: DiagnosticStyledString,
    ) -> Self {
        self.db.note_expected_found(label, expected, found);
        self
    }

    pub fn note_expected_found_extra(
        mut self,
        label: &fmt::Display,
        expected: DiagnosticStyledString,
        found: DiagnosticStyledString,
        expected_extra: &fmt::Display,
        found_extra: &fmt::Display,
    ) -> Self {
        self.db
            .note_expected_found_extra(label, expected, found, expected_extra, found_extra);
        self
    }

    pub fn note(mut self, msg: &str) -> Self {
        self.db.note(msg);
        self
    }

    // pub fn highlighted_note(mut self, msg: Vec<(String, Style)>) -> Self {
    //     self.db.highlighted_note(msg);
    //     self
    // }

    pub fn span_note<S: Into<MultiSpan>>(mut self, sp: S, msg: &str) -> Self {
        self.db.span_note(sp, msg);
        self
    }

    pub fn warn(mut self, msg: &str) -> Self {
        self.db.warn(msg);
        self
    }

    pub fn span_warn<S: Into<MultiSpan>>(mut self, sp: S, msg: &str) -> Self {
        self.db.span_warn(sp, msg);
        self
    }

    pub fn help(mut self, msg: &str) -> Self {
        self.db.help(msg);
        self
    }

    pub fn span_help<S: Into<MultiSpan>>(mut self, sp: S, msg: &str) -> Self {
        self.db.span_help(sp, msg);
        self
    }

    /// Prints out a message with a suggested edit of the code. If the suggestion is presented
    /// inline it will only show the text message and not the text.
    ///
    /// See `CodeSuggestion` for more information.
    pub fn span_suggestion_short(mut self, sp: Span, msg: &str, suggestion: String) -> Self {
        self.db.span_suggestion_short(sp, msg, suggestion);
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
    /// * may contain a name of a function, variable or type, but not whole expressions
    ///
    /// See `CodeSuggestion` for more information.
    pub fn span_suggestion(mut self, sp: Span, msg: &str, suggestion: String) -> Self {
        self.db.span_suggestion(sp, msg, suggestion);
        self
    }

    /// Prints out a message with multiple suggested edits of the code.
    pub fn span_suggestions(mut self, sp: Span, msg: &str, suggestions: Vec<String>) -> Self {
        self.db.span_suggestions(sp, msg, suggestions);
        self
    }

    pub fn span<S: Into<MultiSpan>>(mut self, sp: S) -> Self {
        self.db.set_span(sp);
        self
    }

    pub fn code(mut self, s: DiagnosticId) -> Self {
        self.db.code(s);
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

impl<'a> From<Builder<'a>> for DiagnosticBuilder<'a> {
    #[inline(always)]
    fn from(db: Builder<'a>) -> Self {
        DiagnosticBuilder { db: box db }
    }
}
