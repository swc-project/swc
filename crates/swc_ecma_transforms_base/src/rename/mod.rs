use std::borrow::Cow;

use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith, VisitWith};

#[cfg(feature = "concurrent-renamer")]
use self::renamer_concurrent::{Send, Sync};
#[cfg(not(feature = "concurrent-renamer"))]
use self::renamer_single::{Send, Sync};
use self::{
    analyzer::{scope::RenameMap, Analyzer},
    collector::{collect_decls, CustomBindingCollector, IdCollector},
    eval::contains_eval,
    ops::Operator,
};
use crate::hygiene::Config;

mod analyzer;
mod collector;
mod eval;
mod ops;

pub trait Renamer: Send + Sync {
    /// Should reset `n` to 0 for each identifier?
    const RESET_N: bool;

    /// It should be true if you expect lots of collisions
    const MANGLE: bool;

    fn preserved_ids_for_module(&mut self, _: &Module) -> FxHashSet<Id> {
        Default::default()
    }

    fn preserved_ids_for_script(&mut self, _: &Script) -> FxHashSet<Id> {
        Default::default()
    }

    /// Should increment `n`.
    fn new_name_for(&self, orig: &Id, n: &mut usize) -> JsWord;
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
        preserved: Default::default(),
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

    preserved: FxHashSet<Id>,
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
        has_eval: bool,
    ) -> AHashMap<Id, JsWord>
    where
        N: VisitWith<IdCollector> + VisitWith<CustomBindingCollector<Id>>,
        N: VisitWith<Analyzer>,
    {
        let mut scope = {
            let mut v = Analyzer {
                safari_10: self.config.safari_10,
                has_eval,
                top_level_mark: self.config.top_level_mark,

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

        let mut map = RenameMap::default();

        let mut unresolved = if !is_module_or_script {
            let mut unresolved = self.unresolved.clone();
            unresolved.extend(self.get_unresolved(node));
            Cow::Owned(unresolved)
        } else {
            Cow::Borrowed(&self.unresolved)
        };

        if !self.preserved.is_empty() {
            unresolved
                .to_mut()
                .extend(self.preserved.iter().map(|v| v.0.clone()));
        }

        if R::MANGLE {
            let cost = scope.rename_cost();
            scope.rename_in_mangle_mode(
                &self.renamer,
                &mut map,
                &Default::default(),
                &Default::default(),
                &self.preserved,
                &unresolved,
                cost > 1024,
            );
        } else {
            scope.rename_in_normal_mode(
                &self.renamer,
                &mut map,
                &Default::default(),
                &mut Default::default(),
                &unresolved,
            );
        }

        map.into_iter()
            .map(|((s, ctxt), v)| ((s.into_inner(), ctxt), v))
            .collect()
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
                let map = self.get_map(n, false, false, false);

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
                let map = self.get_map(n, true, false, false);

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
        self.preserved = self.renamer.preserved_ids_for_module(m);
        self.unresolved = self.get_unresolved(m);

        let has_eval = contains_eval(m, true);

        {
            let map = self.get_map(m, false, true, has_eval);

            m.visit_mut_with(&mut rename_with_config(&map, self.config.clone()));
        }

        if has_eval {
            m.visit_mut_children_with(self);
        }
    }

    fn visit_mut_script(&mut self, m: &mut Script) {
        self.preserved = self.renamer.preserved_ids_for_script(m);
        self.unresolved = self.get_unresolved(m);

        let has_eval = contains_eval(m, true);

        {
            let map = self.get_map(m, false, true, has_eval);

            m.visit_mut_with(&mut rename_with_config(&map, self.config.clone()));
        }

        if has_eval {
            m.visit_mut_children_with(self);
        }
    }
}

#[cfg(feature = "concurrent-renamer")]
mod renamer_concurrent {
    pub use std::marker::{Send, Sync};
}

#[cfg(not(feature = "concurrent-renamer"))]
mod renamer_single {
    /// Dummy trait because swc_common is in single thread mode.
    pub trait Send {}
    /// Dummy trait because swc_common is in single thread mode.
    pub trait Sync {}

    impl<T> Send for T where T: ?Sized {}
    impl<T> Sync for T where T: ?Sized {}
}

struct HygieneRemover;

impl VisitMut for HygieneRemover {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        i.span.ctxt = Default::default();
    }
}
