use crate::hir::HirFunction;

/// Rewrites instruction kinds after mutable reassignment analysis.
pub fn rewrite_instruction_kinds_based_on_reassignment(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
