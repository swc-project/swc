//! Transform context for passing state between hooks.

use std::{path::PathBuf, sync::Arc};

use swc_common::{
    errors::{DiagnosticBuilder, Handler},
    SourceMap, Span,
};

/// Context passed through transformer hooks.
///
/// This context holds shared state that is accessible to all hooks during
/// the transformation process, similar to oxc_transformer's TransformCtx.
pub struct TransformCtx {
    /// Path to the source file being transformed.
    pub source_path: PathBuf,

    /// The source text of the file being transformed.
    pub source_text: Arc<String>,

    /// Source map for generating accurate error messages and source locations.
    pub source_map: Arc<SourceMap>,

    /// Handler for diagnostics and errors.
    pub handler: Arc<Handler>,
}

impl TransformCtx {
    /// Creates a new transform context.
    ///
    /// # Arguments
    ///
    /// * `source_path` - The path to the source file
    /// * `source_text` - The source text of the file
    /// * `source_map` - The source map for location tracking
    /// * `handler` - The error handler for diagnostics
    pub fn new(
        source_path: PathBuf,
        source_text: Arc<String>,
        source_map: Arc<SourceMap>,
        handler: Arc<Handler>,
    ) -> Self {
        Self {
            source_path,
            source_text,
            source_map,
            handler,
        }
    }

    /// Emits an error diagnostic at the given span.
    ///
    /// # Arguments
    ///
    /// * `span` - The span where the error occurred
    /// * `message` - The error message
    pub fn emit_error(&self, span: Span, message: &str) {
        self.handler.struct_span_err(span, message).emit();
    }

    /// Creates a diagnostic builder for custom error reporting.
    ///
    /// # Arguments
    ///
    /// * `span` - The span where the diagnostic should be reported
    /// * `message` - The diagnostic message
    pub fn struct_span_err(&self, span: Span, message: &str) -> DiagnosticBuilder<'_> {
        self.handler.struct_span_err(span, message)
    }
}
