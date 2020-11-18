use super::plan::CircularPlan;
use crate::{id::Id, util::MapWithMut};
use indexmap::IndexSet;
use petgraph::{graphmap::DiGraphMap, EdgeDirection::Incoming};
use std::collections::HashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

type StmtDepGraph = DiGraphMap<usize, ()>;

pub(super) fn sort(new: &mut Vec<ModuleItem>) {
    new.retain(|item| match item {
        ModuleItem::Stmt(Stmt::Empty(..)) => false,
        _ => true,
    });

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

    loop {
        if graph.all_edges().count() == 0 {
            break;
        }

        let mut did_work = false;
        // Add nodes which does not have any dependencies.
        for i in 0..len {
            if graph.neighbors_directed(i, Incoming).count() != 0 {
                continue;
            }

            did_work = true;
            orders.push(i);
            // Remove dependency
            graph.remove_node(i);
        }

        if !did_work {
            break;
        }
    }

    // Now all dependencies are merged.
    for i in 0..len {
        if orders.contains(&i) {
            continue;
        }
        orders.push(i);
    }

    let mut buf = Vec::with_capacity(new.len());
    for order in orders {
        let stmt = new[order].take();
        buf.push(stmt)
    }

    *new = buf;
}

/// We do not care about variables created by current statement.
/// But we care about modifications.
#[derive(Default)]
struct RequirementCalculartor {
    required_ids: IndexSet<Id>,
    weak_requirements: IndexSet<Id>,

    in_weak: bool,
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
