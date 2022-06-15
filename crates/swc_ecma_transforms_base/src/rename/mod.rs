use std::collections::HashMap;

use swc_atoms::JsWord;
use swc_common::{chain, collections::AHashMap};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls, BindingCollector};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith, VisitWith};

use self::{analyzer::Analyzer, collector::IdCollector, ops::Operator};

mod analyzer;
mod collector;
mod ops;
#[cfg(test)]
mod tests;

pub trait Renamer: swc_common::sync::Send + swc_common::sync::Sync {
    fn new_name_for(&self, previous: &Id, n: u32) -> JsWord;
}

pub fn rename(map: &AHashMap<Id, JsWord>) -> impl '_ + Fold + VisitMut {
    as_folder(Operator {
        rename: map,
        config: Default::default(),
        extra: Default::default(),
    })
}
#[derive(Debug, Default)]
struct Hygiene {
    config: Config,
}

impl Hygiene {
    fn analyze_root<N>(&mut self, n: &mut N)
    where
        N: VisitWith<IdCollector>,
        N: VisitWith<Analyzer>,
        N: VisitWith<BindingCollector<Id>>,
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
            .collect();

        let mut map = HashMap::default();
        {
            scope.prepare_renaming();

            scope.rename(
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

impl VisitMut for Hygiene {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        self.analyze_root(n);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        self.analyze_root(n);
    }
}
