use fxhash::{FxHashMap, FxHashSet};
use std::mem::take;
use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};

#[derive(Default)]
pub(super) struct HygieneAnalyzer {
    cur: ScopeInfo,
}

#[derive(Default)]
struct ScopeInfo {
    used: FxHashSet<Id>,
}

impl HygieneAnalyzer {
    fn with_scope<F, R>(&mut self, op: F) -> R
    where
        F: FnOnce(&mut HygieneAnalyzer) -> R,
    {
        let parent = take(&mut self.cur);
        let ret = op(self);
        let child = take(&mut self.cur);

        self.cur = parent;

        // We remove hygiene info if child scope uses only one id with a respect to
        // symbol.

        //

        // Done

        self.cur.used.extend(child.used);

        ret
    }
}

impl VisitMut for HygieneAnalyzer {
    noop_visit_mut_type!();

    fn visit_mut_function(&mut self, n: &mut Function) {
        // We add

        self.with_scope(|a| {
            n.visit_mut_children_with(a);
        });
    }
}
