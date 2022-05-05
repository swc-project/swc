use bit_set::BitSet;
use petgraph::graph::UnGraph;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::util::take::Take;
use swc_ecma_ast::*;

use super::liveness::LivenessVarAnalysis;
use crate::{
    control_flow_graph::ControlFlowGraph,
    data_flow::{DataFlowAnalyzer, LinearFlowState},
    liveness::{LiveVarLattice, Var},
    node::Node,
};

/// Ported from https://github.com/google/closure-compiler/blob/04b38ec900b50629f8427b7ed3d2886c80eb88f0/src/com/google/javascript/jscomp/CoalesceVariableNames.java
pub struct CoalesceVarsPass {}

impl CoalesceVarsPass {
    pub fn process(f: &mut Function) {
        let root = Node::new_root(f.take());

        // TODO
        let all_vars_declared_in_fn = vec![];

        let mut pass = Self {};

        let mut cfg = ControlFlowGraph::analyze(&root);

        let mut liveness = DataFlowAnalyzer::new(
            &cfg,
            LivenessVarAnalysis::new(&cfg, all_vars_declared_in_fn),
        );

        liveness.analyze();

        let liveness = liveness.into_inner();
        let escaped_locals = liveness.get_escaped_locals();

        let interference_graph =
            pass.compute_var_names_interference_graph(&liveness, &cfg, &escaped_locals);

        let coloring = GreedyGraphColoring::new(interference_graph, coloring_tie_breaker);
        coloring.color();
    }
}

impl CoalesceVarsPass {
    /// Ported from https://github.com/google/closure-compiler/blob/04b38ec900b50629f8427b7ed3d2886c80eb88f0/src/com/google/javascript/jscomp/CoalesceVariableNames.java#L273
    fn compute_var_names_interference_graph(
        &mut self,
        liveness: &LivenessVarAnalysis,
        cfg: &ControlFlowGraph<Node>,
        escaped: &FxHashSet<Id>,
    ) -> UnGraph<Node, ()> {
        let mut interference_graph = UnGraph::default();

        // First create a node for each non-escaped variable. We add these nodes
        // in the order in which they appear in the code because we want
        // the names that appear earlier in the code to be used
        // when coalescing to variables that appear later in the code.
        let ordered_vars = liveness.get_all_vars_in_order();

        // index i in interference_graph_nodes is set to true when
        // interference_graph has node orderedVariables[i]
        let mut interference_graph_nodes = BitSet::default();

        // interferenceBitSet[i] = indices of all variables that should have an edge
        // with orderedVariables[i]
        let mut interference_bit_set = (0..ordered_vars.len())
            .map(|_| BitSet::default())
            .collect::<Vec<_>>();

        let mut node_ix = FxHashMap::default();

        for (v_index, v) in ordered_vars.iter().enumerate() {
            if escaped.contains(&v.name) {
                continue;
            }

            // NOTE(user): In theory, we CAN coalesce function names just like any
            // variables. Our Liveness analysis captures this just like it as
            // described in the specification. However, we saw some zipped and
            // unzipped size increase after this. We are not totally sure why
            // that is but, for now, we will respect the dead functions and not play around
            // with it
            if v.metadata.is_fn {
                continue;
            }

            // NOTE: we skip class declarations for a combination of two reasons:
            // 1. they are block-scoped, so we would need to rewrite them as class
            // expressions      e.g. `class C {}` -> `var C = class {}` to avoid
            // incorrect semantics
            //      (see testDontCoalesceClassDeclarationsWithDestructuringDeclaration).
            //    This is possible but increases pre-gzip code size and complexity.
            // 2. since function declaration coalescing seems to cause a size regression (as
            // discussed    above) we assume that coalescing class names may
            // cause a similar size regression.
            if v.metadata.is_class {
                continue;
            }

            // Skip lets and consts that have multiple variables declared in them, otherwise
            // this produces incorrect semantics. See test case "testCapture".
            // Skipping vars technically isn't needed for correct semantics, but works
            // around a Safari bug for var redeclarations (https://github.com/google/closure-compiler/issues/3164)
            if v.metadata.is_part_of_desturcturing {
                continue;
            }

            let ix = interference_graph.add_node(Node::clone(v.get_node()));
            node_ix.insert(v.name.clone(), ix);
            interference_graph_nodes.insert(v_index);
        }

        for cfg_node in cfg.node_weights() {
            if cfg.is_implicit_return(cfg_node) {
                continue;
            }

            let state: &LinearFlowState<LiveVarLattice> = cfg_node.get_annotation();

            // Check the live states and add edge when possible. An edge between
            // two variables means that they are alive at
            // overlapping times, which means that their
            // variable names cannot be coalesced.

            let livein = state.get_in();

            for i in livein.borrow().iter_next_set_bit(0) {
                for j in livein.borrow().next_set_bit(i) {
                    interference_bit_set[i].insert(j);
                }
            }

            let liveout = state.get_out();

            for i in livein.borrow().iter_next_set_bit(0) {
                for j in livein.borrow().next_set_bit(i) {
                    interference_bit_set[i].insert(j);
                }
            }

            let live_range_checker =
                LiveRangeChecker::new(Node::clone(&**cfg_node.get_value()), ordered_vars, state);
            live_range_checker.check(&Node::clone(&**cfg_node.get_value()));
            live_range_checker.set_crossing_vars(&mut *interference_bit_set);
        }

        // Go through each variable and try to connect them.

        for (v1_index, v1) in ordered_vars.iter().enumerate() {
            for (v2_index, v2) in ordered_vars.iter().enumerate() {
                // Skip duplicate pairs. Also avoid merging a variable with itself.
                if v1_index > v2_index {
                    continue;
                }

                if !interference_graph_nodes.contains(v1_index)
                    || !interference_graph_nodes.contains(v2_index)
                {
                    // Skip nodes that were not added. They are globals and escaped locals.
                    continue;
                }

                if (v1.metadata.is_param && v2.metadata.is_param)
                    || interference_bit_set[v1_index].contains(v2_index)
                {
                    // Add an edge between variable pairs that are both parameters
                    // because we don't want parameters to share a name.
                    let v1_ix = node_ix[&v1.name];
                    let v2_ix = node_ix[&v2.name];
                    interference_graph.add_edge(v1_ix, v2_ix, ());
                }
            }
        }

        interference_graph
    }
}

/// Used to find written and read variables in the same CFG node so that the
/// variable pairs can be marked as interfering in an interference bit map.
/// Indices of written and read variables are put in a list. These two lists are
/// used to mark each written variable as "crossing" all read variables.
///
///
/// Ported from https://github.com/google/closure-compiler/blob/04b38ec900b50629f8427b7ed3d2886c80eb88f0/src/com/google/javascript/jscomp/CoalesceVariableNames.java#L522-L619
struct LiveRangeChecker {
    root: Node,
    state: LinearFlowState<LiveVarLattice>,

    ordered_vars: Vec<Var>,

    is_assign_to_list: Vec<Id>,
    is_read_from_list: Vec<Id>,
}

impl LiveRangeChecker {
    pub fn new(root: Node, ordered_vars: Vec<Var>, state: LinearFlowState<LiveVarLattice>) -> Self {
        Self {
            root,
            state,
            ordered_vars,
            is_assign_to_list: vec![],
            is_read_from_list: vec![],
        }
    }

    fn check(&mut self, n: &Node) {
        todo!()
    }

    fn visit(&mut self, n: &Node, parent: &Node) {
        todo!()
    }

    fn set_crossing_vars(&self, interference_bit_set: &mut [BitSet]) {
        todo!()
    }
}
