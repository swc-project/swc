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

    pub fn add_dep(&mut self, mut dep: Modules) {
        self.push_all(dep)
    }

    pub fn push_all(&mut self, other: Modules) {
        self.prepended_stmts.extend(other.prepended_stmts);
        self.appended_stmts.extend(other.appended_stmts);
        self.modules.extend(other.modules);
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
        F: FnMut(Vec<ModuleItem>) -> Vec<ModuleItem>,
    {
        let mut p = take(&mut self.prepended_stmts);
        self.prepended_stmts = p.into_iter().map(|(id, items)| (id, op(items))).collect();

        self.modules = take(&mut self.modules)
            .into_iter()
            .map(|mut m| {
                let body = op(take(&mut m.1.body));

                (m.0, Module { body, ..m.1 })
            })
            .collect();

        let mut a = take(&mut self.appended_stmts);
        self.appended_stmts = a.into_iter().map(|(id, items)| (id, op(items))).collect();
    }

    pub fn map_items_mut<F>(&mut self, mut op: F)
    where
        F: FnMut(ModuleId, &mut ModuleItem),
    {
        self.iter_mut().for_each(|item| op(item))
    }

    /// Insert a statement which dependency of can be analyzed statically.
    pub fn inject_all(&mut self, items: impl IntoIterator<Item = (ModuleId, ModuleItem)>) {
        let injected_ctxt = self.injected_ctxt;
        self.injected.extend(items.into_iter().map(|mut item| {
            mark(&mut item, injected_ctxt);
            item
        }));
    }

    pub fn append(&mut self, module_id: ModuleId, mut item: ModuleItem) {
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
        self.iter_mut().for_each(|v| v.1.visit_mut_with(v));
    }

    pub fn fold_with<V>(mut self, v: &mut V) -> Self
    where
        V: Fold,
    {
        self.prepended = self.prepended.fold_with(&mut *v);
        self.modules = self
            .modules
            .into_iter()
            .map(|m| (m.0, m.1.fold_with(&mut *v)))
            .collect();
        self.injected = self.injected.fold_with(&mut *v);

        self
    }

    pub fn visit_with<V>(&self, v: &mut V)
    where
        V: Visit,
    {
        self.iter()
            .for_each(|v| v.1.visit_with(&Invalid { span: DUMMY_SP }, v));
    }

    pub fn retain_mut<F>(&mut self, mut op: F)
    where
        F: FnMut(&mut ModuleItem) -> bool,
    {
        self.prepended_stmts.iter_mut().for_each(|(_, v)| op(v));

        for module in &mut self.modules {
            module.1.body.retain_mut(&mut op);
        }

        self.appended_stmts.iter_mut().for_each(|(_, v)| op(v));
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
