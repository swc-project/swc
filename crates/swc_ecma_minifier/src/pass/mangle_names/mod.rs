use std::{borrow::Cow, sync::Arc};

use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::Mark;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::rename::{renamer, RenameMap, Renamer};
use swc_ecma_visit::VisitMutWith;

pub(crate) use self::preserver::idents_to_preserve;
use crate::{
    option::{MangleCache, MangleOptions},
    util::base54::Base54Chars,
};

mod mangler;
mod preserver;

pub(crate) fn mangle_names(
    program: &mut Program,
    options: &MangleOptions,
    preserved: FxHashSet<Id>,
    chars: Base54Chars,
    top_level_mark: Mark,
    mangle_name_cache: Option<Arc<dyn MangleCache>>,
) {
    // Use hook-based mangler for combined label and private name mangling
    // in a single AST traversal
    self::mangler::visit_with_mangler(program, options.keep_private_props, chars);

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
        },
        ManglingRenamer {
            chars,
            preserved: &preserved,
            cache,
            mangle_name_cache,
            reserved: &options.reserved,
        },
    ));
}

struct ManglingRenamer<'a> {
    chars: Base54Chars,
    preserved: &'a FxHashSet<Id>,
    cache: Option<RenameMap>,
    mangle_name_cache: Option<Arc<dyn MangleCache>>,
    reserved: &'a Vec<Atom>,
}

impl<'a> Renamer for ManglingRenamer<'a> {
    type Target = Atom;

    const MANGLE: bool = true;
    const RESET_N: bool = false;

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

    fn unresolved_symbols(&self) -> Vec<Atom> {
        self.reserved
            .iter()
            .cloned()
            .chain(self.preserved.iter().map(|id| id.0.clone()))
            .collect()
    }

    fn preserve_name(&self, orig: &Id) -> bool {
        self.preserved.contains(orig)
    }
}
