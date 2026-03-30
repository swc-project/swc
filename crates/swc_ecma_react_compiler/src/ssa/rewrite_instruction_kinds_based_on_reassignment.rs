use std::collections::HashSet;

use crate::hir::HirFunction;

/// Rewrites instruction kinds after mutable reassignment analysis.
///
/// The Rust port currently keeps this pass metadata-only to avoid changing
/// generated AST shapes until instruction-level HIR lowering is complete.
pub fn rewrite_instruction_kinds_based_on_reassignment(hir: &mut HirFunction) {
    if hir.metadata.declared_bindings.is_empty() {
        hir.recompute_metadata();
    }

    let mut reassigned = HashSet::<String>::new();

    for (name, writes) in &hir.metadata.write_indices {
        if writes.len() > 1 {
            reassigned.insert(name.clone());
        }
    }

    for (name, versions) in &hir.metadata.phi_candidates {
        if versions.len() > 1 {
            reassigned.insert(name.clone());
        }
    }

    hir.metadata.reassigned_bindings = reassigned;
    hir.metadata.reactive_places.retain(|dep| {
        hir.metadata.mutated_bindings.contains(dep.root.as_str())
            || hir.metadata.reassigned_bindings.contains(dep.root.as_str())
    });
}
