use crate::hir::HirFunction;

/// SSR-specific optimizations.
pub fn optimize_for_ssr(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
