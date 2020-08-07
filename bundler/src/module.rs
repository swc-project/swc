use crate::{helpers::Helpers, id::ModuleId};
use swc_common::{sync::Lrc, Mark, SourceFile};
use swc_ecma_ast::Module;

/// Module after applying transformations.
#[derive(Debug, Clone)]
pub(super) struct TransformedModule {
    pub id: ModuleId,
    pub fm: Lrc<SourceFile>,
    pub module: Lrc<Module>,
    pub imports: Lrc<Imports>,
    pub exports: Lrc<Exports>,

    /// If false, the module will be wrapped with helper function just like
    /// wwbpack.
    pub is_es6: bool,

    /// Used helpers
    pub helpers: Lrc<Helpers>,

    mark: Mark,
}

impl TransformedModule {
    /// Marks applied to bindings
    pub fn mark(&self) -> Mark {
        self.mark
    }
}
