use swc_ecma_ast::Id;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

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
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
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
#[derive(Debug)]
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
