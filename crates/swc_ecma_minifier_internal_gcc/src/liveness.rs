use std::rc::Rc;

use bit_set::BitSet;
use rustc_hash::FxHashSet;
use swc_ecma_ast::Id;

use crate::{
    control_flow::{Branch, ControlFlowGraph},
    dataflow::{FlowAnalyzer, FlowBrancher, FlowJoiner},
    node::Node,
};

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
///
///
/// Ported from https://github.com/google/closure-compiler/blob/3a5d7f7d86867ba950f1a84d11d120bc4cf96de7/src/com/google/javascript/jscomp/LiveVariablesAnalysis.java
pub(super) struct LivenessVarAnalysis<'a> {
    cfg: &'a ControlFlowGraph<Node>,
    all_vars_declared_in_fn: Vec<Var>,
}

impl FlowAnalyzer for LivenessVarAnalysis<'_> {
    type FlowBrancher = LivenessVarFlowBrancher;
    type FlowJoiner = LiveVarJoiner;
    type Lattice = LiveVarLattice;

    fn is_forward(&self) -> bool {
        false
    }

    fn create_entry_lattice(&self) -> Rc<Self::Lattice> {
        Rc::new(LiveVarLattice {
            live_set: BitSet::with_capacity(self.all_vars_declared_in_fn.len()),
        })
    }

    fn create_initial_estimate_lattice(&self) -> Rc<Self::Lattice> {
        Rc::new(LiveVarLattice {
            live_set: BitSet::with_capacity(self.all_vars_declared_in_fn.len()),
        })
    }

    fn create_flow_joiner(&self) -> Self::FlowJoiner {
        LiveVarJoiner {
            result: LiveVarLattice {
                live_set: BitSet::with_capacity(self.all_vars_declared_in_fn.len()),
            },
        }
    }

    fn create_flow_brancher(&self, _node: Node, _output: Rc<Self::Lattice>) -> Self::FlowBrancher {
        unimplemented!("flow brancher is not supported for live var analysis")
    }

    fn flow_through(&mut self, node: Node, input: Rc<Self::Lattice>) -> Rc<Self::Lattice> {
        todo!()
    }
}

/// Ported from https://github.com/google/closure-compiler/blob/3a5d7f7d86867ba950f1a84d11d120bc4cf96de7/src/com/google/javascript/jscomp/LiveVariablesAnalysis.java#L52-L64
pub struct LiveVarJoiner {
    result: LiveVarLattice,
}

impl FlowJoiner for LiveVarJoiner {
    type Lattice = LiveVarLattice;

    fn join_flow(&mut self, input: Rc<Self::Lattice>) {
        self.result.live_set.union_with(&input.live_set);
    }

    fn finish(self) -> Rc<Self::Lattice> {
        Rc::new(self.result)
    }
}

pub struct LivenessVarFlowBrancher {
    _priv: (),
}

impl FlowBrancher for LivenessVarFlowBrancher {
    type Lattice = LiveVarLattice;

    fn branch_flow(&mut self, branch: Branch) -> Rc<Self::Lattice> {
        unimplemented!("flow brancher is not supported for live var analysis")
    }
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
