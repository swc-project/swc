use super::merge::Unexporter;
use crate::{
    bundler::load::TransformedModule, debug::print_hygiene, Bundler, Load, ModuleId, Resolve,
};
use hygiene::top_level_ident_folder;
use std::{borrow::Borrow, iter::once};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, FoldWith, Node, Visit, VisitWith};

mod hygiene;

/// Circular imports are hard to handle.
///
/// We use some dedicated method to handle circular dependencies.
impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_circular_modules(
        &self,
        entry_id: ModuleId,
        circular_modules: &mut Vec<ModuleId>,
    ) -> Module {
        assert!(
            circular_modules.len() >= 1,
            "# of circular modules should be 2 or greater than 2 including entry. Got {:?}",
            circular_modules
        );
        debug_assert!(
            self.scope.is_circular(entry_id),
            "merge_circular_modules should only be called for circular entries"
        );

        let entry_module = self.scope.get_module(entry_id).unwrap();

        let modules = circular_modules
            .iter()
            .chain(once(&entry_id))
            .map(|&id| self.scope.get_module(id).unwrap())
            .collect::<Vec<_>>();

        let mut entry = self.process_circular_module(&modules, entry_module);

        for &dep in &*circular_modules {
            let new_module = self.merge_two_circular_modules(&modules, entry, dep);

            entry = new_module;
        }

        // All circular modules are inlined
        circular_modules.clear();
        circular_modules.push(entry_id);

        entry
    }

    /// Merges `a` and `b` into one module.
    fn merge_two_circular_modules(
        &self,
        circular_modules: &[TransformedModule],
        mut entry: Module,
        dep: ModuleId,
    ) -> Module {
        self.run(|| {
            let dep_info = self.scope.get_module(dep).unwrap();
            let mut dep = self.process_circular_module(circular_modules, dep_info);

            print_hygiene("entry:merge_two_circular_modules", &self.cm, &entry);
            print_hygiene("dep:merge_two_circular_modules", &self.cm, &dep);

            dep = dep.fold_with(&mut Unexporter);

            // Merge code
            entry.body = merge_respecting_order(entry.body, dep.body);

            print_hygiene("END :merge_two_circular_modules", &self.cm, &entry);
            entry
        })
    }

    ///
    ///  - Remove cicular imnports
    fn process_circular_module(
        &self,
        circular_modules: &[TransformedModule],
        entry: TransformedModule,
    ) -> Module {
        let mut module = (*entry.module).clone();
        // print_hygiene("START: process_circular_module", &self.cm, &module);

        module.body.retain(|item| {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    // Drop if it's one of circular import
                    for circular_module in circular_modules {
                        if entry
                            .imports
                            .specifiers
                            .iter()
                            .any(|v| v.0.module_id == circular_module.id && v.0.src == import.src)
                        {
                            log::debug!("Dropping circular import");
                            return false;
                        }
                    }
                }
                _ => {}
            }

            true
        });

        module = module.fold_with(&mut top_level_ident_folder(
            self.top_level_mark,
            entry.mark(),
        ));

        // print_hygiene("END: process_circular_module", &self.cm, &module);

        module
    }
}

/// Originally, this method should create a dependency graph, but
fn merge_respecting_order(mut entry: Vec<ModuleItem>, mut dep: Vec<ModuleItem>) -> Vec<ModuleItem> {
    let mut new = Vec::with_capacity(entry.len() + dep.len());

    // While looping over items from entry, we check for dependency.
    loop {
        if entry.is_empty() {
            log::debug!("entry is empty");
            break;
        }
        let item = entry.drain(..=0).next().unwrap();

        // Everything from  dep is injected
        if dep.is_empty() {
            log::trace!("dep is empty");
            new.push(item);
            new.extend(entry);
            break;
        }

        // If the code of entry depends on dependency, we insert dependency source code
        // at the position.
        if let Some(pos) = dependency_index(&item, &dep) {
            log::trace!("Found depndency: {}", pos);

            new.extend(dep.drain(..=pos));
            new.push(item);
            continue;
        }

        // We checked the length of `dep`
        if let Some(pos) = dependency_index(&dep[0], &[&item]) {
            log::trace!("Found reverse depndency (index[0]): {}", pos);

            new.extend(entry.drain(..=pos));
            new.extend(dep.drain(..=0));
            continue;
        }

        if let Some(pos) = dependency_index(&dep[0], &entry) {
            log::trace!("Found reverse depndency: {}", pos);

            new.extend(entry.drain(..=pos));
            new.extend(dep.drain(..=0));
            continue;
        }

        log::debug!("No dependency");

        new.push(item);
    }

    // Append remaining statements.
    new.extend(dep);

    new
}

/// Searches for top level declaration which provides requirements for `deps`.
fn dependency_index<T>(item: &ModuleItem, deps: &[T]) -> Option<usize>
where
    T: Borrow<ModuleItem>,
{
    let mut v = DepFinder { deps, idx: None };
    item.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    v.idx
}

struct DepFinder<'a, T>
where
    T: Borrow<ModuleItem>,
{
    deps: &'a [T],
    idx: Option<usize>,
}

impl<T> Visit for DepFinder<'_, T>
where
    T: Borrow<ModuleItem>,
{
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if self.idx.is_some() {
            return;
        }

        for (idx, dep) in self.deps.iter().enumerate() {
            match dep.borrow() {
                ModuleItem::Stmt(Stmt::Decl(Decl::Class(decl))) => {
                    log::trace!(
                        "Decl (from dep) = {}{:?}, Ident = {}{:?}",
                        decl.ident.sym,
                        decl.ident.span.ctxt,
                        i.sym,
                        i.span.ctxt
                    );
                    if decl.ident.sym == i.sym && decl.ident.span.ctxt == i.span.ctxt {
                        self.idx = Some(idx);
                        break;
                    }
                }
                _ => {}
            }
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e as _, self);

        if e.computed {
            e.prop.visit_with(e as _, self)
        }
    }

    fn visit_class_member(&mut self, _: &ClassMember, _: &dyn Node) {}
    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}

    /// We only search for top-level binding
    #[inline]
    fn visit_stmts(&mut self, _: &[Stmt], _: &dyn Node) {}
    /// We only search for top-level binding
    #[inline]
    fn visit_block_stmt(&mut self, _: &BlockStmt, _: &dyn Node) {}
}
