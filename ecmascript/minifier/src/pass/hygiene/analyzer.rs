use fxhash::{FxHashMap, FxHashSet};
use std::mem::take;
use swc_atoms::JsWord;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

#[derive(Default)]
pub(super) struct HygieneAnalyzer {
    cur: ScopeInfo,
    top_level_mark: Mark,
    result: FxHashMap<Id, SyntaxContext>,
}

#[derive(Default)]
struct ScopeInfo {
    /// Symbols used within a scope.
    symbols: FxHashMap<JsWord, Vec<SyntaxContext>>,
}

impl HygieneAnalyzer {
    pub fn new(top_level_mark: Mark) -> Self {
        Self {
            top_level_mark,
            ..Default::default()
        }
    }

    fn report_usage(&mut self, i: &Ident) {
        let v = self.cur.symbols.entry(i.sym.clone()).or_default();
        if !v.contains(&i.span.ctxt) {
            v.push(i.span.ctxt);
        }
    }

    /// We search for duplicated symbols.
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

        ret
    }
}

impl VisitMut for HygieneAnalyzer {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        self.with_scope(|a| {
            n.visit_mut_children_with(a);
        });
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        // We add

        self.with_scope(|a| {
            n.visit_mut_children_with(a);
        });
    }
}
