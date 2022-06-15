use rustc_hash::FxHashSet;
use swc_common::SyntaxContext;
use swc_ecma_ast::{Id, Ident};
use swc_ecma_visit::{noop_visit_type, Visit};

pub(super) struct IdCollector {
    pub ids: FxHashSet<Id>,
}

impl Visit for IdCollector {
    noop_visit_type!();

    fn visit_ident(&mut self, id: &Ident) {
        if id.span.ctxt != SyntaxContext::empty() {
            self.ids.insert(id.to_id());
        }
    }
}
