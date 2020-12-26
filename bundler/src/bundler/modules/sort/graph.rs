use crate::bundler::modules::sort::Required;
use petgraph::algo::all_simple_paths;
use petgraph::graphmap::AllEdges;
use petgraph::graphmap::DiGraphMap;
use petgraph::Directed;
use petgraph::EdgeDirection;

/// Used to debug petgraph.
#[derive(Debug, Default)]
pub(super) struct StmtDepGraph {
    inner: DiGraphMap<usize, Required>,
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
        eprintln!(
            "[Graph]all_simple_paths: {} => {}; nodes = {}, edges = {}",
            from,
            to,
            self.inner.node_count(),
            self.inner.edge_count()
        );
        all_simple_paths::<Vec<_>, _>(&self.inner, from, to, 0, None)
            .next()
            .is_some()
    }

    pub fn all_simple_paths(&self, from: usize, to: usize) -> Vec<Vec<usize>> {
        all_simple_paths(&self.inner, from, to, 0, None).collect()
    }
}
