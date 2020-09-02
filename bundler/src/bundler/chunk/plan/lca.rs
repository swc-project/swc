use super::ModuleGraph;
use crate::ModuleId;
use petgraph::EdgeDirection::{Incoming, Outgoing};

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

    if module_ids.len() == 2 {
        let second = module_ids[1];
        if first == second {
            return first;
        }

        if let Some(id) = lca_opt(
            g,
            &g.neighbors_directed(first, Incoming).collect::<Vec<_>>(),
            &g.neighbors_directed(second, Incoming).collect::<Vec<_>>(),
        ) {
            dbg!(id);
            return id;
        }
        unimplemented!()
    }

    return module_ids
        .iter()
        .skip(1)
        .cloned()
        .fold(first, |prev, item| least_common_ancestor(g, &[prev, item]));
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

    None
}
