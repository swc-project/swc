use crate::hir::HirFunction;

/// Performs type inference.
pub fn infer_types(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Performs function-level aliasing and dependency analysis.
pub fn analyse_functions(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Infers reactive places used by memoization logic.
pub fn infer_reactive_places(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Infers mutable aliasing effects.
pub fn infer_mutation_aliasing_effects(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Infers mutable aliasing ranges.
pub fn infer_mutation_aliasing_ranges(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}
