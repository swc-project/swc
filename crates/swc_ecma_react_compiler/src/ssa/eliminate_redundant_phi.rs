use crate::hir::HirFunction;

/// Removes redundant phi nodes.
pub fn eliminate_redundant_phi(hir: &mut HirFunction) {
    if hir.metadata.phi_candidates.is_empty() {
        return;
    }

    hir.metadata.phi_candidates.retain(|_, versions| {
        if versions.len() < 2 {
            return false;
        }
        let first = versions[0];
        versions.iter().any(|version| *version != first)
    });
}
