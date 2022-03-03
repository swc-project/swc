use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

pub(super) fn rename(map: AHashMap<Id, Id>) -> Rename {
    Rename { map }
}

pub(super) struct Rename {
    map: AHashMap<Id, Id>,
}

impl VisitMut for Rename {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        // fast path.
        if i.span.ctxt == SyntaxContext::empty() {
            return;
        }

        if let Some(id) = self.map.get(&i.to_id()) {
            *i = Ident::new(id.0.clone(), i.span.with_ctxt(id.1));
        }
    }
}
