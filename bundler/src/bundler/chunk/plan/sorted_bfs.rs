use std::{cmp::Ord, collections::VecDeque};

use petgraph::visit::{GraphRef, IntoNeighbors, VisitMap, Visitable};

/// A bfs, but entries from same nodes are sorted.
#[derive(Clone)]
pub struct SortedBfs<N, VM> {
    /// The queue of nodes to visit
    pub stack: VecDeque<N>,
    /// The map of discovered nodes
    pub discovered: VM,
}

impl<N, VM> Default for SortedBfs<N, VM>
where
    VM: Default,
{
    fn default() -> Self {
        SortedBfs {
            stack: VecDeque::new(),
            discovered: VM::default(),
        }
    }
}

impl<N, VM> SortedBfs<N, VM>
where
    N: Copy + PartialEq + Ord,
    VM: VisitMap<N>,
{
    /// Create a new **Bfs**, using the graph's visitor map, and put **start**
    /// in the stack of nodes to visit.
    pub fn new<G>(graph: G, start: N) -> Self
    where
        G: GraphRef + Visitable<NodeId = N, Map = VM>,
    {
        let mut discovered = graph.visit_map();
        discovered.visit(start);
        let mut stack = VecDeque::new();
        stack.push_front(start);
        SortedBfs { stack, discovered }
    }

    /// Return the next node in the bfs, or **None** if the traversal is done.
    pub fn next<G>(&mut self, graph: G) -> Option<N>
    where
        G: IntoNeighbors<NodeId = N>,
    {
        if let Some(node) = self.stack.pop_front() {
            let mut vec: Vec<_> = graph.neighbors(node).collect();
            vec.sort();
            for succ in vec {
                if self.discovered.visit(succ) {
                    self.stack.push_back(succ);
                }
            }

            return Some(node);
        }
        None
    }
}
