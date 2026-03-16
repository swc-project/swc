use crate::hir::HirFunction;

/// Prunes known throw-only instructions.
pub fn prune_maybe_throws(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Runs constant propagation.
pub fn constant_propagation(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Runs dead-code elimination.
pub fn dead_code_elimination(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Optimizes props method calls.
pub fn optimize_props_method_calls(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// SSR-specific optimizations.
pub fn optimize_for_ssr(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Placeholder for outlined JSX lowering.
pub fn outline_jsx(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}

/// Placeholder for outlined function extraction.
pub fn outline_functions(_hir: &mut HirFunction) {
    // Intentionally a no-op in the first Rust port stage.
}
