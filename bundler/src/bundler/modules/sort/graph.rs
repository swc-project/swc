use crate::util::fast_graph::FastDiGraphMap;
use ahash::AHashSet;
use petgraph::EdgeDirection;
use petgraph::EdgeDirection::Incoming;
use petgraph::EdgeDirection::Outgoing;
use std::iter::repeat;

/// Is dependancy between nodes hard?
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(super) enum Required {
    /// Required to evaluate
    Always,

    /// Maybe required to evaluate
    Maybe,
}

/// Used to debug petgraph.
#[derive(Debug, Default)]
pub(super) struct StmtDepGraph {
    inner: FastDiGraphMap<usize, Required>,
    /// Read-optimized hashset which contains all direct dependencies and
    /// transitive dependencies.
    paths: Vec<AHashSet<usize>>,
}

impl StmtDepGraph {
    pub fn node_count(&self) -> usize {
        self.inner.node_count()
    }

    pub fn add_node(&mut self, node: usize) {
        self.inner.add_node(node);
    }

    pub fn remove_node(&mut self, node: usize) {
        self.inner.add_node(node);
    }

    pub fn add_edge(&mut self, a: usize, b: usize, required: Required) {
        self.inner.add_edge(a, b, required);

        self.insert_transitives(a, b);
    }

    fn insert_transitives(&mut self, from: usize, to: usize) {
        if self.paths.len() <= from {
            self.paths
                .extend(repeat(Default::default()).take(from + 1 - self.paths.len()))
        }
        if !self.paths[from].insert(to) {
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

    pub fn edge_weight(&self, a: usize, b: usize) -> Option<Required> {
        self.inner.edge_weight(a, b).cloned()
    }

    pub fn neighbors_directed<'a>(
        &'a self,
        start: usize,
        dir: EdgeDirection,
    ) -> impl 'a + Iterator<Item = usize> {
        self.inner.neighbors_directed(start, dir)
    }

    pub fn has_a_path(&self, from: usize, to: usize) -> bool {
        match self.paths.get(from) {
            Some(ps) => ps.contains(&to),
            None => false,
        }
    }
}
