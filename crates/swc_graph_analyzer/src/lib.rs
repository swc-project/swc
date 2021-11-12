use std::{hash::Hash, marker::PhantomData};

pub trait DepGraph {
    type ModuleId: Copy + Eq + Hash + Ord;
}

pub struct GraphAnalyzer<G>
where
    G: DepGraph,
{
    dep_graph: G,
    result: GraphResult<G>,
}

impl<G> GraphAnalyzer<G>
where
    G: DepGraph,
{
    pub fn new(dep_graph: G) -> Self {
        Self {
            dep_graph,
            result: GraphResult {
                all: Default::default(),
                cycles: Default::default(),
                _marker: Default::default(),
            },
        }
    }

    pub fn load(&mut self, entry: G::ModuleId) {}

    pub fn into_result(self) -> GraphResult<G> {
        self.result
    }
}

pub struct GraphResult<G>
where
    G: DepGraph,
{
    pub all: Vec<G::ModuleId>,
    pub cycles: Vec<Vec<G::ModuleId>>,

    _marker: PhantomData<G>,
}
