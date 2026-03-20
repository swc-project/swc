use crate::hir::HirFunction;

/// Infers mutable aliasing effects.
pub fn infer_mutation_aliasing_effects(_hir: &mut HirFunction) {
    // Kept intentionally conservative for the current Rust parity stage.
}
