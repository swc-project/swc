//! Third one

use crate::hygiene::{analyzer::CurScope, unique_scope::unique_scope};
use swc_common::{chain, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith, VisitWith};

use super::analyzer::Analyzer;

pub fn hygiene3() -> impl Fold + VisitMut {
    as_folder(chain!(unique_scope(), Renaming::default()))
}

#[derive(Debug, Default)]
struct Renaming {
    cur_scope: SyntaxContext,
}

impl Renaming {
    fn analyze<N>(&mut self, n: &N)
    where
        for<'aa> N: VisitWith<Analyzer<'aa>>,
    {
        let mut data = Default::default();
        let mut v = Analyzer {
            data: &mut data,
            cur: CurScope {
                parent: None,
                scope_ctxt: SyntaxContext::empty(),
                data: Default::default(),
            },
            is_pat_decl: false,
        };

        dbg!(&data);

        n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    }
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
