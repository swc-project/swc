use std::collections::HashMap;

use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith, VisitWith};

use self::{
    analyzer::Analyzer,
    collector::{collect_decls, CustomBindingCollector, IdCollector},
    eval::contains_eval,
    ops::Operator,
};
use crate::hygiene::Config;

mod analyzer;
mod collector;
mod eval;
mod ops;

pub trait Renamer: Sized + swc_common::sync::Send + swc_common::sync::Sync {
    /// Should reset `n` to 0 for each identifier?
    const RESET_N: bool;

    fn new_name_for(&self, orig: &Id, n: u32) -> JsWord;
}

pub fn rename(map: &AHashMap<Id, JsWord>) -> impl '_ + Fold + VisitMut {
    rename_with_config(map, Default::default())
}

pub fn rename_with_config(map: &AHashMap<Id, JsWord>, config: Config) -> impl '_ + Fold + VisitMut {
    as_folder(Operator {
        rename: map,
        config,
        extra: Default::default(),
    })
}

pub fn renamer<R>(config: Config, renamer: R) -> impl Fold + VisitMut
where
    R: Renamer,
{
    as_folder(RenamePass {
        config,
        renamer,
        unresolved: Default::default(),
    })
}

#[derive(Debug, Default)]
struct RenamePass<R>
where
    R: Renamer,
{
    config: Config,
    renamer: R,

    unresolved: FxHashSet<JsWord>,
}

impl<R> RenamePass<R>
where
    R: Renamer,
{
    fn get_unresolved<N>(&self, n: &N) -> FxHashSet<JsWord>
    where
        N: VisitWith<IdCollector> + VisitWith<CustomBindingCollector<Id>>,
    {
        let usages = {
            let mut v = IdCollector {
                ids: Default::default(),
            };
            n.visit_with(&mut v);
            v.ids
        };
        let decls = collect_decls(n);
        usages
            .into_iter()
            .filter(|used_id| !decls.contains(used_id))
            .map(|v| v.0)
            .collect()
    }

    fn get_map<N>(
        &self,
        node: &N,
        skip_one: bool,
        is_module_or_script: bool,
    ) -> AHashMap<Id, JsWord>
    where
        N: VisitWith<IdCollector> + VisitWith<CustomBindingCollector<Id>>,
        N: VisitWith<Analyzer>,
    {
        let mut scope = {
            let mut v = Analyzer {
                ..Default::default()
            };
            if skip_one {
                node.visit_children_with(&mut v);
            } else {
                node.visit_with(&mut v);
            }
            v.scope
        };
        scope.prepare_renaming();

        let mut map = HashMap::default();

        if !is_module_or_script {
            let mut unresolved = self.unresolved.clone();
            unresolved.extend(self.get_unresolved(node));

            scope.rename(
                &self.renamer,
                &mut map,
                &Default::default(),
                &mut Default::default(),
                &unresolved,
            );
        } else {
            scope.rename(
                &self.renamer,
                &mut map,
                &Default::default(),
                &mut Default::default(),
                &self.unresolved,
            );
        }

        map
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
                let map = self.get_map(n, false, false);

                n.visit_mut_with(&mut rename_with_config(&map, self.config.clone()));
            }
        }
    };
    ($name:ident, $T:ty, true) => {
        /// Only called if `eval` exists
        fn $name(&mut self, n: &mut $T) {
            if contains_eval(n, true) {
                n.visit_mut_children_with(self);
            } else {
                let map = self.get_map(n, true, false);

                n.visit_mut_with(&mut rename_with_config(&map, self.config.clone()));
            }
        }
    };
}

impl<R> VisitMut for RenamePass<R>
where
    R: Renamer,
{
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
        self.unresolved = self.get_unresolved(m);

        if contains_eval(m, true) {
            m.visit_mut_children_with(self);
        } else {
            let map = self.get_map(m, false, true);

            m.visit_mut_with(&mut rename_with_config(&map, self.config.clone()));
        }
    }

    fn visit_mut_script(&mut self, s: &mut Script) {
        self.unresolved = self.get_unresolved(s);

        if contains_eval(s, true) {
            s.visit_mut_children_with(self);
            return;
        }

        let map = self.get_map(s, false, true);

        s.visit_mut_with(&mut rename_with_config(&map, self.config.clone()));
    }
}
