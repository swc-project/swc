use fxhash::{FxHashMap, FxHashSet};
use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

#[derive(Default)]
pub(super) struct HygieneAnalyzer {
    cur: ScopeInfo,
}

#[derive(Default)]
struct ScopeInfo {
    used: FxHashSet<Id>,
}

impl VisitMut for HygieneAnalyzer {
    noop_visit_mut_type!();

    fn visit_mut_function(&mut self, n: &mut Function) {
        // We add
    }
}
