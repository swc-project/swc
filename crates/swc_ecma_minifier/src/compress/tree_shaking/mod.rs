use std::{borrow::Cow, fmt, hash::BuildHasherDefault};

use indexmap::IndexSet;
use petgraph::algo::{has_path_connecting, kosaraju_scc};
use rustc_hash::{FxHashMap, FxHashSet, FxHasher};
use swc_atoms::Atom;
use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::marks::Marks;
use swc_ecma_utils::{find_pat_ids, private_ident, quote_ident};

use self::{
    graph::{Dependency, InternedGraph, Mode},
    util::{
        collect_top_level_decls, ids_captured_by, ids_used_by, ids_used_by_ignoring_nested, Vars,
    },
};

mod graph;
mod util;

type FxBuildHasher = BuildHasherDefault<FxHasher>;

pub fn optimize(module: &mut Module, marks: Marks) {
    let (mut dep_graph, items) = Analyzer::analyze(
        module,
        SyntaxContext::empty().apply_mark(marks.unresolved_mark),
        marks.top_level_ctxt,
    );

    dep_graph.handle_weak(Mode::Production);

    let new_module = dep_graph.combine(&items);

    *module = new_module;
}

pub struct Analyzer<'a> {
    g: &'a mut DepGraph,
    item_ids: &'a Vec<ItemId>,
    items: &'a mut FxHashMap<ItemId, ItemData>,

    last_side_effects: Vec<ItemId>,

    vars: FxHashMap<Id, VarState>,
}

#[derive(Debug, Default, Clone)]
struct VarState {
    declarator: Option<ItemId>,

    /// The module items that might trigger side effects on that variable.
    /// We also store if this is a `const` write, so no further change will
    /// happen to this var.
    last_writes: Vec<ItemId>,
    /// The module items that might read that variable.
    last_reads: Vec<ItemId>,
}

fn get_var<'a>(map: &'a FxHashMap<Id, VarState>, id: &Id) -> Cow<'a, VarState> {
    let v = map.get(id);
    match v {
        Some(v) => Cow::Borrowed(v),
        None => Cow::Owned(Default::default()),
    }
}

impl Analyzer<'_> {
    pub(super) fn analyze(
        module: &Module,
        unresolved_ctxt: SyntaxContext,
        top_level_ctxt: SyntaxContext,
    ) -> (DepGraph, FxHashMap<ItemId, ItemData>) {
        let mut g = DepGraph::default();
        let (item_ids, mut items) = g.init(module, unresolved_ctxt, top_level_ctxt);

        let mut analyzer = Analyzer {
            g: &mut g,
            item_ids: &item_ids,
            items: &mut items,
            last_side_effects: Default::default(),
            vars: Default::default(),
        };

        let eventual_ids = analyzer.hoist_vars_and_bindings();

        analyzer.evaluate_immediate(module, &eventual_ids);

        analyzer.evaluate_eventual(module);

        analyzer.handle_exports(module);

        (g, items)
    }

    /// Phase 1: Hoisted Variables and Bindings
    ///
    ///
    /// Returns all (EVENTUAL_READ/WRITE_VARS) in the module.
    fn hoist_vars_and_bindings(&mut self) -> IndexSet<Id> {
        let mut eventual_ids = IndexSet::default();

        for item_id in self.item_ids.iter() {
            if let Some(item) = self.items.get(item_id) {
                eventual_ids.extend(item.eventual_read_vars.iter().cloned());
                eventual_ids.extend(item.eventual_write_vars.iter().cloned());

                if item.is_hoisted && item.side_effects {
                    self.g
                        .add_strong_deps(item_id, self.last_side_effects.iter());

                    self.last_side_effects.push(item_id.clone());
                }

                for id in item.var_decls.iter() {
                    let state = self.vars.entry(id.clone()).or_default();

                    if state.declarator.is_none() {
                        state.declarator = Some(item_id.clone());
                    }

                    if item.is_hoisted {
                        state.last_writes.push(item_id.clone());
                    } else {
                        // TODO(WEB-705): Create a fake module item
                        // state.last_writes.push(item_id.clone());
                    }
                }
            }
        }

        eventual_ids
    }

    /// Phase 2: Immediate evaluation
    fn evaluate_immediate(&mut self, _module: &Module, eventual_ids: &IndexSet<Id>) {
        for item_id in self.item_ids.iter() {
            if let Some(item) = self.items.get(item_id) {
                // Ignore HOISTED module items, they have been processed in phase 1 already.
                if item.is_hoisted {
                    continue;
                }

                for id in item.var_decls.iter() {
                    let state = self.vars.entry(id.clone()).or_default();
                    if state.declarator.is_none() {
                        state.declarator = Some(item_id.clone());
                    }
                }

                // For each var in READ_VARS:
                for id in item.read_vars.iter() {
                    // Create a strong dependency to all module items listed in LAST_WRITES for that
                    // var.

                    // (the writes need to be executed before this read)
                    let state = get_var(&self.vars, id);
                    self.g.add_strong_deps(item_id, state.last_writes.iter());

                    if let Some(declarator) = &state.declarator {
                        if declarator != item_id {
                            // A read also depends on the declaration.
                            self.g
                                .add_strong_deps(item_id, [declarator].iter().copied());
                        }
                    }
                }

                // For each var in WRITE_VARS:
                for id in item.write_vars.iter() {
                    // Create a weak dependency to all module items listed in
                    // LAST_READS for that var.

                    // (the reads need to be executed before this write, when
                    // it’s needed)

                    let state = get_var(&self.vars, id);
                    self.g.add_weak_deps(item_id, state.last_reads.iter());

                    if let Some(declarator) = &state.declarator {
                        if declarator != item_id {
                            // A write also depends on the declaration.
                            if item.side_effects {
                                self.g
                                    .add_strong_deps(item_id, [declarator].iter().copied());
                            } else {
                                self.g.add_weak_deps(item_id, [declarator].iter().copied());
                            }
                        }
                    }
                }

                if item.side_effects {
                    // Create a strong dependency to LAST_SIDE_EFFECT.

                    self.g
                        .add_strong_deps(item_id, self.last_side_effects.iter());

                    // Create weak dependencies to all LAST_WRITES and
                    // LAST_READS.
                    for id in eventual_ids.iter() {
                        let state = get_var(&self.vars, id);

                        self.g.add_weak_deps(item_id, state.last_writes.iter());
                        self.g.add_weak_deps(item_id, state.last_reads.iter());
                    }
                }

                // For each var in WRITE_VARS:
                for id in item.write_vars.iter() {
                    // Add this module item to LAST_WRITES

                    let state = self.vars.entry(id.clone()).or_default();
                    state.last_writes.push(item_id.clone());

                    // Optimization: Remove each module item to which we
                    // just created a strong dependency from LAST_WRITES

                    // TODO(kdy1): Re-enable this optimization
                    // I disabled this optimization because it causes some issues while enabling
                    // tree ahking in next.js
                    //
                    // state
                    //     .last_writes
                    //     .retain(|last_write| !self.g.has_dep(item_id,
                    // last_write, true));

                    // Drop all writes which are not reachable from this item.
                    //
                    // For
                    //
                    // var x = 0
                    // x = 1
                    // x = 2
                    // x += 3
                    //
                    // this will drop `x = 1` as not reachable from `x += 3`.

                    state
                        .last_writes
                        .retain(|last_write| self.g.has_path_connecting(item_id, last_write));
                }

                // For each var in READ_VARS:
                for id in item.read_vars.iter() {
                    // Add this module item to LAST_READS

                    let state = self.vars.entry(id.clone()).or_default();
                    state.last_reads.push(item_id.clone());

                    // Optimization: Remove each module item to which we
                    // have a strong dependency

                    state
                        .last_reads
                        .retain(|last_read| !self.g.has_dep(item_id, last_read, true));
                }

                if item.side_effects {
                    self.last_side_effects.push(item_id.clone());
                }
            }
        }
    }

    /// Phase 3: Eventual evaluation
    fn evaluate_eventual(&mut self, _module: &Module) {
        for item_id in self.item_ids.iter() {
            if let Some(item) = self.items.get(item_id) {
                // For each var in EVENTUAL_READ_VARS:

                for id in item.eventual_read_vars.iter() {
                    // Create a strong dependency to all module items listed in
                    // LAST_WRITES for that var.

                    let state = get_var(&self.vars, id);
                    self.g.add_strong_deps(item_id, state.last_writes.iter());

                    if let Some(declarator) = &state.declarator {
                        if declarator != item_id {
                            // A read also depends on the declaration.
                            self.g
                                .add_strong_deps(item_id, [declarator].iter().copied());
                        }
                    }
                }

                // For each var in EVENTUAL_WRITE_VARS:
                for id in item.eventual_write_vars.iter() {
                    // Create a weak dependency to all module items listed in
                    // LAST_READS for that var.

                    let state = get_var(&self.vars, id);

                    self.g.add_weak_deps(item_id, state.last_reads.iter());

                    if let Some(declarator) = &state.declarator {
                        if declarator != item_id {
                            // A write also depends on the declaration.
                            self.g
                                .add_strong_deps(item_id, [declarator].iter().copied());
                        }
                    }
                }

                // (no state update happens, since this is only triggered by
                // side effects, which we already handled)
            }
        }
    }

    /// Phase 4: Exports
    fn handle_exports(&mut self, _module: &Module) {
        for item_id in self.item_ids.iter() {
            if let ItemId::Group(kind) = item_id {
                match kind {
                    ItemIdGroupKind::ModuleEvaluation => {
                        // Create a strong dependency to LAST_SIDE_EFFECTS

                        self.g
                            .add_strong_deps(item_id, self.last_side_effects.iter());
                    }
                    ItemIdGroupKind::Export(local, _) => {
                        // Create a strong dependency to LAST_WRITES for this var

                        let state = get_var(&self.vars, local);

                        self.g.add_strong_deps(item_id, state.last_writes.iter());
                    }
                }
            }
        }
    }
}

/// The id of an item
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(crate) enum ItemId {
    Group(ItemIdGroupKind),
    Item { index: usize, kind: ItemIdItemKind },
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(crate) enum ItemIdGroupKind {
    ModuleEvaluation,
    /// `(local, export_name)``
    Export(Id, Atom),
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(crate) enum ItemIdItemKind {
    Normal,

    ImportOfModule,
    /// Imports are split as multiple items.
    ImportBinding(u32),
    VarDeclarator(u32),
}

impl fmt::Debug for ItemId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ItemId::Group(kind) => {
                write!(f, "ItemId({:?})", kind)
            }
            ItemId::Item { index, kind } => {
                write!(f, "ItemId({}, {:?})", index, kind)
            }
        }
    }
}

/// Data about a module item
#[derive(Debug)]
pub(crate) struct ItemData {
    /// Is the module item hoisted?
    pub is_hoisted: bool,

    pub pure: bool,

    /// Variables declared or bound by this module item
    pub var_decls: IndexSet<Id, FxBuildHasher>,

    /// Variables read by this module item during evaluation
    pub read_vars: IndexSet<Id, FxBuildHasher>,

    /// Variables read by this module item eventually
    ///
    /// - e.g. variables read in the body of function declarations are
    ///   considered as eventually read
    /// - This is only used when reads are not trigger directly by this module
    ///   item, but require a side effect to be triggered. We don’t know when
    ///   this is executed.
    /// - Note: This doesn’t mean they are only read “after” initial evaluation.
    ///   They might also be read “during” initial evaluation on any module item
    ///   with SIDE_EFFECTS. This kind of interaction is handled by the module
    ///   item with SIDE_EFFECTS.
    pub eventual_read_vars: IndexSet<Id, FxBuildHasher>,

    /// Side effects that are triggered on local variables during evaluation
    pub write_vars: IndexSet<Id, FxBuildHasher>,

    /// Side effects that are triggered on local variables eventually
    pub eventual_write_vars: IndexSet<Id, FxBuildHasher>,

    /// Any other unknown side effects that are trigger during evaluation
    pub side_effects: bool,

    pub content: ModuleItem,

    pub export: Option<Atom>,
}

impl Default for ItemData {
    fn default() -> Self {
        Self {
            is_hoisted: Default::default(),
            var_decls: Default::default(),
            read_vars: Default::default(),
            eventual_read_vars: Default::default(),
            write_vars: Default::default(),
            eventual_write_vars: Default::default(),
            side_effects: Default::default(),
            content: ModuleItem::dummy(),
            pure: Default::default(),
            export: Default::default(),
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct DepGraph {
    pub(super) g: InternedGraph<ItemId>,
}

impl DepGraph {
    /// Weak imports are imports only if it is referenced strongly. But this
    /// is production-only, and weak dependencies are treated as strong
    /// dependencies in development mode.
    pub(super) fn handle_weak(&mut self, mode: Mode) {
        if !matches!(mode, Mode::Production) {
            return;
        }

        for start in self.g.graph_ix.iter() {
            let start = self.g.get_node(start);
            for end in self.g.graph_ix.iter() {
                let end = self.g.get_node(end);

                if let Some(Dependency::Weak) = self.g.idx_graph.edge_weight(start, end) {
                    self.g.idx_graph.remove_edge(start, end);
                }
            }
        }
    }

    pub(super) fn combine(&self, data: &FxHashMap<ItemId, ItemData>) -> Module {
        let groups = self.finalize(data);
        let mut modules = vec![];

        for (ix, group) in groups.graph_ix.iter().enumerate() {
            let mut chunk = Module {
                span: DUMMY_SP,
                body: vec![],
                shebang: None,
            };

            for g in group {
                chunk.body.push(data[g].content.clone());
            }

            modules.push(chunk);
        }

        Module {
            span: DUMMY_SP,
            body: modules
                .into_iter()
                .flat_map(|m| m.body.into_iter())
                .collect(),
            shebang: None,
        }
    }

    /// Merges a dependency group between [ModuleItem]s into a dependency graph
    /// of [Module]s.
    ///
    /// Note that [ModuleItem] and [Module] are represented as [ItemId] for
    /// performance.
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
            let mut changed = false;

            // Check deps of `start`.
            for dep_ix in graph
                .idx_graph
                .neighbors_directed(start_ix, petgraph::Direction::Outgoing)
            {
                let dep_id = graph.graph_ix.get_index(dep_ix as _).unwrap();

                if global_done.insert(dep_ix)
                    || (data.get(dep_id).map_or(false, |data| data.pure)
                        && group_done.insert(dep_ix))
                {
                    changed = true;

                    group.push(dep_id.clone());

                    add_to_group(graph, data, group, dep_ix, global_done, group_done);
                }
            }

            changed
        }

        let mut cycles = kosaraju_scc(&self.g.idx_graph);
        cycles.retain(|v| v.len() > 1);

        // If a node have two or more dependents, it should be in a separate
        // group.

        let mut groups = vec![];
        let mut global_done = FxHashSet::default();

        // Module evaluation node and export nodes starts a group
        for id in self.g.graph_ix.iter() {
            let ix = self.g.get_node(id);

            if let ItemId::Group(_) = id {
                groups.push((vec![id.clone()], FxHashSet::default(), 1));
                global_done.insert(ix);
            }
        }

        // Cycles should form a separate group
        for id in self.g.graph_ix.iter() {
            let ix = self.g.get_node(id);

            if let Some(cycle) = cycles.iter().find(|v| v.contains(&ix)) {
                if cycle.iter().all(|v| !global_done.contains(v)) {
                    let ids = cycle
                        .iter()
                        .map(|&ix| self.g.graph_ix[ix as usize].clone())
                        .collect::<Vec<_>>();

                    global_done.extend(cycle.iter().copied());

                    let len = ids.len();
                    groups.push((ids, Default::default(), len));
                }
            }
        }

        // Expand **starting** nodes
        for (ix, id) in self.g.graph_ix.iter().enumerate() {
            // If a node is reachable from two or more nodes, it should be in a
            // separate group.

            if global_done.contains(&(ix as u32)) {
                continue;
            }

            // Don't store a pure item in a separate chunk
            if data.get(id).map_or(false, |data| data.pure) {
                continue;
            }

            // The number of nodes that this node is dependent on.
            let dependant_count = self
                .g
                .idx_graph
                .neighbors_directed(ix as _, petgraph::Direction::Incoming)
                .count();

            // The number of starting points that can reach to this node.
            let count_of_startings = global_done
                .iter()
                .filter(|&&staring_point| {
                    has_path_connecting(&self.g.idx_graph, staring_point, ix as _, None)
                })
                .count();

            if dependant_count >= 2 && count_of_startings >= 2 {
                groups.push((vec![id.clone()], FxHashSet::default(), 1));
                global_done.insert(ix as u32);
            }
        }

        loop {
            let mut changed = false;

            for (group, group_done, init_len) in &mut groups {
                // Cycle group

                for i in 0..*init_len {
                    let start = &group[i];
                    let start_ix = self.g.get_node(start);
                    changed |=
                        add_to_group(&self.g, data, group, start_ix, &mut global_done, group_done);
                }
            }

            if !changed {
                break;
            }
        }

        let mut groups = groups.into_iter().map(|v| v.0).collect::<Vec<_>>();

        // We need to sort, because we start from the group item and add others start
        // from them. But the final module should be in the order of the original code.
        for group in groups.iter_mut() {
            group.sort();
            group.dedup();
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
                        new_graph
                            .idx_graph
                            .add_edge(group_ix, dep_group_ix, Dependency::Strong);
                    }
                }
            }
        }

        new_graph
    }

    /// Fills information per module items
    pub(super) fn init(
        &mut self,
        module: &Module,
        unresolved_ctxt: SyntaxContext,
        top_level_ctxt: SyntaxContext,
    ) -> (Vec<ItemId>, FxHashMap<ItemId, ItemData>) {
        let top_level_vars = collect_top_level_decls(module);
        let mut exports = vec![];
        let mut items = FxHashMap::default();
        let mut ids = vec![];

        for (index, item) in module.body.iter().enumerate() {
            // Fill exports
            if let ModuleItem::ModuleDecl(item) = item {
                match item {
                    ModuleDecl::ExportDecl(item) => match &item.decl {
                        Decl::Fn(FnDecl { ident, .. }) | Decl::Class(ClassDecl { ident, .. }) => {
                            exports.push((ident.to_id(), None));
                        }
                        Decl::Var(v) => {
                            for decl in &v.decls {
                                let ids: Vec<Id> = find_pat_ids(&decl.name);
                                for id in ids {
                                    exports.push((id, None));
                                }
                            }
                        }
                        _ => {}
                    },
                    ModuleDecl::ExportNamed(item) => {
                        if let Some(src) = &item.src {
                            // One item for the import for re-export
                            let id = ItemId::Item {
                                index,
                                kind: ItemIdItemKind::ImportOfModule,
                            };
                            ids.push(id.clone());
                            items.insert(
                                id,
                                ItemData {
                                    is_hoisted: true,
                                    side_effects: true,
                                    content: ModuleItem::ModuleDecl(ModuleDecl::Import(
                                        ImportDecl {
                                            specifiers: Default::default(),
                                            src: src.clone(),
                                            ..ImportDecl::dummy()
                                        },
                                    )),
                                    ..Default::default()
                                },
                            );
                        }

                        for (si, s) in item.specifiers.iter().enumerate() {
                            let (orig, mut local, exported) = match s {
                                ExportSpecifier::Named(s) => (
                                    Some(s.orig.clone()),
                                    match &s.orig {
                                        ModuleExportName::Ident(i) => i.clone(),
                                        ModuleExportName::Str(..) => quote_ident!("_tmp"),
                                    },
                                    Some(s.exported.clone().unwrap_or_else(|| s.orig.clone())),
                                ),
                                ExportSpecifier::Default(s) => (
                                    Some(ModuleExportName::Ident(Ident::new(
                                        "default".into(),
                                        DUMMY_SP,
                                    ))),
                                    quote_ident!("default"),
                                    Some(ModuleExportName::Ident(s.exported.clone())),
                                ),
                                ExportSpecifier::Namespace(s) => (
                                    None,
                                    match &s.name {
                                        ModuleExportName::Ident(i) => i.clone(),
                                        ModuleExportName::Str(..) => quote_ident!("_tmp"),
                                    },
                                    Some(s.name.clone()),
                                ),
                            };

                            if item.src.is_some() {
                                local.sym = format!("reexport_{}", local.sym).into();
                                local = local.into_private();
                            }

                            exports.push((local.to_id(), exported.clone()));

                            if let Some(src) = &item.src {
                                let id = ItemId::Item {
                                    index,
                                    kind: ItemIdItemKind::ImportBinding(si as _),
                                };
                                ids.push(id.clone());

                                let import = match s {
                                    ExportSpecifier::Namespace(..) => {
                                        ImportSpecifier::Namespace(ImportStarAsSpecifier {
                                            span: DUMMY_SP,
                                            local: local.clone(),
                                        })
                                    }
                                    _ => ImportSpecifier::Named(ImportNamedSpecifier {
                                        span: DUMMY_SP,
                                        local: local.clone(),
                                        imported: orig,
                                        is_type_only: false,
                                    }),
                                };
                                items.insert(
                                    id,
                                    ItemData {
                                        is_hoisted: true,
                                        var_decls: [local.to_id()].into_iter().collect(),
                                        pure: true,
                                        content: ModuleItem::ModuleDecl(ModuleDecl::Import(
                                            ImportDecl {
                                                span: DUMMY_SP,
                                                specifiers: vec![import],
                                                src: src.clone(),
                                                type_only: false,
                                                with: None,
                                                phase: Default::default(),
                                            },
                                        )),
                                        ..Default::default()
                                    },
                                );
                            }
                        }
                    }

                    ModuleDecl::ExportDefaultDecl(export) => {
                        let id = match &export.decl {
                            DefaultDecl::Class(c) => c.ident.clone(),
                            DefaultDecl::Fn(f) => f.ident.clone(),
                            DefaultDecl::TsInterfaceDecl(_) => unreachable!(),
                        };

                        let default_var = id.unwrap_or_else(|| private_ident!("default_export"));

                        {
                            let mut used_ids = if export.decl.is_fn_expr() {
                                ids_used_by_ignoring_nested(
                                    &export.decl,
                                    unresolved_ctxt,
                                    top_level_ctxt,
                                    &top_level_vars,
                                )
                            } else {
                                ids_used_by(
                                    &export.decl,
                                    unresolved_ctxt,
                                    top_level_ctxt,
                                    &top_level_vars,
                                )
                            };
                            used_ids.read.remove(&default_var.to_id());
                            used_ids.write.insert(default_var.to_id());
                            let mut captured_ids = if export.decl.is_fn_expr() {
                                ids_captured_by(
                                    &export.decl,
                                    unresolved_ctxt,
                                    top_level_ctxt,
                                    &top_level_vars,
                                )
                            } else {
                                Vars::default()
                            };
                            captured_ids.read.remove(&default_var.to_id());

                            let data = ItemData {
                                read_vars: used_ids.read,
                                eventual_read_vars: captured_ids.read,
                                write_vars: used_ids.write,
                                eventual_write_vars: captured_ids.write,
                                var_decls: [default_var.to_id()].into_iter().collect(),
                                content: ModuleItem::ModuleDecl(item.clone()),
                                ..Default::default()
                            };

                            let id = ItemId::Item {
                                index,
                                kind: ItemIdItemKind::Normal,
                            };
                            ids.push(id.clone());
                            items.insert(id, data);
                        }

                        exports.push((
                            default_var.to_id(),
                            Some(ModuleExportName::Ident(quote_ident!("default"))),
                        ));
                    }
                    ModuleDecl::ExportDefaultExpr(export) => {
                        let default_var = private_ident!("default_export");

                        {
                            // For
                            // let __TURBOPACK_default_export__ = expr;

                            let mut used_ids = ids_used_by_ignoring_nested(
                                &export.expr,
                                unresolved_ctxt,
                                top_level_ctxt,
                                &top_level_vars,
                            );
                            let captured_ids = ids_captured_by(
                                &export.expr,
                                unresolved_ctxt,
                                top_level_ctxt,
                                &top_level_vars,
                            );

                            used_ids.write.insert(default_var.to_id());

                            let data = ItemData {
                                read_vars: used_ids.read,
                                eventual_read_vars: captured_ids.read,
                                write_vars: used_ids.write,
                                eventual_write_vars: captured_ids.write,
                                var_decls: [default_var.to_id()].into_iter().collect(),
                                side_effects: true,
                                content: ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(
                                    VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Const,
                                        declare: false,
                                        decls: vec![VarDeclarator {
                                            span: DUMMY_SP,
                                            name: default_var.clone().into(),
                                            init: Some(export.expr.clone()),
                                            definite: false,
                                        }],
                                    },
                                )))),
                                ..Default::default()
                            };

                            let id = ItemId::Item {
                                index,
                                kind: ItemIdItemKind::Normal,
                            };
                            ids.push(id.clone());
                            items.insert(id, data);
                        }

                        {
                            // For export default __TURBOPACK__default__export__

                            exports.push((
                                default_var.to_id(),
                                Some(ModuleExportName::Ident(quote_ident!("default"))),
                            ));
                        }
                    }

                    ModuleDecl::ExportAll(item) => {
                        // One item for the import for re-export
                        let id = ItemId::Item {
                            index,
                            kind: ItemIdItemKind::ImportOfModule,
                        };
                        ids.push(id.clone());
                        items.insert(
                            id,
                            ItemData {
                                is_hoisted: true,
                                side_effects: true,
                                content: ModuleItem::ModuleDecl(ModuleDecl::ExportAll(
                                    item.clone(),
                                )),
                                ..Default::default()
                            },
                        );
                    }
                    _ => {}
                }
            }

            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(item)) => {
                    // We create multiple items for each import.

                    {
                        // One item for the import itself
                        let id = ItemId::Item {
                            index,
                            kind: ItemIdItemKind::ImportOfModule,
                        };
                        ids.push(id.clone());
                        items.insert(
                            id,
                            ItemData {
                                is_hoisted: true,
                                side_effects: true,
                                content: ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                                    specifiers: Default::default(),
                                    ..item.clone()
                                })),
                                ..Default::default()
                            },
                        );
                    }

                    // One per binding
                    for (si, s) in item.specifiers.iter().enumerate() {
                        let id = ItemId::Item {
                            index,
                            kind: ItemIdItemKind::ImportBinding(si as _),
                        };
                        ids.push(id.clone());
                        let local = s.local().to_id();
                        items.insert(
                            id,
                            ItemData {
                                is_hoisted: true,
                                var_decls: [local].into_iter().collect(),
                                pure: true,
                                content: ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                                    specifiers: vec![s.clone()],
                                    ..item.clone()
                                })),
                                ..Default::default()
                            },
                        );
                    }
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(f),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) => {
                    let id = ItemId::Item {
                        index,
                        kind: ItemIdItemKind::Normal,
                    };
                    ids.push(id.clone());

                    let vars = ids_used_by(
                        &f.function,
                        unresolved_ctxt,
                        top_level_ctxt,
                        &top_level_vars,
                    );
                    let var_decls = {
                        let mut v = IndexSet::with_capacity_and_hasher(1, Default::default());
                        v.insert(f.ident.to_id());
                        v
                    };
                    items.insert(
                        id,
                        ItemData {
                            is_hoisted: true,
                            eventual_read_vars: vars.read,
                            eventual_write_vars: vars.write,
                            write_vars: var_decls.clone(),
                            var_decls,
                            content: ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f.clone()))),
                            ..Default::default()
                        },
                    );
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Class(c),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Class(c))) => {
                    let id = ItemId::Item {
                        index,
                        kind: ItemIdItemKind::Normal,
                    };
                    ids.push(id.clone());

                    let mut vars =
                        ids_used_by(&c.class, unresolved_ctxt, top_level_ctxt, &top_level_vars);
                    let var_decls = {
                        let mut v = IndexSet::with_capacity_and_hasher(1, Default::default());
                        v.insert(c.ident.to_id());
                        v
                    };
                    vars.write.insert(c.ident.to_id());
                    items.insert(
                        id,
                        ItemData {
                            read_vars: vars.read,
                            write_vars: vars.write,
                            var_decls,
                            content: ModuleItem::Stmt(Stmt::Decl(Decl::Class(c.clone()))),
                            ..Default::default()
                        },
                    );
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(v),
                    ..
                }))
                | ModuleItem::Stmt(Stmt::Decl(Decl::Var(v))) => {
                    for (i, decl) in v.decls.iter().enumerate() {
                        let id = ItemId::Item {
                            index,
                            kind: ItemIdItemKind::VarDeclarator(i as _),
                        };
                        ids.push(id.clone());

                        let decl_ids: Vec<Id> = find_pat_ids(&decl.name);
                        let vars = ids_used_by(
                            &decl.init,
                            unresolved_ctxt,
                            top_level_ctxt,
                            &top_level_vars,
                        );
                        let eventual_vars =
                            if matches!(decl.init.as_deref(), Some(Expr::Fn(..) | Expr::Arrow(..)))
                            {
                                ids_captured_by(
                                    &decl.init,
                                    unresolved_ctxt,
                                    top_level_ctxt,
                                    &top_level_vars,
                                )
                            } else {
                                Vars::default()
                            };

                        let side_effects = vars.found_unresolved;

                        let var_decl = Box::new(VarDecl {
                            decls: vec![decl.clone()],
                            ..*v.clone()
                        });
                        let content = ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl)));
                        items.insert(
                            id,
                            ItemData {
                                var_decls: decl_ids.clone().into_iter().collect(),
                                read_vars: vars.read,
                                eventual_read_vars: eventual_vars.read,
                                write_vars: decl_ids.into_iter().chain(vars.write).collect(),
                                eventual_write_vars: eventual_vars.write,
                                content,
                                side_effects,
                                ..Default::default()
                            },
                        );
                    }
                }

                ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) if expr.is_assign() => {
                    let Expr::Assign(assign) = &**expr else {
                        unreachable!()
                    };

                    let mut used_ids = ids_used_by_ignoring_nested(
                        item,
                        unresolved_ctxt,
                        top_level_ctxt,
                        &top_level_vars,
                    );
                    let captured_ids =
                        ids_captured_by(item, unresolved_ctxt, top_level_ctxt, &top_level_vars);

                    if assign.op != op!("=") {
                        used_ids.read.extend(used_ids.write.iter().cloned());

                        let extra_ids = ids_used_by_ignoring_nested(
                            &assign.left,
                            unresolved_ctxt,
                            top_level_ctxt,
                            &top_level_vars,
                        );
                        used_ids.read.extend(extra_ids.read);
                        used_ids.write.extend(extra_ids.write);
                    }

                    let side_effects = used_ids.found_unresolved;

                    let data = ItemData {
                        read_vars: used_ids.read,
                        eventual_read_vars: captured_ids.read,
                        write_vars: used_ids.write,
                        eventual_write_vars: captured_ids.write,
                        content: item.clone(),
                        side_effects,
                        ..Default::default()
                    };

                    let id = ItemId::Item {
                        index,
                        kind: ItemIdItemKind::Normal,
                    };
                    ids.push(id.clone());
                    items.insert(id, data);
                }

                ModuleItem::ModuleDecl(
                    ModuleDecl::ExportDefaultDecl(..)
                    | ModuleDecl::ExportDefaultExpr(..)
                    | ModuleDecl::ExportNamed(NamedExport { .. }),
                ) => {}

                _ => {
                    // Default to normal

                    let used_ids = ids_used_by_ignoring_nested(
                        item,
                        unresolved_ctxt,
                        top_level_ctxt,
                        &top_level_vars,
                    );
                    let captured_ids =
                        ids_captured_by(item, unresolved_ctxt, top_level_ctxt, &top_level_vars);
                    let data = ItemData {
                        read_vars: used_ids.read,
                        eventual_read_vars: captured_ids.read,
                        write_vars: used_ids.write,
                        eventual_write_vars: captured_ids.write,
                        side_effects: true,
                        content: item.clone(),
                        ..Default::default()
                    };

                    let id = ItemId::Item {
                        index,
                        kind: ItemIdItemKind::Normal,
                    };
                    ids.push(id.clone());
                    items.insert(id, data);
                }
            }
        }

        {
            // `module evaluation side effects` Node
            let id = ItemId::Group(ItemIdGroupKind::ModuleEvaluation);
            ids.push(id.clone());
            items.insert(
                id,
                ItemData {
                    content: ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: "module evaluation".into(),
                    })),
                    ..Default::default()
                },
            );
        }

        for (local, export_name) in exports {
            let name = match &export_name {
                Some(ModuleExportName::Ident(v)) => v.to_id(),
                _ => local.clone(),
            };
            let id = ItemId::Group(ItemIdGroupKind::Export(local.clone(), name.0.clone()));
            ids.push(id.clone());
            items.insert(
                id.clone(),
                ItemData {
                    content: ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                        span: DUMMY_SP,
                        specifiers: vec![ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: ModuleExportName::Ident(local.clone().into()),
                            exported: export_name,
                            is_type_only: false,
                        })],
                        src: None,
                        type_only: false,
                        with: None,
                    })),
                    read_vars: [name.clone()].into_iter().collect(),
                    export: Some(name.0),
                    ..Default::default()
                },
            );
        }

        (ids, items)
    }

    pub(super) fn add_strong_deps<'a, T>(&mut self, from: &ItemId, to: T)
    where
        T: IntoIterator<Item = &'a ItemId>,
    {
        // This value cannot be lazily initialized because we need to ensure that
        // ModuleEvaluation exists even if there's no side effect.
        let from = self.g.node(from);

        for to in to {
            let to = self.g.node(to);

            self.g.idx_graph.add_edge(from, to, Dependency::Strong);
        }
    }

    pub(super) fn add_weak_deps<'a, T>(&mut self, from: &ItemId, to: T)
    where
        T: IntoIterator<Item = &'a ItemId>,
    {
        let from = self.g.node(from);

        for to in to {
            let to = self.g.node(to);

            if let Some(Dependency::Strong) = self.g.idx_graph.edge_weight(from, to) {
                continue;
            }
            self.g.idx_graph.add_edge(from, to, Dependency::Weak);
        }
    }

    pub(crate) fn has_dep(&mut self, id: &ItemId, dep: &ItemId, only_strong: bool) -> bool {
        let from = self.g.node(id);
        let to = self.g.node(dep);
        self.g
            .idx_graph
            .edge_weight(from, to)
            .map(|d| matches!(d, Dependency::Strong) || !only_strong)
            .unwrap_or(false)
    }

    pub(crate) fn has_path_connecting(&mut self, from: &ItemId, to: &ItemId) -> bool {
        let from = self.g.node(from);
        let to = self.g.node(to);

        has_path_connecting(&self.g.idx_graph, from, to, None)
    }
}
