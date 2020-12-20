use super::Modules;
use crate::debug::print_hygiene;
use crate::{id::Id, util::MapWithMut};
use indexmap::IndexSet;
use petgraph::algo::all_simple_paths;
use petgraph::graphmap::DiGraphMap;
use petgraph::EdgeDirection::Outgoing as Dependancies;
use retain_mut::RetainMut;
use std::collections::HashMap;
use std::collections::HashSet;
use std::mem::take;
use std::ops::Range;
use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_common::Spanned;
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

            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. }))
                | ModuleItem::Stmt(Stmt::Decl(decl)) => {
                    //
                    match decl {
                        // These declarations does not depend on other nodes.
                        Decl::Fn(_) | Decl::TsInterface(_) | Decl::TsTypeAlias(_) => continue,
                        Decl::Class(cls) => {
                            cls.class
                                .super_class
                                .visit_with(&Invalid { span: DUMMY_SP }, &mut visitor);
                        }

                        _ => {
                            item.visit_with(&Invalid { span: DUMMY_SP }, &mut visitor);
                        }
                    }
                }
                _ => {
                    item.visit_with(&Invalid { span: DUMMY_SP }, &mut visitor);
                }
            }

            for (id, kind) in visitor.required_ids {
                if let Some(declarator_indexes) = declared_by.get(&id) {
                    for &declarator_index in declarator_indexes {
                        if declarator_index != idx {
                            graph.add_edge(idx, declarator_index, kind);
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
        let len = new.len();
        let mut orders = vec![];
        let mut delayed = HashSet::new();

        {
            let mut sorter = Sorter {
                graph: &mut graph,
                orders: &mut orders,
                same_module_ranges: &same_module_ranges,
                free,
                _new: &new,
                checked_deps: Default::default(),
                visited_goto: Default::default(),
            };

            for start_idx in module_starts {
                sorter.insert_orders(start_idx, false, &mut delayed);
            }

            sorter.emit_free_items();
            sorter.emit_items(0..len, true);

            // Now all dependencies are merged.
            for i in 0..len {
                if sorter.orders.contains(&i) {
                    continue;
                }
                dbg!("ignored", i);

                sorter.emit(i, true);
            }
        }

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

struct Sorter<'a> {
    graph: &'a mut StmtDepGraph,
    orders: &'a mut Vec<usize>,
    checked_deps: HashSet<usize>,
    visited_goto: HashSet<usize>,
    same_module_ranges: &'a [Range<usize>],
    /// Range of injected statements.
    free: Range<usize>,
    _new: &'a [ModuleItem],
}

impl Sorter<'_> {
    fn dump_item(&self, idx: usize) {
        match &self._new[idx] {
            ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                let ids: Vec<Id> = find_ids(&var.decls);
                eprintln!("({}) Declare: `{:?}`", idx, ids);
            }
            ModuleItem::Stmt(Stmt::Decl(Decl::Class(cls))) => {
                eprintln!("({}) Declare: `{:?}`", idx, Id::from(&cls.ident));
            }
            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
                eprintln!("({}) Declare: `{:?}`", idx, Id::from(&f.ident));
            }
            _ => {}
        }
    }

    // This removes dependencies to other node.
    fn emit(&mut self, idx: usize, emit_dependants: bool) {
        if self.orders.contains(&idx) {
            return;
        }
        eprintln!("Emit: `{}`", idx);
        self.dump_item(idx);

        // Ensure that we already emitted all non-cyclic deps.
        if cfg!(debug_assertions) {
            let deps: Vec<_> = self.graph.neighbors_directed(idx, Dependancies).collect();
            for dep in deps {
                let cycles: Vec<Vec<_>> =
                    all_simple_paths(&*self.graph, dep, idx, 0, None).collect();
                if cycles.is_empty() {
                    continue;
                }

                if !self.orders.contains(&dep) {
                    self.dump_item(dep);
                    unreachable!("`{}` depends on `{}`", idx, dep)
                }
            }
        }

        self.orders.push(idx);
        self.graph.remove_node(idx);

        if emit_dependants {
            self.emit_free_items();
        }
    }

    /// Inject dependency-less free statements.
    fn emit_free_items(&mut self) {
        let range = self.free.clone();
        self.emit_items(range, false)
    }

    fn emit_items(&mut self, range: Range<usize>, emit_free_dependants: bool) {
        // No dependencies
        loop {
            if self.graph.all_edges().count() == 0 {
                if emit_free_dependants {
                    self.emit_free_items();
                }
                break;
            }

            let mut did_work = false;
            for i in range.clone() {
                if self.orders.contains(&i) {
                    continue;
                }

                let deps = self.graph.neighbors_directed(i, Dependancies);

                if deps.count() != 0 {
                    continue;
                }

                did_work = true;
                self.emit(i, emit_free_dependants);
            }

            if !did_work {
                break;
            }
        }

        // Strong dependencies
        loop {
            if self.graph.all_edges().count() == 0 {
                break;
            }

            let mut did_work = false;
            // Add nodes which does not have any dependencies.
            for i in range.clone() {
                if self.orders.contains(&i) {
                    continue;
                }

                let deps = self
                    .graph
                    .neighbors_directed(i, Dependancies)
                    .filter(|&dep| self.graph.edge_weight(i, dep) == Some(&Required::Always));

                if deps.count() != 0 {
                    continue;
                }

                did_work = true;

                eprintln!("Emit ({:?}, strong): {}", range, i);
                self.dump_item(i);

                self.orders.push(i);

                // Remove strong dependency
                for dependancy in self
                    .graph
                    .neighbors_directed(i, Dependancies)
                    .filter(|&dep| self.graph.edge_weight(i, dep) == Some(&Required::Always))
                    .collect::<Vec<_>>()
                {
                    self.graph.remove_edge(i, dependancy).unwrap();
                }
            }

            if emit_free_dependants {
                self.emit_free_items();
            }

            if !did_work {
                break;
            }
        }

        // Weak dependencies
        loop {
            if self.graph.all_edges().count() == 0 {
                break;
            }

            let mut did_work = false;
            // Add nodes which does not have any dependencies.
            for i in range.clone() {
                let deps = self.graph.neighbors_directed(i, Dependancies);

                if self.orders.contains(&i) || deps.count() != 0 {
                    continue;
                }

                eprintln!("Emit ({:?}, weak): {}", range, i);
                self.dump_item(i);

                did_work = true;
                self.orders.push(i);

                // Remove dependency
                self.graph.remove_node(i);
            }

            if emit_free_dependants {
                self.emit_free_items();
            }

            if !did_work {
                break;
            }
        }
    }

    /// Insert orders smartly :)
    fn insert_orders(
        &mut self,
        idx: usize,
        ignore_range_start: bool,
        delayed: &mut HashSet<usize>,
    ) {
        let mut dejavu = HashSet::default();
        self.insert_inner(idx, ignore_range_start, &mut dejavu, delayed, &[])
    }

    fn emit_cycles(&mut self, cycles: Vec<Vec<usize>>) {
        let mut delayed = Default::default();
        {
            eprintln!("Cycles: {:?}", cycles);
            // Emit non-cycle deps.

            for path in &cycles {
                for &idx in path {
                    let deps: Vec<_> = self.graph.neighbors_directed(idx, Dependancies).collect();

                    for dep in deps {
                        let has_cycle =
                            all_simple_paths::<Vec<_>, _>(&*self.graph, dep, idx, 0, None).count()
                                != 0;

                        if !has_cycle {
                            self.insert_orders(dep, false, &mut delayed);
                        }
                    }
                }
            }
        }

        eprintln!("Cycle");

        for path in &cycles {
            dbg!(&path);
        }
    }

    fn range_of(&self, idx: usize) -> Option<Range<usize>> {
        self.same_module_ranges
            .iter()
            .find(|range| range.contains(&idx))
            .cloned()
    }

    /// Insert orders smartly :)
    fn insert_inner(
        &mut self,
        idx: usize,
        ignore_range_start: bool,
        dejavu: &mut HashSet<usize>,
        delayed: &mut HashSet<usize>,
        excluded_cycles: &[Vec<usize>],
    ) {
        let mut next = Some(idx);

        while let Some(idx) = next.take() {
            eprintln!("Checking `{}`", idx);

            if delayed.contains(&idx) || self.orders.contains(&idx) {
                eprintln!("Skipping `{}`", idx);
                continue;
            }

            {
                let deps = self
                    .graph
                    .neighbors_directed(idx, Dependancies)
                    .collect::<Vec<_>>();

                for dep in deps {
                    let cycles: Vec<Vec<_>> =
                        all_simple_paths(&*self.graph, dep, idx, 0, None).collect();
                    if !cycles.is_empty() {
                        self.emit_cycles(cycles);
                        continue;
                    }
                    // We jump to another module.
                    eprintln!("Jumping to dep: `{}`", dep);
                    self.insert_inner(dep, false, dejavu, delayed, excluded_cycles);
                }
            }

            let range = self.range_of(idx);
            if let Some(range) = &range {
                if !ignore_range_start && idx != range.start {
                    let goto = range
                        .clone()
                        .into_iter()
                        .find(|idx| !self.orders.contains(idx));

                    if let Some(goto) = goto {
                        if self.visited_goto.insert(goto) {
                            // We should process module from start to end.
                            dbg!(goto);
                            self.insert_inner(goto, true, dejavu, delayed, excluded_cycles);
                        }
                    }
                }
            }

            let range = match range {
                Some(v) => v,
                None => {
                    if !delayed.contains(&idx) {
                        // Free statements, like injected vars.
                        self.emit(idx, true);
                    }
                    return;
                }
            };

            if !delayed.contains(&idx) {
                self.emit(idx, true);

                let next_idx = idx + 1;

                if !range.contains(&next_idx) {
                    eprintln!("Not in range: next = `{}`", next_idx);
                    // We successfully processed a module.
                    return;
                }
                dbg!(next_idx);
                next = Some(next_idx);
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
