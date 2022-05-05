use std::{collections::VecDeque, rc::Rc};

use rustc_hash::FxHashSet;

use crate::{control_flow_graph::ControlFlowGraph, node::Node, ptr::Ptr};

pub trait FlowAnalyzer {
    type Lattice;
    type FlowJoiner: FlowJoiner<Self::Lattice>;

    fn create_flow_joiner(&self) -> Self::FlowJoiner;
}

pub trait FlowJoiner<L> {
    fn join(&mut self, input: L);

    fn finish(self) -> L;
}

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

    fn init(&mut self) {
        // Is this really required? Seems like google closure compiler is reusing this?
        self.work_queue.clear();
    }

    pub fn analyze(&mut self) {
        self.init();
    }

    pub fn into_inner(self) -> A {
        self.analyzer
    }
}

pub struct LinearFlowState<L> {
    step_count: u32,
    in_: Rc<L>,
    out: Rc<L>,
}

impl<L> LinearFlowState<L> {
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

    pub fn get_in(&self) -> &Rc<L> {
        &self.in_
    }

    pub fn set_in(&mut self, in_: &Rc<L>) {
        self.in_ = in_.clone();
    }

    pub fn get_out(&self) -> &Rc<L> {
        &self.out
    }

    pub fn set_out(&mut self, out: &Rc<L>) {
        self.out = out.clone();
    }
}

struct UniqueQueue<T> {
    seen_set: FxHashSet<Ptr<T>>,
    queue: VecDeque<Ptr<T>>,
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

    fn remove_first(&mut self) -> Option<Ptr<T>> {
        let t = self.queue.pop_front()?;
        self.seen_set.remove(&t);

        Some(t)
    }

    fn add(&mut self, t: Ptr<T>) {
        if self.seen_set.insert(t) {
            self.queue.push_back(t);
        }
    }

    fn clear(&mut self) {
        self.seen_set.clear();
        self.queue.clear();
    }
}
