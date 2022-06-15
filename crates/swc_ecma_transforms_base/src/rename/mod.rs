use std::collections::HashMap;

use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith, VisitWith};

use self::{
    analyzer::Analyzer,
    collector::{collect_decls, CustomBindingCollector, IdCollector},
    ops::Operator,
};
use crate::hygiene::Config;

mod analyzer;
mod collector;
mod ops;

pub trait Renamer: swc_common::sync::Send + swc_common::sync::Sync {
    fn new_name_for(&self, orig: &Id, n: u32) -> JsWord;
}

pub fn rename(map: &AHashMap<Id, JsWord>) -> impl '_ + Fold + VisitMut {
    as_folder(Operator {
        rename: map,
        config: Default::default(),
        extra: Default::default(),
    })
}

pub fn renamer<R>(config: Config, renamer: R) -> impl Fold + VisitMut
where
    R: Renamer,
{
    as_folder(RenamePass { config, renamer })
}

#[derive(Debug, Default)]
struct RenamePass<R>
where
    R: Renamer,
{
    config: Config,
    renamer: R,
}

impl<R> RenamePass<R>
where
    R: Renamer,
{
    fn analyze_root<N>(&mut self, n: &mut N)
    where
        N: VisitWith<IdCollector>,
        N: VisitWith<Analyzer>,
        N: VisitWith<CustomBindingCollector<Id>>,
        N: for<'aa> VisitMutWith<Operator<'aa>>,
    {
        let mut scope = {
            let mut v = Analyzer {
                ..Default::default()
            };
            n.visit_with(&mut v);
            v.scope
        };

        let usages = {
            let mut v = IdCollector {
                ids: Default::default(),
            };
            n.visit_with(&mut v);
            v.ids
        };
        let decls = collect_decls(n);
        let unresolved = usages
            .into_iter()
            .filter(|used_id| !decls.contains(used_id))
            .map(|v| v.0)
            .collect::<FxHashSet<_>>();

        let mut map = HashMap::default();
        {
            scope.prepare_renaming();

            scope.rename(
                &self.renamer,
                &mut map,
                &Default::default(),
                &mut Default::default(),
                &unresolved,
            );
        }

        n.visit_mut_with(&mut Operator {
            rename: &map,
            config: self.config.clone(),
            extra: Default::default(),
        });
    }
}

impl<R> VisitMut for RenamePass<R>
where
    R: Renamer,
{
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        self.analyze_root(n);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        self.analyze_root(n);
    }
}
