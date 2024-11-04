use std::{borrow::Cow, sync::Arc};

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::Mark;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::rename::{renamer, RenameMap, Renamer};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub(crate) use self::preserver::idents_to_preserve;
use crate::{
    option::{MangleCache, MangleOptions},
    util::base54::Base54Chars,
};

mod preserver;
mod private_name;

pub(crate) fn mangle_names(
    program: &mut Program,
    options: &MangleOptions,
    preserved: FxHashSet<Id>,
    chars: Base54Chars,
    top_level_mark: Mark,
    mangle_name_cache: Option<Arc<dyn MangleCache>>,
) {
    program.visit_mut_with(&mut LabelMangler {
        chars,
        cache: Default::default(),
        n: Default::default(),
    });

    program.visit_mut_with(&mut self::private_name::private_name_mangler(
        options.keep_private_props,
        chars,
    ));

    let mut cache = None;

    if let Some(mangle_cache) = &mangle_name_cache {
        let mut c = RenameMap::default();
        mangle_cache.vars_cache(&mut |v| c.extend(v.iter().map(|(k, v)| (k.clone(), v.clone()))));
        cache = Some(c);
    }

    program.visit_mut_with(&mut renamer(
        swc_ecma_transforms_base::hygiene::Config {
            keep_class_names: options.keep_class_names,
            top_level_mark,
            ignore_eval: options.eval,
            preserved_symbols: options.reserved.iter().cloned().collect(),
            ..Default::default()
        },
        ManglingRenamer {
            chars,
            preserved,
            cache,
            mangle_name_cache,
        },
    ));
}

struct ManglingRenamer {
    chars: Base54Chars,
    preserved: FxHashSet<Id>,
    cache: Option<RenameMap>,
    mangle_name_cache: Option<Arc<dyn MangleCache>>,
}

impl Renamer for ManglingRenamer {
    const MANGLE: bool = true;
    const RESET_N: bool = false;

    fn preserved_ids_for_module(&mut self, _: &Module) -> FxHashSet<Id> {
        self.preserved.clone()
    }

    fn preserved_ids_for_script(&mut self, _: &Script) -> FxHashSet<Id> {
        self.preserved.clone()
    }

    fn new_name_for(&self, _: &Id, n: &mut usize) -> Atom {
        self.chars.encode(n, true)
    }

    fn get_cached(&self) -> Option<Cow<RenameMap>> {
        self.cache.as_ref().map(Cow::Borrowed)
    }

    fn store_cache(&mut self, update: &RenameMap) {
        if let Some(cacher) = &self.mangle_name_cache {
            cacher.update_vars_cache(update);
        }
    }
}

struct LabelMangler {
    chars: Base54Chars,
    cache: FxHashMap<Atom, Atom>,
    n: usize,
}

impl LabelMangler {
    fn mangle(&mut self, label: &mut Ident) {
        let v = self
            .cache
            .entry(label.sym.clone())
            .or_insert_with(|| self.chars.encode(&mut self.n, true))
            .clone();

        label.sym = v;
    }
}

impl VisitMut for LabelMangler {
    noop_visit_mut_type!();

    fn visit_mut_labeled_stmt(&mut self, s: &mut LabeledStmt) {
        self.mangle(&mut s.label);

        s.visit_mut_children_with(self);
    }

    fn visit_mut_continue_stmt(&mut self, s: &mut ContinueStmt) {
        if let Some(label) = &mut s.label {
            self.mangle(label);
        }
    }

    fn visit_mut_break_stmt(&mut self, s: &mut BreakStmt) {
        if let Some(label) = &mut s.label {
            self.mangle(label);
        }
    }
}
