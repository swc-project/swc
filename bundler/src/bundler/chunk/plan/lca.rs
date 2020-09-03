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

    let first = module_ids[0];
    let second = module_ids[1];

    if module_ids.len() == 2 {
        if first == second {
            return first;
        }

        if let Some(id) = lca_opt(g, &[first], &[second]) {
            log::info!("Found lca: {:?}", id);
            return id;
        }

        let li = g.neighbors_directed(first, Incoming).collect::<Vec<_>>();
        let ri = g.neighbors_directed(second, Incoming).collect::<Vec<_>>();

        if let Some(id) = lca_opt(g, &li, &ri) {
            log::info!("Found lca: {:?}", id);
            return id;
        }
        unreachable!("failed to calculagte least common ancestor")
    }

    return module_ids
        .iter()
        .skip(2)
        .cloned()
        .fold(least_common_ancestor(g, &[first, second]), |prev, item| {
            least_common_ancestor(g, &[prev, item])
        });
}

fn lca_opt(g: &ModuleGraph, li: &[ModuleId], ri: &[ModuleId]) -> Option<ModuleId> {
    for &l in li {
        for &r in ri {
            if l == r {
                return Some(l);
            }
        }
    }

    for &l in li {
        let vec: Vec<_> = g.neighbors_directed(l, Incoming).collect();
        if let Some(id) = lca_opt(g, &vec, ri) {
            return Some(id);
        }
    }

    for &l in ri {
        let vec: Vec<_> = g.neighbors_directed(l, Incoming).collect();
        if let Some(id) = lca_opt(g, li, &vec) {
            return Some(id);
        }
    }

    None
}
