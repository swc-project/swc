use ahash::AHashSet;
use auto_impl::auto_impl;
use std::{fmt::Debug, hash::Hash, marker::PhantomData};
use swc_fast_graph::digraph::FastDiGraphMap;

#[auto_impl(&, Box, Rc, Arc)]
pub trait DepGraph {
    type ModuleId: Debug + Copy + Eq + Hash + Ord;

    fn deps_of(&self, module_id: Self::ModuleId) -> Vec<Self::ModuleId>;
}

pub struct GraphAnalyzer<G>
where
    G: DepGraph,
{
    /// `(src, dst)`
    tracked: AHashSet<(G::ModuleId, G::ModuleId)>,
    dep_graph: G,
    data: GraphResult<G>,
}

impl<G> GraphAnalyzer<G>
where
    G: DepGraph,
{
    pub fn new(dep_graph: G) -> Self {
        Self {
            dep_graph,
            data: GraphResult {
                all: Default::default(),
                graph: Default::default(),
                cycles: Default::default(),
                _marker: Default::default(),
            },
            tracked: Default::default(),
        }
    }

    pub fn load(&mut self, entry: G::ModuleId) {
        self.add_to_graph(entry, &mut vec![entry])
    }

    fn add_to_graph(&mut self, module_id: G::ModuleId, path: &mut Vec<G::ModuleId>) {
        let visited = self.data.all.contains(&module_id);
        // dbg!(visited);
        // dbg!(&path);
        let cycle_rpos = if visited {
            path.iter().rposition(|v| *v == module_id)
        } else {
            None
        };

        if let Some(rpos) = cycle_rpos {
            let cycle = path[rpos..].to_vec();
            tracing::debug!("Found cycle: {:?}", cycle);
            self.data.cycles.push(cycle);
        }

        let prev_last = *path.last().unwrap();
        // Prevent infinite recursion.
        if !self.tracked.insert((prev_last, module_id)) {
            return;
        }

        path.push(module_id);

        if !visited {
            self.data.all.push(module_id);
        }
        self.data.graph.add_node(module_id);

        for dep_module_id in self.dep_graph.deps_of(module_id) {
            tracing::debug!("Dep: {:?} -> {:?}", module_id, dep_module_id);

            self.data.graph.add_edge(module_id, dep_module_id, ());

            self.add_to_graph(dep_module_id, path);
        }

        let res = path.pop();
        debug_assert_eq!(res, Some(module_id));
    }

    pub fn into_result(self) -> GraphResult<G> {
        self.data
    }
}

pub struct GraphResult<G>
where
    G: DepGraph,
{
    pub all: Vec<G::ModuleId>,
    pub graph: FastDiGraphMap<G::ModuleId, ()>,
    pub cycles: Vec<Vec<G::ModuleId>>,

    _marker: PhantomData<G>,
}
