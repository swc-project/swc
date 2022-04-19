use rustc_hash::FxHashSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::hygiene::rename;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_obj_and_computed, Visit, VisitMut, VisitMutWith,
    VisitWith,
};

use super::{analyzer::Analyzer, preserver::idents_to_preserve};
use crate::{marks::Marks, option::MangleOptions};

pub(crate) fn name_mangler(
    options: MangleOptions,
    _marks: Marks,
    _top_level_ctxt: SyntaxContext,
) -> impl VisitMut {
    Mangler {
        options,
        preserved: Default::default(),
    }
}

struct Mangler {
    options: MangleOptions,

    preserved: FxHashSet<Id>,
}

impl Mangler {
    fn contains_eval<N>(&self, node: &N) -> bool
    where
        N: VisitWith<EvalFinder>,
    {
        let mut v = EvalFinder { found: false };
        node.visit_with(&mut v);
        v.found
    }

    fn get_map<N>(&self, node: &N) -> AHashMap<Id, JsWord>
    where
        N: VisitWith<Analyzer>,
    {
        let mut analyzer = Analyzer {
            scope: Default::default(),
            is_pat_decl: Default::default(),
        };
        node.visit_with(&mut analyzer);

        analyzer.into_rename_map(&self.preserved)
    }
}

/// Mark a node as a unit of minification.
///
/// This is
macro_rules! unit {
    ($name:ident, $T:ty) => {
        /// Only called if `eval` exists
        fn $name(&mut self, n: &mut $T) {
            if self.contains_eval(n) {
                n.visit_mut_children_with(self);
            } else {
                let map = self.get_map(n);

                n.visit_mut_with(&mut rename(&map));
            }
        }
    };
}

impl VisitMut for Mangler {
    noop_visit_mut_type!();

    unit!(visit_mut_arrow_expr, ArrowExpr);

    unit!(visit_mut_setter_prop, SetterProp);

    unit!(visit_mut_getter_prop, GetterProp);

    unit!(visit_mut_constructor, Constructor);

    unit!(visit_mut_fn_expr, FnExpr);

    unit!(visit_mut_method_prop, MethodProp);

    unit!(visit_mut_class_method, ClassMethod);

    unit!(visit_mut_private_method, PrivateMethod);

    fn visit_mut_module(&mut self, m: &mut Module) {
        self.preserved = idents_to_preserve(self.options.clone(), &*m);

        if self.contains_eval(m) {
            m.visit_mut_children_with(self);
            return;
        }

        let map = self.get_map(m);

        m.visit_mut_with(&mut rename(&map));
    }

    fn visit_mut_script(&mut self, s: &mut Script) {
        if self.contains_eval(s) {
            return;
        }

        self.preserved = idents_to_preserve(self.options.clone(), &*s);

        if self.contains_eval(s) {
            s.visit_mut_children_with(self);
            return;
        }

        let map = self.get_map(s);

        s.visit_mut_with(&mut rename(&map));
    }
}

struct EvalFinder {
    found: bool,
}

impl Visit for EvalFinder {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, i: &Ident) {
        if i.sym == js_word!("eval") {
            self.found = true;
        }
    }
}
