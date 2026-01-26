//! Hook-based mangler for labels and private names.
//!
//! This module uses `swc_ecma_hooks` to combine label mangling and private name
//! mangling into a single AST traversal, reducing overhead.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::VisitMutWith;

use crate::{
    hook_utils::{HookBuilder, NoopHook},
    util::base54::Base54Chars,
};

/// Context passed through all mangler hooks.
pub(super) struct ManglerCtx;

/// Hook for mangling label names in control flow statements.
pub(super) struct LabelManglerHook {
    chars: Base54Chars,
    cache: FxHashMap<Atom, Atom>,
    n: usize,
}

impl LabelManglerHook {
    pub(super) fn new(chars: Base54Chars) -> Self {
        Self {
            chars,
            cache: FxHashMap::with_capacity_and_hasher(64, Default::default()),
            n: Default::default(),
        }
    }

    fn mangle(&mut self, label: &mut Ident) {
        // Avoid cloning the symbol if it's already cached
        if let Some(cached) = self.cache.get(&label.sym) {
            label.sym = cached.clone();
            return;
        }

        let new_sym = self.chars.encode(&mut self.n, true);
        self.cache.insert(label.sym.clone(), new_sym.clone());
        label.sym = new_sym;
    }
}

impl VisitMutHook<ManglerCtx> for LabelManglerHook {
    fn enter_labeled_stmt(&mut self, n: &mut LabeledStmt, _ctx: &mut ManglerCtx) {
        self.mangle(&mut n.label);
    }

    fn enter_continue_stmt(&mut self, n: &mut ContinueStmt, _ctx: &mut ManglerCtx) {
        if let Some(label) = &mut n.label {
            self.mangle(label);
        }
    }

    fn enter_break_stmt(&mut self, n: &mut BreakStmt, _ctx: &mut ManglerCtx) {
        if let Some(label) = &mut n.label {
            self.mangle(label);
        }
    }
}

/// Hook for mangling private field/method names.
pub(super) struct PrivateNameManglerHook {
    chars: Base54Chars,
    keep_private_props: bool,
    private_n: usize,
    renamed_private: FxHashMap<Atom, Atom>,
}

impl PrivateNameManglerHook {
    pub(super) fn new(keep_private_props: bool, chars: Base54Chars) -> Self {
        Self {
            keep_private_props,
            private_n: Default::default(),
            renamed_private: Default::default(),
            chars,
        }
    }

    fn rename_private(&mut self, private_name: &mut PrivateName) {
        if self.keep_private_props {
            return;
        }
        let new_sym = if let Some(cached) = self.renamed_private.get(&private_name.name) {
            cached.clone()
        } else {
            let sym = self.chars.encode(&mut self.private_n, true);

            self.renamed_private
                .insert(private_name.name.clone(), sym.clone());

            sym
        };

        private_name.name = new_sym;
    }
}

impl VisitMutHook<ManglerCtx> for PrivateNameManglerHook {
    fn enter_private_name(&mut self, n: &mut PrivateName, _ctx: &mut ManglerCtx) {
        self.rename_private(n);
    }
}

/// Creates a combined mangler hook that handles both labels and private names
/// in a single AST traversal.
pub(super) fn mangler_hook(
    keep_private_props: bool,
    chars: Base54Chars,
) -> impl VisitMutHook<ManglerCtx> {
    HookBuilder::new(NoopHook)
        .chain(LabelManglerHook::new(chars))
        .chain(PrivateNameManglerHook::new(keep_private_props, chars))
        .build()
}

/// Visits a program with the combined mangler hooks.
/// This performs a single AST traversal for both label and private name
/// mangling.
pub(super) fn visit_with_mangler(
    program: &mut Program,
    keep_private_props: bool,
    chars: Base54Chars,
) {
    let hook = mangler_hook(keep_private_props, chars);
    let ctx = ManglerCtx;

    let mut visitor = VisitMutWithHook { hook, context: ctx };
    program.visit_mut_with(&mut visitor);
}
