use crate::analyzer::analyze;
use crate::analyzer::ProgramData;
use crate::analyzer::ScopeData;
use crate::util::has_mark;
use swc_common::Mark;
use swc_common::Span;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

mod analyzer;

pub fn optimize_hygiene(m: &mut Module, top_level_mark: Mark) {
    let data = analyze(&*m);
    m.visit_mut_with(&mut hygiene_optimizer(data, top_level_mark))
}

/// Create a hygiene optimizer.
///
/// Hygiene optimizer removes span hygiene without renaming if it's ok to do so.
pub(crate) fn hygiene_optimizer(
    data: ProgramData,
    top_level_mark: Mark,
) -> impl 'static + VisitMut {
    Optimizer {
        data,
        top_level_mark,
        cur_scope: None,
    }
}

struct Optimizer {
    data: ProgramData,
    top_level_mark: Mark,
    cur_scope: Option<SyntaxContext>,
}

impl Optimizer {
    fn scope(&self) -> &ScopeData {
        match self.cur_scope {
            Some(v) => self.data.scopes.get(&v).expect("failed to get scope"),
            None => &self.data.top,
        }
    }

    fn with_scope<F, Ret>(&mut self, scope_ctxt: SyntaxContext, op: F) -> Ret
    where
        F: FnOnce(&mut Optimizer) -> Ret,
    {
        let old = self.cur_scope;
        self.cur_scope = Some(scope_ctxt);

        let ret = op(self);

        self.cur_scope = old;

        ret
    }

    /// Registers a binding ident. This is treated as [PatMode::OtherDecl].
    ///
    /// If it conflicts
    #[allow(unused)]
    fn register_binding_ident(&mut self, i: &mut Ident) {}
}

impl VisitMut for Optimizer {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if i.span.ctxt == SyntaxContext::empty() {
            return;
        }

        if has_mark(i.span, self.top_level_mark) {
            return;
        }

        let info = self.data.vars.get(&i.to_id());
        // Ignore labels.
        let info = match info {
            Some(v) => v,
            None => return,
        };

        // If multiple variables with same name is declared, skip it.
        if let Some(decls) = self.scope().declared_symbols.get(&i.sym) {
            if decls.len() >= 2 {
                return;
            }
        }

        if info.is_fn_local {
            i.span.ctxt = SyntaxContext::empty().apply_mark(self.top_level_mark);
        }
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_span(&mut self, span: &mut Span) {
        span.ctxt = SyntaxContext::empty();
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        self.with_scope(n.span.ctxt, |v| {
            n.visit_mut_children_with(v);
        });
    }
}
