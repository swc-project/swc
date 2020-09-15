use super::ModuleGraph;
use crate::ModuleId;
use petgraph::EdgeDirection::Incoming;

// TODO: Optimize with cache.
pub(super) fn least_common_ancestor(g: &ModuleGraph, module_ids: &[ModuleId]) -> ModuleId {
    assert_ne!(
        module_ids,
        &[],
        "Cannot calculate least common ancestor of no module"
    );
    if module_ids.len() == 1 {
        return module_ids[0];
    }

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

        if let Some(id) = check_itself_and_parent(g, &[first], &[second]) {
            log::info!("Found lca: {:?}", id);
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
        .fold(least_common_ancestor(g, &[first, second]), |prev, item| {
            least_common_ancestor(g, &[prev, item])
        });
}

fn check_itself<I>(li: I, ri: &[ModuleId]) -> Option<ModuleId>
where
    I: IntoIterator<Item = ModuleId>,
{
    for l in li {
        for &r in ri {
            if l == r {
                return Some(l);
            }
        }
    }

    None
}

fn check_itself_and_parent(g: &ModuleGraph, li: &[ModuleId], ri: &[ModuleId]) -> Option<ModuleId> {
    if let Some(id) = check_itself(li.iter().copied(), ri) {
        return Some(id);
    }

    for &l in li {
        if let Some(id) = check_itself(g.neighbors_directed(l, Incoming), ri) {
            return Some(id);
        }
    }

    for &r in ri {
        if let Some(id) = check_itself(g.neighbors_directed(r, Incoming), li) {
            return Some(id);
        }
    }

    for &l in li {
        for &r in ri {
            let lv = g.neighbors_directed(l, Incoming).collect::<Vec<_>>();
            let rv = g.neighbors_directed(r, Incoming).collect::<Vec<_>>();

            if let Some(id) = check_itself_and_parent(g, &lv, &rv) {
                return Some(id);
            }
        }
    }

    None
}
