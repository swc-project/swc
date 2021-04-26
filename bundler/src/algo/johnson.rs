use crate::util::fast_graph::FastDiGraphMap;
use crate::util::fast_graph::NodeTrait;
use fxhash::FxHashMap;
use petgraph::algo::tarjan_scc;
use petgraph::EdgeDirection::Outgoing;
use std::hash::Hash;
use std::mem::take;

pub(crate) struct Johnson<'a, N, E> {
    graph: &'a FastDiGraphMap<N, E>,
    blocked: FxHashMap<N, bool>,
    blocked_nodes: FxHashMap<N, Vec<N>>,
    circuits: Vec<Vec<N>>,
}

impl<'a, N, E> Johnson<'a, N, E>
where
    N: Copy + Eq + Hash + NodeTrait,
    E: Copy,
{
    pub fn new(graph: &'a FastDiGraphMap<N, E>) -> Self {
        Self {
            graph,
            blocked: Default::default(),
            blocked_nodes: Default::default(),
            circuits: Default::default(),
        }
    }

    fn unblock(&mut self, u: N) {
        self.blocked.insert(u, false);

        while let Some(vec) = self.blocked_nodes.get_mut(&u) {
            if vec.is_empty() {
                break;
            }

            let w = vec.remove(0);
            self.unblock(w);
        }
    }

    fn circuit(&mut self, graph: &FastDiGraphMap<N, E>, v: N, s: N, stack: &mut Vec<N>) -> bool {
        if graph.node_count() == 0 {
            return false;
        }

        let mut find = false;
        stack.push(v);
        self.blocked.insert(v, true);

        for w in graph.neighbors_directed(v, Outgoing) {
            if w == s {
                stack.push(s);
                self.circuits.push(stack.clone());
                stack.pop();
                find = true;
            } else {
                if !self.blocked.get(&w).unwrap() {
                    if self.circuit(graph, w, s, stack) {
                        find = true;
                    }
                }
            }
        }

        if find {
            self.unblock(v);
        } else {
            for w in graph.neighbors_directed(v, Outgoing) {
                let vec = self.blocked_nodes.get_mut(&w).unwrap();
                if !vec.contains(&v) {
                    vec.push(v);
                }
            }
        }

        stack.pop();

        find
    }

    fn least_vertex(graph: &FastDiGraphMap<N, E>) -> Option<N> {
        graph.nodes().min()
    }

    fn sub_graph_from(g: &FastDiGraphMap<N, E>, i: N) -> FastDiGraphMap<N, E> {
        let mut new = FastDiGraphMap::new();

        for from in g.nodes() {
            if from >= i {
                for to in g.neighbors_directed(from, Outgoing) {
                    if to >= i {
                        new.add_edge(from, to, *g.edge_weight(from, to).unwrap());
                    }
                }
            }
        }

        new
    }

    fn least_scc(g: &FastDiGraphMap<N, E>) -> FastDiGraphMap<N, E> {
        let mut graph = g.clone().into_graph::<usize>();
        let sccs = tarjan_scc(&graph);
        let mut min = None;
        let min_scc = vec![];
        let mut min_scc = &min_scc;
        for scc in &sccs {
            if scc.len() == 1 {
                continue;
            }

            for i in scc {
                match &mut min {
                    Some(min) => {
                        if i < *min {
                            min_scc = &scc;
                            *min = i;
                        }
                    }
                    None => {
                        min = Some(i);
                    }
                }
            }
        }

        let mut new = FastDiGraphMap::new();
        for i in min_scc {
            let i = graph.remove_node(*i).unwrap();
            for (from, to, weight) in g.edges(i) {
                if from != i {
                    continue;
                }

                let contains = min_scc
                    .iter()
                    .any(|idx| graph.remove_node(*idx).unwrap() == to);
                if contains {
                    new.add_edge(from, to, *weight);
                }
            }
        }

        new
    }

    pub fn find_circuits(mut self) -> Vec<Vec<N>> {
        if self.graph.node_count() == 0 {
            return vec![];
        }

        let mut stack = vec![];
        let mut nodes_to_visit = self.graph.nodes().collect::<Vec<_>>();
        nodes_to_visit.sort();
        nodes_to_visit.reverse();

        while let Some(s) = nodes_to_visit.pop() {
            let sub_graph = Self::sub_graph_from(&self.graph, s);
            let least_scc = Self::least_scc(&sub_graph);

            if least_scc.node_count() > 0 {
                let least = Self::least_vertex(&least_scc).unwrap();
                nodes_to_visit.retain(|node| *node >= least);

                for i in least_scc.nodes() {
                    self.blocked.insert(i, false);
                    self.blocked_nodes.insert(i, vec![]);
                }
                self.circuit(&least_scc, s, s, &mut stack);
            } else {
                break;
            }
        }

        take(&mut self.circuits)
    }
}
