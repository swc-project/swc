use std::hash::Hash;

use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::hygiene::rename;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};
use tracing::info;

use super::{analyzer::Analyzer, preserver::idents_to_preserve};
use crate::{
    debug::dump,
    marks::Marks,
    option::MangleOptions,
    util::{contains_eval, idents_used_by, IdentUsageCollector},
};

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
    fn get_map<N>(&self, node: &N, skip_one: bool) -> AHashMap<Id, JsWord>
    where
        N: VisitWith<Analyzer>
            + VisitWith<IdentUsageCollector>
            + VisitWith<CustomBindingCollector<Id>>,
    {
        let mut analyzer = Analyzer {
            scope: Default::default(),
            is_pat_decl: Default::default(),
        };
        if skip_one {
            node.visit_children_with(&mut analyzer);
        } else {
            node.visit_with(&mut analyzer);
        }

        let used = idents_used_by(node);
        let local_decls = collect_decls(node);

        let mut unresolved = self.unresolved.clone();
        for id in used {
            if !local_decls.contains(&id) {
                unresolved.insert(id.0);
            }
        }
        analyzer.into_rename_map(&self.preserved, &unresolved)
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
                let map = self.get_map(n, false);

                n.visit_mut_with(&mut rename(&map));
            }
        }
    };
    ($name:ident, $T:ty, true) => {
        /// Only called if `eval` exists
        fn $name(&mut self, n: &mut $T) {
            if contains_eval(n, true) {
                n.visit_mut_children_with(self);
            } else {
                let map = self.get_map(n, true);

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

    unit!(visit_mut_fn_decl, FnDecl, true);

    unit!(visit_mut_class_decl, ClassDecl, true);

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
            let map = self.get_map(m, false);

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

        let map = self.get_map(s, false);

        s.visit_mut_with(&mut rename(&map));
    }
}

struct CustomBindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    only: Option<SyntaxContext>,
    bindings: FxHashSet<I>,
    is_pat_decl: bool,
}

impl<I> CustomBindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    fn add(&mut self, i: &Ident) {
        if let Some(only) = self.only {
            if only != i.span.ctxt {
                return;
            }
        }

        self.bindings.insert(I::from_ident(i));
    }
}

impl<I> Visit for CustomBindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        let old = self.is_pat_decl;

        for p in &n.params {
            self.is_pat_decl = true;
            p.visit_with(self);
        }

        n.body.visit_with(self);
        self.is_pat_decl = old;
    }

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp) {
        node.value.visit_with(self);

        if self.is_pat_decl {
            self.add(&node.key);
        }
    }

    fn visit_catch_clause(&mut self, node: &CatchClause) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        node.param.visit_with(self);

        self.is_pat_decl = false;
        node.body.visit_with(self);
        self.is_pat_decl = old;
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        node.visit_children_with(self);

        self.add(&node.ident);
    }

    fn visit_class_expr(&mut self, node: &ClassExpr) {
        node.visit_children_with(self);

        if let Some(id) = &node.ident {
            self.add(id);
        }
    }

    fn visit_expr(&mut self, node: &Expr) {
        let old = self.is_pat_decl;
        self.is_pat_decl = false;
        node.visit_children_with(self);
        self.is_pat_decl = old;
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        node.visit_children_with(self);

        self.add(&node.ident);
    }

    fn visit_fn_expr(&mut self, node: &FnExpr) {
        node.visit_children_with(self);

        if let Some(id) = &node.ident {
            self.add(id);
        }
    }

    fn visit_import_default_specifier(&mut self, node: &ImportDefaultSpecifier) {
        self.add(&node.local);
    }

    fn visit_import_named_specifier(&mut self, node: &ImportNamedSpecifier) {
        self.add(&node.local);
    }

    fn visit_import_star_as_specifier(&mut self, node: &ImportStarAsSpecifier) {
        self.add(&node.local);
    }

    fn visit_param(&mut self, node: &Param) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        node.visit_children_with(self);
        self.is_pat_decl = old;
    }

    fn visit_pat(&mut self, node: &Pat) {
        node.visit_children_with(self);

        if self.is_pat_decl {
            if let Pat::Ident(i) = node {
                self.add(&i.id)
            }
        }
    }

    fn visit_var_declarator(&mut self, node: &VarDeclarator) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        node.name.visit_with(self);

        self.is_pat_decl = false;
        node.init.visit_with(self);
        self.is_pat_decl = old;
    }
}

fn collect_decls<I, N>(n: &N) -> FxHashSet<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
    N: VisitWith<CustomBindingCollector<I>>,
{
    let mut v = CustomBindingCollector {
        only: None,
        bindings: Default::default(),
        is_pat_decl: false,
    };
    n.visit_with(&mut v);
    v.bindings
}
