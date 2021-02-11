use crate::bundler::modules::sort::Required;
use ahash::AHashSet;
use petgraph::graphmap::DiGraphMap;
use petgraph::EdgeDirection;
use petgraph::EdgeDirection::Incoming;
use petgraph::EdgeDirection::Outgoing;

/// Used to debug petgraph.
#[derive(Debug, Default)]
pub(super) struct StmtDepGraph {
    inner: DiGraphMap<usize, Required>,
    /// Read-optimized hashset which contains all direct dependencies and
    /// transitive dependencies.
    paths: AHashSet<(usize, usize)>,
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
        if !self.paths.insert((from, to)) {
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
        self.paths.contains(&(from, to))
    }
}
