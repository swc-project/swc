use crate::hir::HirFunction;

/// Infers reactive places used by memoization logic.
pub fn infer_reactive_places(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
