use super::plan::CircularPlan;
use crate::{
    bundler::{chunk::merge::Ctx, load::TransformedModule},
    debug::print_hygiene,
    id::Id,
    util::{
        graph::{Inliner, NodeId},
        MapWithMut,
    },
    Bundler, Load, ModuleId, Resolve,
};
use anyhow::{Context, Error};
use indexmap::IndexSet;
use petgraph::{graphmap::DiGraphMap, visit::Dfs, EdgeDirection::Incoming};
use std::{
    borrow::Borrow,
    collections::{HashMap, HashSet, VecDeque},
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

    for (idx, item) in new.iter().enumerate() {
        // We then calculate which ids a statement require to be executed.
        // Again, we don't need to analyze non-top-level idents because they
        // are not evaluated while lpoading module.
        let mut visitor = RequirementCalculartor::default();
        item.visit_with(&Invalid { span: DUMMY_SP }, &mut visitor);

        for id in visitor.required_ids {
            if let Some(&declarator_idx) = declared_by.get(&id) {
                if declarator_idx != idx {
                    graph.add_edge(declarator_idx, idx, ());
                }
            }
        }
    }

    // Now graph contains enough information to sort statements.
    let len = new.len();
    let mut orders: Vec<usize> = vec![];

    for i in 0..len {
        if graph.neighbors_directed(i, Incoming).count() != 0 {
            continue;
        }

        let mut dfs = Dfs::new(&graph, i);

        while let Some(node) = dfs.next(&graph) {
            if orders.contains(&node) {
                break;
            }
            orders.push(node);
        }
    }

    let mut buf = Vec::with_capacity(new.len());
    for order in orders {
        let stmt = new[order].take();
        buf.push(stmt)
    }

    buf
}

/// We do not care about variables created by current statement.
/// But we care about modifications.
#[derive(Default)]
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
    fn visit_class_method(&mut self, _: &ClassMethod, _: &dyn Node) {}
    fn visit_private_method(&mut self, _: &PrivateMethod, _: &dyn Node) {}
    fn visit_method_prop(&mut self, _: &MethodProp, _: &dyn Node) {}

    fn visit_expr(&mut self, expr: &Expr, _: &dyn Node) {
        let in_var_decl = self.in_var_decl;
        self.in_var_decl = false;

        match expr {
            Expr::Ident(i) => {
                self.required_ids.insert(i.into());
            }
            _ => {
                expr.visit_children_with(self);
            }
        }

        self.in_var_decl = in_var_decl;
    }

    fn visit_prop(&mut self, prop: &Prop, _: &dyn Node) {
        match prop {
            Prop::Shorthand(i) => {
                self.required_ids.insert(i.into());
            }
            _ => prop.visit_children_with(self),
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e as _, self);

        if e.computed {
            e.prop.visit_with(e as _, self);
        }
    }
}
