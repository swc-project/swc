use std::collections::HashMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

pub(super) struct RemarkIdents {
    pub map: HashMap<Id, SyntaxContext>,
}

impl VisitMut for RemarkIdents {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        let id = (*n).to_id();
        if let Some(&ctxt) = self.map.get(&id) {
            n.span = n.span.with_ctxt(ctxt);
        }
    }
}
