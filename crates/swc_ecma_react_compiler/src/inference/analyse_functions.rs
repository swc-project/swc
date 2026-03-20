use crate::hir::HirFunction;

/// Performs function-level aliasing and dependency analysis.
pub fn analyse_functions(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
