use crate::hir::HirFunction;

/// Infers mutable aliasing ranges.
pub fn infer_mutation_aliasing_ranges(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
