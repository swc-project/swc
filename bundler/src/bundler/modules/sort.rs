use super::Modules;
use crate::{id::Id, util::MapWithMut};
use indexmap::IndexSet;
use petgraph::EdgeDirection::Incoming as Dependants;
use petgraph::EdgeDirection::Outgoing as Dependancies;
use retain_mut::RetainMut;
use std::collections::HashMap;
use std::collections::HashSet;
use std::collections::VecDeque;
use std::iter::from_fn;
use std::mem::take;
use std::ops::Range;
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

type StmtDepGraph = self::graph::StmtDepGraph;

mod graph;
/// Is dependancy between nodes hard?
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Required {
    /// Required to evaluate
    Always,

    /// Maybe required to evaluate
    Maybe,
}

impl Modules {
    pub fn sort(&mut self) {
        let injected_ctxt = self.injected_ctxt;
        {
            let mut modules = take(&mut self.modules);
            for module in &mut modules {
                module.body.retain_mut(|item| {
                    let is_free = item.span().ctxt == injected_ctxt;
                    if is_free {
                        self.injected.push(item.take());
                        false
                    } else {
                        true
                    }
                });
            }
            self.modules = modules;
        }

        self.retain_mut(|item| match item {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            _ => true,
        });

        let mut new = vec![];
        let mut graph = StmtDepGraph::default();

        new.extend(self.prepended.drain(..));
        let mut module_starts = vec![];
        let mut same_module_ranges = vec![];
        for module in self.modules.drain(..) {
            let start = new.len();
            let inner_len = module.body.len();
            if inner_len != 0 {
                let end = start + inner_len;

                module_starts.push(start);
                same_module_ranges.push(start..end);
            }

            // for (inner_idx, item) in module.body.into_iter().enumerate() {
            //     let idx = new.len();
            //     if inner_idx != 0 && inner_idx + 1 != inner_len && !new.is_empty() {
            //         graph.add_edge(idx - 1, idx, Required::Always);
            //     }

            //     new.push(item);
            // }

            new.extend(module.body);
        }
        let free = new.len()..(new.len() + self.injected.len());
        if cfg!(debug_assertions) {
            for rng in &same_module_ranges {
                for idx in rng.clone() {
                    assert!(!free.contains(&idx));
                }
            }
        }
        new.extend(self.injected.drain(..));

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
                            // eprintln!("Decl: `{}` declares {:?}`", idx, Id::from(ident));
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

                                    // eprintln!("Decl: `{}` declares {:?}`", idx, id);
                                    declared_by.entry(id).or_default().push(idx);
                                }
                            }
                        }
                        _ => {}
                    }
                }
                _ => {}
            }

            {
                // Find extra initializations.
                let mut v = FieldInitFinter::default();
                item.visit_with(&Invalid { span: DUMMY_SP }, &mut v);

                for id in v.accessed {
                    if let Some(declarator_indexes) = declared_by.get(&id) {
                        let idx_decl = match &item {
                            ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                                let ids: Vec<Id> = find_ids(&var.decls);
                                format!("`{:?}`", ids)
                            }
                            ModuleItem::Stmt(Stmt::Decl(Decl::Class(c))) => {
                                format!("{}{:?}", c.ident.sym, c.ident.span.ctxt)
                            }
                            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
                                format!("{}{:?}", f.ident.sym, f.ident.span.ctxt)
                            }
                            _ => String::from(""),
                        };

                        for &declarator_index in declarator_indexes {
                            if declarator_index != idx {
                                graph.add_edge(idx, declarator_index, Required::Always);
                                // eprintln!(
                                //     "Field init: `{}` ({}) depends on `{}`:
                                // {:?}",
                                //     idx, idx_decl, declarator_index, &id
                                // );
                            }
                        }

                        // eprintln!("`{}` declares {:?}`", idx, id);
                        declared_by.entry(id).or_default().push(idx);
                    }
                }
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
                if visitor.excluded.contains(&id) {
                    continue;
                }

                if let Some(declarator_indexes) = declared_by.get(&id) {
                    for &declarator_index in declarator_indexes {
                        if declarator_index != idx {
                            let idx_decl = match &item {
                                ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                                    let ids: Vec<Id> = find_ids(&var.decls);
                                    format!("`{:?}`", ids)
                                }
                                ModuleItem::Stmt(Stmt::Decl(Decl::Class(c))) => {
                                    format!("{}{:?}", c.ident.sym, c.ident.span.ctxt)
                                }
                                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
                                    format!("{}{:?}", f.ident.sym, f.ident.span.ctxt)
                                }
                                _ => String::from(""),
                            };

                            graph.add_edge(idx, declarator_index, kind);
                            // eprintln!(
                            //     "`{}` ({}) depends on `{}`: {:?}",
                            //     idx, idx_decl, declarator_index, &id
                            // );
                            if cfg!(debug_assertions) {
                                let deps: Vec<_> =
                                    graph.neighbors_directed(idx, Dependancies).collect();
                                assert!(deps.contains(&declarator_index));
                            }
                        }
                    }
                }
            }
        }

        // Now graph contains enough information to sort statements.
        let mut orders = vec![];
        orders.extend(iter(
            &mut graph,
            &same_module_ranges,
            free.clone(),
            &module_starts,
            &new,
        ));
        // let mut delayed = HashSet::new();

        assert_eq!(orders.len(), new.len());

        let mut buf = Vec::with_capacity(new.len());
        for order in orders {
            let stmt = new[order].take();
            buf.push(stmt)
        }

        *self = Modules::from(
            Module {
                span: DUMMY_SP,
                body: buf,
                shebang: None,
            },
            injected_ctxt,
        );
    }
}

fn iter<'a>(
    graph: &'a mut StmtDepGraph,
    same_module_ranges: &'a [Range<usize>],
    free: Range<usize>,
    module_starts: &[usize],
    stmts: &'a [ModuleItem],
) -> impl 'a + Iterator<Item = usize> {
    let len = graph.node_count();

    // dbg!(&same_module_ranges);
    // dbg!(&free);
    // dbg!(&module_starts);

    let mut moves = HashSet::new();
    let mut done = HashSet::new();
    let mut stack = VecDeque::new();
    stack.extend(module_starts.iter().copied());

    for &start in module_starts {
        let range = same_module_ranges
            .iter()
            .find(|range| range.contains(&start))
            .cloned();
        if let Some(range) = range {
            for v in range {
                stack.push_back(v);
            }
        }
    }
    for v in free.clone() {
        stack.push_back(v);
    }

    from_fn(move || {
        if done.len() == len {
            return None;
        }

        // Check for first item.
        'main: while let Some(idx) = stack.pop_front() {
            if done.contains(&idx) {
                // eprintln!("Done: {}", idx);
                continue;
            }
            let is_free = free.contains(&idx);

            // dbg!(idx, is_free);
            // match &stmts[idx] {
            //     ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
            //         let ids: Vec<Id> = find_ids(&var.decls);
            //         eprintln!("(`{}`) Declare: `{:?}`", idx, ids);
            //     }
            //     ModuleItem::Stmt(Stmt::Decl(Decl::Class(cls))) => {
            //         eprintln!("(`{}`) Declare: `{:?}`", idx, Id::from(&cls.ident));
            //     }
            //     ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
            //         eprintln!("(`{}`) Declare: `{:?}`", idx, Id::from(&f.ident));
            //     }
            //     _ => eprintln!("(`{}`) Stmt", idx,),
            // }

            let current_range = same_module_ranges
                .iter()
                .find(|range| range.contains(&idx))
                .cloned();

            // dbg!(&current_range);

            let can_ignore_deps = match &stmts[idx] {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(..),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Fn(..))) => true,

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Class(cls),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Class(cls)))
                    if cls.class.super_class.is_none() =>
                {
                    true
                }

                _ => false,
            };
            let can_ignore_weak_deps = can_ignore_deps
                || match &stmts[idx] {
                    ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        decl: Decl::Class(..),
                        ..
                    }))
                    | ModuleItem::Stmt(Stmt::Decl(Decl::Class(..))) => true,
                    _ => false,
                };

            // We
            {
                let deps = graph
                    .neighbors_directed(idx, Dependancies)
                    .filter(|dep| {
                        let declared_in_same_module = match &current_range {
                            Some(v) => v.contains(&dep),
                            None => false,
                        };

                        // We have logic to handle items declared in same module.
                        if declared_in_same_module {
                            return false;
                        }

                        // Exlcude emitted items
                        !done.contains(dep)
                    })
                    .collect::<Vec<_>>();

                // dbg!(&deps);

                if !deps.is_empty() {
                    let mut deps_to_push = vec![];
                    for dep in deps.iter().rev().copied() {
                        if deps_to_push.contains(&dep) {
                            continue;
                        }

                        let can_ignore_dep = can_ignore_deps
                            || (can_ignore_weak_deps
                                && graph.edge_weight(idx, dep) == Some(Required::Maybe));

                        if can_ignore_dep {
                            if graph.has_a_path(dep, idx) {
                                // Just emit idx.
                                continue;
                            }
                        }

                        deps_to_push.push(dep);
                    }

                    // dbg!(&deps_to_push);

                    if !deps_to_push.is_empty() {
                        // We should check idx again after emitting dependencies.
                        stack.push_front(idx);

                        for dep in deps_to_push {
                            // eprintln!("[Move]{} => {}; kind = dep", idx, dep);
                            stack.push_front(dep)
                        }

                        continue;
                    }
                }
            }

            if is_free {
                let dependants = graph
                    .neighbors_directed(idx, Dependants)
                    .collect::<Vec<_>>();

                for dependant in dependants {
                    if !done.contains(&dependant) && free.contains(&dependant) {
                        stack.push_front(dependant);
                    }
                }

                graph.remove_node(idx);
                done.insert(idx);
                return Some(idx);
            }

            let current_range = match current_range {
                Some(v) => v,
                None => {
                    let dependants = graph
                        .neighbors_directed(idx, Dependants)
                        .collect::<Vec<_>>();

                    // dbg!(&dependants);

                    // We only emit free items because we want to emit statements from same module
                    // to emitted closedly.
                    for dependant in dependants {
                        if !done.contains(&dependant) && free.contains(&dependant) {
                            stack.push_front(dependant);
                        }
                    }

                    // It's not within a module, so explicit ordering is not required.
                    graph.remove_node(idx);
                    done.insert(idx);
                    return Some(idx);
                }
            };

            // We should respect original order of statements within a module.
            for preceding in current_range.clone() {
                // We should select first statement in module which is not emitted yet.
                if done.contains(&preceding) {
                    continue;
                }
                // dbg!(preceding);
                if preceding == idx {
                    continue;
                }
                if preceding > idx {
                    break;
                }

                if !moves.insert((idx, preceding)) {
                    // idx = preceding;
                    break;
                }

                let dependants = graph
                    .neighbors_directed(idx, Dependants)
                    .collect::<Vec<_>>();

                // dbg!(&dependants);

                // We only emit free items because we want to emit statements from same module
                // to emitted closedly.
                for dependant in dependants {
                    if !done.contains(&dependant) && free.contains(&dependant) {
                        stack.push_front(dependant);
                    }
                }

                // We found a preceding statement which is not emitted yet.
                stack.push_front(idx);
                stack.push_front(preceding);
                continue 'main;
            }

            // Prefer inserting module as a whole.
            let next = idx + 1;
            if current_range.contains(&next) {
                if moves.insert((idx, next)) {
                    if !done.contains(&next) {
                        stack.push_front(next);
                    }
                }
            }

            graph.remove_node(idx);
            done.insert(idx);
            return Some(idx);
        }

        None
    })
}

/// Using prototype should be treated as an initialization.
#[derive(Default)]
struct FieldInitFinter {
    in_object_assign: bool,
    in_rhs: bool,
    accessed: HashSet<Id>,
}

impl FieldInitFinter {
    fn check_lhs_of_assign(&mut self, lhs: &PatOrExpr) {
        match lhs {
            PatOrExpr::Expr(e) => {
                self.check_lhs_expr_of_assign(&e);
            }
            PatOrExpr::Pat(pat) => match &**pat {
                Pat::Expr(e) => {
                    self.check_lhs_expr_of_assign(&e);
                }
                _ => {}
            },
        }
    }
    fn check_lhs_expr_of_assign(&mut self, lhs: &Expr) {
        match lhs {
            Expr::Member(m) => {
                let obj = match &m.obj {
                    ExprOrSuper::Super(_) => return,
                    ExprOrSuper::Expr(obj) => &**obj,
                };

                match obj {
                    Expr::Ident(i) => {
                        self.accessed.insert(i.into());
                    }
                    Expr::Member(..) => self.check_lhs_expr_of_assign(&obj),
                    _ => {}
                }
            }
            _ => {}
        }
    }
}

impl Visit for FieldInitFinter {
    fn visit_assign_expr(&mut self, e: &AssignExpr, _: &dyn Node) {
        let old = self.in_rhs;
        e.left.visit_with(e, self);
        self.check_lhs_of_assign(&e.left);

        self.in_rhs = true;
        e.right.visit_with(e, self);
        self.in_rhs = old;
    }

    fn visit_pat(&mut self, e: &Pat, _: &dyn Node) {
        let old = self.in_rhs;
        self.in_rhs = false;
        e.visit_children_with(self);
        self.in_rhs = old;
    }

    fn visit_call_expr(&mut self, e: &CallExpr, _: &dyn Node) {
        match &e.callee {
            ExprOrSuper::Super(_) => {}
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Member(callee) => match &callee.obj {
                    ExprOrSuper::Expr(callee_obj) => match &**callee_obj {
                        Expr::Ident(Ident {
                            sym: js_word!("Object"),
                            ..
                        }) => match &*callee.prop {
                            Expr::Ident(Ident { sym: prop_sym, .. })
                                if !callee.computed && *prop_sym == *"assign" =>
                            {
                                let old = self.in_object_assign;
                                self.in_object_assign = true;

                                e.args.visit_with(e, self);
                                self.in_object_assign = old;

                                return;
                            }
                            _ => {}
                        },
                        _ => {}
                    },
                    ExprOrSuper::Super(_) => {}
                },

                _ => {}
            },
        }

        e.visit_children_with(self);
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);

        if e.computed {
            e.prop.visit_with(e, self);
        }

        if !self.in_rhs || self.in_object_assign {
            match &e.obj {
                ExprOrSuper::Expr(obj) => match &**obj {
                    Expr::Ident(obj) => match &*e.prop {
                        Expr::Ident(Ident { sym: prop_sym, .. })
                            if !e.computed && *prop_sym == *"prototype" =>
                        {
                            self.accessed.insert(obj.into());
                        }
                        _ => {}
                    },
                    _ => {}
                },

                _ => {}
            }
        }
    }
}

/// Finds usage of `ident`
struct InitializerFinder {
    ident: Id,
    found: bool,
    in_complex: bool,
}

impl Visit for InitializerFinder {
    noop_visit_type!();

    fn visit_pat(&mut self, pat: &Pat, _: &dyn Node) {
        match pat {
            Pat::Ident(i) if self.ident == *i => {
                self.found = true;
            }

            _ => {
                pat.visit_children_with(self);
            }
        }
    }

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
    /// While bundling, there can be two bindings with same name and syntax
    /// context, in case of wrapped es modules. We exclude them from dependency
    /// graph.
    excluded: IndexSet<Id>,

    in_weak: bool,
    in_var_decl: bool,
    in_assign_lhs: bool,
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

    fn visit_assign_expr(&mut self, e: &AssignExpr, _: &dyn Node) {
        let old = self.in_assign_lhs;

        self.in_assign_lhs = true;
        e.left.visit_with(e, self);

        self.in_assign_lhs = false;
        e.right.visit_with(e, self);

        self.in_assign_lhs = old;
    }

    fn visit_pat(&mut self, pat: &Pat, _: &dyn Node) {
        match pat {
            Pat::Ident(i) => {
                // We do not care about variables created by current statement.
                if self.in_var_decl && !self.in_assign_lhs {
                    return;
                }
                self.insert(i.into());
            }
            _ => {
                pat.visit_children_with(self);
            }
        }
    }

    fn visit_var_declarator(&mut self, var: &VarDeclarator, _: &dyn Node) {
        let in_var_decl = self.in_var_decl;
        self.in_var_decl = true;

        if self.in_weak {
            let ids: Vec<Id> = find_ids(&var.name);
            self.excluded.extend(ids);
        }

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
