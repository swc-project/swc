use super::Modules;
use crate::{dep_graph::ModuleGraph, ModuleId};
use std::time::Instant;
use swc_common::{sync::Lrc, SourceMap, DUMMY_SP};
use swc_ecma_ast::*;

mod chunk;
mod graph;
mod stmt;
#[cfg(test)]
mod tests;

impl Modules {
    /// If module graph proves that one module can com before other module, it
    /// will be simply injected. If it is not the case, we will consider the
    /// dependency between statements.
    ///
    /// TODO: Change this to return [Module].
    pub fn sort(
        &mut self,
        entry_id: ModuleId,
        module_graph: &ModuleGraph,
        cycles: &Vec<Vec<ModuleId>>,
        cm: &Lrc<SourceMap>,
    ) {
        tracing::debug!("Sorting {:?}", entry_id);

        let injected_ctxt = self.injected_ctxt;

        #[cfg(not(target_arch = "wasm32"))]
        let start = Instant::now();
        let chunks = self.take_chunks(entry_id, module_graph, cycles, cm);
        #[cfg(not(target_arch = "wasm32"))]
        let dur = Instant::now() - start;
        #[cfg(not(target_arch = "wasm32"))]
        tracing::debug!("Sorting took {:?}", dur);

        let buf = chunks
            .into_iter()
            .flat_map(|chunk| chunk.stmts)
            .collect::<Vec<_>>();

        let module = Module {
            span: DUMMY_SP,
            body: buf,
            shebang: None,
        };

        // print_hygiene("after sort", cm, &module);

        *self = Modules::from(entry_id, module, injected_ctxt);
        tracing::debug!("Sorted {:?}", entry_id);
    }
}
