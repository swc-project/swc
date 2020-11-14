use super::PlanBuilder;
use crate::ModuleId;
use petgraph::EdgeDirection::Incoming;

// TODO: Optimize with cache.
pub(super) fn least_common_ancestor(b: &PlanBuilder, module_ids: &[ModuleId]) -> ModuleId {
    assert_ne!(
        module_ids,
        &[],
        "Cannot calculate least common ancestor of no module"
    );
    if module_ids.len() == 1 {
        return module_ids[0];
    }
    let g = &b.direct_deps;

    // Check for roots
    for &mid in module_ids {
        if g.neighbors_directed(mid, Incoming).count() == 0 {
            return mid;
        }
    }

    let first = module_ids[0];
    let second = module_ids[1];

    if module_ids.len() == 2 {
        if first == second {
            return first;
        }

        if b.direct_deps.contains_edge(first, second) {
            return second;
        }
        if b.direct_deps.contains_edge(second, first) {
            return first;
        }

        if let Some(id) = check_itself_and_parent(b, &[first], &[second]) {
            log::debug!("Found lca: {:?}", id);
            return id;
        }

        unreachable!(
            "failed to calculate least common ancestors of {:?}",
            module_ids
        )
    }

    return module_ids
        .iter()
        .skip(2)
        .cloned()
        .fold(least_common_ancestor(b, &[first, second]), |prev, item| {
            least_common_ancestor(b, &[prev, item])
        });
}

fn check_itself(b: &PlanBuilder, li: &[ModuleId], ri: &[ModuleId]) -> Option<ModuleId> {
    let g = &b.direct_deps;
    for &l in li {
        // Root
        if g.neighbors_directed(l, Incoming).count() == 0 {
            return Some(l);
        }

        for &r in ri {
            // Root
            if g.neighbors_directed(r, Incoming).count() == 0 {
                return Some(r);
            }

            if l == r {
                return Some(l);
            }
        }
    }

    None
}

fn check_itself_and_parent(b: &PlanBuilder, li: &[ModuleId], ri: &[ModuleId]) -> Option<ModuleId> {
    let g = &b.direct_deps;

    if let Some(id) = check_itself(b, li, ri) {
        return Some(id);
    }

    for &l in li {
        let mut l_dependants = g.neighbors_directed(l, Incoming).collect::<Vec<_>>();
        l_dependants.sort();
        for &l_dependant in &l_dependants {
            if g.neighbors_directed(l_dependant, Incoming).count() == 0 {
                return Some(l_dependant);
            }
        }

        l_dependants.retain(|&id| !b.is_circular(id));
        if l_dependants.is_empty() {
            return Some(l);
        }

        if let Some(id) = check_itself_and_parent(b, &l_dependants, ri) {
            return Some(id);
        }
    }

    for &r in ri {
        let mut r_dependants = g.neighbors_directed(r, Incoming).collect::<Vec<_>>();
        r_dependants.sort();
        for &r_dependant in &r_dependants {
            if g.neighbors_directed(r_dependant, Incoming).count() == 0 {
                return Some(r_dependant);
            }
        }

        r_dependants.retain(|&id| !b.is_circular(id));

        if r_dependants.is_empty() {
            return Some(r);
        }

        if let Some(id) = check_itself_and_parent(b, &r_dependants, li) {
            return Some(id);
        }
    }

    // for &l in li {
    //     for &r in ri {
    //         let lv = g.neighbors_directed(l, Incoming).collect::<Vec<_>>();
    //         let rv = g.neighbors_directed(r, Incoming).collect::<Vec<_>>();

    //         if let Some(id) = check_itself_and_parent(g, &lv, &rv) {
    //             return Some(id);
    //         }
    //     }
    // }

    None
}
