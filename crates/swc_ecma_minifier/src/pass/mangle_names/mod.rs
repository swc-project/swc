use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::chain;
use swc_ecma_ast::{Module, *};
use swc_ecma_transforms_base::rename::{renamer, Renamer};
use swc_ecma_visit::VisitMut;

use self::preserver::idents_to_preserve;
use crate::{option::MangleOptions, util::base54};

mod preserver;
mod private_name;

pub(crate) fn name_mangler(options: MangleOptions) -> impl VisitMut {
    chain!(
        self::private_name::private_name_mangler(options.keep_private_props),
        renamer(Default::default(), ManglingRenamer { options })
    )
}

struct ManglingRenamer {
    options: MangleOptions,
}

impl Renamer for ManglingRenamer {
    const PARALLEL: bool = true;
    const RESET_N: bool = false;

    fn preserved_ids_for_module(&mut self, n: &Module) -> FxHashSet<Id> {
        idents_to_preserve(self.options.clone(), n)
    }

    fn preserved_ids_for_script(&mut self, n: &Script) -> FxHashSet<Id> {
        idents_to_preserve(self.options.clone(), n)
    }

    fn new_name_for(&self, _: &Id, n: &mut usize) -> JsWord {
        base54::encode(n, true)
    }
}
