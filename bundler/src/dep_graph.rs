use crate::util::fast_graph::NodeTrait;
use crate::ModuleId;
use ahash::AHashSet;
use petgraph::graphmap::DiGraphMap;
use petgraph::visit::GraphBase;
use petgraph::visit::GraphRef;
use petgraph::visit::IntoNeighbors;
use petgraph::visit::Visitable;
use petgraph::EdgeDirection;
use petgraph::EdgeDirection::Incoming;
use petgraph::EdgeDirection::Outgoing;
use std::hash::Hash;
use std::iter::repeat;
use std::ops::Deref;

pub(crate) trait DepIndexType {
    fn as_usize(&self) -> usize;
}

pub(crate) type ModuleGraph = DepGraph<ModuleId, ()>;

#[derive(Debug, Clone)]
pub(crate) struct DepGraph<N, E>
where
    N: Eq + Hash + NodeTrait + DepIndexType,
    E: Copy + Eq,
{
    inner: DiGraphMap<N, E>,
    /// Read-optimized hashset which contains all direct dependencies and
    /// transitive dependencies.
    deps: Vec<AHashSet<usize>>,
}

impl<N, E> Default for DepGraph<N, E>
where
    N: Eq + Hash + NodeTrait + DepIndexType,
    E: Copy + Eq,
{
    fn default() -> Self {
        Self {
            inner: Default::default(),
            deps: Default::default(),
        }
    }
}

impl<N, E> DepGraph<N, E>
where
    N: DepIndexType + NodeTrait,
    E: Copy + Eq,
{
    pub fn node_count(&self) -> usize {
        self.inner.node_count()
    }

    pub fn add_node(&mut self, node: N) {
        self.inner.add_node(node);
    }

    pub fn remove_node(&mut self, node: N) {
        self.inner.add_node(node);
    }

    pub fn add_edge(&mut self, a: N, b: N, weight: E) {
        self.inner.add_edge(a, b, weight);

        self.insert_transitives(a, b);
    }

    pub fn contains_edge(&self, a: N, b: N) -> bool {
        self.inner.contains_edge(a, b)
    }

    fn insert_transitives(&mut self, from: N, to: N) {
        if self.deps.len() <= from.as_usize() {
            self.deps
                .extend(repeat(Default::default()).take(from.as_usize() + 1 - self.deps.len()))
        }
        if !self.deps[from.as_usize()].insert(to.as_usize()) {
            return;
        }

        for transitive in self
            .inner
            .neighbors_directed(to, Outgoing)
            .collect::<Vec<_>>()
        {
            self.insert_transitives(from, transitive)
        }

        for transitive in self
            .inner
            .neighbors_directed(from, Incoming)
            .collect::<Vec<_>>()
        {
            self.insert_transitives(transitive, to)
        }
    }

    pub fn edge_weight(&self, a: N, b: N) -> Option<E> {
        self.inner.edge_weight(a, b).cloned()
    }

    pub fn neighbors_directed<'a>(
        &'a self,
        start: N,
        dir: EdgeDirection,
    ) -> impl 'a + Iterator<Item = N> {
        self.inner.neighbors_directed(start, dir)
    }

    pub fn has_a_path(&self, from: usize, to: usize) -> bool {
        match self.deps.get(from) {
            Some(ps) => ps.contains(&to),
            None => false,
        }
    }
}

impl<N, E> GraphBase for DepGraph<N, E>
where
    N: Copy + Ord + Hash + DepIndexType,
    E: Copy + Eq,
{
    type EdgeId = E;

    type NodeId = N;
}

impl<N, E> Visitable for DepGraph<N, E>
where
    N: Copy + Ord + Hash + DepIndexType,
    E: Copy + Eq,
{
    type Map = <DiGraphMap<N, E> as Visitable>::Map;

    fn visit_map(self: &Self) -> Self::Map {
        Visitable::visit_map(&self.inner)
    }

    fn reset_map(self: &Self, map: &mut Self::Map) {
        Visitable::reset_map(&self.inner, map)
    }
}

impl<N, E> Deref for DepGraph<N, E>
where
    N: Copy + Ord + Hash + DepIndexType,
    E: Copy + Eq,
{
    type Target = DiGraphMap<N, E>;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}
