use crate::analyzer::ProgramData;
use swc_common::Span;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

/// Create a hygiene optimizer.
///
/// Hygiene optimizer removes span hygiene without renaming if it's ok to do so.
pub(crate) fn hygiene_optimizer(data: ProgramData) -> impl 'static + VisitMut {
    Optimizer { data }
}

struct Optimizer {
    data: ProgramData,
}

impl Optimizer {
    /// Registers a binding ident. This is treated as [PatMode::OtherDecl].
    ///
    /// If it conflicts
    #[allow(unused)]
    fn register_binding_ident(&mut self, i: &mut Ident) {}
}

impl VisitMut for Optimizer {
    noop_visit_mut_type!();

    fn visit_mut_span(&mut self, span: &mut Span) {
        span.ctxt = SyntaxContext::empty();
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if i.span.ctxt == SyntaxContext::empty() {
            return;
        }

        let info = self.data.vars.get(&i.to_id());
        // Ignore labels.
        let info = match info {
            Some(v) => v,
            None => return,
        };

        if info.is_fn_local {
            i.span.ctxt = SyntaxContext::empty();
        }
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }
}
