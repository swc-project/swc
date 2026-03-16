use crate::hir::HirFunction;

/// Converts HIR into SSA form.
pub fn enter_ssa(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Removes redundant phi nodes.
pub fn eliminate_redundant_phi(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}
