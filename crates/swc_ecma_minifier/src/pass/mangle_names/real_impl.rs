use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::hygiene::rename;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};
use tracing::info;

use super::{analyzer::Analyzer, preserver::idents_to_preserve};
use crate::{debug::dump, marks::Marks, option::MangleOptions, util::contains_eval};

pub(crate) fn name_mangler(options: MangleOptions, marks: Marks) -> impl VisitMut {
    Mangler {
        options,
        unresolved_ctxt: SyntaxContext::empty().apply_mark(marks.unresolved_mark),
        preserved: Default::default(),
        unresolved: Default::default(),
    }
}

struct Mangler {
    options: MangleOptions,

    unresolved_ctxt: SyntaxContext,

    preserved: FxHashSet<Id>,
    unresolved: FxHashSet<JsWord>,
}

impl Mangler {
    fn get_map<N>(&self, node: &N) -> AHashMap<Id, JsWord>
    where
        N: VisitWith<Analyzer>,
    {
        let mut analyzer = Analyzer {
            scope: Default::default(),
            is_pat_decl: Default::default(),
        };
        node.visit_with(&mut analyzer);

        analyzer.into_rename_map(&self.preserved, &self.unresolved)
    }
}

/// Mark a node as a unit of minification.
///
/// This is
macro_rules! unit {
    ($name:ident, $T:ty) => {
        /// Only called if `eval` exists
        fn $name(&mut self, n: &mut $T) {
            if contains_eval(n, true) {
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
        let v = idents_to_preserve(self.options.clone(), self.unresolved_ctxt, &*m);
        self.preserved = v.0;
        self.unresolved = v.1;

        if option_env!("DEBUG_MANGLER") == Some("1") {
            info!("Before: {}", dump(&*m, true));
        }

        if contains_eval(m, true) {
            m.visit_mut_children_with(self);
        } else {
            let map = self.get_map(m);

            m.visit_mut_with(&mut rename(&map));
        }

        if option_env!("DEBUG_MANGLER") == Some("1") {
            info!("After: {}", dump(&*m, true));
        }
    }

    fn visit_mut_script(&mut self, s: &mut Script) {
        let v = idents_to_preserve(self.options.clone(), self.unresolved_ctxt, &*s);
        self.preserved = v.0;
        self.unresolved = v.1;

        if contains_eval(s, true) {
            s.visit_mut_children_with(self);
            return;
        }

        let map = self.get_map(s);

        s.visit_mut_with(&mut rename(&map));
    }
}
