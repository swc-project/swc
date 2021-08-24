use crate::analyzer::{ProgramData, ScopeData};
use fxhash::FxHashSet;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

pub(super) struct HygieneAnalyzer<'a> {
    pub data: &'a ProgramData,
    pub hygiene: HygieneData,
    pub top_level_mark: Mark,
    pub cur_scope: Option<SyntaxContext>,
}

#[derive(Debug, Default)]
pub(super) struct HygieneData {
    /// Has higher precedence over `modified`.
    pub preserved: FxHashSet<Id>,

    pub modified: FxHashSet<Id>,
}

impl HygieneAnalyzer<'_> {
    fn scope(&self) -> &ScopeData {
        match self.cur_scope {
            Some(v) => self.data.scopes.get(&v).expect("failed to get scope"),
            None => &self.data.top,
        }
    }

    fn with_scope<F, Ret>(&mut self, scope_ctxt: SyntaxContext, op: F) -> Ret
    where
        F: FnOnce(&mut HygieneAnalyzer) -> Ret,
    {
        let old = self.cur_scope;
        self.cur_scope = Some(scope_ctxt);

        let ret = op(self);

        let mut ids = vec![];
        {
            let scope = self.scope();
            for (sym, ctxts) in &scope.declared_symbols {
                if ctxts.len() == 1 {
                    let id = (sym.clone(), *ctxts.iter().next().unwrap());
                    ids.push(id)
                }
            }
        }
        for id in ids {
            self.hygiene.preserved.remove(&id);
            self.hygiene.modified.insert(id);
        }

        self.cur_scope = old;

        ret
    }
}

impl Visit for HygieneAnalyzer<'_> {
    noop_visit_type!();

    fn visit_function(&mut self, n: &Function, _: &dyn Node) {
        self.with_scope(n.span.ctxt, |v| {
            n.visit_children_with(v);
        });
    }

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if cfg!(feature = "debug") {
            log::trace!("hygiene: Handling ({})", i);
        }

        if i.span.ctxt == SyntaxContext::empty() {
            return;
        }

        if i.span.has_mark(self.top_level_mark) {
            return;
        }

        let info = self.data.vars.get(&i.to_id());
        // Ignore labels.
        let info = match info {
            Some(v) => v,
            None => {
                if cfg!(feature = "debug") {
                    log::trace!("hygiene: No such var: {}{:?}", i.sym, i.span.ctxt);
                }
                return;
            }
        };

        // If multiple variables with same name is declared, skip it.
        if let Some(decls) = self.scope().declared_symbols.get(&i.sym) {
            if decls.len() >= 2 {
                self.hygiene.preserved.insert(i.to_id());
                if cfg!(feature = "debug") {
                    log::trace!(
                        "hygiene: Preserving hygiene of {}{:?} because it's declared multiple \
                         times",
                        i.sym,
                        i.span.ctxt
                    );
                }

                return;
            }
        }

        if info.is_fn_local || info.declared_as_fn_expr {
            if cfg!(feature = "debug") {
                log::trace!(
                    "hygiene: Optimization candidate: {}{:?}",
                    i.sym,
                    i.span.ctxt
                );
            }
            self.hygiene.modified.insert(i.to_id());
        } else {
            if cfg!(feature = "debug") {
                log::trace!(
                    "hygiene: Preserving {}{:?} as it is not fn-local",
                    i.sym,
                    i.span.ctxt
                );
            }
        }
    }

    fn visit_member_expr(&mut self, n: &MemberExpr, _: &dyn Node) {
        n.obj.visit_with(n, self);

        if n.computed {
            n.prop.visit_with(n, self);
        }
    }

    fn visit_prop_name(&mut self, n: &PropName, _: &dyn Node) {
        match n {
            PropName::Computed(..) => {
                n.visit_children_with(self);
            }
            _ => {}
        }
    }
}
