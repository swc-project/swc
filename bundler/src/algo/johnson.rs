use fxhash::FxHashMap;

use crate::util::fast_graph::FastDiGraphMap;

pub(crate) struct Johnson<N, E> {
    graph: FastDiGraphMap<N, E>,
    blocked: FxHashMap<N, bool>,
    blocked_nodes: FxHashMap<N, Vec<N>>,
    circuits: Vec<Vec<N>>,
}

impl<N, E> Johnson<N, E> {}
