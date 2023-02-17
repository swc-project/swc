use std::hash::{BuildHasherDefault, Hash};

use indexmap::IndexSet;
use petgraph::algo::{has_path_connecting, kosaraju_scc};
use rustc_hash::{FxHashMap, FxHashSet, FxHasher};
use swc_atoms::js_word;
use swc_ecma_ast::{
    ClassDecl, Decl, ExportDecl, ExportSpecifier, Expr, ExprStmt, FnDecl, Id, ImportSpecifier,
    Module, ModuleDecl, ModuleExportName, ModuleItem, Stmt, VarDecl,
};
use swc_ecma_utils::find_pat_ids;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};
use swc_fast_graph::digraph::FastDiGraphMap;

/// DCE, but for unused expressions.
pub fn expr_sweeper() -> impl VisitMut {
    ExprSweeper::default()
}

#[derive(Debug, Default)]
struct ExprSweeper {}

impl VisitMut for ExprSweeper {
    noop_visit_mut_type!();
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
pub struct InternedGraph<T>
where
    T: Eq + Hash + Clone,
{
    /// `bool`: Strong
    pub(super) idx_graph: FastDiGraphMap<u32, bool>,
    pub(super) graph_ix: IndexSet<T, BuildHasherDefault<FxHasher>>,
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
pub struct DepGraph {
    pub(super) g: InternedGraph<ItemId>,
}

impl DepGraph {
    /// Weak imports are imports only if it's is referenced strongly. But this
    /// is production-only, and week dependencies are treated as strong
    /// dependency in development mode.
    pub(super) fn handle_weak(&mut self, is_development: bool) {
        if is_development {
        } else {
            for start in self.g.graph_ix.iter() {
                let start = self.g.get_node(start);
                for end in self.g.graph_ix.iter() {
                    let end = self.g.get_node(end);

                    if let Some(false) = self.g.idx_graph.edge_weight(start, end) {
                        self.g.idx_graph.remove_edge(start, end);
                    }
                }
            }
        }
    }

    pub(super) fn finalize(
        &self,
        data: &FxHashMap<ItemId, ItemData>,
    ) -> InternedGraph<Vec<ItemId>> {
        /// Returns true if it should be called again
        fn add_to_group(
            graph: &InternedGraph<ItemId>,
            data: &FxHashMap<ItemId, ItemData>,
            group: &mut Vec<ItemId>,
            start_ix: u32,
            global_done: &mut FxHashSet<u32>,
            group_done: &mut FxHashSet<u32>,
        ) -> bool {
            // TODO: Consider cycles
            //

            let mut changed = false;

            // Check deps of `start`.
            for dep_ix in graph
                .idx_graph
                .neighbors_directed(start_ix, petgraph::Direction::Outgoing)
            {
                let dep_id = graph.graph_ix.get_index(dep_ix as _).unwrap().clone();

                if global_done.insert(dep_ix) || group_done.insert(dep_ix) {
                    changed = true;

                    group.push(dep_id);

                    add_to_group(graph, data, group, dep_ix, global_done, group_done);
                }
            }

            changed
        }

        let mut cycles = kosaraju_scc(&self.g.idx_graph);
        cycles.retain(|v| v.len() > 1);

        // If a node have two or more dependants, it should be in a separate
        // group.

        let mut groups = vec![];
        let mut global_done = FxHashSet::default();

        // Module evaluation node and export nodes starts a group
        for id in self.g.graph_ix.iter() {
            let ix = self.g.get_node(id);

            if id.index == usize::MAX {
                groups.push((vec![id.clone()], FxHashSet::default()));
                global_done.insert(ix);
                continue;
            }
        }

        // Expand **starting** nodes
        for (ix, id) in self.g.graph_ix.iter().enumerate() {
            // If a node is reachable from two or more nodes, it should be in a
            // separate group.

            if global_done.contains(&(ix as u32)) {
                continue;
            }

            let count = global_done
                .iter()
                .filter(|&&staring_point| {
                    has_path_connecting(&self.g.idx_graph, staring_point, ix as _, None)
                })
                .count();

            if count >= 2 {
                groups.push((vec![id.clone()], FxHashSet::default()));
                global_done.insert(ix as u32);
            }
        }

        //

        loop {
            let mut changed = false;

            for (group, group_done) in &mut groups {
                let start = group[0].clone();
                let start_ix = self.g.get_node(&start);
                if add_to_group(&self.g, data, group, start_ix, &mut global_done, group_done) {
                    changed = true;
                }
            }

            if !changed {
                break;
            }
        }

        let mut groups = groups.into_iter().map(|v| v.0).collect::<Vec<_>>();

        for group in groups.iter_mut() {
            group.sort()
        }

        let mut new_graph = InternedGraph::default();
        let mut group_ix_by_item_ix = FxHashMap::default();

        for group in &groups {
            let group_ix = new_graph.node(group);

            for item in group {
                let item_ix = self.g.get_node(item);
                group_ix_by_item_ix.insert(item_ix, group_ix);
            }
        }

        for group in &groups {
            let group_ix = new_graph.node(group);

            for item in group {
                let item_ix = self.g.get_node(item);

                for item_dep_ix in self
                    .g
                    .idx_graph
                    .neighbors_directed(item_ix, petgraph::Direction::Outgoing)
                {
                    let dep_group_ix = group_ix_by_item_ix.get(&item_dep_ix);
                    if let Some(&dep_group_ix) = dep_group_ix {
                        if group_ix == dep_group_ix {
                            continue;
                        }
                        new_graph.idx_graph.add_edge(group_ix, dep_group_ix, true);
                    }
                }
            }
        }

        new_graph
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

                ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                    expr: box Expr::Assign(assign),
                    ..
                })) => {
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
