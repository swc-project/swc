use crate::{id::Id, util::MapWithMut};
use indexmap::IndexSet;
use petgraph::{
    graphmap::DiGraphMap,
    EdgeDirection::{Incoming, Outgoing},
};
use std::collections::HashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

type StmtDepGraph = DiGraphMap<usize, Required>;

/// Is dependancy between nodes hard?
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Required {
    /// Required to evaluate
    Always,

    /// Maybe required to evaluate
    Maybe,
}

pub(super) fn sort(new: &mut Vec<ModuleItem>) {
    new.retain(|item| match item {
        ModuleItem::Stmt(Stmt::Empty(..)) => false,
        _ => true,
    });

    let mut graph = StmtDepGraph::default();
    let mut declared_by = HashMap::<Id, Vec<usize>>::default();
    let mut uninitialized_ids = HashMap::<Id, usize>::new();

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
                        declared_by.entry(Id::from(ident)).or_default().push(idx);
                    }
                    Decl::Var(vars) => {
                        for var in &vars.decls {
                            //
                            let ids: Vec<Id> = find_ids(&var.name);
                            for id in ids {
                                if var.init.is_none() {
                                    uninitialized_ids.insert(id.clone(), idx);
                                }
                                declared_by.entry(id).or_default().push(idx);
                            }
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    // Handle uninitialized variables
    //
    // Compiled typescript enum is not initialized by declaration
    //
    // var Status;
    // (function(Status){})(Status)
    for (uninit_id, start_idx) in uninitialized_ids {
        for (idx, item) in new.iter().enumerate().filter(|(idx, _)| *idx > start_idx) {
            let mut finder = InitializerFinder {
                ident: uninit_id.clone(),
                found: false,
                in_complex: false,
            };
            item.visit_with(&Invalid { span: DUMMY_SP }, &mut finder);
            if finder.found {
                declared_by.entry(uninit_id).or_default().push(idx);
                break;
            }
        }
    }

    for (idx, item) in new.iter().enumerate() {
        // We then calculate which ids a statement require to be executed.
        // Again, we don't need to analyze non-top-level idents because they
        // are not evaluated while lpoading module.
        let mut visitor = RequirementCalculartor::default();
        item.visit_with(&Invalid { span: DUMMY_SP }, &mut visitor);

        for (id, kind) in visitor.required_ids {
            if let Some(declarator_indexes) = declared_by.get(&id) {
                for &declarator_index in declarator_indexes {
                    if declarator_index != idx {
                        graph.add_edge(declarator_index, idx, kind);
                    }
                }
            }
        }
    }

    // Now graph contains enough information to sort statements.
    let len = new.len();
    let mut orders: Vec<usize> = vec![];

    // No dependencies
    loop {
        if graph.all_edges().count() == 0 {
            break;
        }

        let mut did_work = false;
        // Add nodes which does not have any dependencies.
        for i in 0..len {
            if orders.contains(&i) {
                continue;
            }

            let dependants = graph.neighbors_directed(i, Incoming);

            if dependants.count() != 0 {
                continue;
            }

            did_work = true;
            orders.push(i);

            // Remove dependencies to other node.
            graph.remove_node(i);
        }

        if !did_work {
            break;
        }
    }

    // Strong dependencies
    loop {
        if graph.all_edges().count() == 0 {
            break;
        }

        let mut did_work = false;
        // Add nodes which does not have any dependencies.
        for i in 0..len {
            if orders.contains(&i) {
                continue;
            }

            let dependants = graph
                .neighbors_directed(i, Incoming)
                .filter(|&entry| graph.edge_weight(entry, i) == Some(&Required::Always));

            if dependants.count() != 0 {
                continue;
            }

            did_work = true;
            orders.push(i);

            // Remove strong dependency
            for dependancy in graph
                .neighbors_directed(i, Outgoing)
                .filter(|&dep| graph.edge_weight(i, dep) == Some(&Required::Always))
                .collect::<Vec<_>>()
            {
                graph.remove_edge(i, dependancy).unwrap();
            }
        }

        if !did_work {
            break;
        }
    }

    // Weak dependencies
    loop {
        if graph.all_edges().count() == 0 {
            break;
        }

        let mut did_work = false;
        // Add nodes which does not have any dependencies.
        for i in 0..len {
            let dependants = graph.neighbors_directed(i, Incoming);

            if orders.contains(&i) || dependants.count() != 0 {
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

    assert_eq!(orders.len(), new.len());

    let mut buf = Vec::with_capacity(new.len());
    for order in orders {
        let stmt = new[order].take();
        buf.push(stmt)
    }

    *new = buf;
}

/// Finds usage of `ident`
struct InitializerFinder {
    ident: Id,
    found: bool,
    in_complex: bool,
}

impl Visit for InitializerFinder {
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if self.in_complex && self.ident == *i {
            self.found = true;
        }
    }

    fn visit_expr_or_spread(&mut self, node: &ExprOrSpread, _: &dyn Node) {
        let in_complex = self.in_complex;
        self.in_complex = true;
        node.visit_children_with(self);
        self.in_complex = in_complex;
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        {
            let in_complex = self.in_complex;
            self.in_complex = true;
            e.obj.visit_children_with(self);
            self.in_complex = in_complex;
        }

        if e.computed {
            e.prop.visit_with(e as _, self);
        }
    }
}

/// We do not care about variables created by current statement.
/// But we care about modifications.
#[derive(Default)]
struct RequirementCalculartor {
    required_ids: IndexSet<(Id, Required)>,

    in_weak: bool,
    in_var_decl: bool,
}

macro_rules! weak {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, f: &$T, _: &dyn Node) {
            let in_weak = self.in_weak;
            self.in_weak = true;

            f.visit_children_with(self);

            self.in_weak = in_weak;
        }
    };
}

impl RequirementCalculartor {
    fn insert(&mut self, i: Id) {
        self.required_ids.insert((
            i,
            if self.in_weak {
                Required::Maybe
            } else {
                Required::Always
            },
        ));
    }
}

impl Visit for RequirementCalculartor {
    noop_visit_type!();

    weak!(visit_arrow_expr, ArrowExpr);
    weak!(visit_function, Function);
    weak!(visit_class_method, ClassMethod);
    weak!(visit_private_method, PrivateMethod);
    weak!(visit_method_prop, MethodProp);

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _: &dyn Node) {
        self.insert(n.orig.clone().into());
    }

    fn visit_pat(&mut self, pat: &Pat, _: &dyn Node) {
        match pat {
            Pat::Ident(i) => {
                // We do not care about variables created by current statement.
                if self.in_var_decl {
                    return;
                }
                self.insert(i.into());
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

    fn visit_expr(&mut self, expr: &Expr, _: &dyn Node) {
        let in_var_decl = self.in_var_decl;
        self.in_var_decl = false;

        match expr {
            Expr::Ident(i) => {
                self.insert(i.into());
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
                self.insert(i.into());
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
