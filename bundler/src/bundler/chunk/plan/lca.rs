use super::ModuleGraph;
use crate::ModuleId;

pub(super) fn least_common_ancestor(g: &ModuleGraph, module_ids: &[ModuleId]) -> ModuleId {
    assert_ne!(
        module_ids,
        &[],
        "Cannot calculate least common ancestor of no module"
    );
    if module_ids.len() == 1 {
        return module_ids[0];
    }

    if module_ids.len() == 2 {
        return;
    }

    let first = module_ids[0];

    return module_ids
        .iter()
        .skip(1)
        .cloned()
        .fold(first, |prev, item| least_common_ancestor(g, &[prev, item]));
}
