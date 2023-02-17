#![warn(clippy::all)]
#![warn(unused)]

use std::{
    hash::{BuildHasherDefault, Hash},
    mem::take,
};

use indexmap::IndexSet;
use petgraph::algo::kosaraju_scc;
use rustc_hash::{FxHashMap, FxHashSet, FxHasher};
use swc_atoms::js_word;
use swc_ecma_ast::{
    op, ClassDecl, Decl, ExportDecl, ExportSpecifier, Expr, ExprStmt, FnDecl, Id, ImportSpecifier,
    Module, ModuleDecl, ModuleExportName, ModuleItem, Stmt, VarDecl,
};
use swc_ecma_utils::find_pat_ids;
use swc_fast_graph::digraph::FastDiGraphMap;

use self::util::{ids_captured_by, ids_used_by, ids_used_by_ignoring_nested};

mod util;

/// DCE, but for unused expressions.
///
/// Returns true if it's changed.
pub fn sweep_expressions(module: &mut Module) -> bool {
    let mut g = DepGraph::default();
    let (item_ids, mut items) = g.init(module);
    {
        let mut analyzer = Analyzer {
            g: &mut g,
            item_ids: &item_ids,
            items: &mut items,
            last_side_effect: Default::default(),
            last_side_effects: Default::default(),
            vars: Default::default(),
        };

        let eventual_ids = analyzer.hoist_vars_and_bindings(module);

        analyzer.evaluate_immediate(module, &eventual_ids);

        analyzer.evaluate_eventual(module);

        analyzer.handle_exports(module);
    }

    let required = g.finalize();

    let retained_lines = required
        .iter()
        .map(|v| v.index)
        .filter(|&v| v != usize::MAX)
        .collect::<FxHashSet<_>>();

    if retained_lines.len() == module.body.len() {
        return false;
    }

    let mut new_body = vec![];

    for (index, stmt) in take(&mut module.body).into_iter().enumerate() {
        if retained_lines.contains(&index) {
            new_body.push(stmt);
        }
    }

    module.body = new_body;

    true
}

pub struct Analyzer<'a> {
    g: &'a mut DepGraph,
    item_ids: &'a Vec<ItemId>,
    items: &'a mut FxHashMap<ItemId, ItemData>,

    last_side_effect: Option<ItemId>,
    last_side_effects: Vec<ItemId>,

    vars: FxHashMap<Id, VarState>,
}

#[derive(Debug, Default)]
struct VarState {
    /// The module items that might triggered side effects on that variable.
    /// We also store if this is a `const` write, so no further change will
    /// happen to this var.
    last_writes: Vec<ItemId>,
    /// The module items that might read that variable.
    last_reads: Vec<ItemId>,
}
impl Analyzer<'_> {
    /// Phase 1: Hoisted Variables and Bindings
    ///
    ///
    /// Returns all (EVENTUAL_READ/WRITE_VARS) in the module.
    fn hoist_vars_and_bindings(&mut self, module: &Module) -> IndexSet<Id> {
        let mut eventual_ids = IndexSet::default();

        for item_id in self.item_ids.iter() {
            if let Some(item) = self.items.get(item_id) {
                eventual_ids.extend(item.eventual_read_vars.iter().cloned());
                eventual_ids.extend(item.eventual_write_vars.iter().cloned());

                if item.is_hoisted && item.side_effects {
                    if let Some(last) = self.last_side_effect.take() {
                        self.g.add_strong_dep(item_id, &last)
                    }

                    self.last_side_effect = Some(item_id.clone());
                    self.last_side_effects.push(item_id.clone());
                }

                for id in item.var_decls.iter() {
                    let state = self.vars.entry(id.clone()).or_default();

                    if item.is_hoisted {
                        state.last_writes.push(item_id.clone());
                    } else {
                        // TODO: Create a fake module item
                        // state.last_writes.push(item_id.clone());
                    }
                }
            }
        }

        eventual_ids
    }

    /// Phase 2: Immediate evaluation
    fn evaluate_immediate(&mut self, module: &Module, eventual_ids: &IndexSet<Id>) {
        for item_id in self.item_ids.iter() {
            if let Some(item) = self.items.get(item_id) {
                // Ignore HOISTED module items, they have been processed in phase 1 already.
                if item.is_hoisted {
                    continue;
                }

                let mut items_to_remove_from_last_reads = FxHashMap::<_, Vec<_>>::default();

                // For each var in READ_VARS:
                for id in item.read_vars.iter() {
                    // Create a strong dependency to all module items listed in LAST_WRITES for that
                    // var.

                    // (the write need to be executed before this read)
                    if let Some(state) = self.vars.get(id) {
                        for last_write in state.last_writes.iter() {
                            self.g.add_strong_dep(item_id, last_write);

                            items_to_remove_from_last_reads
                                .entry(id.clone())
                                .or_default()
                                .push(last_write.clone());
                        }
                    }
                }

                // For each var in WRITE_VARS:
                for id in item.write_vars.iter() {
                    // Create a weak dependency to all module items listed in
                    // LAST_READS for that var.

                    // (the read need to be executed before this write, when
                    // it’s needed)

                    if let Some(state) = self.vars.get(id) {
                        for last_read in state.last_reads.iter() {
                            self.g.add_weak_dep(item_id, last_read);
                        }
                    }
                }

                if item.side_effects {
                    // Create a strong dependency to LAST_SIDE_EFFECT.

                    if let Some(last) = &self.last_side_effect {
                        self.g.add_strong_dep(item_id, last);
                    }

                    // Create weak dependencies to all LAST_WRITES and
                    // LAST_READS.
                    for id in eventual_ids.iter() {
                        if let Some(state) = self.vars.get(id) {
                            for last_write in state.last_writes.iter() {
                                self.g.add_weak_dep(item_id, last_write);
                            }

                            for last_read in state.last_reads.iter() {
                                self.g.add_weak_dep(item_id, last_read);
                            }
                        }
                    }
                }

                // For each var in WRITE_VARS:
                for id in item.write_vars.iter() {
                    // Add this module item to LAST_WRITES

                    let state = self.vars.entry(id.clone()).or_default();
                    state.last_writes.push(item_id.clone());

                    // TODO: Optimization: Remove each module item to which we
                    // just created a strong dependency from LAST_WRITES
                }

                // For each var in READ_VARS:
                for id in item.read_vars.iter() {
                    // Add this module item to LAST_READS

                    let state = self.vars.entry(id.clone()).or_default();
                    state.last_reads.push(item_id.clone());

                    // Optimization: Remove each module item to which we
                    // just created a strong dependency from LAST_READS

                    if let Some(items) = items_to_remove_from_last_reads.get(id) {
                        for item in items {
                            if let Some(pos) = state.last_reads.iter().position(|v| *v == *item) {
                                state.last_reads.remove(pos);
                            }
                        }
                    }
                }

                if item.side_effects {
                    self.last_side_effect = Some(item_id.clone());
                    self.last_side_effects.push(item_id.clone());
                }
            }
        }
    }

    /// Phase 3: Eventual evaluation
    fn evaluate_eventual(&mut self, module: &Module) {
        for item_id in self.item_ids.iter() {
            if let Some(item) = self.items.get(item_id) {
                // For each var in EVENTUAL_READ_VARS:

                for id in item.eventual_read_vars.iter() {
                    // Create a strong dependency to all module items listed in
                    // LAST_WRITES for that var.

                    if let Some(state) = self.vars.get(id) {
                        for last_write in state.last_writes.iter() {
                            self.g.add_strong_dep(item_id, last_write);
                        }
                    }
                }

                // For each var in EVENTUAL_WRITE_VARS:
                for id in item.eventual_write_vars.iter() {
                    // Create a weak dependency to all module items listed in
                    // LAST_READS for that var.

                    if let Some(state) = self.vars.get(id) {
                        for last_read in state.last_reads.iter() {
                            self.g.add_weak_dep(item_id, last_read);
                        }
                    }
                }

                // (no state update happens, since this is only triggered by
                // side effects, which we already handled)
            }
        }
    }

    /// Phase 4: Exports
    fn handle_exports(&mut self, module: &Module) {
        for item_id in self.item_ids.iter() {
            if item_id.index == usize::MAX {
                match &item_id.kind {
                    ItemIdKind::ModuleEvaluation => {
                        // Create a strong dependency to LAST_SIDE_EFFECTS

                        for last in self.last_side_effects.iter() {
                            self.g.add_strong_dep(item_id, last);
                        }

                        // // Create weak dependencies to all LAST_WRITES and
                        // // LAST_READS.

                        // for (.., state) in self.vars.iter() {
                        //     for last_write in state.last_writes.iter() {
                        //         self.g.add_weak_dep(item_id, last_write);
                        //     }

                        //     for last_read in state.last_reads.iter() {
                        //         self.g.add_weak_dep(item_id, last_read);
                        //     }
                        // }
                    }
                    ItemIdKind::Export(id) => {
                        // Create a strong dependency to LAST_WRITES for this var

                        if let Some(state) = self.vars.get(id) {
                            for last_write in state.last_writes.iter() {
                                self.g.add_strong_dep(item_id, last_write);
                            }
                        }
                    }

                    _ => {}
                }
            }
        }
    }
}

/// The id of an item
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
struct ItemId {
    /// The index of the module item in the module.
    pub index: usize,
    pub kind: ItemIdKind,
}

/// ## Import
///
/// ```js
/// import { upper } from "module";
/// ```
///
/// becomes [ItemIdKind::ImportOfModule] and [ItemIdKind::ImportBinding].
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
enum ItemIdKind {
    ///
    Normal,

    ImportOfModule,
    /// Imports are splitted as multiple items.
    ImportBinding(u32),
    VarDeclarator(u32),

    ModuleEvaluation,

    Export(Id),
}

/// Data about a module item
#[derive(Debug, Default)]
struct ItemData {
    /// If the module item is hoisted?
    pub is_hoisted: bool,

    /// Variables declared or bound by this module item?
    pub var_decls: Vec<Id>,

    /// Variables read by this module item during evaluation?
    pub read_vars: Vec<Id>,

    /// Variables read by this module item eventually?
    ///
    /// - e.g. variables read in the body of function declarations are
    ///   considered
    ///  as eventually read
    /// - This is only used when reads are not trigger directly by this module
    ///   item, but require a side effect to be triggered. We don’t know when
    ///   this is executed.
    /// - Note: This doesn’t mean they are only read “after” initial evaluation.
    ///   They might also be read “during” initial evaluation on any module item
    ///   with SIDE_EFFECTS. This kind of interaction is handled by the module
    ///   item with SIDE_EFFECTS.
    pub eventual_read_vars: Vec<Id>,

    /// Side effects that are triggered on local variables during evaluation?
    pub write_vars: Vec<Id>,

    /// Side effects that are triggered on local variables eventually?
    pub eventual_write_vars: Vec<Id>,

    /// Are other unknown side effects that are trigger during evaluation?
    pub side_effects: bool,
}

#[derive(Debug, Clone)]
struct InternedGraph<T>
where
    T: Eq + Hash + Clone,
{
    /// `bool`: Strong
    idx_graph: FastDiGraphMap<u32, bool>,
    graph_ix: IndexSet<T, BuildHasherDefault<FxHasher>>,
}

impl<T> Default for InternedGraph<T>
where
    T: Eq + Hash + Clone,
{
    fn default() -> Self {
        Self {
            idx_graph: Default::default(),
            graph_ix: Default::default(),
        }
    }
}

impl<T> InternedGraph<T>
where
    T: Eq + Hash + Clone,
{
    pub(super) fn node(&mut self, id: &T) -> u32 {
        self.graph_ix.get_index_of(id).unwrap_or_else(|| {
            let ix = self.graph_ix.len();
            self.graph_ix.insert_full(id.clone());
            ix
        }) as _
    }

    /// Panics if `id` is not found.
    pub(super) fn get_node(&self, id: &T) -> u32 {
        self.graph_ix.get_index_of(id).unwrap() as _
    }

    pub(super) fn map<N, F>(self, mut map: F) -> InternedGraph<N>
    where
        N: Clone + Eq + Hash,
        F: FnMut(T) -> N,
    {
        let ix = self.graph_ix.into_iter().map(|v| map(v)).collect();
        InternedGraph {
            idx_graph: self.idx_graph,
            graph_ix: ix,
        }
    }
}

#[derive(Debug, Clone, Default)]
struct DepGraph {
    g: InternedGraph<ItemId>,
}

impl DepGraph {
    fn finalize(&self) -> FxHashSet<ItemId> {
        /// Returns true if it should be called again
        fn add_to_group(
            graph: &InternedGraph<ItemId>,
            required: &mut FxHashSet<ItemId>,
            start_ix: u32,
            done: &mut FxHashSet<u32>,
        ) -> bool {
            // TODO: Consider cycles
            //

            let mut changed = false;

            // Check deps of `start`.
            for dep_ix in graph
                .idx_graph
                .neighbors_directed(start_ix, petgraph::Direction::Outgoing)
            {
                if done.insert(dep_ix) {
                    changed = true;

                    let dep_id = graph.graph_ix.get_index(dep_ix as _).unwrap().clone();

                    required.insert(dep_id);

                    add_to_group(graph, required, dep_ix, done);
                }
            }

            changed
        }

        let mut cycles = kosaraju_scc(&self.g.idx_graph);
        cycles.retain(|v| v.len() > 1);

        // If a node have two or more dependants, it should be in a separate
        // group.

        let mut required = FxHashSet::default();
        let mut done = FxHashSet::default();

        // Module evaluation node and export nodes starts a group
        for id in self.g.graph_ix.iter() {
            let ix = self.g.get_node(id);

            if id.index == usize::MAX {
                required.insert(id.clone());
                done.insert(ix);
                continue;
            }
        }

        //

        for &start_ix in &done.clone() {
            if add_to_group(&self.g, &mut required, start_ix, &mut done) {}
        }

        required
    }

    /// Fills information per module items
    pub(super) fn init(&mut self, module: &Module) -> (Vec<ItemId>, FxHashMap<ItemId, ItemData>) {
        let mut exports = vec![];
        let mut items = FxHashMap::default();
        let mut ids = vec![];

        for (index, item) in module.body.iter().enumerate() {
            // Fill exports
            if let ModuleItem::ModuleDecl(item) = item {
                match item {
                    ModuleDecl::ExportDecl(item) => match &item.decl {
                        Decl::Fn(FnDecl { ident, .. }) | Decl::Class(ClassDecl { ident, .. }) => {
                            exports.push(ident.to_id());
                        }
                        Decl::Var(v) => {
                            for decl in &v.decls {
                                let ids: Vec<Id> = find_pat_ids(&decl.name);
                                for id in ids {
                                    exports.push(id);
                                }
                            }
                        }
                        _ => {}
                    },
                    ModuleDecl::ExportNamed(item) => {
                        if item.src.is_none() {
                            for s in &item.specifiers {
                                match s {
                                    ExportSpecifier::Named(s) => {
                                        match s.exported.as_ref().unwrap_or(&s.orig) {
                                            ModuleExportName::Ident(i) => {
                                                exports.push(i.to_id());
                                            }
                                            ModuleExportName::Str(s) => {}
                                        }
                                    }
                                    ExportSpecifier::Default(s) => {
                                        exports.push((js_word!("default"), Default::default()));
                                    }
                                    ExportSpecifier::Namespace(s) => match &s.name {
                                        ModuleExportName::Ident(i) => {
                                            exports.push(i.to_id());
                                        }
                                        ModuleExportName::Str(s) => {}
                                    },
                                }
                            }
                        }
                    }
                    ModuleDecl::ExportDefaultDecl(_) => {
                        exports.push((js_word!("default"), Default::default()));
                    }
                    ModuleDecl::ExportDefaultExpr(_) => {
                        exports.push((js_word!("default"), Default::default()));
                    }
                    ModuleDecl::ExportAll(_) => {}
                    _ => {}
                }
            }

            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(item)) => {
                    // We create multiple items for each import.

                    {
                        // One item for the import itself
                        let id = ItemId {
                            index,
                            kind: ItemIdKind::ImportOfModule,
                        };
                        ids.push(id.clone());
                        items.insert(
                            id,
                            ItemData {
                                is_hoisted: true,
                                side_effects: true,
                                ..Default::default()
                            },
                        );
                    }

                    // One per binding
                    for (si, s) in item.specifiers.iter().enumerate() {
                        let id = ItemId {
                            index,
                            kind: ItemIdKind::ImportBinding(si as u32),
                        };
                        ids.push(id.clone());
                        let local = match s {
                            ImportSpecifier::Named(s) => s.local.to_id(),
                            ImportSpecifier::Default(s) => s.local.to_id(),
                            ImportSpecifier::Namespace(s) => s.local.to_id(),
                        };
                        items.insert(
                            id,
                            ItemData {
                                is_hoisted: true,
                                var_decls: vec![local],
                                ..Default::default()
                            },
                        );
                    }

                    continue;
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(f),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
                    let id = ItemId {
                        index,
                        kind: ItemIdKind::Normal,
                    };
                    ids.push(id.clone());

                    let (read_vars, write_vars) = ids_used_by(&f.function);
                    items.insert(
                        id,
                        ItemData {
                            is_hoisted: true,
                            eventual_read_vars: read_vars,
                            eventual_write_vars: write_vars,
                            var_decls: vec![f.ident.to_id()],
                            ..Default::default()
                        },
                    );
                    continue;
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(v),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Var(v))) => {
                    for (i, decl) in v.decls.iter().enumerate() {
                        let id = ItemId {
                            index,
                            kind: ItemIdKind::VarDeclarator(i as _),
                        };
                        ids.push(id.clone());

                        let decl_ids = find_pat_ids(&decl.name);
                        let (r, w) = ids_used_by_ignoring_nested(&decl.init);
                        let (er, ew) = ids_captured_by(&decl.init);

                        let var_decl = Box::new(VarDecl {
                            decls: vec![decl.clone()],
                            ..*v.clone()
                        });
                        items.insert(
                            id,
                            ItemData {
                                var_decls: decl_ids.clone(),
                                read_vars: r,
                                eventual_read_vars: er,
                                write_vars: decl_ids.into_iter().chain(w).collect(),
                                eventual_write_vars: ew,
                                ..Default::default()
                            },
                        );
                    }

                    continue;
                }

                ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) if expr.is_assign() => {
                    let assign = match &**expr {
                        Expr::Assign(a) => a,
                        _ => unreachable!(),
                    };

                    let mut used_ids = ids_used_by_ignoring_nested(item);
                    let captured_ids = ids_captured_by(item);

                    if assign.op != op!("=") {
                        let extra_ids = ids_used_by_ignoring_nested(&assign.left);
                        used_ids.0.extend(extra_ids.0);
                        used_ids.0.extend(extra_ids.1);
                    }

                    let data = ItemData {
                        read_vars: used_ids.0,
                        eventual_read_vars: captured_ids.0,
                        write_vars: used_ids.1,
                        eventual_write_vars: captured_ids.1,
                        ..Default::default()
                    };

                    let id = ItemId {
                        index,
                        kind: ItemIdKind::Normal,
                    };
                    ids.push(id.clone());
                    items.insert(id, data);
                    continue;
                }
                _ => {}
            }

            // Default to normal

            let used_ids = ids_used_by_ignoring_nested(item);
            let captured_ids = ids_captured_by(item);
            let data = ItemData {
                read_vars: used_ids.0,
                eventual_read_vars: captured_ids.0,
                write_vars: used_ids.1,
                eventual_write_vars: captured_ids.1,
                side_effects: true,
                ..Default::default()
            };

            let id = ItemId {
                index,
                kind: ItemIdKind::Normal,
            };
            ids.push(id.clone());
            items.insert(id, data);
        }

        {
            // `module evaluation side effects` Node
            let id = ItemId {
                index: usize::MAX,
                kind: ItemIdKind::ModuleEvaluation,
            };
            ids.push(id.clone());
            items.insert(
                id,
                ItemData {
                    ..Default::default()
                },
            );
        }

        for export in exports {
            let id = ItemId {
                index: usize::MAX,
                kind: ItemIdKind::Export(export.clone()),
            };
            ids.push(id.clone());
            items.insert(
                id,
                ItemData {
                    ..Default::default()
                },
            );
        }

        (ids, items)
    }

    pub(super) fn add_strong_dep(&mut self, item: &ItemId, dep: &ItemId) {
        let from = self.g.node(item);
        let to = self.g.node(dep);

        self.g.idx_graph.add_edge(from, to, true);
    }

    pub(super) fn add_weak_dep(&mut self, item: &ItemId, dep: &ItemId) {
        let from = self.g.node(item);
        let to = self.g.node(dep);

        if let Some(true) = self.g.idx_graph.edge_weight(from, to) {
            return;
        }
        self.g.idx_graph.add_edge(from, to, false);
    }
}
