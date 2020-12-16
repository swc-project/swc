use retain_mut::RetainMut;
use std::mem::take;
use swc_common::DUMMY_SP;
use swc_ecma_ast::Module;
use swc_ecma_ast::ModuleItem;
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

mod sort;

#[derive(Debug, Clone)]
pub struct Modules {
    // We will change this into `Vec<Module>`.
    body: Vec<ModuleItem>,
    prepended: Vec<ModuleItem>,
    injected: Vec<ModuleItem>,
}

impl Modules {
    pub fn empty() -> Self {
        Self {
            body: Default::default(),
            prepended: Default::default(),
            injected: Default::default(),
        }
    }

    pub fn into_items(self) -> Vec<ModuleItem> {
        self.prepended
            .into_iter()
            .chain(self.body)
            .chain(self.injected)
            .collect()
    }

    pub fn push_all(&mut self, item: Modules) {
        self.prepended.extend(item.prepended);
        self.body.extend(item.body);
        self.injected.extend(item.injected);
    }

    pub fn iter(&self) -> impl Iterator<Item = &ModuleItem> {
        self.prepended
            .iter()
            .chain(self.body.iter())
            .chain(self.injected.iter())
    }

    pub fn iter_mut(&mut self) -> impl Iterator<Item = &mut ModuleItem> {
        self.prepended
            .iter_mut()
            .chain(self.body.iter_mut())
            .chain(self.injected.iter_mut())
    }

    pub fn map<F>(&mut self, mut op: F)
    where
        F: FnMut(Vec<ModuleItem>) -> Vec<ModuleItem>,
    {
        self.prepended = op(take(&mut self.prepended));
        self.body = op(take(&mut self.body));
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
        self.injected.extend(items);
    }

    /// Insert a statement which dependency of can be analyzed statically.
    pub fn inject(&mut self, var: ModuleItem) {
        self.injected.push(var)
    }

    pub fn prepend(&mut self, item: ModuleItem) {
        self.prepended.push(item)
    }

    pub fn visit_mut_with<V>(&mut self, v: &mut V)
    where
        V: VisitMut,
    {
        self.body.visit_mut_with(&mut *v);
        // self.injected.visit_mut_with(&mut *v);
    }

    pub fn fold_with<V>(mut self, v: &mut V) -> Self
    where
        V: Fold,
    {
        self.prepended = self.prepended.fold_with(&mut *v);
        self.body = self.body.fold_with(&mut *v);
        self.injected = self.injected.fold_with(&mut *v);

        self
    }

    pub fn retain_mut<F>(&mut self, mut op: F)
    where
        F: FnMut(&mut ModuleItem) -> bool,
    {
        self.prepended.retain_mut(&mut op);
        self.body.retain_mut(&mut op);
        self.injected.retain_mut(&mut op);
    }
}

impl From<Module> for Modules {
    fn from(module: Module) -> Self {
        Self {
            body: module.body,
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
            body: modules.body,
            shebang: None,
        }
    }
}
