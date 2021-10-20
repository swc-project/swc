use super::{
    ops::Operator,
    usage_analyzer::{Data, UsageAnalyzer},
};
use crate::hygiene::{unique_scope::unique_scope, usage_analyzer::CurScope};
use swc_common::{chain, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith, VisitWith};

pub fn hygiene3() -> impl Fold + VisitMut {
    as_folder(chain!(unique_scope(), Hygiene::default()))
}

#[derive(Debug, Default)]
struct Hygiene {}

impl Hygiene {
    fn analyze<N>(&mut self, n: &mut N)
    where
        N: for<'aa> VisitWith<UsageAnalyzer<'aa>>,
        N: for<'aa> VisitMutWith<Operator<'aa>>,
    {
        let mut data = Data::default();
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

        let ops = data.ops.into_inner();

        n.visit_mut_with(&mut Operator(&ops));
    }
}

impl VisitMut for Hygiene {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        self.analyze(n);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        self.analyze(n);
    }
}
