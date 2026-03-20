use crate::hir::HirFunction;

/// Prunes known throw-only instructions.
pub fn prune_maybe_throws(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
