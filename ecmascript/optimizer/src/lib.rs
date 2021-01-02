use crate::ast::clean_up;
use crate::ast::prepare;
use crate::control_flow_graph::ControlFlowGraph;
use crate::dce::remove_dead_code;
use swc_ecma_ast::*;

mod ast;
mod basic_block;
mod block_id;
mod control_flow_graph;
mod dce;
mod mutations;

#[derive(Debug, Default, Clone, Copy)]
pub struct OptimizerConfig {
    pub dce: bool,
}

pub fn optimize(m: &mut Module, config: OptimizerConfig) {
    prepare(m);

    let mutations = {
        let mut cfg = ControlFlowGraph::anaylze(m);

        if config.dce {
            remove_dead_code(&mut cfg);
        }

        cfg.mutations
    };

    mutations.apply(m);

    clean_up(m);
}
