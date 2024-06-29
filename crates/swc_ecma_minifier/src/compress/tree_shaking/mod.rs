use std::{borrow::Cow, fmt};

use graph::InternedGraph;
use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::SyntaxContext;
use swc_ecma_ast::{Id, Module, ModuleItem};

mod graph;

pub(super) struct TreeShaking {
    pub top_level_ctxt: SyntaxContext,
    pub unresolved_ctxt: SyntaxContext,

    pub data: Data,
}

#[derive(Default)]
pub(super) struct Data {}

impl TreeShaking {
    pub fn run(&mut self) {}
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
