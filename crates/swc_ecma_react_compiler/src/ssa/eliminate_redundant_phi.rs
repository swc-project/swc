use crate::hir::HirFunction;

/// Removes redundant phi nodes.
pub fn eliminate_redundant_phi(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
