use std::collections::HashSet;

use crate::hir::HirFunction;

/// Infers reactive places used by memoization logic.
pub fn infer_reactive_places(hir: &mut HirFunction) {
    let mut places = hir.metadata.reactive_places.clone();
    let mut seen = HashSet::<(String, Vec<String>)>::new();
    for place in &places {
        seen.insert((place.root.clone(), place.path.clone()));
    }

    for deps in hir.metadata.callback_dependency_hints.values() {
        for dep in deps {
            if !hir.metadata.mutated_bindings.contains(dep.root.as_str())
                && !hir.metadata.reassigned_bindings.contains(dep.root.as_str())
            {
                continue;
            }
            let key = (dep.root.clone(), dep.path.clone());
            if seen.insert(key) {
                places.push(dep.clone());
            }
        }
    }

    for deps in hir.metadata.scope_dependencies.values() {
        for dep in deps {
            if !hir.metadata.mutated_bindings.contains(dep.root.as_str())
                && !hir.metadata.reassigned_bindings.contains(dep.root.as_str())
            {
                continue;
            }
            let key = (dep.root.clone(), dep.path.clone());
            if seen.insert(key) {
                places.push(dep.clone());
            }
        }
    }

    hir.metadata.reactive_places = places;
}
