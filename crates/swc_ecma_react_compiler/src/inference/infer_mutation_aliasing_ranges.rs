use crate::hir::HirFunction;

/// Infers mutable aliasing ranges.
pub fn infer_mutation_aliasing_ranges(hir: &mut HirFunction) {
    if hir.metadata.write_indices.is_empty() {
        hir.recompute_metadata();
    }

    let mut ranges = hir.metadata.mutation_ranges.clone();
    for (name, indices) in &hir.metadata.write_indices {
        if let (Some(start), Some(end)) = (indices.first(), indices.last()) {
            ranges
                .entry(name.clone())
                .and_modify(|range| {
                    range.0 = range.0.min(*start);
                    range.1 = range.1.max(*end);
                })
                .or_insert((*start, *end));
        }
    }

    // Treat bindings inferred as mutable aliases as spanning their full write
    // range to preserve conservative dependency invalidation.
    for name in &hir.metadata.mutated_bindings {
        if let Some(indices) = hir.metadata.write_indices.get(name) {
            if let (Some(start), Some(end)) = (indices.first(), indices.last()) {
                ranges
                    .entry(name.clone())
                    .and_modify(|range| {
                        range.0 = range.0.min(*start);
                        range.1 = range.1.max(*end);
                    })
                    .or_insert((*start, *end));
            }
        }
    }

    hir.metadata.mutation_ranges = ranges;
}
