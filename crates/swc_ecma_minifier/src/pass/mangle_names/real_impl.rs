use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::hygiene::rename;
use swc_ecma_utils::UsageFinder;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use super::{
    analyzer::Analyzer,
    preserver::{idents_to_preserve, Preserver},
};
use crate::{marks::Marks, option::MangleOptions};

pub(crate) fn name_mangler(
    options: MangleOptions,
    _marks: Marks,
    top_level_ctxt: SyntaxContext,
) -> impl VisitMut {
    Mangler {
        options,
        top_level_ctxt,
    }
}

struct Mangler {
    options: MangleOptions,

    /// Used to check `eval`.
    top_level_ctxt: SyntaxContext,
}

impl Mangler {
    fn contains_direct_eval<N>(&self, node: &N) -> bool
    where
        N: VisitWith<DirectEvalFinder>,
    {
        let mut v = DirectEvalFinder { found: false };
        node.visit_with(&mut v);
        v.found
    }

    fn contains_indirect_eval<N>(&self, node: &N) -> bool
    where
        N: for<'aa> VisitWith<UsageFinder<'aa>>,
    {
        UsageFinder::find(
            &Ident::new("eval".into(), DUMMY_SP.with_ctxt(self.top_level_ctxt)),
            node,
        )
    }

    fn get_map<N>(&self, node: &N) -> AHashMap<Id, JsWord>
    where
        N: VisitWith<Preserver>,
        N: VisitWith<Analyzer>,
    {
        let preserved = idents_to_preserve(self.options.clone(), &*node);

        let mut analyzer = Analyzer {
            scope: Default::default(),
            is_pat_decl: Default::default(),
        };
        node.visit_with(&mut analyzer);

        analyzer.into_rename_map(&preserved)
    }
}

impl VisitMut for Mangler {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, m: &mut Module) {
        if self.contains_direct_eval(m) {
            return;
        }

        if self.contains_indirect_eval(m) {
            m.visit_mut_children_with(self);
            return;
        }

        let map = self.get_map(m);

        m.visit_mut_with(&mut rename(&map));
    }

    fn visit_mut_script(&mut self, s: &mut Script) {
        if self.contains_direct_eval(s) {
            return;
        }

        if self.contains_indirect_eval(s) {
            s.visit_mut_children_with(self);
            return;
        }

        let map = self.get_map(s);

        s.visit_mut_with(&mut rename(&map));
    }
}

struct DirectEvalFinder {
    found: bool,
}

impl Visit for DirectEvalFinder {
    noop_visit_type!();

    fn visit_callee(&mut self, callee: &Callee) {
        callee.visit_children_with(self);

        if let Some(Expr::Ident(ref i)) = callee.as_expr().map(|v| &**v) {
            if i.sym == js_word!("eval") {
                self.found = true;
            }
        }
    }
}
