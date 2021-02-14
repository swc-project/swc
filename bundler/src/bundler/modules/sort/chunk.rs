use crate::bundler::modules::Modules;
use crate::dep_graph::ModuleGraph;
use crate::util::MapWithMut;
use crate::ModuleId;
use retain_mut::RetainMut;
use std::mem::take;
use swc_common::Spanned;
use swc_ecma_ast::*;

/// The unit of sorting.
#[derive(Debug)]
pub(super) struct Chunk {
    /// This [None] for injected items.
    pub module_id: Option<ModuleId>,
    pub stmts: Vec<ModuleItem>,
}

impl Modules {
    fn normalize_injected(&mut self) {
        let injected_ctxt = self.injected_ctxt;

        self.retain_mut(|item| match item {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            _ => true,
        });

        let mut modules = take(&mut self.modules);
        for module in &mut modules {
            module.1.body.retain_mut(|item| {
                let is_free = item.span().ctxt == injected_ctxt;
                if is_free {
                    self.injected.push(item.take());
                    false
                } else {
                    true
                }
            });
        }
        self.modules = modules;
    }

    /// Modules with circular import relations will be in same chunk.
    pub(super) fn take_chunks(&mut self, entry_id: ModuleId, graph: &ModuleGraph) -> Vec<Chunk> {
        self.normalize_injected();

        let mut chunks = vec![];

        chunks.extend(take(&mut self.prepended).into_iter().map(|stmt| Chunk {
            module_id: None,
            stmts: vec![stmt],
        }));
        chunks.extend(take(&mut self.injected).into_iter().map(|stmt| Chunk {
            module_id: None,
            stmts: vec![stmt],
        }));

        chunks.extend(toposort(take(&mut self.modules), entry_id, graph));

        chunks
    }
}

/// Sort items topologically, while merging cycles as a
fn toposort(
    modules: Vec<(ModuleId, Module)>,
    entry: ModuleId,
    graph: &ModuleGraph,
) -> impl Iterator<Item = Chunk> {
}
