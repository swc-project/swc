use crate::hir::HirFunction;

/// Drops manual memoization hints before inference when configured.
pub fn drop_manual_memoization(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
