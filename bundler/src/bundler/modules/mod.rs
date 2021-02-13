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

use crate::util::MapWithMut;
use crate::ModuleId;

mod sort;
#[cfg(test)]
mod tests;
#[derive(Debug, Clone)]
pub struct Modules {
    /// Indicates that a statement is injected.
    ///
    /// Note: This context shoulod be shared for a bundle.
    pub(crate) injected_ctxt: SyntaxContext,

    // We will change this into `Vec<Module>`.
    modules: Vec<(ModuleId, Module)>,
    prepended: Vec<ModuleItem>,
    injected: Vec<ModuleItem>,
}

impl Modules {
    pub fn empty(injected_ctxt: SyntaxContext) -> Self {
        Self {
            injected_ctxt,
            modules: Default::default(),
            prepended: Default::default(),
            injected: Default::default(),
        }
    }

    pub fn from(module: Module, injected_ctxt: SyntaxContext) -> Self {
        let mut ret = Self::empty(injected_ctxt);
        ret.modules.push(module);
        ret
    }

    pub fn into_items(self) -> Vec<ModuleItem> {
        // self.sort();
        // self.modules.pop().unwrap().body
        self.prepended
            .into_iter()
            .chain(self.modules.into_iter().flat_map(|v| v.body))
            .chain(self.injected)
            .collect()
    }

    /// Entry module is stored as a last element.
    pub fn add_dep(&mut self, mut dep: Modules) {
        dep.prepended.append(&mut self.prepended);

        let entry = self.modules.pop();
        let modules = self.modules.take().into_iter();
        let mut new = vec![];
        new.extend(modules);
        new.extend(dep.modules.into_iter());
        new.extend(entry);

        dep.modules = new;
        dep.injected.append(&mut self.injected);
        *self = dep;
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
                let body = op(take(&mut m.body));

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
    pub fn inject_all(&mut self, items: impl IntoIterator<Item = ModuleItem>) {
        let injected_ctxt = self.injected_ctxt;
        self.injected.extend(items.into_iter().map(|mut item| {
            mark(&mut item, injected_ctxt);
            item
        }));
    }

    /// Insert a statement which dependency of can be analyzed statically.
    pub fn inject(&mut self, mut var: ModuleItem) {
        mark(&mut var, self.injected_ctxt);

        self.injected.push(var)
    }

    pub fn prepend(&mut self, item: ModuleItem) {
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

    pub fn visit_with<V>(&self, v: &mut V)
    where
        V: Visit,
    {
        self.prepended.visit_with(&Invalid { span: DUMMY_SP }, v);
        self.modules
            .iter()
            .for_each(|m| m.visit_with(&Invalid { span: DUMMY_SP }, v));
        self.injected.visit_with(&Invalid { span: DUMMY_SP }, v);
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

fn mark(item: &mut ModuleItem, ctxt: SyntaxContext) {
    match item {
        ModuleItem::ModuleDecl(item) => match item {
            ModuleDecl::Import(ImportDecl { span, .. })
            | ModuleDecl::ExportDecl(ExportDecl { span, .. })
            | ModuleDecl::ExportNamed(NamedExport { span, .. })
            | ModuleDecl::ExportDefaultDecl(ExportDefaultDecl { span, .. })
            | ModuleDecl::ExportDefaultExpr(ExportDefaultExpr { span, .. })
            | ModuleDecl::ExportAll(ExportAll { span, .. })
            | ModuleDecl::TsImportEquals(TsImportEqualsDecl { span, .. })
            | ModuleDecl::TsExportAssignment(TsExportAssignment { span, .. })
            | ModuleDecl::TsNamespaceExport(TsNamespaceExportDecl { span, .. }) => {
                span.ctxt = ctxt;
            }
        },
        ModuleItem::Stmt(stmt) => match stmt {
            Stmt::Empty(_) => return,
            Stmt::Block(BlockStmt { span, .. })
            | Stmt::Debugger(DebuggerStmt { span, .. })
            | Stmt::With(WithStmt { span, .. })
            | Stmt::Return(ReturnStmt { span, .. })
            | Stmt::Labeled(LabeledStmt { span, .. })
            | Stmt::Break(BreakStmt { span, .. })
            | Stmt::Continue(ContinueStmt { span, .. })
            | Stmt::If(IfStmt { span, .. })
            | Stmt::Switch(SwitchStmt { span, .. })
            | Stmt::Throw(ThrowStmt { span, .. })
            | Stmt::Try(TryStmt { span, .. })
            | Stmt::While(WhileStmt { span, .. })
            | Stmt::DoWhile(DoWhileStmt { span, .. })
            | Stmt::For(ForStmt { span, .. })
            | Stmt::ForIn(ForInStmt { span, .. })
            | Stmt::ForOf(ForOfStmt { span, .. })
            | Stmt::Expr(ExprStmt { span, .. }) => {
                span.ctxt = ctxt;
            }
            Stmt::Decl(decl) => match decl {
                Decl::Class(ClassDecl {
                    class: Class { span, .. },
                    ..
                })
                | Decl::Fn(FnDecl {
                    function: Function { span, .. },
                    ..
                })
                | Decl::Var(VarDecl { span, .. })
                | Decl::TsInterface(TsInterfaceDecl { span, .. })
                | Decl::TsTypeAlias(TsTypeAliasDecl { span, .. })
                | Decl::TsEnum(TsEnumDecl { span, .. })
                | Decl::TsModule(TsModuleDecl { span, .. }) => {
                    span.ctxt = ctxt;
                }
            },
        },
    }
}
