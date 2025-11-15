//! Transform context shared across all hooks.

use swc_common::{comments::Comments, SourceMap, SourceMapper, Span};

/// Context passed through all transform hooks.
///
/// This struct contains shared state and utilities that are available to all
/// transforms during the AST traversal. It provides access to the source map,
/// comments, and other common functionality needed by transforms.
///
/// # Example
///
/// ```rust,ignore
/// impl VisitMutHook<TransformCtx<'_>> for MyTransform {
///     fn enter_program(&mut self, node: &mut Program, ctx: &mut TransformCtx) {
///         // Access source map
///         let span = ctx.source_map.span_to_snippet(node.span());
///
///         // Use helper methods
///         ctx.mark_changed();
///     }
/// }
/// ```
pub struct TransformCtx<'a> {
    /// Source map for span operations.
    pub source_map: &'a SourceMap,

    /// Comments associated with the source.
    pub comments: Option<&'a dyn Comments>,

    /// Tracks whether any transform has modified the AST.
    changed: bool,
}

impl<'a> TransformCtx<'a> {
    /// Creates a new transform context.
    ///
    /// # Arguments
    ///
    /// * `source_map` - Reference to the source map
    /// * `comments` - Optional comments
    pub fn new(source_map: &'a SourceMap, comments: Option<&'a dyn Comments>) -> Self {
        Self {
            source_map,
            comments,
            changed: false,
        }
    }

    /// Marks that a transform has modified the AST.
    ///
    /// This can be used by transforms to indicate they've made changes,
    /// which may be useful for optimization passes that only need to run
    /// when changes occur.
    pub fn mark_changed(&mut self) {
        self.changed = true;
    }

    /// Returns whether any transform has modified the AST.
    pub fn has_changed(&self) -> bool {
        self.changed
    }

    /// Resets the changed flag.
    pub fn reset_changed(&mut self) {
        self.changed = false;
    }

    /// Gets the snippet of source code for a given span.
    ///
    /// Returns `None` if the span is not valid or the snippet cannot be
    /// extracted.
    pub fn span_to_snippet(&self, span: Span) -> Option<String> {
        self.source_map
            .span_to_snippet(span)
            .ok()
            .map(|s| s.to_string())
    }
}
