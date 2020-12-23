use crate::bundler::modules::sort::Required;
use petgraph::graphmap::DiGraphMap;

/// Used to debug petgraph.
#[derive(Debug)]
pub(super) struct StmtDepGraph {
    inner: DiGraphMap<usize, Required>,
}

impl StmtDepGraph {}
