use super::{
    merge::{ImportDropper, Unexporter},
    plan::{CircularPlan, Plan},
};
use crate::{bundler::load::TransformedModule, util::CHashSet, Bundler, Load, ModuleId, Resolve};
use anyhow::{Context, Error};
use std::borrow::Borrow;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, FoldWith, Node, Visit, VisitMutWith, VisitWith};

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
        plan: &Plan,
        circular_plan: &CircularPlan,
        entry_id: ModuleId,
        merged: &CHashSet<ModuleId>,
    ) -> Result<Module, Error> {
        assert!(
            circular_plan.chunks.len() >= 1,
            "# of circular modules should be 2 or greater than 2 including entry. Got {:?}",
            circular_plan
        );
        let entry_module = self.scope.get_module(entry_id).unwrap();

        let modules = circular_plan
            .chunks
            .iter()
            .map(|&id| self.scope.get_module(id).unwrap())
            .collect::<Vec<_>>();
        merged.insert(entry_id);
        let mut entry = self
            .merge_modules(plan, entry_id, false, true, merged)
            .context("failed to merge dependency of a cyclic module")?;

        entry.visit_mut_with(&mut ImportDropper {
            imports: &entry_module.imports,
        });
        // print_hygiene("entry:drop_imports", &self.cm, &entry);

        for &dep in &*circular_plan.chunks {
            if dep == entry_id {
                continue;
            }
            if !merged.insert(dep) {
                continue;
            }
            log::debug!("Circular merge: {:?}", dep);

            let new_module = self.merge_two_circular_modules(plan, &modules, entry, dep, merged)?;

            entry = new_module;

            // print_hygiene("entry:merge_two_circular_modules", &self.cm,
            // &entry);
        }

        Ok(entry)
    }

    /// Merges `a` and `b` into one module.
    fn merge_two_circular_modules(
        &self,
        plan: &Plan,
        _circular_modules: &[TransformedModule],
        mut entry: Module,
        dep: ModuleId,
        merged: &CHashSet<ModuleId>,
    ) -> Result<Module, Error> {
        self.run(|| {
            let mut dep = self
                .merge_modules(plan, dep, false, true, merged)
                .context("failed to merge dependency of a cyclic module")?;

            // print_hygiene("dep:init", &self.cm, &dep);

            dep = dep.fold_with(&mut Unexporter);

            // Merge code
            entry.body = merge_respecting_order(entry.body, dep.body);

            // print_hygiene("END :merge_two_circular_modules", &self.cm, &entry);
            Ok(entry)
        })
    }
}

/// Originally, this method should create a dependency graph, but
fn merge_respecting_order(mut entry: Vec<ModuleItem>, mut dep: Vec<ModuleItem>) -> Vec<ModuleItem> {
    let mut new = Vec::with_capacity(entry.len() + dep.len());

    // While looping over items from entry, we check for dependency.
    loop {
        if entry.is_empty() {
            log::trace!("entry is empty");
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

        log::trace!("No dependency");

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
                        log::info!("Index is {}", idx);
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

    #[inline]
    fn visit_import_decl(&mut self, _: &ImportDecl, _: &dyn Node) {}
    #[inline]
    fn visit_class_member(&mut self, _: &ClassMember, _: &dyn Node) {}
    #[inline]
    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}
    #[inline]
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}

    /// We only search for top-level binding
    #[inline]
    fn visit_stmts(&mut self, _: &[Stmt], _: &dyn Node) {}
    /// We only search for top-level binding
    #[inline]
    fn visit_block_stmt(&mut self, _: &BlockStmt, _: &dyn Node) {}
}
