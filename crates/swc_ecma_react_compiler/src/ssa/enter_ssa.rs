use crate::hir::HirFunction;

/// Converts HIR into SSA form.
pub fn enter_ssa(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
