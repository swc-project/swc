use crate::util::fast_graph::FastDiGraphMap;
use crate::util::fast_graph::NodeTrait;
use fxhash::FxHashMap;
use petgraph::EdgeDirection::Outgoing;
use std::hash::Hash;

pub(crate) struct Johnson<N, E> {
    graph: FastDiGraphMap<N, E>,
    blocked: FxHashMap<N, bool>,
    blocked_nodes: FxHashMap<N, Vec<N>>,
    circuits: Vec<Vec<N>>,
}

impl<N, E> Johnson<N, E>
where
    N: Copy + Eq + Hash + NodeTrait,
    E: Copy,
{
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
}
