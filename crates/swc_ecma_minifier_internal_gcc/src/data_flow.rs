use std::{any::Any, collections::VecDeque, rc::Rc};

use petgraph::Direction;
use rustc_hash::FxHashSet;

use crate::{
    control_flow_graph::{Branch, ControlFlowGraph},
    graph::DiGraphNode,
    node::Node,
    ptr::Ptr,
};

pub trait FlowAnalyzer {
    type Lattice: PartialEq + Any;
    type FlowJoiner: FlowJoiner<Lattice = Self::Lattice>;

    type FlowBrancher: FlowBrancher<Lattice = Self::Lattice>;

    fn is_forward(&self) -> bool;

    fn is_branched(&self) -> bool;

    fn create_flow_joiner(&self) -> Self::FlowJoiner;

    fn create_flow_brancher(&self, node: Node, output: Self::Lattice) -> Self::FlowBrancher;

    fn create_initial_estimate_lattice(&self) -> Self::Lattice;

    fn flow_through(&mut self, node: Node, input: Self::Lattice) -> Self::Lattice;
}

pub trait FlowJoiner {
    type Lattice;

    fn join(&mut self, input: Self::Lattice);

    fn finish(self) -> Self::Lattice;
}

pub trait FlowBrancher {
    type Lattice;

    fn branch_flow(&mut self, branch: Branch) -> Self::Lattice;
}

/**
 * The maximum number of steps per individual CFG node before we assume the
 * analysis is divergent.
 *
 * <p>TODO(b/196398705): This is way too high. Find traversal ordering
 * heurisitc that reduces it.
 */
const MAX_STEPS_PER_NODE: u32 = 20000;

pub struct DataFlowAnalyzer<'a, A>
where
    A: FlowAnalyzer,
{
    cfg: &'a ControlFlowGraph<Node>,
    analyzer: A,

    work_queue: UniqueQueue<Node>,
}

impl<'a, A> DataFlowAnalyzer<'a, A>
where
    A: FlowAnalyzer,
{
    pub fn new(cfg: &'a ControlFlowGraph<Node>, analyzer: A) -> Self {
        Self {
            cfg,
            analyzer,
            work_queue: UniqueQueue::default(),
        }
    }

    pub fn analyze(&mut self) {
        self.init();

        while let Some(cur_node) = self.work_queue.remove_first() {
            let cur_state = cur_node.get_annotation::<LinearFlowState<A::Lattice>>();

            assert!(
                cur_state.step_count < MAX_STEPS_PER_NODE,
                "Dataflow analysis appears to diverge around"
            );
            cur_state.step_count += 1;
            let cur_node_ix = self.cfg.node_ix(&cur_node);

            self.join_inputs(&cur_node);

            if self.flow(&cur_node) {
                // If there is a change in the current node, we want to grab the
                // list of nodes that this node affects.

                let next_nodes = self.cfg.neighbors_directed(
                    cur_node_ix,
                    if self.analyzer.is_forward() {
                        Direction::Outgoing
                    } else {
                        Direction::Incoming
                    },
                );

                for next in next_nodes {
                    let next_node = self.cfg.node_weight(next).unwrap();
                    if next_node != self.cfg.get_implicit_return() {
                        self.work_queue.add(next_node.clone())
                    }
                }
            }
        }

        if self.analyzer.is_forward() {
            self.join_inputs(self.cfg.get_implicit_return());
        }
    }

    fn init(&mut self) {
        // Is this really required? Seems like google closure compiler is reusing this?
        self.work_queue.clear();

        for node in self.cfg.node_weights() {
            let in_ = Rc::new(self.analyzer.create_initial_estimate_lattice());
            let out = Rc::new(self.analyzer.create_initial_estimate_lattice());

            node.set_annotation(LinearFlowState::new(in_, out));

            if !self.cfg.is_implicit_return(node) {
                self.work_queue.add(node.clone());
            }
        }

        if self.analyzer.is_branched() {
            for edge in self.cfg.edge_weights_mut() {}
        }
    }

    fn flow(&mut self, node: &DiGraphNode<Node>) -> bool {
        let state: &LinearFlowState<A::Lattice> = node.get_annotation();

        if self.analyzer.is_forward() {
            let out_before = state.get_out();
            state.set_out(self.analyzer.flow_through(node.get_value(), state.get_in()));

            let changed = out_before != state.get_out();

            if self.analyzer.is_branched() {
                let brancher = self
                    .analyzer
                    .create_flow_brancher(node.get_value(), state.get_out());

                for out_edge in self.cfg.edges_directed(a, Direction::Outgoing) {
                    let out_branch_before = out_edge.weight().get_annotation();
                    out_edge
                        .weight()
                        .set_annotation(brancher.branch_flow(out_edge.get_value()));

                    if !changed {
                        changed = out_branch_before != out_edge.weight().get_annotation();
                    }
                }
            }

            changed
        } else {
            let in_before = state.get_in();
            state.set_in(
                self.analyzer
                    .flow_through(node.get_value(), state.get_out()),
            );

            return in_before != state.get_in();
        }
    }

    fn join_inputs(&mut self, node: &DiGraphNode<Node>) {}

    pub fn into_inner(self) -> A {
        self.analyzer
    }
}

pub struct LinearFlowState<L>
where
    L: PartialEq,
{
    step_count: u32,
    in_: L,
    out: L,
}

impl<L> LinearFlowState<L>
where
    L: PartialEq,
{
    pub fn new(in_: Rc<L>, out: Rc<L>) -> Self {
        LinearFlowState {
            step_count: 0,
            in_,
            out,
        }
    }

    pub fn step_count(&self) -> u32 {
        self.step_count
    }

    pub fn get_in(&self) -> &L {
        &self.in_
    }

    pub fn set_in(&mut self, in_: L) {
        self.in_ = in_;
    }

    pub fn get_out(&self) -> &L {
        &self.out
    }

    pub fn set_out(&mut self, out: L) {
        self.out = out;
    }
}

struct UniqueQueue<T> {
    seen_set: FxHashSet<Ptr<T>>,
    queue: VecDeque<DiGraphNode<T>>,
}

impl<T> Default for UniqueQueue<T> {
    fn default() -> Self {
        Self {
            seen_set: Default::default(),
            queue: Default::default(),
        }
    }
}

impl<T> UniqueQueue<T> {
    pub fn new() -> Self {
        Self {
            seen_set: FxHashSet::default(),
            queue: VecDeque::new(),
        }
    }

    fn is_empty(&self) -> bool {
        self.queue.is_empty()
    }

    fn remove_first(&mut self) -> Option<DiGraphNode<T>> {
        let t = self.queue.pop_front()?;
        self.seen_set.remove(&t);

        Some(t)
    }

    fn add(&mut self, t: DiGraphNode<T>) {
        if self.seen_set.insert((&*t).clone()) {
            self.queue.push_back(t);
        }
    }

    fn clear(&mut self) {
        self.seen_set.clear();
        self.queue.clear();
    }
}
