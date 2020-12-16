use swc_common::DUMMY_SP;
use swc_ecma_ast::Module;
use swc_ecma_ast::ModuleItem;
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

#[derive(Debug, Clone)]
pub struct Modules {
    // We will change this into `Vec<Module>`.
    pub body: Vec<ModuleItem>,

    injected: Vec<ModuleItem>,
}

impl Modules {
    pub fn empty() -> Self {
        Self {
            body: Default::default(),
            injected: Default::default(),
        }
    }

    pub fn iter_mut(&mut self) -> impl Iterator<Item = &mut ModuleItem> {
        self.body.iter_mut().chain(self.injected.iter_mut())
    }

    /// Insert a statement which dependency of can be analyzed statically.
    pub fn inject(&mut self, var: ModuleItem) {
        self.injected.push(var)
    }

    pub fn visit_mut_with<V>(&mut self, v: &mut V)
    where
        V: VisitMut,
    {
        self.body.visit_mut_with(&mut *v);
        self.injected.visit_mut_with(&mut *v);
    }

    pub fn fold_with<V>(mut self, v: &mut V) -> Self
    where
        V: Fold,
    {
        self.body = self.body.fold_with(&mut *v);
        self.injected = self.injected.fold_with(&mut *v);

        self
    }
}

impl From<Module> for Modules {
    fn from(module: Module) -> Self {
        Self {
            body: module.body,
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
