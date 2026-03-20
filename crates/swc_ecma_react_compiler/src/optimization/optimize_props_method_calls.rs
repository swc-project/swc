use crate::hir::HirFunction;

/// Optimizes props method calls.
pub fn optimize_props_method_calls(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
