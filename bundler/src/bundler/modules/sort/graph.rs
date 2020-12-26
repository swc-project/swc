use crate::bundler::modules::sort::Required;
use petgraph::algo::all_simple_paths;
use petgraph::graphmap::AllEdges;
use petgraph::graphmap::DiGraphMap;
use petgraph::Directed;
use petgraph::EdgeDirection;
use petgraph::EdgeDirection::Outgoing;
use std::collections::HashSet;

/// Used to debug petgraph.
#[derive(Debug, Default)]
pub(super) struct StmtDepGraph {
    inner: DiGraphMap<usize, Required>,
    /// Read-optimized hashset which contains all direct dependencies and
    /// transitive dependencies.
    paths: HashSet<(usize, usize)>,
}

impl StmtDepGraph {
    pub fn node_count(&self) -> usize {
        self.inner.node_count()
    }

    pub fn add_node(&mut self, node: usize) {
        println!("[Graph][Node][Add]{}", node);
        self.inner.add_node(node);
    }

    pub fn remove_node(&mut self, node: usize) {
        println!("[Graph][Node][Remove]{}", node);
        self.inner.add_node(node);
    }

    pub fn add_edge(&mut self, a: usize, b: usize, required: Required) {
        println!("[Graph][Edge]{},{}", a, b);
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
    }

    pub fn all_edges(&self) -> AllEdges<usize, Required, Directed> {
        self.inner.all_edges()
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
        // if cfg!(debug_assertions) {
        //     assert_eq!(self.inner.node_count(), self.inner.nodes().count());
        //     assert_eq!(self.inner.edge_count(), self.inner.all_edges().count());
        //     for (a, b, _) in self.inner.all_edges() {
        //         assert!(self.inner.contains_node(a));
        //         assert!(self.inner.contains_node(b));
        //     }
        // }

        // eprintln!(
        //     "[Graph]all_simple_paths: {} => {}; nodes = {}, edges = {}",
        //     from,
        //     to,
        //     self.inner.node_count(),
        //     self.inner.edge_count()
        // );
        self.paths.contains(&(from, to))
        // all_simple_paths::<Vec<_>, _>(&self.inner, from, to, 0, None)
        //     .next()
        //     .is_some()
    }

    pub fn all_simple_paths(&self, from: usize, to: usize) -> Vec<Vec<usize>> {
        all_simple_paths(&self.inner, from, to, 0, None).collect()
    }
}
