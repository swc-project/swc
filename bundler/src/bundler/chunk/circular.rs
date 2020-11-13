use super::{
    merge::{ImportDropper, Unexporter},
    plan::CircularPlan,
};
use crate::{
    bundler::{chunk::merge::Ctx, load::TransformedModule},
    Bundler, Load, ModuleId, Resolve,
};
use anyhow::{Context, Error};
use std::borrow::Borrow;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, FoldWith, Node, Visit, VisitMutWith, VisitWith};

#[cfg(test)]
mod tests;

/// Circular imports are hard to handle.
///
/// We use some dedicated method to handle circular dependencies.
impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_circular(
        &self,
        ctx: &Ctx,
        plan: &CircularPlan,
        entry_id: ModuleId,
    ) -> Result<Module, Error> {
        assert!(
            plan.chunks.len() >= 1,
            "# of circular modules should be 2 or greater than 2 including entry. Got {:?}",
            plan
        );
        let entry_module = self.scope.get_module(entry_id).unwrap();
        let direct_deps = entry_module
            .imports
            .specifiers
            .iter()
            .map(|v| v.0.module_id)
            .chain(entry_module.exports.reexports.iter().map(|v| v.0.module_id))
            .collect::<Vec<_>>();

        let modules = plan
            .chunks
            .iter()
            .map(|&id| self.scope.get_module(id).unwrap())
            .collect::<Vec<_>>();
        let mut entry = self
            .merge_modules(ctx, entry_id, false, false)
            .context("failed to merge dependency of a cyclic module")?;

        entry.visit_mut_with(&mut ImportDropper {
            imports: &entry_module.imports,
        });
        // print_hygiene("entry:drop_imports", &self.cm, &entry);
        let mut deps = plan.chunks.clone();
        deps.sort_by_key(|&dep| (!direct_deps.contains(&dep), dep));

        for dep in deps {
            if dep == entry_id {
                continue;
            }

            if !ctx.merged.insert(dep) {
                log::debug!("[Circular merge] Already merged: {:?}", dep);
                continue;
            }

            log::debug!("Circular merge: {:?}", dep);

            let new_module = self.merge_two_circular_modules(ctx, &modules, entry, dep)?;

            entry = new_module;

            // print_hygiene(
            //     "[circular] entry:merge_two_circular_modules",
            //     &self.cm,
            //     &entry,
            // );
        }

        Ok(entry)
    }

    /// Merges `a` and `b` into one module.
    fn merge_two_circular_modules(
        &self,
        ctx: &Ctx,
        _circular_modules: &[TransformedModule],
        mut entry: Module,
        dep: ModuleId,
    ) -> Result<Module, Error> {
        self.run(|| {
            let mut dep = self
                .merge_modules(ctx, dep, false, false)
                .context("failed to merge dependency of a cyclic module")?;

            // print_hygiene("[circular] dep:init", &self.cm, &dep);

            dep = dep.fold_with(&mut Unexporter);

            // Merge code
            entry.body = merge_respecting_order(dep.body, entry.body);

            // print_hygiene(
            //     "[circular] END :merge_two_circular_modules",
            //     &self.cm,
            //     &entry,
            // );
            Ok(entry)
        })
    }
}

/// Originally, this method should create a dependency graph, but
fn merge_respecting_order(mut dep: Vec<ModuleItem>, mut entry: Vec<ModuleItem>) -> Vec<ModuleItem> {
    let mut new = Vec::with_capacity(dep.len() + entry.len());

    // While looping over items from entry, we check for dependency.
    loop {
        if dep.is_empty() {
            log::trace!("dep is empty");
            break;
        }
        let item = dep.drain(..=0).next().unwrap();

        // Everything from  dep is injected
        if entry.is_empty() {
            log::trace!("dep is empty");
            new.push(item);
            new.append(&mut dep);
            break;
        }

        // If the code of entry depends on dependency, we insert dependency source code
        // at the position.
        if let Some(pos) = dependency_index(&item, &entry) {
            log::trace!("Found depndency: {}", pos);

            new.extend(entry.drain(..=pos));
            new.push(item);
            continue;
        }

        // We checked the length of `dep`
        if let Some(pos) = dependency_index(&entry[0], &[&item]) {
            log::trace!("Found reverse depndency (index[0]): {}", pos);

            new.push(item);
            new.extend(entry.drain(..=0));
            continue;
        }

        if let Some(pos) = dependency_index(&entry[0], &dep) {
            log::trace!("Found reverse depndency: {}", pos);

            new.push(item);
            new.extend(dep.drain(..=pos));
            new.extend(entry.drain(..=0));
            continue;
        }

        log::trace!("No dependency");

        new.push(item);
    }

    new.extend(dep);

    // Append remaining statements.
    new.extend(entry);

    new
}

/// Searches for top level declaration which provides requirements for `deps`.
fn dependency_index<T>(item: &ModuleItem, deps: &[T]) -> Option<usize>
where
    T: Borrow<ModuleItem>,
{
    let mut v = DepFinder {
        deps,
        idx: None,
        last_usage_idx: None,
    };
    item.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    v.idx.or(v.last_usage_idx)
}

struct DepFinder<'a, T>
where
    T: Borrow<ModuleItem>,
{
    deps: &'a [T],
    last_usage_idx: Option<usize>,
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
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Class(decl),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Class(decl))) => {
                    log::trace!(
                        "Decl (from dep) = {}{:?}, Ident = {}{:?}",
                        decl.ident.sym,
                        decl.ident.span.ctxt,
                        i.sym,
                        i.span.ctxt
                    );
                    if decl.ident.sym == i.sym && decl.ident.span.ctxt == i.span.ctxt {
                        self.idx = Some(idx);
                        log::debug!("Index is {}", idx);
                        break;
                    }
                }

                dep => {
                    if DepUsageFinder::find(i, dep) {
                        self.last_usage_idx = Some(idx);
                    }
                }
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

/// Finds usage of `ident`
struct DepUsageFinder<'a> {
    ident: &'a Ident,
    found: bool,
}

impl<'a> Visit for DepUsageFinder<'a> {
    noop_visit_type!();

    fn visit_call_expr(&mut self, e: &CallExpr, _: &dyn Node) {
        if self.found {
            return;
        }

        match &e.callee {
            ExprOrSuper::Super(_) => {}
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Ident(..) => {}
                _ => {
                    callee.visit_with(e, self);
                }
            },
        }

        e.args.visit_with(e, self);
    }

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if self.found {
            return;
        }

        if i.span.ctxt() == self.ident.span.ctxt() && i.sym == self.ident.sym {
            self.found = true;
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        if self.found {
            return;
        }

        e.obj.visit_with(e as _, self);

        if e.computed {
            e.prop.visit_with(e as _, self);
        }
    }
}

impl<'a> DepUsageFinder<'a> {
    pub fn find<N>(ident: &'a Ident, node: &N) -> bool
    where
        N: VisitWith<Self>,
    {
        let mut v = DepUsageFinder {
            ident,
            found: false,
        };
        node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
        v.found
    }
}
