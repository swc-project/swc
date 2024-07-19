use std::{collections::VecDeque, iter::from_fn, ops::Range};

use indexmap::IndexSet;
use petgraph::EdgeDirection::{Incoming as Dependants, Outgoing as Dependencies};
use swc_common::{
    collections::{AHashMap, AHashSet, ARandomState},
    sync::Lrc,
    util::take::Take,
    SourceMap, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_utils::find_pat_ids;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::graph::Required;
use crate::{id::Id, modules::sort::graph::StmtDepGraph, util::is_injected};

pub(super) fn sort_stmts(
    injected_ctxt: SyntaxContext,
    modules: Vec<Vec<ModuleItem>>,
    _cm: &Lrc<SourceMap>,
) -> Vec<ModuleItem> {
    let total_len: usize = modules.iter().map(|v| v.len()).sum();

    let mut stmts = Vec::new();
    let mut free = Vec::new();
    let mut same_module_ranges = Vec::new();
    let mut module_starts = Vec::new();

    for module in modules {
        let start = stmts.len();
        module_starts.push(stmts.len());
        let mut module_item_count = 0;

        for stmt in module {
            if is_injected_module_item(&stmt, injected_ctxt) {
                free.push(stmt)
            } else {
                module_item_count += 1;
                stmts.push(stmt)
            }
        }

        same_module_ranges.push(start..start + module_item_count);
    }
    let non_free_count = stmts.len();
    let free_range = non_free_count..non_free_count + free.len();
    stmts.extend(free);

    // print_hygiene(
    //     &format!("before sort"),
    //     cm,
    //     &Module {
    //         span: DUMMY_SP,
    //         body: stmts.clone(),
    //         shebang: None,
    //     },
    // );

    let mut id_graph = calc_deps(&stmts);

    tracing::debug!("Analyzed dependencies between statements");

    let orders = iter(
        &mut id_graph,
        &same_module_ranges,
        free_range,
        &module_starts,
        &stmts,
    )
    .collect::<Vec<_>>();

    tracing::debug!("Sorted statements");

    debug_assert_eq!(total_len, orders.len());

    let mut new = Vec::with_capacity(stmts.len());
    for idx in orders {
        new.push(stmts[idx].take());
    }

    new
}

fn is_injected_module_item(stmt: &ModuleItem, injected_ctxt: SyntaxContext) -> bool {
    match stmt {
        ModuleItem::ModuleDecl(
            ModuleDecl::Import(ImportDecl {
                with: Some(with), ..
            })
            | ModuleDecl::ExportAll(ExportAll {
                with: Some(with), ..
            })
            | ModuleDecl::ExportNamed(NamedExport {
                with: Some(with), ..
            }),
        ) => is_injected(with),

        ModuleItem::Stmt(Stmt::Decl(Decl::Var(v))) => v.ctxt == injected_ctxt,

        _ => false,
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

    let mut moves = AHashSet::default();
    let mut done = AHashSet::default();
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
            //         eprintln!("(`{}`) Declare var: `{:?}`", idx, ids);
            //     }
            //     ModuleItem::Stmt(Stmt::Decl(Decl::Class(cls))) => {
            //         eprintln!("(`{}`) Declare class: `{:?}`", idx, Id::from(&cls.ident));
            //     }
            //     ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
            //         eprintln!("(`{}`) Declare fn: `{:?}`", idx, Id::from(&f.ident));
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
                || matches!(
                    &stmts[idx],
                    ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        decl: Decl::Class(..),
                        ..
                    })) | ModuleItem::Stmt(Stmt::Decl(Decl::Class(..)))
                );

            // We
            {
                let deps = graph
                    .neighbors_directed(idx, Dependencies)
                    .filter(|dep| {
                        let declared_in_same_module = match &current_range {
                            Some(v) => v.contains(dep),
                            None => false,
                        };
                        if declared_in_same_module {
                            return false;
                        }

                        if !free.contains(&idx)
                            && graph.has_a_path(*dep, idx)
                            && !moves.insert((idx, *dep))
                        {
                            return false;
                        }

                        // Exclude emitted items
                        !done.contains(dep)
                    })
                    .collect::<Vec<_>>();

                // dbg!(&deps);

                if !deps.is_empty() {
                    let mut deps_to_push = Vec::new();
                    for dep in deps.iter().rev().copied() {
                        if deps_to_push.contains(&dep) {
                            continue;
                        }

                        let can_ignore_dep = can_ignore_deps
                            || (can_ignore_weak_deps
                                && graph.edge_weight(idx, dep) == Some(Required::Maybe));

                        if can_ignore_dep && graph.has_a_path(dep, idx) {
                            // Just emit idx.
                            continue;
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
                    // to emitted closely.
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
                    continue;
                }

                let dependants = graph
                    .neighbors_directed(idx, Dependants)
                    .collect::<Vec<_>>();

                // dbg!(&dependants);

                // We only emit free items because we want to emit statements from same module
                // to emitted closely.
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

            graph.remove_node(idx);
            done.insert(idx);
            return Some(idx);
        }

        None
    })
}

/// Using prototype should be treated as an initialization.
#[derive(Default)]
struct FieldInitFinder {
    in_object_assign: bool,
    in_rhs: bool,
    accessed: AHashSet<Id>,
}

impl FieldInitFinder {
    fn check_lhs_of_assign(&mut self, lhs: &AssignTarget) {
        if let AssignTarget::Simple(SimpleAssignTarget::Member(m)) = lhs {
            match &*m.obj {
                Expr::Ident(i) => {
                    self.accessed.insert(i.into());
                }
                Expr::Member(..) => self.check_lhs_expr_of_assign(&m.obj),
                _ => {}
            }
        }
    }

    fn check_lhs_expr_of_assign(&mut self, lhs: &Expr) {
        if let Expr::Member(m) = lhs {
            match &*m.obj {
                Expr::Ident(i) => {
                    self.accessed.insert(i.into());
                }
                Expr::Member(..) => self.check_lhs_expr_of_assign(&m.obj),
                _ => {}
            }
        }
    }
}

impl Visit for FieldInitFinder {
    noop_visit_type!();

    fn visit_assign_expr(&mut self, e: &AssignExpr) {
        let old = self.in_rhs;
        self.in_rhs = false;
        e.left.visit_with(self);
        self.check_lhs_of_assign(&e.left);

        self.in_rhs = true;
        e.right.visit_with(self);
        self.in_rhs = old;
    }

    fn visit_pat(&mut self, e: &Pat) {
        let old = self.in_rhs;
        self.in_rhs = false;
        e.visit_children_with(self);
        self.in_rhs = old;
    }

    fn visit_call_expr(&mut self, e: &CallExpr) {
        match &e.callee {
            Callee::Super(_) | Callee::Import(_) => {}
            Callee::Expr(callee) => {
                if let Expr::Member(callee) = &**callee {
                    if callee.obj.is_ident_ref_to("Object") {
                        match &callee.prop {
                            MemberProp::Ident(IdentName { sym: prop_sym, .. })
                                if *prop_sym == *"assign" =>
                            {
                                let old = self.in_object_assign;
                                self.in_object_assign = true;

                                e.args.visit_with(self);
                                self.in_object_assign = old;

                                return;
                            }
                            _ => {}
                        }
                    }
                }
            }
        }

        e.visit_children_with(self);
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);

        if let MemberProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }

        if !self.in_rhs || self.in_object_assign {
            if let Expr::Ident(obj) = &*e.obj {
                match &e.prop {
                    MemberProp::Ident(IdentName { sym: prop_sym, .. })
                        if *prop_sym == *"prototype" =>
                    {
                        self.accessed.insert(obj.into());
                    }
                    _ => {}
                }
            }
        }
    }

    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            c.visit_with(self);
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

    fn visit_pat(&mut self, pat: &Pat) {
        match pat {
            Pat::Ident(i) if self.ident == i.id => {
                self.found = true;
            }

            _ => {
                pat.visit_children_with(self);
            }
        }
    }

    fn visit_ident(&mut self, i: &Ident) {
        if self.in_complex && self.ident == *i {
            self.found = true;
        }
    }

    fn visit_expr_or_spread(&mut self, node: &ExprOrSpread) {
        let in_complex = self.in_complex;
        self.in_complex = true;
        node.visit_children_with(self);
        self.in_complex = in_complex;
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        {
            let in_complex = self.in_complex;
            self.in_complex = true;
            e.obj.visit_children_with(self);
            self.in_complex = in_complex;
        }

        if let MemberProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }

    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }
}

/// We do not care about variables created by current statement.
/// But we care about modifications.
#[derive(Default)]
struct RequirementCalculator {
    required_ids: IndexSet<(Id, Required), ARandomState>,
    /// While bundling, there can be two bindings with same name and syntax
    /// context, in case of wrapped es modules. We exclude them from dependency
    /// graph.
    excluded: IndexSet<Id, ARandomState>,

    in_weak: bool,
    in_var_decl: bool,
    in_assign_lhs: bool,
}

macro_rules! weak {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, f: &$T) {
            let in_weak = self.in_weak;
            self.in_weak = true;

            f.visit_children_with(self);

            self.in_weak = in_weak;
        }
    };
}

impl RequirementCalculator {
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

impl Visit for RequirementCalculator {
    noop_visit_type!();

    weak!(visit_arrow_expr, ArrowExpr);

    weak!(visit_function, Function);

    weak!(visit_class_method, ClassMethod);

    weak!(visit_private_method, PrivateMethod);

    weak!(visit_method_prop, MethodProp);

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        let orig = match &n.orig {
            ModuleExportName::Ident(ident) => ident,
            ModuleExportName::Str(..) => unimplemented!("module string names unimplemented"),
        };
        self.insert(orig.clone().into());
    }

    fn visit_assign_expr(&mut self, e: &AssignExpr) {
        let old = self.in_assign_lhs;

        self.in_assign_lhs = true;
        e.left.visit_with(self);

        self.in_assign_lhs = false;
        e.right.visit_with(self);

        self.in_assign_lhs = old;
    }

    fn visit_pat(&mut self, pat: &Pat) {
        match pat {
            Pat::Ident(i) => {
                // We do not care about variables created by current statement.
                if self.in_var_decl && !self.in_assign_lhs {
                    return;
                }
                self.insert(i.id.clone().into());
            }
            _ => {
                pat.visit_children_with(self);
            }
        }
    }

    fn visit_var_declarator(&mut self, var: &VarDeclarator) {
        let in_var_decl = self.in_var_decl;
        self.in_var_decl = true;

        if self.in_weak {
            let ids: Vec<Id> = find_pat_ids(&var.name);
            self.excluded.extend(ids);
        }

        var.visit_children_with(self);

        self.in_var_decl = in_var_decl;
    }

    fn visit_expr(&mut self, expr: &Expr) {
        match expr {
            Expr::Ident(i) => {
                if self.in_var_decl && self.in_assign_lhs {
                    return;
                }
                self.insert(i.into());
            }
            _ => {
                expr.visit_children_with(self);
            }
        }
    }

    fn visit_prop(&mut self, prop: &Prop) {
        match prop {
            Prop::Shorthand(i) => {
                self.insert(i.into());
            }
            _ => prop.visit_children_with(self),
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);

        if let MemberProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }

    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }
}

fn calc_deps(new: &[ModuleItem]) -> StmtDepGraph {
    tracing::debug!("Analyzing dependencies between statements");
    let mut graph = StmtDepGraph::default();

    let mut declared_by = AHashMap::<Id, Vec<usize>>::default();
    let mut uninitialized_ids = AHashMap::<Id, usize>::default();

    for (idx, item) in new.iter().enumerate() {
        graph.add_node(idx);

        // We start by calculating ids created by statements. Note that we don't need to
        // analyze bodies of functions nor members of classes, because it's not
        // evaluated until they are called.

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
                            let ids: Vec<Id> = find_pat_ids(&var.name);
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
            let mut v = FieldInitFinder::default();
            item.visit_with(&mut v);

            for id in v.accessed {
                if let Some(declarator_indexes) = declared_by.get(&id) {
                    // let idx_decl = match &item {
                    //     ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                    //         let ids: Vec<Id> = find_ids(&var.decls);
                    //         format!("`{:?}`", ids)
                    //     }
                    //     ModuleItem::Stmt(Stmt::Decl(Decl::Class(c))) => {
                    //         format!("{}{:?}", c.ident.sym, c.ident.ctxt)
                    //     }
                    //     ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
                    //         format!("{}{:?}", f.ident.sym, f.ident.ctxt)
                    //     }
                    //     _ => String::from(""),
                    // };

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
            item.visit_with(&mut finder);
            if finder.found {
                declared_by.entry(uninit_id).or_default().push(idx);
                break;
            }
        }
    }

    for (idx, item) in new.iter().enumerate() {
        // We then calculate which ids a statement require to be executed.
        // Again, we don't need to analyze non-top-level identifiers because they
        // are not evaluated while loading module.

        let mut visitor = RequirementCalculator::default();

        item.visit_with(&mut visitor);

        for (id, kind) in visitor.required_ids {
            if visitor.excluded.contains(&id) {
                continue;
            }

            if let Some(declarator_indexes) = declared_by.get(&id) {
                for &declarator_index in declarator_indexes {
                    if declarator_index != idx {
                        // let idx_decl = match &item {
                        //     ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                        //         let ids: Vec<Id> = find_ids(&var.decls);
                        //         format!("`{:?}`", ids)
                        //     }
                        //     ModuleItem::Stmt(Stmt::Decl(Decl::Class(c))) => {
                        //         format!("{}{:?}", c.ident.sym, c.ident.ctxt)
                        //     }
                        //     ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
                        //         format!("{}{:?}", f.ident.sym, f.ident.ctxt)
                        //     }
                        //     _ => String::from(""),
                        // };

                        graph.add_edge(idx, declarator_index, kind);
                        // eprintln!(
                        //     "`{}` ({}) depends on `{}`: {:?}",
                        //     idx, idx_decl, declarator_index, &id
                        // );
                        if cfg!(debug_assertions) {
                            assert!(graph
                                .neighbors_directed(idx, Dependencies)
                                .any(|x| x == declarator_index));
                        }
                    }
                }
            }
        }
    }

    graph
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP;
    use swc_ecma_ast::*;

    use super::{calc_deps, Dependencies};
    use crate::{bundler::tests::suite, debug::print_hygiene};

    fn assert_no_cycle(s: &str) {
        suite().file("main.js", s).run(|t| {
            let info = t.module("main.js");
            let module = (*info.module).clone();

            let graph = calc_deps(&module.body);

            for i in 0..module.body.len() {
                if let ModuleItem::Stmt(Stmt::Decl(Decl::Fn(..))) = &module.body[i] {
                    continue;
                }

                let deps = graph
                    .neighbors_directed(i, Dependencies)
                    .collect::<Vec<_>>();

                for dep in deps {
                    if let ModuleItem::Stmt(Stmt::Decl(Decl::Fn(..))) = &module.body[dep] {
                        continue;
                    }
                    print_hygiene(
                        "first item",
                        &t.cm,
                        &Module {
                            span: DUMMY_SP,
                            body: vec![module.body[dep].clone()],
                            shebang: None,
                        },
                    );
                    print_hygiene(
                        "second item",
                        &t.cm,
                        &Module {
                            span: DUMMY_SP,
                            body: vec![module.body[i].clone()],
                            shebang: None,
                        },
                    );
                    assert!(
                        !graph.has_a_path(dep, i),
                        "{} and {} is dependant to each other",
                        dep,
                        i,
                    );
                }
            }

            Ok(())
        });
    }

    #[test]
    fn no_cycle_1() {
        assert_no_cycle(
            r#"
            function lexer(str) {
                const tokens = [];
                let i = 0;
                while(i < str.length){
                    const char = str[i];
                    if (char === "*" || char === "+" || char === "?") {
                        tokens.push({
                            type: "MODIFIER",
                            index: i,
                            value: str[i++]
                        });
                        continue;
                    }
                    if (char === "\\") {
                        tokens.push({
                            type: "ESCAPED_CHAR",
                            index: i++,
                            value: str[i++]
                        });
                        continue;
                    }
                    if (char === "{") {
                        tokens.push({
                            type: "OPEN",
                            index: i,
                            value: str[i++]
                        });
                        continue;
                    }
                    if (char === "}") {
                        tokens.push({
                            type: "CLOSE",
                            index: i,
                            value: str[i++]
                        });
                        continue;
                    }
                    if (char === ":") {
                        let name = "";
                        let j = i + 1;
                        while(j < str.length){
                            const code = str.charCodeAt(j);
                            if ((code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95) {
                                name += str[j++];
                                continue;
                            }
                            break;
                        }
                        if (!name) throw new TypeError(`Missing parameter name at ${i}`);
                        tokens.push({
                            type: "NAME",
                            index: i,
                            value: name
                        });
                        i = j;
                        continue;
                    }
                    if (char === "(") {
                        let count = 1;
                        let pattern = "";
                        let j = i + 1;
                        if (str[j] === "?") {
                            throw new TypeError(`Pattern cannot start with "?" at ${j}`);
                        }
                        while(j < str.length){
                            if (str[j] === "\\") {
                                pattern += str[j++] + str[j++];
                                continue;
                            }
                            if (str[j] === ")") {
                                count--;
                                if (count === 0) {
                                    j++;
                                    break;
                                }
                            } else if (str[j] === "(") {
                                count++;
                                if (str[j + 1] !== "?") {
                                    throw new TypeError(`Capturing groups are not allowed at ${j}`);
                                }
                            }
                            pattern += str[j++];
                        }
                        if (count) throw new TypeError(`Unbalanced pattern at ${i}`);
                        if (!pattern) throw new TypeError(`Missing pattern at ${i}`);
                        tokens.push({
                            type: "PATTERN",
                            index: i,
                            value: pattern
                        });
                        i = j;
                        continue;
                    }
                    tokens.push({
                        type: "CHAR",
                        index: i,
                        value: str[i++]
                    });
                }
                tokens.push({
                    type: "END",
                    index: i,
                    value: ""
                });
                return tokens;
            }
            function parse(str, options = {
            }) {
                const tokens = lexer(str);
                const { prefixes ="./"  } = options;
                const defaultPattern = `[^${escapeString(options.delimiter || "/#?")}]+?`;
                const result = [];
                let key = 0;
                let i = 0;
                let path = "";
                const tryConsume = (type)=>{
                    if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
                };
                const mustConsume = (type)=>{
                    const value = tryConsume(type);
                    if (value !== undefined) return value;
                    const { type: nextType , index  } = tokens[i];
                    throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
                };
                const consumeText = ()=>{
                    let result1 = "";
                    let value;
                    while((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))){
                        result1 += value;
                    }
                    return result1;
                };
                while(i < tokens.length){
                    const char = tryConsume("CHAR");
                    const name = tryConsume("NAME");
                    const pattern = tryConsume("PATTERN");
                    if (name || pattern) {
                        let prefix = char || "";
                        if (prefixes.indexOf(prefix) === -1) {
                            path += prefix;
                            prefix = "";
                        }
                        if (path) {
                            result.push(path);
                            path = "";
                        }
                        result.push({
                            name: name || key++,
                            prefix,
                            suffix: "",
                            pattern: pattern || defaultPattern,
                            modifier: tryConsume("MODIFIER") || ""
                        });
                        continue;
                    }
                    const value = char || tryConsume("ESCAPED_CHAR");
                    if (value) {
                        path += value;
                        continue;
                    }
                    if (path) {
                        result.push(path);
                        path = "";
                    }
                    const open = tryConsume("OPEN");
                    if (open) {
                        const prefix = consumeText();
                        const name1 = tryConsume("NAME") || "";
                        const pattern1 = tryConsume("PATTERN") || "";
                        const suffix = consumeText();
                        mustConsume("CLOSE");
                        result.push({
                            name: name1 || (pattern1 ? key++ : ""),
                            pattern: name1 && !pattern1 ? defaultPattern : pattern1,
                            prefix,
                            suffix,
                            modifier: tryConsume("MODIFIER") || ""
                        });
                        continue;
                    }
                    mustConsume("END");
                }
                return result;
            }
            const parse1 = parse;
            function compile(str, options) {
                return tokensToFunction(parse(str, options), options);
            }
            const compile1 = compile;
            function tokensToFunction(tokens, options = {
            }) {
                const reFlags = flags(options);
                const { encode =(x)=>x
                 , validate =true  } = options;
                const matches = tokens.map((token)=>{
                    if (typeof token === "object") {
                        return new RegExp(`^(?:${token.pattern})$`, reFlags);
                    }
                });
                return (data)=>{
                    let path = "";
                    for(let i = 0; i < tokens.length; i++){
                        const token = tokens[i];
                        if (typeof token === "string") {
                            path += token;
                            continue;
                        }
                        const value = data ? data[token.name] : undefined;
                        const optional = token.modifier === "?" || token.modifier === "*";
                        const repeat = token.modifier === "*" || token.modifier === "+";
                        if (Array.isArray(value)) {
                            if (!repeat) {
                                throw new TypeError(`Expected "${token.name}" to not repeat, but got an array`);
                            }
                            if (value.length === 0) {
                                if (optional) continue;
                                throw new TypeError(`Expected "${token.name}" to not be empty`);
                            }
                            for(let j = 0; j < value.length; j++){
                                const segment = encode(value[j], token);
                                if (validate && !(matches[i]).test(segment)) {
                                    throw new TypeError(`Expected all "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                                }
                                path += token.prefix + segment + token.suffix;
                            }
                            continue;
                        }
                        if (typeof value === "string" || typeof value === "number") {
                            const segment = encode(String(value), token);
                            if (validate && !(matches[i]).test(segment)) {
                                throw new TypeError(`Expected "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                            }
                            path += token.prefix + segment + token.suffix;
                            continue;
                        }
                        if (optional) continue;
                        const typeOfMessage = repeat ? "an array" : "a string";
                        throw new TypeError(`Expected "${token.name}" to be ${typeOfMessage}`);
                    }
                    return path;
                };
            }
            const tokensToFunction1 = tokensToFunction;
            function match(str, options) {
                const keys = [];
                const re = pathToRegexp(str, keys, options);
                return regexpToFunction(re, keys, options);
            }
            const match1 = match;
            function regexpToFunction(re, keys, options = {
            }) {
                const { decode =(x)=>x
                  } = options;
                return function(pathname) {
                    const m = re.exec(pathname);
                    if (!m) return false;
                    const { 0: path , index  } = m;
                    const params = Object.create(null);
                    for(let i = 1; i < m.length; i++){
                        if (m[i] === undefined) continue;
                        const key = keys[i - 1];
                        if (key.modifier === "*" || key.modifier === "+") {
                            params[key.name] = m[i].split(key.prefix + key.suffix).map((value)=>{
                                return decode(value, key);
                            });
                        } else {
                            params[key.name] = decode(m[i], key);
                        }
                    }
                    return {
                        path,
                        index,
                        params
                    };
                };
            }
            const regexpToFunction1 = regexpToFunction;
            function escapeString(str) {
                return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
            }
            function flags(options) {
                return options && options.sensitive ? "" : "i";
            }
            function regexpToRegexp(path, keys) {
                if (!keys) return path;
                const groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
                let index = 0;
                let execResult = groupsRegex.exec(path.source);
                while(execResult){
                    keys.push({
                        name: execResult[1] || index++,
                        prefix: "",
                        suffix: "",
                        modifier: "",
                        pattern: ""
                    });
                    execResult = groupsRegex.exec(path.source);
                }
                return path;
            }
            function arrayToRegexp(paths, keys, options) {
                const parts = paths.map((path)=>pathToRegexp(path, keys, options).source
                );
                return new RegExp(`(?:${parts.join("|")})`, flags(options));
            }
            function stringToRegexp(path, keys, options) {
                return tokensToRegexp(parse(path, options), keys, options);
            }
            function tokensToRegexp(tokens, keys, options = {
            }) {
                const { strict =false , start =true , end =true , encode =(x)=>x
                  } = options;
                const endsWith = `[${escapeString(options.endsWith || "")}]|$`;
                const delimiter = `[${escapeString(options.delimiter || "/#?")}]`;
                let route = start ? "^" : "";
                for (const token of tokens){
                    if (typeof token === "string") {
                        route += escapeString(encode(token));
                    } else {
                        const prefix = escapeString(encode(token.prefix));
                        const suffix = escapeString(encode(token.suffix));
                        if (token.pattern) {
                            if (keys) keys.push(token);
                            if (prefix || suffix) {
                                if (token.modifier === "+" || token.modifier === "*") {
                                    const mod = token.modifier === "*" ? "?" : "";
                                    route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`;
                                } else {
                                    route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`;
                                }
                            } else {
                                route += `(${token.pattern})${token.modifier}`;
                            }
                        } else {
                            route += `(?:${prefix}${suffix})${token.modifier}`;
                        }
                    }
                }
                if (end) {
                    if (!strict) route += `${delimiter}?`;
                    route += !options.endsWith ? "$" : `(?=${endsWith})`;
                } else {
                    const endToken = tokens[tokens.length - 1];
                    const isEndDelimited = typeof endToken === "string" ? delimiter.indexOf(endToken[endToken.length - 1]) > -1 : endToken === undefined;
                    if (!strict) {
                        route += `(?:${delimiter}(?=${endsWith}))?`;
                    }
                    if (!isEndDelimited) {
                        route += `(?=${delimiter}|${endsWith})`;
                    }
                }
                return new RegExp(route, flags(options));
            }
            const tokensToRegexp1 = tokensToRegexp;
            function pathToRegexp(path, keys, options) {
                if (path instanceof RegExp) return regexpToRegexp(path, keys);
                if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
                return stringToRegexp(path, keys, options);
            }
            const pathToRegexp1 = pathToRegexp;
        "#,
        );
    }
}
