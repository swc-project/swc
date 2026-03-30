use crate::hir::HirFunction;

/// Performs function-level aliasing and dependency analysis.
pub fn analyse_functions(hir: &mut HirFunction) {
    // This pass computes function capture sidecars used by later dependency
    // checks. Recompute full metadata to keep sidecars coherent after earlier
    // AST rewrites.
    hir.recompute_metadata();
}
