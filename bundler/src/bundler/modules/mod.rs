use crate::util::MapWithMut;
use retain_mut::RetainMut;
use std::mem::take;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::Module;
use swc_ecma_ast::ModuleItem;
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

mod sort;
#[cfg(test)]
mod tests;
#[derive(Debug, Clone)]
pub struct Modules {
    // We will change this into `Vec<Module>`.
    modules: Vec<Module>,
    prepended: Vec<ModuleItem>,
    injected: Vec<ModuleItem>,
}

impl Modules {
    pub fn empty() -> Self {
        Self {
            modules: Default::default(),
            prepended: Default::default(),
            injected: Default::default(),
        }
    }

    pub fn into_items(mut self) -> Vec<ModuleItem> {
        self.sort();
        self.modules.pop().unwrap().body
    }

    pub fn prepend_all(&mut self, mut other: Modules) {
        other.prepended.append(&mut self.prepended);
        other.modules.append(&mut self.modules);
        other.injected.append(&mut self.injected);
        *self = other;
    }

    pub fn push_all(&mut self, item: Modules) {
        self.prepended.extend(item.prepended);
        self.modules.extend(item.modules);
        self.injected.extend(item.injected);
    }

    pub fn iter(&self) -> impl Iterator<Item = &ModuleItem> {
        self.prepended
            .iter()
            .chain(self.modules.iter().flat_map(|m| m.body.iter()))
            .chain(self.injected.iter())
    }

    pub fn iter_mut(&mut self) -> impl Iterator<Item = &mut ModuleItem> {
        self.prepended
            .iter_mut()
            .chain(self.modules.iter_mut().flat_map(|m| m.body.iter_mut()))
            .chain(self.injected.iter_mut())
    }

    pub fn map_any_items<F>(&mut self, mut op: F)
    where
        F: FnMut(Vec<ModuleItem>) -> Vec<ModuleItem>,
    {
        self.prepended = op(take(&mut self.prepended));
        self.modules = take(&mut self.modules)
            .into_iter()
            .map(|mut m| {
                let mut body = op(take(&mut m.body));

                body.retain_mut(|item| {
                    if item.span().is_dummy() {
                        self.injected.push(item.take());
                        false
                    } else {
                        true
                    }
                });

                Module { body, ..m }
            })
            .collect();
        self.injected = op(take(&mut self.injected));
    }

    pub fn map_items_mut<F>(&mut self, mut op: F)
    where
        F: FnMut(&mut ModuleItem),
    {
        self.iter_mut().for_each(|item| {
            op(item);
        })
    }

    /// Insert a statement which dependency of can be analyzed statically.
    pub fn inject_all(&mut self, items: Vec<ModuleItem>) {
        assert!(items.iter().all(|v| v.span().is_dummy()));
        self.injected.extend(items);
    }

    /// Insert a statement which dependency of can be analyzed statically.
    pub fn inject(&mut self, var: ModuleItem) {
        assert!(var.span().is_dummy());

        self.injected.push(var)
    }

    pub fn prepend(&mut self, item: ModuleItem) {
        assert!(item.span().is_dummy());

        self.prepended.push(item)
    }

    pub fn visit_mut_with<V>(&mut self, v: &mut V)
    where
        V: VisitMut,
    {
        self.prepended.visit_mut_with(&mut *v);
        for module in &mut self.modules {
            module.visit_mut_with(&mut *v);
        }
        self.injected.visit_mut_with(&mut *v);
    }

    pub fn fold_with<V>(mut self, v: &mut V) -> Self
    where
        V: Fold,
    {
        self.prepended = self.prepended.fold_with(&mut *v);
        self.modules = self
            .modules
            .into_iter()
            .map(|m| m.fold_with(&mut *v))
            .collect();
        self.injected = self.injected.fold_with(&mut *v);

        self
    }

    pub fn retain_mut<F>(&mut self, mut op: F)
    where
        F: FnMut(&mut ModuleItem) -> bool,
    {
        self.prepended.retain_mut(&mut op);
        for module in &mut self.modules {
            module.body.retain_mut(&mut op);
        }
        self.injected.retain_mut(&mut op);
    }
}

impl From<Module> for Modules {
    fn from(module: Module) -> Self {
        Self {
            modules: vec![module],
            prepended: Default::default(),
            injected: Default::default(),
        }
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
