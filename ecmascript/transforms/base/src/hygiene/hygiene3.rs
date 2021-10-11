//! Third one

use crate::hygiene::unique_scope::unique_scope;
use swc_common::{chain, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn hygiene3() -> impl Fold + VisitMut {
    as_folder(chain!(unique_scope(), Renaming::default()))
}

#[derive(Debug, Default)]
struct Renaming {
    cur_scope: SyntaxContext,
}

impl Renaming {
    fn analyze<N>(&mut self, n: &N) {}
}

impl VisitMut for Renaming {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        self.analyze(&*n);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        self.analyze(&*n);

        n.visit_mut_children_with(self);
    }
}
