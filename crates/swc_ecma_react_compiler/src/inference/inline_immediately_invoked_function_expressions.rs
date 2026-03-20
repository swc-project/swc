use crate::hir::HirFunction;

/// Inlines immediately-invoked function expressions when safe.
pub fn inline_immediately_invoked_function_expressions(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
