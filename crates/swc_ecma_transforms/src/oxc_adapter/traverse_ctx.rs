/// TraverseCtx provides context for SWC transformers using the VisitMutHook
/// pattern.
///
/// This type is designed to be compatible with the OXC transformer architecture
/// while working within SWC's ecosystem. It provides:
///
/// - Scope and semantic information
/// - Helper methods for common transformations
/// - State management across transform passes
///
/// # Example
///
/// ```rust,ignore
/// use swc_ecma_ast::*;
/// use swc_ecma_hooks::VisitMutHook;
/// use swc_ecma_transforms::oxc_adapter::TraverseCtx;
///
/// struct MyTransform;
///
/// impl VisitMutHook<TraverseCtx> for MyTransform {
///     fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TraverseCtx) {
///         // Use context to transform expressions
///     }
/// }
/// ```
#[derive(Debug)]
pub struct TraverseCtx {
    /// Depth of traversal in the AST
    depth: usize,

    /// Custom state that can be used by transformers
    /// This allows transformers to maintain state across visits
    state: TraverseState,
}

/// State that can be shared across different transformers
#[derive(Debug, Default)]
pub struct TraverseState {
    /// Counter for generating unique variable names
    var_counter: usize,
}

impl TraverseCtx {
    /// Creates a new TraverseCtx
    pub fn new() -> Self {
        Self {
            depth: 0,
            state: TraverseState::default(),
        }
    }

    /// Gets the current depth in the AST
    pub fn depth(&self) -> usize {
        self.depth
    }

    /// Increments the depth counter (called when entering a node)
    pub(crate) fn enter_node(&mut self) {
        self.depth += 1;
    }

    /// Decrements the depth counter (called when exiting a node)
    pub(crate) fn exit_node(&mut self) {
        self.depth = self.depth.saturating_sub(1);
    }

    /// Generates a unique variable name
    ///
    /// This is useful for creating temporary variables during transformations
    ///
    /// # Example
    ///
    /// ```rust,ignore
    /// let temp_var = ctx.generate_unique_name("temp");
    /// // Returns: "temp_0", "temp_1", etc.
    /// ```
    pub fn generate_unique_name(&mut self, base: &str) -> String {
        let counter = self.state.var_counter;
        self.state.var_counter += 1;
        format!("{}_{}", base, counter)
    }

    /// Resets the context state
    ///
    /// This should be called between different transform passes
    pub fn reset(&mut self) {
        self.depth = 0;
        self.state.var_counter = 0;
    }
}

impl Default for TraverseCtx {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_traverse_ctx_new() {
        let ctx = TraverseCtx::new();
        assert_eq!(ctx.depth(), 0);
    }

    #[test]
    fn test_depth_tracking() {
        let mut ctx = TraverseCtx::new();
        assert_eq!(ctx.depth(), 0);

        ctx.enter_node();
        assert_eq!(ctx.depth(), 1);

        ctx.enter_node();
        assert_eq!(ctx.depth(), 2);

        ctx.exit_node();
        assert_eq!(ctx.depth(), 1);

        ctx.exit_node();
        assert_eq!(ctx.depth(), 0);
    }

    #[test]
    fn test_unique_name_generation() {
        let mut ctx = TraverseCtx::new();

        let name1 = ctx.generate_unique_name("temp");
        assert_eq!(name1, "temp_0");

        let name2 = ctx.generate_unique_name("temp");
        assert_eq!(name2, "temp_1");

        let name3 = ctx.generate_unique_name("var");
        assert_eq!(name3, "var_2");
    }

    #[test]
    fn test_reset() {
        let mut ctx = TraverseCtx::new();

        ctx.enter_node();
        ctx.enter_node();
        let _ = ctx.generate_unique_name("temp");
        let _ = ctx.generate_unique_name("temp");

        assert_eq!(ctx.depth(), 2);

        ctx.reset();

        assert_eq!(ctx.depth(), 0);
        let name = ctx.generate_unique_name("temp");
        assert_eq!(name, "temp_0");
    }
}
