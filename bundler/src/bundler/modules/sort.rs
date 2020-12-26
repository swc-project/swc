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
                            eprintln!("`{}` declares {:?}`", idx, Id::from(ident));
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

                                    eprintln!("`{}` declares {:?}`", idx, id);
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
                let mut v = PrototypeUsageFinter::default();
                item.visit_with(&Invalid { span: DUMMY_SP }, &mut v);

                for id in v.accessed {
                    if let Some(declarator_indexes) = declared_by.get(&id) {
                        for &declarator_index in declarator_indexes {
                            if declarator_index != idx {
                                graph.add_edge(idx, declarator_index, Required::Always);
                                eprintln!("`{}` depends on `{}: {:?}`", idx, declarator_index, &id);
                            }
                        }

                        eprintln!("`{}` declares {:?}`", idx, id);
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
                if let Some(declarator_indexes) = declared_by.get(&id) {
                    for &declarator_index in declarator_indexes {
                        if declarator_index != idx {
                            graph.add_edge(idx, declarator_index, kind);
                            eprintln!("`{}` depends on `{}: {:?}`", idx, declarator_index, id);
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
        orders.extend(iter(
            &mut graph,
            &same_module_ranges,
            free.clone(),
            &module_starts,
            &new,
        ));
        // let mut delayed = HashSet::new();

        // {
        //     let mut sorter = Sorter {
        //         graph: &mut graph,
        //         orders: &mut orders,
        //         same_module_ranges: &same_module_ranges,
        //         free: free.clone(),
        //         _new: &new,
        //         visited_goto: Default::default(),
        //     };
        //
        //     for start_idx in module_starts {
        //         sorter.insert_orders(start_idx, false, &mut delayed);
        //     }
        //
        //     sorter.emit_free_items();
        //     sorter.emit_items(0..len, true);
        //
        //     // Now all dependencies are merged.
        //     eprintln!("Free: {:?}", free);
        //     for i in 0..len {
        //         if sorter.orders.contains(&i) {
        //             continue;
        //         }
        //         // dbg!("Left", i);
        //         sorter.dump_item(i);
        //
        //         sorter.insert_orders(i, false, &mut delayed);
        //     }
        // }
        //
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
    visited_goto: HashSet<usize>,
    same_module_ranges: &'a [Range<usize>],
    /// Range of injected statements.
    free: Range<usize>,
    _new: &'a [ModuleItem],
}

impl Sorter<'_> {
    fn dump_item(&self, idx: usize) {
        // match &self._new[idx] {
        //     ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
        //         let ids: Vec<Id> = find_ids(&var.decls);
        //         eprintln!("({}) Declare: `{:?}`", idx, ids);
        //     }
        //     ModuleItem::Stmt(Stmt::Decl(Decl::Class(cls))) => {
        //         eprintln!("({}) Declare: `{:?}`", idx, Id::from(&cls.ident));
        //     }
        //     ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
        //         eprintln!("({}) Declare: `{:?}`", idx, Id::from(&f.ident));
        //     }
        //     _ => {}
        // }
    }

    // This removes dependencies to other node.
    fn emit(&mut self, idx: usize, emit_dependants: bool) {
        if self.orders.contains(&idx) {
            return;
        }
        eprintln!("Emit: `{}`", idx);
        self.dump_item(idx);

        // `remove_node` should remove edges connected to it, but petgraph@0.5.1 has a
        // bug. So we manually removes edges before removing node.
        //
        // TODO: Report this to upstream and remove hack
        let dependants = self
            .graph
            .neighbors_directed(idx, Dependants)
            .collect::<Vec<_>>();

        // dbg!(&dependants);

        // Ensure that we already emitted all non-cyclic deps.
        if cfg!(debug_assertions) {
            let deps: Vec<_> = self.graph.neighbors_directed(idx, Dependancies).collect();
            for dep in deps {
                if self.graph.has_a_path(dep, idx) {
                    continue;
                }

                if !self.orders.contains(&dep) {
                    self.dump_item(dep);
                    unreachable!("`{}` depends on `{}`", idx, dep)
                }
            }
        }

        self.orders.push(idx);

        // hack
        if emit_dependants {
            for &dependant in &dependants {
                if self.free.contains(&dependant) {
                    let deps_of_dependant: Vec<_> = self
                        .graph
                        .neighbors_directed(dependant, Dependancies)
                        .filter(|i| !self.orders.contains(i))
                        .collect();

                    // dbg!(dependant, &deps_of_dependant);
                    if dependants.is_empty()
                        || (deps_of_dependant.len() == 1 && deps_of_dependant[0] == idx)
                    {
                        self.emit(dependant, emit_dependants);
                    }
                }
            }
        }
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

                let deps: Vec<_> = self
                    .graph
                    .neighbors_directed(i, Dependancies)
                    .filter(|&dep| self.graph.edge_weight(i, dep) == Some(Required::Always))
                    .collect();

                if deps.len() != 0 {
                    continue;
                }
                let deps: Vec<_> = self.graph.neighbors_directed(i, Dependancies).collect();

                did_work = true;

                self.insert_deps(
                    i,
                    deps.clone(),
                    &mut Default::default(),
                    &mut Default::default(),
                );
                dbg!();
                self.emit(i, emit_free_dependants);
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
                let deps = self
                    .graph
                    .neighbors_directed(i, Dependancies)
                    .collect::<Vec<_>>();

                if self.orders.contains(&i) || deps.len() != 0 {
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
                        let has_cycle = self.graph.has_a_path(dep, idx);

                        if !has_cycle {
                            self.insert_orders(dep, false, &mut delayed);
                        }
                    }
                }
            }
        }

        eprintln!("Cycle");

        for path in &cycles {
            // dbg!(&path);
        }
    }

    fn range_of(&self, idx: usize) -> Option<Range<usize>> {
        self.same_module_ranges
            .iter()
            .find(|range| range.contains(&idx))
            .cloned()
    }

    fn insert_deps(
        &mut self,
        idx: usize,
        deps: Vec<usize>,
        dejavu: &mut HashSet<usize>,
        delayed: &mut HashSet<usize>,
    ) {
        for &dep in &deps {
            dbg!(dep, idx);
            let cycles = self.graph.all_simple_paths(dep, idx);
            if !cycles.is_empty() {
                self.emit_cycles(cycles);
                continue;
            }
            // We jump to another module.
            eprintln!("Jumping to dep: `{}`", dep);
            self.insert_inner(dep, false, dejavu, delayed, &[]);

            eprintln!("Done: one dep of `{}`: `{}`", idx, dep);
        }
        eprintln!("Done: deps of `{}`: `{:?}`", idx, deps);
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

                self.insert_deps(idx, deps, dejavu, delayed)
            }

            dbg!();
            let range = self.range_of(idx);
            if let Some(range) = &range {
                if !ignore_range_start && idx > range.start {
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

fn iter<'a>(
    graph: &'a mut StmtDepGraph,
    same_module_ranges: &'a [Range<usize>],
    free: Range<usize>,
    module_starts: &[usize],
    stmts: &'a [ModuleItem],
) -> impl 'a + Iterator<Item = usize> {
    let len = graph.node_count();

    dbg!(&same_module_ranges);
    dbg!(&free);
    dbg!(&module_starts);

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
        'main: while let Some(mut idx) = stack.pop_front() {
            if done.contains(&idx) {
                // eprintln!("Done: {}", idx);
                continue;
            }
            dbg!(idx);
            match &stmts[idx] {
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

            let current_range = same_module_ranges
                .iter()
                .find(|range| range.contains(&idx))
                .cloned();

            dbg!(&current_range);

            // We
            {
                let deps = graph
                    .neighbors_directed(idx, Dependancies)
                    .filter(|dep| {
                        // Exlcude emitted items
                        !done.contains(dep)
                    })
                    .collect::<Vec<_>>();

                dbg!(&deps);

                if !deps.is_empty() {
                    let mut deps_to_push = vec![];
                    for dep in deps {
                        // TODO: Move pointer to `dep` depending on the range start / free.
                        if deps_to_push.contains(&dep) {
                            continue;
                        }

                        if graph.has_a_path(dep, idx) {
                            match &stmts[idx] {
                                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                    decl: Decl::Fn(..),
                                    ..
                                }))
                                | ModuleItem::Stmt(Stmt::Decl(Decl::Fn(..))) => continue,

                                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                    decl: Decl::Class(cls),
                                    ..
                                }))
                                | ModuleItem::Stmt(Stmt::Decl(Decl::Class(cls)))
                                    if cls.class.super_class.is_none() =>
                                {
                                    continue
                                }

                                _ => {}
                            }
                        }

                        deps_to_push.push(dep);
                    }

                    dbg!(&deps_to_push);

                    if !deps_to_push.is_empty() {
                        // We should check idx again after emitting dependencies.
                        stack.push_front(idx);

                        for dep in deps_to_push {
                            eprintln!("[Move]{} => {}; kind = dep", idx, dep);
                            stack.push_front(dep)
                        }

                        continue;
                    }
                }
            }
            let is_free = free.contains(&idx);

            dbg!(is_free);

            if is_free {
                let dependants = graph
                    .neighbors_directed(idx, Dependants)
                    .collect::<Vec<_>>();

                for dependant in dependants {
                    if !done.contains(&dependant) {
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

                    dbg!(&dependants);

                    for dependant in dependants {
                        if !done.contains(&dependant) {
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
            for preceding in current_range {
                // We should select first statement in module which is not emitted yet.
                if done.contains(&preceding) {
                    continue;
                }
                dbg!(preceding);
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

                dbg!(&dependants);

                for dependant in dependants {
                    if !done.contains(&dependant) {
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
struct PrototypeUsageFinter {
    accessed: HashSet<Id>,
}

impl Visit for PrototypeUsageFinter {
    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);

        if e.computed {
            e.prop.visit_with(e, self);
        }

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
