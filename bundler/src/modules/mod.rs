use crate::ModuleId;
use ahash::AHashMap;
use retain_mut::RetainMut;
use std::mem::take;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

mod sort;

#[derive(Debug, Clone)]
pub struct Modules {
    /// Indicates that a statement is injected.
    ///
    /// Note: This context shoulod be shared for a bundle.
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
        self.iter()
            .for_each(|item| item.1.visit_with(&Invalid { span: DUMMY_SP }, v));
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
