use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{chain, SyntaxContext};
use swc_ecma_ast::{Module, *};
use swc_ecma_transforms_base::rename::{renamer, Renamer};
use swc_ecma_visit::VisitMut;

use self::preserver::idents_to_preserve;
use crate::{
    option::MangleOptions,
    util::base54::{Base54Chars, CharFreq},
};

mod preserver;
mod private_name;

pub(crate) fn name_mangler(
    options: MangleOptions,
    program: &Program,
    unresolved_ctxt: SyntaxContext,
) -> impl VisitMut {
    let preserved = idents_to_preserve(options.clone(), program);

    let base54 = CharFreq::compute(program, &preserved, unresolved_ctxt).compile();

    chain!(
        self::private_name::private_name_mangler(options.keep_private_props, base54),
        renamer(Default::default(), ManglingRenamer { base54, preserved })
    )
}

struct ManglingRenamer {
    base54: Base54Chars,
    preserved: FxHashSet<Id>,
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

    fn new_name_for(&self, _: &Id, n: &mut usize) -> JsWord {
        self.base54.encode(n, true)
    }
}
