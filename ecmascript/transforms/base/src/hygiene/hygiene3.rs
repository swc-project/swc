//! Third one

use super::{rename::RenameAnalyzer, usage_analyzer::UsageAnalyzer};
use crate::hygiene::{unique_scope::unique_scope, usage_analyzer::CurScope};
use swc_common::{chain, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith, VisitWith};

pub fn hygiene3() -> impl Fold + VisitMut {
    as_folder(chain!(unique_scope(), Renamer::default()))
}

/// While visiing identifiers, we check if it will be resolved as a correct
/// variable, and skip if it's the case.
#[derive(Debug, Default)]
struct Renamer {
    cur_scope: SyntaxContext,
}

impl Renamer {
    fn analyze<N>(&mut self, n: &N)
    where
        N: for<'aa> VisitWith<UsageAnalyzer<'aa>>,
        N: for<'aa> VisitWith<RenameAnalyzer<'aa>>,
    {
        let mut data = Default::default();
        {
            let mut v = UsageAnalyzer {
                data: &mut data,
                cur: CurScope {
                    parent: None,
                    scope_ctxt: SyntaxContext::empty(),
                    data: Default::default(),
                },
                is_pat_decl: false,
            };

            n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
        }

        let data = data.freeze();

        let mut ops = {
            let mut v = RenameAnalyzer {
                data: &data,
                ops: Default::default(),
                scope_ctxt: Default::default(),
                par_depth: 0,
            };

            n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
            v.ops
        };

        dbg!(&data);
        dbg!(&ops);
    }
}

impl VisitMut for Renamer {
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
