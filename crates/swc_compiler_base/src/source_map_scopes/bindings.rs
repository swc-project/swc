use super::{
    collect::CollectedScope,
    encode::{BindingTransition, BindingValue, ScopePosition},
    positions::{points_in_original_range, position_in_generated_range, MappingIndex},
};

pub(crate) fn build_scope_bindings(
    scope: &CollectedScope,
    source_idx: u32,
    generated_start: ScopePosition,
    generated_end: ScopePosition,
    mappings: &MappingIndex,
) -> Vec<BindingValue> {
    scope
        .variables
        .iter()
        .map(|variable| {
            let mut samples =
                points_in_original_range(mappings, source_idx, variable.start, variable.end)
                    .into_iter()
                    .filter(|point| {
                        position_in_generated_range(point.generated, generated_start, generated_end)
                    })
                    .filter_map(|point| {
                        point
                            .generated_name
                            .as_ref()
                            .map(|name| (point.generated, name.clone()))
                    })
                    .collect::<Vec<_>>();

            if samples.is_empty() {
                return BindingValue::Simple(None);
            }

            samples.sort_by_key(|sample| sample.0);
            samples.dedup_by(|lhs, rhs| lhs.0 == rhs.0 && lhs.1 == rhs.1);

            let initial = samples[0].1.clone();
            let mut current = initial.clone();
            let mut transitions = Vec::new();

            for (from, name) in samples.into_iter().skip(1) {
                if name == current {
                    continue;
                }

                current = name.clone();
                transitions.push(BindingTransition {
                    from,
                    value: Some(name),
                });
            }

            if transitions.is_empty() {
                BindingValue::Simple(Some(initial))
            } else {
                BindingValue::WithSubRanges {
                    initial: Some(initial),
                    transitions,
                }
            }
        })
        .collect()
}
