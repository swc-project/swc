use super::plan::CircularPlan;
use crate::{
    bundler::{chunk::merge::Ctx, load::TransformedModule},
    debug::print_hygiene,
    id::Id,
    util::graph::NodeId,
    Bundler, Load, ModuleId, Resolve,
};
use anyhow::{Context, Error};
use indexmap::IndexSet;
use petgraph::graphmap::DiGraphMap;
use std::{
    borrow::Borrow,
    collections::{HashMap, HashSet},
};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
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

        if !ctx.merged.insert(entry_id) {
            log::debug!("[circular] skip: {:?}", entry_id);
            return Ok(Module {
                span: DUMMY_SP,
                body: Default::default(),
                shebang: Default::default(),
            });
        }

        self.handle_import_deps(&entry_module, &mut entry, true);

        print_hygiene("[circular] entry:init", &self.cm, &entry);

        // entry.visit_mut_with(&mut ImportDropper {
        //     imports: &entry_module.imports,
        // });
        // print_hygiene("entry:drop_imports", &self.cm, &entry);
        let mut deps = plan.chunks.clone();
        deps.sort_by_key(|&dep| (!direct_deps.contains(&dep), dep));

        for dep in deps {
            if dep == entry_id {
                continue;
            }

            if !ctx.merged.insert(dep) {
                log::debug!("[circular] skip: {:?}", dep);
                continue;
            }

            log::debug!("Circular merge: {:?}", dep);

            let new_module = self.merge_two_circular_modules(ctx, &modules, entry, dep)?;

            entry = new_module;

            print_hygiene(
                "[circular] entry:merge_two_circular_modules",
                &self.cm,
                &entry,
            );
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
            let dep_info = self.scope.get_module(dep).unwrap();
            let mut dep = self
                .merge_modules(ctx, dep, false, false)
                .context("failed to merge dependency of a cyclic module")?;

            print_hygiene("[circular] dep:init 1", &self.cm, &dep);

            self.handle_import_deps(&dep_info, &mut dep, true);

            print_hygiene("[circular] dep:init 2", &self.cm, &dep);

            // dep = dep.fold_with(&mut Unexporter);

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

type StmtDepGraph = DiGraphMap<usize, ()>;

/// Originally, this method should create a dependency graph, but
///
/// TODO: Merge all module at once
fn merge_respecting_order(dep: Vec<ModuleItem>, entry: Vec<ModuleItem>) -> Vec<ModuleItem> {
    let mut new = Vec::with_capacity(dep.len() + entry.len());

    new.extend(entry);
    new.extend(dep);

    let mut graph = StmtDepGraph::default();
    let mut declared_by = HashMap::<Id, usize>::default();

    for (idx, item) in new.iter().enumerate() {
        {
            graph.add_node(idx);

            // We start by calculating ids created by statements. Note that we don't need to
            // analyze bodies of functions nor members of classes, because it's not
            // evaludated until they are called.

            match item {
                // We only check declarations because ids are created by declarations.
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. }))
                | ModuleItem::Stmt(Stmt::Decl(decl)) => {
                    //
                    match decl {
                        Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                            declared_by.insert(Id::from(ident), idx);
                        }
                        Decl::Var(vars) => {
                            let ids: Vec<Id> = find_ids(&vars.decls);

                            for id in ids {
                                declared_by.insert(id, idx);
                            }
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        }

        {
            // We then calculate which ids a statement require to be executed.
            // Again, we don't need to analyze non-top-level idents because they
            // are not evaluated while lpoading module.
        }
    }

    new
}

/// We do not care about variables created by current statement.
/// But we care about modifications.
struct RequirementCalculartor {
    required_ids: IndexSet<Id>,
    in_var_decl: bool,
}

impl Visit for RequirementCalculartor {
    noop_visit_type!();

    fn visit_pat(&mut self, pat: &Pat, _: &dyn Node) {
        match pat {
            Pat::Ident(i) => {
                // We do not care about variables created by current statement.
                if self.in_var_decl {
                    return;
                }
                self.required_ids.insert(i.into());
            }
            _ => {}
        }
    }

    fn visit_var_declarator(&mut self, var: &VarDeclarator, _: &dyn Node) {
        let in_var_decl = self.in_var_decl;
        self.in_var_decl = true;

        var.visit_children_with(self);

        self.in_var_decl = in_var_decl;
    }

    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}
    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}

    fn visit_expr(&mut self, expr: &Expr, _: &dyn Node) {
        match expr {
            Expr::Ident(i) => {
                self.required_ids.insert(i.into());
            }
            _ => {
                expr.visit_children_with(self);
            }
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e as _, self);

        if e.computed {
            e.prop.visit_with(e as _, self);
        }
    }
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
                        "Class decl (from dep) = {}{:?}, Ident = {}{:?}",
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

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(decl),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) => {
                    let ids: Vec<Id> = find_ids(decl);

                    for id in ids {
                        if id == *i {
                            self.idx = Some(idx);
                            log::debug!("Index is {}", idx);
                            break;
                        }
                    }
                }

                dep => {}
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
