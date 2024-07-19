use std::mem::take;

use swc_common::{collections::AHashMap, SourceMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith, Visit, VisitMut, VisitMutWith, VisitWith};

use crate::ModuleId;

mod sort;

#[derive(Debug, Clone)]
pub struct Modules {
    /// Indicates that a statement is injected.
    ///
    /// Note: This context should be shared for a bundle.
    pub(crate) injected_ctxt: SyntaxContext,

    // We will change this into `Vec<Module>`.
    modules: Vec<(ModuleId, Module)>,
    prepended_stmts: AHashMap<ModuleId, Vec<ModuleItem>>,
    appended_stmts: AHashMap<ModuleId, Vec<ModuleItem>>,
}

impl Modules {
    pub fn empty(injected_ctxt: SyntaxContext) -> Self {
        Self {
            injected_ctxt,
            modules: Default::default(),
            prepended_stmts: Default::default(),
            appended_stmts: Default::default(),
        }
    }

    pub fn from(id: ModuleId, module: Module, injected_ctxt: SyntaxContext) -> Self {
        let mut ret = Self::empty(injected_ctxt);
        ret.modules.push((id, module));
        ret
    }

    fn into_items(self) -> Vec<ModuleItem> {
        debug_assert!(
            self.prepended_stmts.is_empty(),
            "sort should be called before calling into_items"
        );
        debug_assert!(
            self.appended_stmts.is_empty(),
            "sort should be called before calling into_items"
        );
        self.modules.into_iter().flat_map(|v| v.1.body).collect()
    }

    pub fn add_dep(&mut self, dep: Modules) {
        self.push_all(dep)
    }

    pub fn push_all(&mut self, other: Modules) {
        for (id, stmts) in other.prepended_stmts {
            self.prepended_stmts.entry(id).or_default().extend(stmts);
        }

        for (id, stmts) in other.appended_stmts {
            self.appended_stmts.entry(id).or_default().extend(stmts);
        }

        for (id, module) in other.modules {
            if let Some(prev) = self.modules.iter_mut().find(|prev| prev.0 == id) {
                prev.1.body.extend(module.body);
            } else {
                self.modules.push((id, module));
            }
        }
    }

    pub fn iter(&self) -> impl Iterator<Item = (ModuleId, &ModuleItem)> {
        self.prepended_stmts
            .iter()
            .flat_map(|(id, stmts)| stmts.iter().map(move |stmt| (*id, stmt)))
            .chain(
                self.modules
                    .iter()
                    .flat_map(|(id, m)| m.body.iter().map(move |v| (*id, v))),
            )
            .chain(
                self.appended_stmts
                    .iter()
                    .flat_map(|(id, stmts)| stmts.iter().map(move |stmt| (*id, stmt))),
            )
    }

    pub fn iter_mut(&mut self) -> impl Iterator<Item = (ModuleId, &mut ModuleItem)> {
        self.prepended_stmts
            .iter_mut()
            .flat_map(|(id, stmts)| stmts.iter_mut().map(move |stmt| (*id, stmt)))
            .chain(
                self.modules
                    .iter_mut()
                    .flat_map(|(id, m)| m.body.iter_mut().map(move |v| (*id, v))),
            )
            .chain(
                self.appended_stmts
                    .iter_mut()
                    .flat_map(|(id, stmts)| stmts.iter_mut().map(move |stmt| (*id, stmt))),
            )
    }

    pub fn map_any_items<F>(&mut self, mut op: F)
    where
        F: FnMut(ModuleId, Vec<ModuleItem>) -> Vec<ModuleItem>,
    {
        let p = take(&mut self.prepended_stmts);
        self.prepended_stmts = p
            .into_iter()
            .map(|(id, items)| (id, op(id, items)))
            .collect();

        self.modules = take(&mut self.modules)
            .into_iter()
            .map(|mut m| {
                let body = op(m.0, take(&mut m.1.body));

                (m.0, Module { body, ..m.1 })
            })
            .collect();

        let a = take(&mut self.appended_stmts);
        self.appended_stmts = a
            .into_iter()
            .map(|(id, items)| (id, op(id, items)))
            .collect();
    }

    pub fn map_items_mut<F>(&mut self, mut op: F)
    where
        F: FnMut(ModuleId, &mut ModuleItem),
    {
        self.iter_mut().for_each(|(id, item)| op(id, item))
    }

    pub fn append_all(&mut self, items: impl IntoIterator<Item = (ModuleId, ModuleItem)>) {
        for v in items {
            self.append(v.0, v.1);
        }
    }

    pub fn append(&mut self, module_id: ModuleId, item: ModuleItem) {
        self.appended_stmts.entry(module_id).or_default().push(item);
    }

    pub fn prepend(&mut self, module_id: ModuleId, item: ModuleItem) {
        self.prepended_stmts
            .entry(module_id)
            .or_default()
            .push(item);
    }

    #[cfg(not(feature = "concurrent"))]
    pub(crate) fn par_visit_mut_with<V>(&mut self, v: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(v)
    }

    #[cfg(feature = "concurrent")]
    pub(crate) fn par_visit_mut_with<V>(&mut self, v: &mut V)
    where
        V: Clone + VisitMut + Send + Sync,
    {
        use rayon::prelude::*;

        let pre = &mut self.prepended_stmts;
        let modules = &mut self.modules;
        let app = &mut self.appended_stmts;

        rayon::scope(|s| {
            s.spawn(|_| {
                pre.par_iter_mut()
                    .for_each(|(_, stmts)| stmts.visit_mut_with(&mut v.clone()));
            });

            s.spawn(|_| {
                modules
                    .par_iter_mut()
                    .for_each(|(_, stmts)| stmts.visit_mut_with(&mut v.clone()));
            });

            s.spawn(|_| {
                app.par_iter_mut()
                    .for_each(|(_, stmts)| stmts.visit_mut_with(&mut v.clone()));
            });
        });
    }

    pub fn visit_mut_with<V>(&mut self, v: &mut V)
    where
        V: VisitMut,
    {
        self.iter_mut().for_each(|item| item.1.visit_mut_with(v));
    }

    pub fn fold_with<V>(mut self, v: &mut V) -> Self
    where
        V: Fold,
    {
        self.prepended_stmts = self
            .prepended_stmts
            .into_iter()
            .map(|(id, items)| (id, items.fold_with(&mut *v)))
            .collect();
        self.modules = self
            .modules
            .into_iter()
            .map(|m| (m.0, m.1.fold_with(&mut *v)))
            .collect();

        self.appended_stmts = self
            .appended_stmts
            .into_iter()
            .map(|(id, items)| (id, items.fold_with(&mut *v)))
            .collect();

        self
    }

    pub fn visit_with<V>(&self, v: &mut V)
    where
        V: Visit,
    {
        self.iter().for_each(|item| item.1.visit_with(v));
    }

    pub fn retain_mut<F>(&mut self, mut op: F)
    where
        F: FnMut(ModuleId, &mut ModuleItem) -> bool,
    {
        self.prepended_stmts
            .iter_mut()
            .for_each(|(id, v)| v.retain_mut(|item| op(*id, item)));

        for module in &mut self.modules {
            let id = module.0;
            module.1.body.retain_mut(|item| op(id, item));
        }

        self.appended_stmts
            .iter_mut()
            .for_each(|(id, v)| v.retain_mut(|item| op(*id, item)));
    }

    #[allow(unused)]
    #[cfg(debug_assertions)]
    pub(crate) fn print(
        &self,
        cm: &swc_common::sync::Lrc<SourceMap>,
        event: impl std::fmt::Display,
    ) {
        let files = self
            .modules
            .iter()
            .map(|(_, m)| m.span)
            .filter_map(|module_span| {
                if module_span.is_dummy() {
                    return None;
                }
                Some(format!("{}\n", cm.lookup_source_file(module_span.lo).name))
            })
            .collect::<String>();
        let mut cloned = self.clone();
        let mut stmts = Vec::new();

        for (id, mut module) in cloned.modules {
            swc_ecma_utils::prepend_stmts(
                &mut module.body,
                cloned
                    .prepended_stmts
                    .get(&id)
                    .cloned()
                    .unwrap_or_default()
                    .into_iter(),
            );

            module
                .body
                .extend(cloned.appended_stmts.get(&id).cloned().unwrap_or_default());

            stmts.extend(module.body);
        }

        crate::debug::print_hygiene(
            &format!("{}\n{}", event, files),
            cm,
            &Module {
                span: DUMMY_SP,
                body: stmts,
                shebang: None,
            },
        );
    }
}

impl From<Modules> for Module {
    fn from(modules: Modules) -> Self {
        // TODO
        Self {
            span: DUMMY_SP,
            body: modules.into_items(),
            shebang: None,
        }
    }
}
