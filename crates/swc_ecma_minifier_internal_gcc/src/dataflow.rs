use std::{borrow::Borrow, cell::RefCell, collections::VecDeque, rc::Rc};

use petgraph::{graph::EdgeReference, Direction};
use rustc_hash::FxHashSet;

use crate::{
    control_flow::{Branch, ControlFlowGraph},
    graph::{DiGraphEdge, DiGraphNode},
    node::Node,
    ptr::Ptr,
};

pub trait FlowAnalyzer {
    type Lattice: 'static + PartialEq;
    type FlowJoiner: FlowJoiner<Lattice = Self::Lattice>;

    type FlowBrancher: FlowBrancher<Lattice = Self::Lattice>;

    fn is_forward(&self) -> bool;

    fn is_branched(&self) -> bool {
        false
    }

    fn create_entry_lattice(&self) -> Rc<Self::Lattice>;

    fn create_initial_estimate_lattice(&self) -> Rc<Self::Lattice>;

    fn create_flow_joiner(&self) -> Self::FlowJoiner;

    fn create_flow_brancher(&self, node: Node, output: Rc<Self::Lattice>) -> Self::FlowBrancher;

    fn flow_through(&mut self, node: Node, input: Rc<Self::Lattice>) -> Rc<Self::Lattice>;
}

pub trait FlowJoiner {
    type Lattice;

    fn join_flow(&mut self, input: Rc<Self::Lattice>);

    fn finish(self) -> Rc<Self::Lattice>;
}

pub trait FlowBrancher {
    type Lattice;

    fn branch_flow(&mut self, branch: Branch) -> Rc<Self::Lattice>;
}

/**
 * The maximum number of steps per individual CFG node before we assume the
 * analysis is divergent.
 *
 * <p>TODO(b/196398705): This is way too high. Find traversal ordering
 * heurisitc that reduces it.
 */
const MAX_STEPS_PER_NODE: u32 = 20000;

/// Used with [FlowAnalyzer].
///
///
/// Ported from https://github.com/google/closure-compiler/blob/3a5d7f7d86867ba950f1a84d11d120bc4cf96de7/src/com/google/javascript/jscomp/DataFlowAnalysis.java#L350
pub struct DataFlowAnalyzer<'a, 'ast, A>
where
    A: FlowAnalyzer,
{
    cfg: &'a ControlFlowGraph<'a, Node<'ast>>,
    analyzer: A,

    work_queue: UniqueQueue<'a, Node<'ast>>,
}

impl<'a, 'ast, A> DataFlowAnalyzer<'a, 'ast, A>
where
    A: FlowAnalyzer,
{
    pub fn new(cfg: &'a ControlFlowGraph<Node<'ast>>, analyzer: A) -> Self {
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
                cur_state.step_count() < MAX_STEPS_PER_NODE,
                "Dataflow analysis appears to diverge around"
            );
            cur_state.0.borrow_mut().step_count += 1;
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
            let in_ = self.analyzer.create_initial_estimate_lattice();
            let out = self.analyzer.create_initial_estimate_lattice();

            node.set_annotation(LinearFlowState(Rc::new(RefCell::new(
                LinearFlowStateData::new(in_, out),
            ))));

            if !self.cfg.is_implicit_return(node) {
                self.work_queue.add(node.clone());
            }
        }

        if self.analyzer.is_branched() {
            for edge in self.cfg.edge_weights() {
                todo!()
            }
        }
    }

    fn flow(&mut self, node: &DiGraphNode<Node>) -> bool {
        let node_ix = self.cfg.node_ix(node);
        let state = node.get_annotation::<LinearFlowState<A::Lattice>>();

        if self.analyzer.is_forward() {
            let out_before = state.get_out();

            let value = self
                .analyzer
                .flow_through(Node::clone(node), state.get_in().clone());
            state.set_out(value);

            let mut changed = out_before != state.get_out();

            if self.analyzer.is_branched() {
                let mut brancher = self
                    .analyzer
                    .create_flow_brancher(Node::clone(node), state.get_out().clone());

                for out_edge in self.cfg.edges_directed(node_ix, Direction::Outgoing) {
                    let out_branch_before = out_edge
                        .weight()
                        .get_annotation::<LinearFlowState<A::Lattice>>();
                    out_edge
                        .weight()
                        .set_annotation(brancher.branch_flow(**out_edge.weight()));

                    if !changed {
                        changed = *out_branch_before
                            != *out_edge
                                .weight()
                                .get_annotation::<LinearFlowState<A::Lattice>>();
                    }
                }
            }

            changed
        } else {
            let in_before = state.get_in();

            let value = self
                .analyzer
                .flow_through(Node::clone(node), state.get_out().clone());
            state.set_in(value);

            in_before != state.get_in()
        }
    }

    fn join_inputs(&mut self, node: &DiGraphNode<Node>) {
        let state = node.get_annotation::<LinearFlowState<A::Lattice>>();
        let node_ix = self.cfg.node_ix(node);

        if self.analyzer.is_forward() && self.cfg.get_entry() == node {
            state.set_in(self.analyzer.create_entry_lattice());
            return;
        }

        let in_edges = self
            .cfg
            .edges_directed(
                node_ix,
                if self.analyzer.is_forward() {
                    Direction::Outgoing
                } else {
                    Direction::Incoming
                },
            )
            .collect::<Vec<_>>();

        let result = match in_edges.len() {
            0 => return,
            1 => self.get_input_from_edge(in_edges[0]),

            _ => {
                let mut joiner = self.analyzer.create_flow_joiner();
                for in_edge in in_edges {
                    joiner.join_flow(self.get_input_from_edge(in_edge));
                }
                joiner.finish()
            }
        };

        if self.analyzer.is_forward() {
            state.set_in(result);
        } else {
            state.set_out(result);
        }
    }

    fn get_input_from_edge(&mut self, e: EdgeReference<DiGraphEdge<Branch>>) -> Rc<A::Lattice> {
        todo!()
    }

    pub fn into_inner(self) -> A {
        self.analyzer
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct LinearFlowState<L>(Rc<RefCell<LinearFlowStateData<L>>>)
where
    L: PartialEq;

impl<L> LinearFlowState<L>
where
    L: PartialEq,
{
    pub fn step_count(&self) -> u32 {
        RefCell::borrow(&self.0.borrow()).step_count
    }

    pub fn get_in(&self) -> Rc<L> {
        RefCell::borrow(&self.0.borrow()).in_.clone()
    }

    pub fn set_in(&self, in_: Rc<L>) {
        self.0.borrow_mut().in_ = in_;
    }

    pub fn get_out(&self) -> Rc<L> {
        RefCell::borrow(&self.0.borrow()).out.clone()
    }

    pub fn set_out(&self, out: Rc<L>) {
        self.0.borrow_mut().out = out;
    }
}
#[derive(Debug, PartialEq, Eq)]
struct LinearFlowStateData<L>
where
    L: PartialEq,
{
    step_count: u32,
    in_: Rc<L>,
    out: Rc<L>,
}

impl<L> LinearFlowStateData<L>
where
    L: PartialEq,
{
    pub fn new(in_: Rc<L>, out: Rc<L>) -> Self {
        Self {
            step_count: 0,
            in_,
            out,
        }
    }
}

struct UniqueQueue<'a, T> {
    seen_set: FxHashSet<Ptr<'a, T>>,
    queue: VecDeque<DiGraphNode<'a, T>>,
}

impl<'a, T> Default for UniqueQueue<'a, T> {
    fn default() -> Self {
        Self {
            seen_set: Default::default(),
            queue: Default::default(),
        }
    }
}

impl<'a, T> UniqueQueue<'a, T> {
    pub fn new() -> Self {
        Self {
            seen_set: FxHashSet::default(),
            queue: VecDeque::new(),
        }
    }

    fn is_empty(&self) -> bool {
        self.queue.is_empty()
    }

    fn remove_first(&mut self) -> Option<DiGraphNode<'a, T>> {
        let t = self.queue.pop_front()?;
        self.seen_set.remove(&t);

        Some(t)
    }

    fn add(&mut self, t: DiGraphNode<'a, T>) {
        if self.seen_set.insert(*t) {
            self.queue.push_back(t);
        }
    }

    fn clear(&mut self) {
        self.seen_set.clear();
        self.queue.clear();
    }
}
