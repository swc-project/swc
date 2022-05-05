use bit_set::BitSet;
use rustc_hash::FxHashSet;
use swc_ecma_ast::Id;

use crate::{control_flow_graph::ControlFlowGraph, dataflow::FlowAnalyzer, node::Node};

/// We may need this
#[derive(Clone)]
pub(crate) struct Var {
    pub name: Id,

    node: Node,
    parent: Node,

    pub metadata: VarMetadata,
}

#[derive(Debug, Clone)]
pub(crate) struct VarMetadata {
    pub is_part_of_desturcturing: bool,
    pub is_param: bool,
    pub is_fn: bool,
    pub is_class: bool,
}

impl Var {
    pub fn get_parent_node(&self) -> &Node {
        &self.parent
    }

    pub fn get_node(&self) -> &Node {
        &self.node
    }
}

///
pub(super) struct LivenessVarAnalysis<'a> {
    cfg: &'a ControlFlowGraph<Node>,
    all_vars_declared_in_fn: Vec<Var>,
}

impl FlowAnalyzer for LivenessVarAnalysis<'_> {
    type Lattice = LiveVarLattice;
}

impl<'a> LivenessVarAnalysis<'a> {
    pub fn new(cfg: &'a ControlFlowGraph<Node>, all_vars_declared_in_fn: Vec<Var>) -> Self {
        Self {
            cfg,
            all_vars_declared_in_fn,
        }
    }

    pub fn get_escaped_locals(&self) -> FxHashSet<Id> {
        todo!()
    }

    pub fn get_all_vars_in_order(&self) -> Vec<Var> {
        self.all_vars_declared_in_fn.clone()
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct LiveVarLattice {
    live_set: BitSet,
}

impl LiveVarLattice {
    /// - `num_vars`: Number of all local variables
    pub fn new(num_vars: usize) -> Self {
        Self {
            live_set: BitSet::with_capacity(num_vars),
        }
    }

    /// There is only a version of this function with index since var.index will
    /// return the wrong one. Use an instantiation of
    /// LiveVariablesAnalysis and getVarIndex(var) to get the right index.
    pub fn is_live(&self, index: usize) -> bool {
        self.live_set.get_ref()[index]
    }

    pub fn next_set_bit(&self, from_index: usize) -> Option<usize> {
        let pos = self
            .live_set
            .get_ref()
            .iter()
            .skip(from_index)
            .position(|v| v)?;

        Some(from_index + pos)
    }

    pub fn iter_next_set_bit<'a>(&'a self, from_index: usize) -> NextSetBitIter<'a> {
        NextSetBitIter {
            lattice: self,
            cur: Some(from_index),
        }
    }
}

pub struct NextSetBitIter<'a> {
    lattice: &'a LiveVarLattice,
    cur: Option<usize>,
}

impl Iterator for NextSetBitIter<'_> {
    type Item = usize;

    fn next(&mut self) -> Option<Self::Item> {
        let cur = self.cur?;

        let next = self.lattice.next_set_bit(cur + 1);
        self.cur = next;

        Some(cur)
    }
}
